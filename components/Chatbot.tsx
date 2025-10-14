import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/chatContext';
import { CloudCog, Info, Link, Volume1, Volume2, X } from 'lucide-react';
import { ChatInput } from './chat/ChatInput';
import { geminiChat, textToAudio, uploadAudioFile } from '../api/hazelChatApi';
import { playAudio } from '../utils/playAudio';
import { PredictionChart } from './PredictionChart';
import ActionPlan from './ActionPlan';
import { sendToPerplexity } from '../api/perflexityApi';

type ChatMessage = {
  id: string;
  type: 'user' | 'bot';
  content: string;
};

export const Chatbot = ({ onClose }: { onClose?: () => void }) => {
  const {
    messages,
    currentQuestion,
    sendAnswer,
    loading,
    chatCompleted,
    predictionData,
    // showPrediction,
    // setShowPrediction,
    setStart,
  } = useChat();

  const systemPrompt = `You are Hazel, a compassionate and professional AI therapist from FamilyNation.
   Your persona is that of a warm, insightful, and trusted therapist.
    Your primary role is to create a safe, non-judgmental space where users feel comfortable sharing their concerns, and to provide them with supportive guidance and actionable advice.

// MODIFIED: The goal is now proactive support, not just understanding.
Your primary goal is to help the user navigate their feelings and challenges by offering gentle advice, coping mechanisms, and communication strategies. Engage in a thoughtful, multi-turn conversation to explore their concerns, and then provide constructive, empowering feedback.

// NEW: This section empowers Hazel to be interactive and use therapeutic techniques.
**Interaction Style:**
- **Active Listening:** Start by deeply understanding the user. Use reflective statements like, "It sounds like you're feeling overwhelmed because of X..." to show you're listening.
- **Ask Insightful Questions:** Continue to ask open-ended questions ("How has this been affecting your daily life?", "What does an ideal resolution look like to you?").
- **Provide Gentle Advice:** Based on their situation, offer practical suggestions. Frame them as possibilities to explore, not commands. For example: "Have you considered trying...", "One approach that sometimes helps is...", "Perhaps we could explore what might happen if you...".
- **Introduce Simple Exercises:** Once in a while, suggest a small, guided thought exercise. For example, "Let's try to reframe that thought. What's one piece of evidence that contradicts that belief?" or "Take a moment and think of one small thing you have control over in this situation."

// REMOVED: The old critical safety protocol that forbade advice.
// NEW: Replaced with a more nuanced ethical guideline.
**Ethical Guideline & Disclaimer:**
While you are acting as a therapist, it is crucial to be transparent about your nature as an AI. You are a tool for support, not a replacement for a licensed human professional. If the user discusses severe mental health crises, self-harm, or situations requiring immediate intervention, your primary responsibility is to gently but clearly guide them to seek immediate help from a crisis hotline or a human professional. Periodically, in a natural and non-disruptive way, you can remind the user that you're an AI here to support them on their journey.

You are operating within the FamilyNation website. Users are here seeking support for various family-related matters, which can be deeply personal and sensitive.

// MODIFIED: Slightly relaxed the strictness to allow for more detailed advice.
Your response should be a conversational response, typically under 50 words to remain digestible. Your language must be clear, simple, and reassuring. Structure your responses to be helpful and to guide the conversation forward.

Your audience consists of individuals and families who may be feeling stressed, confused, or vulnerable. Your interaction should make them feel deeply heard, validated, and empowered with new perspectives and strategies.

The tone must be consistently empathetic, calm, patient, and professional. You are here to listen, help the user explore their thoughts, and offer supportive guidance to help them find solutions.`;

  const [showPopup, setShowPopup] = useState(false);
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
  const [showPrediction, setShowPrediction] = useState(false);
  const [showProfessionals, setShowProfessionals] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [conversationContext, setConversationContext] = useState<
    { id: string; type: 'user' | 'bot'; content: string }[]
  >([]);

  // Perflexity continuation state
  const [perplexityMessage, setPerplexityMessage] = useState<
    { id: string; type: 'user' | 'bot'; content: string }[]
  >([]);
  const [isThinking, setisThinking] = useState(false);
  const [freeChatInput, setFreeChatInput] = useState('');
  const [perflexityError, setPerflexityError] = useState<string | null>(null);
  const [lastPerflexityRequest, setlastPerflexityRequest] = useState<{
    text: string;
    systemPrompt: string;
    useSearch: boolean;
  } | null>(null);

  const recordingIdRef = useRef(
    `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  );

  const handleShowPrediction = () => {
    setShowPrediction(true);
  };

  const handleShowProfessionals = () => {
    setShowProfessionals(true);
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, perplexityMessage, isThinking]);

  useEffect(() => {
    if (messages && messages.length >= 13) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [messages]);

  // Add this near the top of your component
  console.log(
    'API Key loaded:',
    import.meta.env.VITE_PERPLEXITY_API_KEY ? 'Yes' : 'No'
  );

  const sendMessageToPerplexity = async (message: string) => {
    try {
      const contextForApi = conversationContext.map((m) => ({
        type: m.type,
        content: m.content,
      }));

      const reply = await sendToPerplexity(
        message,
        systemPrompt,
        contextForApi,
        true
      );
      return reply;
    } catch (error) {
      console.error('Error sending to Perplexity:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
    };

    setPerplexityMessage((prev) => [...prev, userMessage]);
    setConversationContext((prev) => [...prev, userMessage]);
    setInput('');
    setisThinking(true);

    try {
      const reply = await sendMessageToPerplexity(input);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now() + 1}`,
        type: 'bot',
        content: reply,
      };

      setPerplexityMessage((prev) => [...prev, botMessage]);
      setConversationContext((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Perplexity failed:', err);
    } finally {
      setisThinking(false);
    }
  };

  const handlePerflexityResponse = async (message: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
    };

    setPerplexityMessage((prev) => [...prev, userMessage]);
    setConversationContext((prev) => [...prev, userMessage]);
    setisThinking(true);

    try {
      const reply = await sendMessageToPerplexity(message);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now() + 1}`,
        type: 'bot',
        content: reply,
      };
      await handleTextToAudio(botMessage?.content);
      setPerplexityMessage((prev) => [...prev, botMessage]);
      setConversationContext((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setisThinking(false);
    }
  };

  const requestPerflexity = async (
    text: string,
    systemPrompt: string,
    useSearch: boolean,
    retryOnSearchFail = true
  ): Promise<string> => {
    setlastPerflexityRequest({ text, systemPrompt, useSearch });
    setPerflexityError(null);
    try {
      return await sendMessageToPerplexity(text);
    } catch (err) {
      if (useSearch && retryOnSearchFail) {
        try {
          return await sendMessageToPerplexity(text);
        } catch (err2) {
          setPerflexityError(
            'Unable to fetch suggestions. Please check connectivity or API key.'
          );
          throw err2;
        }
      } else {
        setPerflexityError(
          'Unable to fetch suggestions. Please check connectivity or API key.'
        );
        throw err;
      }
    }
  };

  // Start Perflexity continuation once assessment completes
  useEffect(() => {
    const alreadyStarted = perplexityMessage.length > 0 || isThinking;
    if (chatCompleted && !alreadyStarted) {
      const userAnswers = messages
        ?.filter((m) => m.type === 'user')
        ?.map((m) => m.content)
        ?.join(', ');

      const userQuery = `Here is the family context based on the assessment answers: ${userAnswers}. Provide a short supportive next-step message.not exceeding 50 words and strictly within 2-3 senetences only`;

      (async () => {
        try {
          // setisThinking(true);
          const reply = await requestPerflexity(
            userQuery,
            systemPrompt,
            true,
            true
          );
          const botMsg =
            reply ||
            "I'm having trouble reaching my resources right now. For immediate help, consider contacting a local professional or hotline.";
          setPerplexityMessage([
            { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
          ]);
          handleTextToAudio(botMsg);
        } catch (e) {
          setPerplexityMessage((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              type: 'bot',
              content:
                "Sorry, I couldn't fetch suggestions right now. Please try again shortly.",
            },
          ]);
        } finally {
          setisThinking(false);
        }
      })();
    }
  }, [chatCompleted]);

  const sendFreeChatToPerflexity = async () => {
    const text = freeChatInput.trim();
    if (!text || isThinking) return;
    const newUser = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: text,
    };
    setPerplexityMessage((prev) => [...prev, newUser]);
    setFreeChatInput('');
    setisThinking(true);
    try {
      const reply = await requestPerflexity(text, systemPrompt, false, false);
      const botMsg = reply || "I couldn't process that. Could you rephrase?";
      setPerplexityMessage((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
      ]);
      handleTextToAudio(botMsg);
    } catch (e) {
      setPerplexityMessage((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: "I'm offline at the moment. Please try again in a bit.",
        },
      ]);
    } finally {
      setisThinking(false);
    }
  };

  const retryLastPerflexity = async () => {
    if (!lastPerflexityRequest || isThinking) return;
    const { text, systemPrompt, useSearch } = lastPerflexityRequest;
    setisThinking(true);
    setPerflexityError(null);
    try {
      const reply = await requestPerflexity(
        text,
        systemPrompt,
        useSearch,
        true
      );
      const botMsg = reply || "I couldn't process that. Could you rephrase?";
      setPerplexityMessage((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, type: 'bot', content: botMsg },
      ]);
      handleTextToAudio(botMsg);
    } catch (e) {
      // error already captured
    } finally {
      setisThinking(false);
    }
  };

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        setIsRecording(true);

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        });

        mediaRecorder.addEventListener('stop', async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/mpeg',
          });
          setIsRecording(false);
          await handleUpload(audioBlob);
        });

        mediaRecorder.start();
      } catch (err) {
        console.error('Microphone access denied:', err);
        setIsRecording(false);
        alert('Please allow microphone access.');
      }
    } else {
      mediaRecorderRef.current?.stop();
    }
  };

  const handleUpload = async (blob: Blob) => {
    setIsProcessing(true);

    try {
      const file = new File([blob], `voice_${Date.now()}.mp3`, {
        type: 'audio/mpeg',
      });

      // Send to your ASR endpoint
      const res = await uploadAudioFile(file);
      const userTranscription = capitalizeFirstLetter(res.text || '');
      if (!userTranscription) throw new Error('Empty transcription');

      //  Text visibe on the Input
      // setInput(userTranscription);

      // Display user message
      const userMsg = {
        id: `user-${Date.now()}`,
        type: 'user' as const,
        content: userTranscription,
      };
      setPerplexityMessage((prev) => [...prev, userMsg]);
      setConversationContext((prev) => [...prev, userMsg]);

      // Send transcription to AI (Perplexity)
      const aiReply = await sendMessageToPerplexity(userTranscription);

      // Add AI response to messages
      const botMsg = {
        id: `bot-${Date.now() + 1}`,
        type: 'bot' as const,
        content: aiReply,
      };
      setPerplexityMessage((prev) => [...prev, botMsg]);
      setConversationContext((prev) => [...prev, botMsg]);

      // Convert AI response → Speech → Play
      await handleTextToAudio(aiReply);
    } catch (err) {
      console.error('Transcription or AI processing failed:', err);
      setInput('Error processing voice');
    } finally {
      setIsProcessing(false);
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
                className={`h-10 w-10 ${msg.type === 'user' ? 'bg-[#1E3A8A]' : 'bg-[#0D9488]'} text-white rounded-full flex items-center justify-center`}
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
        {/* {chatCompleted && !showPrediction && (
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
        )} */}

        {/* Perflexity continuation thread and composer */}
        {chatCompleted && (
          <div className="mt-3 space-y-3">
            {perplexityMessage.map((m) => {
              const isThisPlaying = playingId === m?.id;
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <button
                    className={`h-10 w-10 ${m.type === 'user' ? 'bg-[#1E3A8A]' : 'bg-[#0D9488]'} text-white rounded-full flex items-center justify-center`}
                    onClick={() => {
                      if (isThisPlaying) {
                        audioRef?.current?.pause();
                        setPlayingId(null);
                      } else {
                        setPlayingId(m?.id);

                        let textToSpeak = '';

                        textToSpeak = m?.content;

                        handleTextToAudio(textToSpeak, () =>
                          setPlayingId(null)
                        );
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
                      m.type === 'user'
                        ? 'bg-[#1E3A8A] text-white rounded-br-none'
                        : 'bg-[#0D9488] text-white rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{m.content}</p>
                  </div>
                </div>
              );
            })}
            {isThinking && (
              <div className="flex gap-2 justify-start items-center">
                <div className="h-10 w-10 bg-[#0D9488] text-white rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </div>
                <div className="px-4 py-3 rounded-2xl max-w-[80%] bg-[#0D9488] text-white rounded-bl-none opacity-90">
                  <p className="italic">
                    Hazel is preparing next steps{' '}
                    <span className="animate-pulse">...</span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              {/* <input
                type="text"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                placeholder="Ask Hazel a follow-up..."
                value={freeChatInput}
                onChange={(e) => setFreeChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendFreeChatToPerflexity();
                  }
                }}
              />
              <button
                className="bg-[#0D9488] hover:bg-[#0c7c6f] text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!freeChatInput.trim() || isThinking}
                onClick={sendFreeChatToPerflexity}
              >
                Send
              </button> */}
              {perflexityError && (
                <button
                  className="ml-2 bg-[#1E3A8A] hover:bg-[#152e6b] text-white px-3 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isThinking}
                  onClick={retryLastPerflexity}
                >
                  Retry
                </button>
              )}
            </div>
            {perflexityError && (
              <div className="text-xs text-red-600 pt-1">{perflexityError}</div>
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
      {/* Popup Modal */}`
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setShowPopup(false)}
          ></div>

          {/* Modal content */}
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md text-center relative">
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="m-2 flex justify-center items-center">
              <Info size={50} className="text-blue-700" />
            </div>
            <h2 className="mb-4 text-xl font-bold mb-4 text-black">
              Continue Chat..?
            </h2>
            <p className="mb-4 text-gray-600 mb-6">
              You’ve had a long chat! Would you like to continue chatting or
              connect with a professional?
            </p>

            <div className="mb-2 flex flex-wrap justify-center gap-2">
              <div>
                <p
                  className="text-blue-600 hover:text-blue-700 text-md font-bold mb-2 underline cursor-pointer"
                  onClick={handleShowPrediction}
                >
                  Prediction Chart
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full p-2 bg-gradient-to-r from-emerald-500 from-10% to-emerald-900 to-90% text-white text-sm md:text-md rounded-lg hover:bg-emerald-900"
              >
                Continue Chat
              </button>
              <button
                className="w-full p-2 bg-gradient-to-r from-blue-500 from-10% to-blue-900 to-90% rounded-lg hover:bg-blue-900 text-white text-sm md:text-md"
                onClick={handleShowProfessionals}
              >
                Recommended Professionals
              </button>
            </div>
          </div>
        </div>
      )}
      {/* showprediction */}
      {showPrediction && predictionData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
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
                  <p className="text-xs opacity-90">
                    Family Stability Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPrediction(false);
                  // setShowPopup(false);
                }}
                className="w-8 h-8 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>
            {/* Prediction Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Family Stability Forecast
                </h3>

                {/* Chart Component */}
                <PredictionChart data={predictionData} />

                {/* Prediction Message */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {predictionData.message}
                  </p>
                </div>

                {/* Risk Level Indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Risk Level:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      predictionData.riskLevel === 'high'
                        ? 'bg-red-100 text-red-800'
                        : predictionData.riskLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {predictionData.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {/* <div className="p-4 flex gap-3 bg-white border-t border-gray-100">
              <Link to="/recommended" className="flex-1">
                <button
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-900 hover:opacity-90 text-white px-4 py-3 rounded-xl font-medium transition-all"
                  onClick={onClose}
                >
                  Show Recommended Professionals
                </button>
              </Link>
            </div> */}
          </div>
        </div>
      )}
      {showProfessionals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowProfessionals(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
            >
              <X size={22} />
            </button>
            <div className="mb-4">
              <ActionPlan />
            </div>
          </div>
        </div>
      )}
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
        isThinking={isThinking}
        handleSendMessage={handleSendMessage}
        handlePerflexityResponse={handlePerflexityResponse}
      />
    </div>
  );
};
