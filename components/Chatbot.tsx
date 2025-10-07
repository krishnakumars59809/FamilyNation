import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/chatContext';
import { Volume1, Volume2 } from 'lucide-react';
import { ChatInput } from './chat/ChatInput';
import { textToAudio, uploadAudioFile } from '../api/hazelChatApi';
import { playAudio } from '../utils/playAudio';

export const Chatbot = ({ onClose }: { onClose?: () => void }) => {
  const {
    messages,
    currentQuestion,
    sendAnswer,
    loading,
    chatCompleted,
    predictionData,
    showPrediction,
    setShowPrediction,
    setStart,
  } = useChat();

  const [input, setInput] = useState('');
  const [showFamilyProfile, setShowFamilyProfile] = useState(true); // NEW: Show profile first
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceGender, setVoiceGender] = useState<'MALE' | 'FEMALE' | 'NEUTRAL'>(
    'NEUTRAL'
  );
  const [canInteract, setCanInteract] = useState(true);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gemini continuation state
  const [geminiThread, setGeminiThread] = useState<
    { id: string; type: 'user' | 'bot'; content: string }[]
  >([]);
  const [isGeminiThinking, setIsGeminiThinking] = useState(false);
  const [freeChatInput, setFreeChatInput] = useState('');
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [lastGeminiRequest, setLastGeminiRequest] = useState<{
    text: string;
    systemPrompt: string;
    useSearch: boolean;
  } | null>(null);

  const recordingIdRef = useRef(
    `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gemini API helper
  const GEMINI_API_KEY = (import.meta as any)?.env?.VITE_GEMINI_API_KEY || '';
  // Add this near the top of your component
console.log('API Key loaded:', import.meta.env.VITE_GEMINI_API_KEY ? 'Yes' : 'No');
  const sendToGemini = async (
    text: string,
    systemPrompt: string,
    useSearch = false
  ): Promise<string> => {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
      
      const payload = {
        contents: [{
          parts: [{ text }]
        }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        ...(useSearch && {
          tools: [{ google_search: {} }]
        })
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch from Gemini API');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from model';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const requestGemini = async (
    text: string,
    systemPrompt: string,
    useSearch: boolean,
    retryOnSearchFail = true
  ): Promise<string> => {
    setLastGeminiRequest({ text, systemPrompt, useSearch });
    setGeminiError(null);
    try {
      return await sendToGemini(text, systemPrompt, useSearch);
    } catch (err) {
      if (useSearch && retryOnSearchFail) {
        try {
          return await sendToGemini(text, systemPrompt, false);
        } catch (err2) {
          setGeminiError('Unable to fetch suggestions. Please check connectivity or API key.');
          throw err2;
        }
      } else {
        setGeminiError('Unable to fetch suggestions. Please check connectivity or API key.');
        throw err;
      }
    }
  };

  // Start Gemini continuation once assessment completes
  useEffect(() => {
    const alreadyStarted = geminiThread.length > 0 || isGeminiThinking;
    if (chatCompleted && !alreadyStarted) {
      const userAnswers = messages
        ?.filter((m) => m.type === 'user')
        ?.map((m) => m.content)
        ?.join(', ');
      const systemPrompt =
        'You are Hazel, a compassionate, practical family support assistant. Be brief, empathetic, actionable. Offer 2-3 concrete next steps not exceeding 50 words.';
      const userQuery = `Here is the family context based on the assessment answers: ${userAnswers}. Provide a short supportive next-step message.not exceeding 50 words`;

      (async () => {
        try {
          setIsGeminiThinking(true);
          const reply = await requestGemini(userQuery, systemPrompt, true, true);
          const botMsg =
            reply ||
            "I'm having trouble reaching my resources right now. For immediate help, consider contacting a local professional or hotline.";
          setGeminiThread([{ id: `bot-${Date.now()}`, type: 'bot', content: botMsg }]);
          handleTextToAudio(botMsg);
        } catch (e) {
          setGeminiThread((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content: "Sorry, I couldn't fetch suggestions right now. Please try again shortly.",
            },
          ]);
        } finally {
          setIsGeminiThinking(false);
        }
      })();
    }
  }, [chatCompleted]);

  const sendFreeChatToGemini = async () => {
    const text = freeChatInput.trim();
    if (!text || isGeminiThinking) return;
    const newUser = { id: `user-${Date.now()}`, type: 'user' as const, content: text };
    setGeminiThread((prev) => [...prev, newUser]);
    setFreeChatInput('');
    setIsGeminiThinking(true);
    try {
      const systemPrompt =
        'You are Hazel, a compassionate, succinct family support assistant. Keep replies short, warm, and actionable. not exceeding 50 words';
      const reply = await requestGemini(text, systemPrompt, false, false);
      const botMsg = reply || "I couldn't process that. Could you rephrase?";
      setGeminiThread((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
      ]);
      handleTextToAudio(botMsg);
    } catch (e) {
      setGeminiThread((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: "I'm offline at the moment. Please try again in a bit.",
        },
      ]);
    } finally {
      setIsGeminiThinking(false);
    }
  };

  const retryLastGemini = async () => {
    if (!lastGeminiRequest || isGeminiThinking) return;
    const { text, systemPrompt, useSearch } = lastGeminiRequest;
    setIsGeminiThinking(true);
    setGeminiError(null);
    try {
      const reply = await requestGemini(text, systemPrompt, useSearch, true);
      const botMsg = reply || "I couldn't process that. Could you rephrase?";
      setGeminiThread((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
      ]);
      handleTextToAudio(botMsg);
    } catch (e) {
      // error already captured
    } finally {
      setIsGeminiThinking(false);
    }
  };

  const handleMicClick = async () => {
    if (!isRecording) {
      setIsRecording(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        });

        mediaRecorder.addEventListener('stop', async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/mpeg',
          });
          setRecording(audioBlob);
          setIsRecording(false);
          await handleUpload(audioBlob);
        });

        mediaRecorder.start();
      } catch (err) {
        console.error('Mic error', err);
        alert('Cannot access microphone');
        setIsRecording(false);
      }
    } else {
      mediaRecorderRef.current?.stop();
    }
  };

  // Gemini API helper
  const GEMINI_API_KEY = 'AIzaSyANxHRpEwxCnksZg6nBP47oxshkzqa__aM' || '';
  // Add this near the top of your component
  console.log(
    'API Key loaded:',
    import.meta.env.VITE_GEMINI_API_KEY ? 'Yes' : 'No'
  );
  const sendToGemini = async (
    text: string,
    systemPrompt: string,
    useSearch = false
  ): Promise<string> => {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [
          {
            parts: [{ text }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        ...(useSearch && {
          tools: [{ google_search: {} }],
        }),
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Failed to fetch from Gemini API'
        );
      }

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response from model'
      );
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const requestGemini = async (
    text: string,
    systemPrompt: string,
    useSearch: boolean,
    retryOnSearchFail = true
  ): Promise<string> => {
    setLastGeminiRequest({ text, systemPrompt, useSearch });
    setGeminiError(null);
    try {
      return await sendToGemini(text, systemPrompt, useSearch);
    } catch (err) {
      if (useSearch && retryOnSearchFail) {
        try {
          return await sendToGemini(text, systemPrompt, false);
        } catch (err2) {
          setGeminiError(
            'Unable to fetch suggestions. Please check connectivity or API key.'
          );
          throw err2;
        }
      } else {
        setGeminiError(
          'Unable to fetch suggestions. Please check connectivity or API key.'
        );
        throw err;
      }
    }
  };

  // Start Gemini continuation once assessment completes
  useEffect(() => {
    const alreadyStarted = geminiThread.length > 0 || isGeminiThinking;
    if (chatCompleted && !alreadyStarted) {
      const userAnswers = messages
        ?.filter((m) => m.type === 'user')
        ?.map((m) => m.content)
        ?.join(', ');
      const systemPrompt =
        'You are Hazel, a compassionate, practical family support assistant. Be brief, empathetic, actionable. Offer 2-3 concrete next steps not exceeding 50 words.';
      const userQuery = `Here is the family context based on the assessment answers: ${userAnswers}. Provide a short supportive next-step message.not exceeding 50 words`;

      (async () => {
        try {
          setIsGeminiThinking(true);
          const reply = await requestGemini(
            userQuery,
            systemPrompt,
            true,
            true
          );
          const botMsg =
            reply ||
            "I'm having trouble reaching my resources right now. For immediate help, consider contacting a local professional or hotline.";
          setGeminiThread([
            { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
          ]);
          handleTextToAudio(botMsg);
        } catch (e) {
          setGeminiThread((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content:
                "Sorry, I couldn't fetch suggestions right now. Please try again shortly.",
            },
          ]);
        } finally {
          setIsGeminiThinking(false);
        }
      })();
    }
  }, [chatCompleted]);

  const sendFreeChatToGemini = async () => {
    const text = freeChatInput.trim();
    if (!text || isGeminiThinking) return;
    const newUser = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: text,
    };
    setGeminiThread((prev) => [...prev, newUser]);
    setFreeChatInput('');
    setIsGeminiThinking(true);
    try {
      const systemPrompt =
        'You are Hazel, a compassionate, succinct family support assistant. Keep replies short, warm, and actionable. not exceeding 50 words';
      const reply = await requestGemini(text, systemPrompt, false, false);
      const botMsg = reply || "I couldn't process that. Could you rephrase?";
      setGeminiThread((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
      ]);
      handleTextToAudio(botMsg);
    } catch (e) {
      setGeminiThread((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: "I'm offline at the moment. Please try again in a bit.",
        },
      ]);
    } finally {
      setIsGeminiThinking(false);
    }
  };

  const retryLastGemini = async () => {
    if (!lastGeminiRequest || isGeminiThinking) return;
    const { text, systemPrompt, useSearch } = lastGeminiRequest;
    setIsGeminiThinking(true);
    setGeminiError(null);
    try {
      const reply = await requestGemini(text, systemPrompt, useSearch, true);
      const botMsg = reply || "I couldn't process that. Could you rephrase?";
      setGeminiThread((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
      ]);
      handleTextToAudio(botMsg);
    } catch (e) {
      // error already captured
    } finally {
      setIsGeminiThinking(false);
    }
  };

  // Define this function above your return statement (inside your component)
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Add user message to thread
    setGeminiThread((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: userMessage,
      },
    ]);

    try {
      setIsGeminiThinking(true);
      const systemPrompt =
        'You are a helpful assistant for family matters. Be kind and supportive in your responses, not exceeding 50 words.';

      const response = await sendToGemini(userMessage, systemPrompt);

      // Add bot response to thread
      setGeminiThread((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response,
        },
      ]);

      // Speak the response
      try {
        const audioUrl = await textToAudio(response);
        if (audioUrl) {
          await playAudio(audioUrl, () => {
            setIsPlaying(false);
            setPlayingId(null);
          });
        }
      } catch (audioError) {
        console.error('Error playing audio:', audioError);
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      setGeminiError('Failed to get response from AI. Please try again.');
    } finally {
      setIsGeminiThinking(false);
    }
  };

  const handleGeminiResponse = async (message: string) => {
    // Add user message to thread
    setGeminiThread((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: message,
      },
    ]);

    try {
      setIsGeminiThinking(true);
      const systemPrompt =
        'You are a helpful assistant for family matters. Be kind and supportive in your responses, not exceeding 50 words.';

      const response = await sendToGemini(message, systemPrompt);

      // Add bot response
      setGeminiThread((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response,
        },
      ]);

      // Speak the response
      try {
        const audioUrl = await textToAudio(response);
        if (audioUrl) {
          await playAudio(audioUrl, () => {
            setIsPlaying(false);
            setPlayingId(null);
          });
        }
      } catch (audioError) {
        console.error('Error playing audio:', audioError);
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      setGeminiError('Failed to get response from AI. Please try again.');
    } finally {
      setIsGeminiThinking(false);
    }
  };

  const handleUpload = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const file = new File([blob], `${recordingIdRef.current}.mp3`, {
        type: 'audio/mpeg',
      });
      const res = await uploadAudioFile(file);
      const formatted = capitalizeFirstLetter(res.text);
      setInput(formatted); // transcription appears in input
      setIsProcessing(false);
      recordingIdRef.current = `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    } catch (err) {
      console.error(err);
      setInput('Upload failed');
    }
  };

  function capitalizeFirstLetter(text: string) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  function handleStartHazel() {
    setShowFamilyProfile(false);
    setStart(true);
  }

  const handleTextToAudio = async (text: string, onFinish?: () => void) => {
    try {
      if (canInteract) {
        setCanInteract(false);
        const res: any = await textToAudio(text);
        if (!res?.audio) return;

        const audioBuffer = Uint8Array.from(atob(res?.audio), (c) =>
          c?.charCodeAt(0)
        )?.buffer;

        playAudio(audioBuffer, setIsPlaying, () => {
          setCanInteract(true);
          if (onFinish) onFinish();
        });
      }
    } catch (err) {
      console?.error('TTS failed:', err);
      setPlayingId(null);
      setCanInteract(true);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // TODO
  // useEffect(() => {
  //   if (!messages || messages?.length === 0 || showFamilyProfile) return;

  //   const lastMsg = messages?.[messages?.length - 1];

  //   if (lastMsg?.type !== 'user') {
  //     let textToSpeak = lastMsg?.content;

  //     if (lastMsg?.options && lastMsg?.options?.length > 0) {
  //       textToSpeak += '. Options are: ' + lastMsg.options.join(', ') + '.';
  //     }

  //     handleTextToAudio(textToSpeak);
  //   }
  // }, [messages]);

  // Show loading state
  if (loading)
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-sm mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-[#0D9488] rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-[#0D9488] rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-[#0D9488] rounded-full animate-pulse delay-300"></div>
        </div>
        <p className="text-center mt-3 text-gray-600">Loading Hazel...</p>
      </div>
    );

  // NEW: Show family profile screen first
  if (showFamilyProfile) {
    return (
      <div className="flex flex-col h-[100vh] w-full  bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="h-[10vh] p-4 bg-[#1E3A8A] text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center relative">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#F87171] rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F87171] rounded-full opacity-80 animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold">FamilyNation</span>
              <p className="text-xs opacity-90">It Starts at Home</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Family Profile Content */}
        <div className="h-[40vh] bg-gray-50">
          <div className="bg-white lg:rounded-xl p-2 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
              Meet the Johnson Family
            </h3>

            {/* Family Avatars Grid */}
            <div className="h-[30vh] flex-1 overflow-y-auto grid md:grid-cols-2 gap-4 mb-6">
              {/* Daughter */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-100  ">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">D</span>
                  </div>
                  <div>
                    <span className="font-semibold text-red-800">
                      Daughter (17)
                    </span>
                    <p className="text-xs text-red-600">High School Student</p>
                  </div>
                </div>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Learning impairment</li>
                  <li>• Being bullied at school</li>
                  <li>• Slipping grades</li>
                  <li>• Experimenting with drugs</li>
                </ul>
              </div>

              {/* Son */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">S</span>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800">
                      Son (19)
                    </span>
                    <p className="text-xs text-blue-600">College Student</p>
                  </div>
                </div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Confrontational behavior</li>
                  <li>• Anxiety and frustration</li>
                  <li>• Resentful towards family</li>
                </ul>
              </div>

              {/* Mother */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">M</span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-800">
                      Mother
                    </span>
                    <p className="text-xs text-purple-600">
                      Working Professional
                    </p>
                  </div>
                </div>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Anxiety and depression</li>
                  <li>• Under psychiatric care</li>
                  <li>• Overwhelmed by family issues</li>
                </ul>
              </div>

              {/* Father */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">F</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-800">Father</span>
                    <p className="text-xs text-green-600">
                      Working Professional
                    </p>
                  </div>
                </div>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Job insecurity</li>
                  <li>• Financial stress</li>
                  <li>• Marital conflict</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[40vh] p-2">
          {/* Family Challenges Summary */}
          <div className="h-[20vh] bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Family Challenges:
            </h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Parents have combative marriage</li>
              <li>• Disagreement on solutions</li>
              <li>• Stress spills over to school/work</li>
              <li>• Risk of family breakdown</li>
            </ul>
          </div>

          {/* Narration from document */}
          <div className="h-[20vh] mt-4">
            <p className="p-4 text-sm text-gray-700 italic bg-gray-100 rounded-lg">
              "This family looks like so many others. Stress, conflict, and
              hardship don't stay at home — they spill over into schools,
              workplaces, and communities."
            </p>
          </div>
        </div>

        {/* Start Chat Button */}
        <div className="p-2">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-900 hover:bg-emerald-900 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            onClick={handleStartHazel}
          >
            Start Assessment with Hazel
          </button>
        </div>
      </div>
    );
  }

  // Prediction view removed

  // Main Chat Interface
  return (
    <div className="flex flex-col h-full w-full  bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Hazel branding */}
      <div className="p-4 bg-[#1E3A8A] text-white flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center relative">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-[#F87171] rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F87171] rounded-full opacity-80 animate-pulse"></div>
          </div>
          <div>
            <span className="font-bold">Hazel</span>
            <p className="text-xs opacity-90">Family Support Agent</p>
          </div>
          {/* <select className="bg-transparent" value={voiceGender} onChange={(e) => setVoiceGender(e.target.value as any)}>
  <option className="bg-transparent" value="MALE">Male</option>
  <option className="bg-transparent" value="FEMALE">Female</option>
  <option className="bg-transparent" value="NEUTRAL">Neutral</option>
</select> */}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center transition-colors"
        >
          &times;
        </button>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages?.map((msg) => {
          const isThisPlaying = playingId === msg?.id;

          return (
            <div
              key={msg?.id}
              className={`flex gap-2 ${msg?.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <button
                className="h-10 w-10 bg-[#0D9488] text-white rounded-full flex items-center justify-center"
                onClick={() => {
                  if (isThisPlaying) {
                    audioRef?.current?.pause();
                    setPlayingId(null);
                  } else {
                    setPlayingId(msg?.id);

                    let textToSpeak = '';

                    if (msg?.type === 'user') {
                      textToSpeak = `Your answer is: You have chosen ${msg?.content}`;
                    } else {
                      textToSpeak = msg?.content;
                      if (msg?.options && msg?.options?.length > 0) {
                        textToSpeak += `. Options are: ${msg?.options?.join(', ')}.`;
                      }
                    }

                    handleTextToAudio(textToSpeak, () => setPlayingId(null));
                  }
                }}
              >
                {isThisPlaying ? (
                  <Volume2 className="text-black" />
                ) : (
                  <Volume1 />
                )}
              </button>

              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  msg?.type === 'user'
                    ? 'bg-[#1E3A8A] text-white rounded-br-none'
                    : 'bg-[#0D9488] text-white rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg?.content}</p>

                {msg?.options && (
                  <div className="mt-3 flex flex-col gap-2">
                    {msg?.options?.map((opt) => (
                      <button
                        key={opt}
                        className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl text-left transition-all duration-200 border border-white border-opacity-30"
                        onClick={() => sendAnswer(opt)}
                        disabled={!canInteract}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Show "analyzing" message when completed but before prediction */}
        {chatCompleted && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl max-w-[80%] bg-[#0D9488] text-white rounded-bl-none">
              <p className="leading-relaxed">
                Thank you for your answers. I'm analyzing your situation and
                preparing recommendations...
              </p>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Gemini continuation thread and composer */}
        {chatCompleted && (
          <div className="mt-3 space-y-3">
            {isGeminiThinking && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl max-w-[80%] bg-[#0D9488] text-white rounded-bl-none opacity-90">
                  <p className="italic">Hazel is preparing next steps...</p>
                </div>
              </div>
            )}
            {geminiThread.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                    m.type === 'user'
                      ? 'bg-[#1E3A8A] text-white rounded-br-none'
                      : 'bg-[#0D9488] text-white rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              {/* <input
                type="text"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                placeholder="Ask Hazel a follow-up..."
                value={freeChatInput}
                onChange={(e) => setFreeChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendFreeChatToGemini();
                  }
                }}
              />
              <button
                className="bg-[#0D9488] hover:bg-[#0c7c6f] text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!freeChatInput.trim() || isGeminiThinking}
                onClick={sendFreeChatToGemini}
              >
                Send
              </button> */}
              {geminiError && (
                <button
                  className="ml-2 bg-[#1E3A8A] hover:bg-[#152e6b] text-white px-3 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isGeminiThinking}
                  onClick={retryLastGemini}
                >
                  Retry
                </button>
              )}
            </div>
            {geminiError && (
              <div className="text-xs text-red-600 pt-1">{geminiError}</div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {/* {currentQuestion && !currentQuestion.options && !chatCompleted && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  sendAnswer(input);
                  setInput('');
                }
              }}
            />
            <button
              className="bg-[#0D9488] hover:bg-[#0c7c6f] text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim()}
              onClick={() => {
                if (input.trim()) {
                  sendAnswer(input);
                  setInput('');
                }
              }}
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Hazel is here to listen and support your family
          </p>
        </div>
      )} */}
      <ChatInput
        input={input}
        setInput={setInput}
        sendAnswer={sendAnswer}
        isRecording={isRecording}
        handleMicClick={handleMicClick}
        isProcessing={isProcessing}
        // disabled={!canInteract}
        chatCompleted={chatCompleted}
        currentQuestion={currentQuestion}
        isGeminiThinking={isGeminiThinking}
        handleSendMessage={handleSendMessage}
        handleGeminiResponse={handleGeminiResponse}
      />
    </div>
  );
};
