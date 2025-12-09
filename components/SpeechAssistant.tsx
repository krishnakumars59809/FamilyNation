import React, { useEffect, useRef, useState } from 'react';
import { detectOS } from '../utils/detectOS';
import { useVoiceRecorder } from '../hook/useVoiceRecorder';
import { uploadAudioFile, textToAudio } from '../api/hazelChatApi';
import { playAudio } from '../utils/playAudio';
import { sendToPerplexity } from '../api/perflexityApi';
import { systemPrompt } from './constants/systemPrompt';
import { Send } from 'lucide-react';

const SpeechAssistant: React.FC<{
  voiceEnable: boolean;
  input: string;
  setInput: (val: string) => void;
  onBack?: () => void;
}> = ({ voiceEnable, input, setInput, onBack }) => {
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'listening' | 'processing' | 'speaking' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [conversationContext, setConversationContext] = useState<
    Array<{ type: 'user' | 'bot'; content: string }>
  >([]);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [operatingSystem, setOperatingSystem] =
    useState<string>('Detecting OS...');
  type MessageContent = string | React.ReactNode;

  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      id: string;
      type: 'user' | 'bot';
      content: MessageContent;
      timestamp: Date;
    }>
  >([]);

  useEffect(() => {
    if (voiceEnable) {
      startRecording(); // Start Mic
    } else {
      stopRecording(); // Stop Mic
    }
  }, [voiceEnable]);

  // Show recommendations button after 5 messages and only if it hasn't been shown before
  const [hasShownRecommendations, setHasShownRecommendations] = useState(false);
  const isIOS = operatingSystem.toLowerCase().includes('ios');

  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const handleStopSpeaking = () => {
    // 1. Stop audio
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    // 2. Clear audio & speaking state
    setAudioPlayer(null);
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (conversationHistory.length >= 5 && !hasShownRecommendations) {
      setShowRecommendations(true);
    }
  }, [conversationHistory.length, hasShownRecommendations]);

  // Detect OS on component mount
  useEffect(() => {
    try {
      const detectedOS = detectOS();
      setOperatingSystem(detectedOS);
    } catch (error) {
      console.error('Error detecting OS:', error);
      setOperatingSystem('Unknown OS');
    }
  }, []);

  const handleRecommendationsClick = async () => {
    // Hide the recommendations button immediately when clicked
    setShowRecommendations(false);
    // Mark recommendations as shown to prevent button from reappearing
    setHasShownRecommendations(true);

    try {
      // Show loading state
      const loadingMessage = {
        id: `rec-loading-${Date.now()}`,
        type: 'bot' as const,
        content: 'Finding helpful resources for you...',
        timestamp: new Date(),
      };
      setConversationHistory((prev) => [...prev, loadingMessage]);

      // Get the conversation context
      const conversationContext = conversationHistory.slice(-4).map((m) => ({
        type: m.type,
        content:
          typeof m.content === 'string' ? m.content : '[Content with links]',
      }));

      // Create a focused prompt to get media resources
      const prompt = `Based on our conversation, please provide 2-4 high-quality, relevant media links 
        (videos, articles, or blogs) that could be helpful. Format the response as markdown links:
        - [Title 1](https://example1.com) - Brief description
        - [Title 2](https://example2.com) - Brief description`;

      // Call Perplexity API with web search enabled
      const response = await sendToPerplexity(
        prompt,
        'You are a helpful assistant that provides relevant and high-quality media resources. ' +
          'Focus on educational content from reputable sources. Include a mix of videos and articles.',
        conversationContext,
        true // Enable web search
      );

      // Remove loading message
      setConversationHistory((prev) =>
        prev.filter((m) => m.id !== loadingMessage.id)
      );

      // Process and format the response
      const formattedContent = (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">
            Here are some resources you might find helpful:
          </p>
          <div className="space-y-2">
            {response
              .split('\n')
              .filter((line) => line.trim().startsWith('- ['))
              .map((line, i) => {
                // Extract link and text using regex
                const match = line.match(/\[(.*?)\]\((.*?)\)(?: - (.*))?/);
                if (!match) return null;

                const [, title, url, description] = match;
                return (
                  <div
                    key={i}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium flex items-start"
                    >
                      <svg
                        className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span>
                        {title}
                        {description && (
                          <span className="block text-sm text-gray-600 font-normal mt-0.5">
                            {description}
                          </span>
                        )}
                      </span>
                    </a>
                  </div>
                );
              })}
          </div>
        </div>
      );

      const recommendationMessage = {
        id: `rec-${Date.now()}`,
        type: 'bot' as const,
        content: formattedContent,
        timestamp: new Date(),
      };

      setConversationHistory((prev) => [...prev, recommendationMessage]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      const errorMessage = {
        id: `rec-error-${Date.now()}`,
        type: 'bot' as const,
        content:
          "Sorry, I had trouble finding resources. You can try asking me a specific question about what you're looking for!",
        timestamp: new Date(),
      };
      setConversationHistory((prev) => [...prev, errorMessage]);
    }
  };
  const [autoListenNext, setAutoListenNext] = useState(false);
  const [pendingAudioBuffer, setPendingAudioBuffer] =
    useState<ArrayBuffer | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Process audio and get response
  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setStatus('processing');
    setError(null);

    try {
      // 1. Convert speech to text
      const file = new File([audioBlob], `speech-${Date.now()}.wav`, {
        type: 'audio/wav',
      });
      const sttResponse = await uploadAudioFile(file);
      const userText = sttResponse?.text?.trim();

      if (!userText) {
        throw new Error('Could not understand your voice. Please try again.');
      }

      // Update conversation context
      const updatedContext = [
        ...conversationContext,
        { type: 'user' as const, content: userText },
      ];
      setConversationContext(updatedContext);

      // Add user message to conversation history
      const userEntry = {
        id: `user-${Date.now()}`,
        type: 'user' as const,
        content: userText,
        timestamp: new Date(),
      };
      setConversationHistory((prev) => [...prev, userEntry]);

      // 2. Get response from Perplexity AI
      const reply = await sendToPerplexity(
        userText,
        systemPrompt,
        conversationContext,
        true // Enable web search for more accurate responses
      );

      const cleanedReply = reply
        .replace(/\[\d+\]/g, '') // Remove [1], [2], etc.
        .replace(/[*_`~]/g, '') // Remove markdown symbols (*, _, `, ~)
        .replace(/-{2,}/g, '-') // Replace multiple dashes with a single dash
        .replace(/\s{2,}/g, ' ') // Remove extra spaces
        .trim(); // Trim start and end spaces

      // Update conversation context with bot's response
      setConversationContext((prev) => [
        ...prev,
        { type: 'bot' as const, content: cleanedReply },
      ]);

      // Add bot response to conversation history
      const botEntry = {
        id: `bot-${Date.now()}`,
        type: 'bot' as const,
        content: cleanedReply,
        timestamp: new Date(),
      };
      setConversationHistory((prev) => [...prev, botEntry]);

      // If voice is OFF → stop here
      if (!voiceEnable) {
        setStatus('idle');
        setIsProcessing(false);
        return;
      }

      if (voiceEnable) {
        // 3. Convert response to speech via existing API
        const tts = await textToAudio(cleanedReply);
        const base64 = (tts as any)?.audio;
        if (!base64) {
          throw new Error('TTS audio missing');
        }
        const audioBuffer = Uint8Array.from(atob(base64), (c) =>
          c.charCodeAt(0)
        ).buffer;
        setStatus('speaking');

        // On iOS, require user tap to play; else autoplay
        if (isIOS) {
          setPendingAudioBuffer(audioBuffer);
          // Enable auto-listen after speech completes
          setAutoListenNext(true);
        } else {
          // Play the audio and set up auto-listen for after speech completes
          playAudio(audioBuffer, setIsSpeaking, setAudioPlayer, () => {
            if (voiceEnable && autoListenNext) {
              setTimeout(() => {
                startRecording();
              }, 500);
            }
          });
          // Enable auto-listen for the next user input
          setAutoListenNext(true);
        }
      }
    } catch (err) {
      console.error('Error in speech processing:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');

      // Reset after showing error
      setTimeout(() => {
        setError(null);
        setStatus('idle');
      }, 3000);
    } finally {
      setIsProcessing(false);
      resetRecording();
    }
  };

  const sendTextMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    // Stop any mic flow
    stopRecording?.();
    setIsSpeaking(false);
    setStatus('idle');

    // Add typed text to chat
    const userEntry = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: userText,
      timestamp: new Date(),
    };
    setConversationHistory((prev) => [...prev, userEntry]);

    // Update context
    const updatedContext = [
      ...conversationContext,
      { type: 'user' as const, content: userText },
    ];
    setConversationContext(updatedContext);

    setInput('');

    // ---- SEND TO PERPLEXITY ----
    try {
      const reply = await sendToPerplexity(
        userText,
        systemPrompt,
        conversationContext,
        true
      );

      const cleanedReply = reply
        .replace(/\[\d+\]/g, '')
        .replace(/[*_`~]/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/\s{2,}/g, ' ')
        .trim();

      // Add bot message in chat
      const botEntry = {
        id: `bot-${Date.now()}`,
        type: 'bot' as const,
        content: cleanedReply,
        timestamp: new Date(),
      };
      setConversationHistory((prev) => [...prev, botEntry]);

      // Update context
      setConversationContext((prev) => [
        ...prev,
        { type: 'bot' as const, content: cleanedReply },
      ]);

      // ---- If voice is disabled → STOP HERE ----
      if (!voiceEnable) {
        setStatus('idle');
        return;
      }

      // ---- SPEAK REPLY ----
      // const tts = await textToAudio(cleanedReply);
      // const base64 = (tts as any)?.audio;

      // if (base64) {
      //   const audioBuffer = Uint8Array.from(atob(base64), (c) =>
      //     c.charCodeAt(0)
      //   ).buffer;

      //   if (isIOS) {
      //     setPendingAudioBuffer(audioBuffer);
      //     setAutoListenNext(true);
      //   } else {
      //     setStatus("speaking");
      //     await playAudio(audioBuffer, setIsSpeaking, setAudioPlayer);
      //     setStatus("idle");
      //   }
      // }
    } catch (err) {
      console.error('Typed message error:', err);
      setStatus('error');
    }
  };

  const unlockAndPlayWelcome = async () => {
    if (!isIOS || hasWelcomed || isSpeaking || isProcessing) return;
    try {
      const AudioCtx: any =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          const ctx = new AudioCtx();
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
          await ctx.resume();
          setTimeout(() => {
            try {
              source.disconnect();
              ctx.close();
            } catch {}
          }, 0);
        } catch {}
      }

      const welcomeMessage =
        "Hello! I'm Hazel, your family support assistant. I'm here to help you with any family concerns or challenges you might be facing.  How can I help you today?";
      // If voice assistant disabled → do NOT speak
      if (!voiceEnable) {
        setStatus('idle');
        setHasWelcomed(true);
        return;
      }
      setStatus('speaking');
      const tts = await textToAudio(welcomeMessage);
      const base64 = (tts as any)?.audio;
      if (base64) {
        const audioBuffer = Uint8Array.from(atob(base64), (c) =>
          c.charCodeAt(0)
        ).buffer;
        setAutoListenNext(true);
        await playAudio(audioBuffer, setIsSpeaking, setAudioPlayer);
      }
      setStatus('idle');
      setHasWelcomed(true);
    } catch (err) {
      console.error('iOS unlock welcome failed:', err);
      setStatus('idle');
      setHasWelcomed(true);
    }
  };

  // Process audio when new recording is available
  useEffect(() => {
    if (audioBlob && !isProcessing) {
      // Only process if we have a non-empty audio blob
      if (audioBlob.size > 0) {
        processAudio();
      } else {
        // If we get an empty audio blob (from silence detection), reset the state
        resetRecording();
        setStatus('idle');
      }
    }
  }, [audioBlob]);

  // Handle recording state changes
  useEffect(() => {
    if (isRecording) {
      setStatus('listening');
    } else if (status === 'listening') {
      // When recording stops, set to processing if we have audio to process
      if (audioBlob && audioBlob.size > 0) {
        setStatus('processing');
      } else {
        setStatus('idle');
      }
    }
  }, [isRecording, status, audioBlob]);

  // Auto-start listening only after welcome has finished or later idle states
  useEffect(() => {
    if (!hasWelcomed) return;
    if (status === 'idle' && !isProcessing && !isSpeaking) {
      // Small delay before starting to listen again
      const timer = setTimeout(() => {
        if (voiceEnable && !isRecording && !isProcessing) {
          startRecording();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasWelcomed, status, isProcessing, isSpeaking, isRecording, voiceEnable]);

  // Handle speaking state changes
  useEffect(() => {
    if (isSpeaking) {
      setStatus('speaking');
    } else if (status === 'speaking') {
      setStatus('idle');

      // Auto-start listening after Hazel finishes speaking if autoListenNext is true
      if (voiceEnable && autoListenNext && !isProcessing) {
        // Small delay before starting to listen again
        const timer = setTimeout(() => {
          startRecording();
          setAutoListenNext(false); // Reset after starting to listen
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [
    isSpeaking,
    status,
    autoListenNext,
    isProcessing,
    startRecording,
    voiceEnable,
  ]);

  // Welcome greeting when component mounts
  useEffect(() => {
    if (!hasWelcomed) {
      const welcomeMessage =
        "Hello! I'm Hazel, your family support assistant. I'm here to help you with any family concerns or challenges you might be facing.  How can I help you today?";
      const initWelcome = async () => {
        // Add welcome message to conversation history immediately
        const welcomeEntry = {
          id: `welcome-${Date.now()}`,
          type: 'bot' as const,
          content: welcomeMessage,
          timestamp: new Date(),
        };
        setConversationHistory([welcomeEntry]);
        // If voice assistant disabled → do NOT speak
        if (!voiceEnable) {
          setStatus('idle');
          stopRecording();
          setHasWelcomed(true);
          return;
        }
        try {
          const tts = await textToAudio(welcomeMessage);
          const base64 = (tts as any)?.audio;
          if (base64) {
            const audioBuffer = Uint8Array.from(atob(base64), (c) =>
              c.charCodeAt(0)
            ).buffer;
            if (isIOS) {
              // Queue for user tap; do not autoplay
              setPendingAudioBuffer(audioBuffer);
              setAutoListenNext(true);
            } else {
              setStatus('speaking');
              setAutoListenNext(true);
              await playAudio(audioBuffer, setIsSpeaking, setAudioPlayer);
              setStatus('idle');
            }
          } else {
            setHasWelcomed(true);
          }
        } catch (err) {
          console.error('Error preparing welcome message:', err);
          setStatus('idle');
          setHasWelcomed(true);
        }
        if (!isIOS) {
          setHasWelcomed(true);
        }
      };

      const timer = setTimeout(initWelcome, 300);
      return () => clearTimeout(timer);
    }
  }, [hasWelcomed]);

  // Auto-start microphone recording when Hazel finishes speaking
  useEffect(() => {
    if (
      voiceEnable &&
      !isSpeaking &&
      autoListenNext &&
      !isRecording &&
      !isProcessing
    ) {
      setAutoListenNext(false);
      // slight delay to avoid race with state updates
      setTimeout(() => {
        startRecording();
      }, 200);
    }
  }, [
    isSpeaking,
    autoListenNext,
    isRecording,
    isProcessing,
    startRecording,
    voiceEnable,
  ]);

  // No on-screen text per requirements
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-4 h-[10vh] bg-[#1E3A8A] text-white flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center relative">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-[#F87171]'}`}
              ></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F87171] rounded-full opacity-80 animate-pulse"></div>
          </div>
          <div>
            <span className="font-bold text-lg">Hazel</span>
            <p className="text-xs opacity-90">Voice Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={() => {
                onBack();
                handleStopSpeaking();
              }}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center"
              aria-label="Back"
            >
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Layout: 60% History + 40% Voice UI */}
      <div
        className={`h-[80vh] ${!voiceEnable ? '' : 'flex-1 flex flex-col md:flex-row'} `}
      >
        {/* Conversation History - 60% */}
        <div
          className={`${!voiceEnable ? 'h-[70vh] md:[70vh]' : 'h-[70vh] md:h-full md:w-[60%]'}  w-full  border-r bg-white overflow-y-auto`}
        >
          {conversationHistory.length > 0 ? (
            <div className="p-4 space-y-4">
              {conversationHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#0D9488] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.type === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {showRecommendations && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleRecommendationsClick}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Show Recommendations
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-lg mb-2">💬</div>
                <div className="text-sm">Conversation will appear here</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Interface - 40% */}

        {voiceEnable ? (
          <div className="h-[10vh] md:h-full w-full md:w-[40%] flex flex-col items-center justify-end md:justify-center p-6 text-center bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="relative mb-0 md:mb-8">
              {/* Animated microphone icon */}
              <div
                className={`relative top-16 md:top-0 w-14 h-14 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
                  status === 'listening'
                    ? 'bg-red-100 scale-110'
                    : status === 'processing' || status === 'speaking'
                      ? 'bg-green-50'
                      : 'bg-white'
                } shadow-lg ${isIOS && !hasWelcomed ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (isIOS && !hasWelcomed) {
                    void unlockAndPlayWelcome();
                  }
                }}
              >
                <div
                  className={`p-6 rounded-full ${
                    status === 'listening'
                      ? 'bg-red-500 text-white'
                      : status === 'processing'
                        ? 'bg-blue-100 text-blue-600'
                        : status === 'speaking'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {status === 'listening' ? (
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 relative z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                  ) : status === 'processing' ? (
                    <div className="flex space-x-2">
                      <div
                        className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  ) : status === 'speaking' ? (
                    <div className="flex items-center justify-center space-x-1">
                      <div
                        className="w-1 h-4 bg-green-500 rounded-full animate-audio-wave"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-1 h-6 bg-green-500 rounded-full animate-audio-wave"
                        style={{ animationDelay: '100ms' }}
                      ></div>
                      <div
                        className="w-1 h-8 bg-green-500 rounded-full animate-audio-wave"
                        style={{ animationDelay: '200ms' }}
                      ></div>
                      <div
                        className="w-1 h-6 bg-green-500 rounded-full animate-audio-wave"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                      <div
                        className="w-1 h-4 bg-green-500 rounded-full animate-audio-wave"
                        style={{ animationDelay: '400ms' }}
                      ></div>
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  )}
                </div>

                {/* Animated rings when listening */}
                {status === 'listening' && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-red-200 opacity-70 animate-ping"></div>
                    <div
                      className="absolute inset-0 rounded-full border-4 border-red-100 opacity-70 animate-ping"
                      style={{ animationDelay: '0.5s' }}
                    ></div>
                  </>
                )}
              </div>
              {isIOS && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-10 pointer-events-none">
                  <p className="text-xs text-gray-600">
                    Tap to let Hazel speak
                  </p>
                </div>
              )}
            </div>

            {/* Controls */}
            {/* <div className="p-6">
          <div className="flex justify-center">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              onMouseLeave={isRecording ? stopRecording : undefined}
              disabled={isProcessing || isSpeaking}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D9488] ${
                status === 'listening'
                  ? 'bg-red-600 hover:bg-red-700 scale-110'
                  : status === 'processing' || status === 'speaking'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#0D9488] hover:bg-[#0f766e]'
              }`}
            >
              {status === 'processing' ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : status === 'speaking' ? (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-2 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-1 h-6 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-1 h-2 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '400ms' }}></div>
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div> */}
          </div>
        ) : (
          <div className="h-[20vh] md:h-[15vh] border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e40af] sm:text-sm md:text-base transition-all duration-300"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && input.trim()) {
                    sendTextMessage(); // send typed text
                  }
                }}
              />
              <button
                className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white p-4 rounded-full sm:text-sm md:text-base"
                disabled={!input.trim()}
                onClick={sendTextMessage}
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Hazel is here to listen and support your family
            </p>
          </div>
        )}
      </div>

      {/* iOS: tap anywhere to play queued Hazel audio (welcome or subsequent) */}
      {isIOS && pendingAudioBuffer && (
        <div
          onClick={async () => {
            try {
              // Ensure AudioContext resumed on iOS
              const AudioCtx: any =
                (window as any).AudioContext ||
                (window as any).webkitAudioContext;
              if (AudioCtx) {
                try {
                  const ctx = new AudioCtx();
                  const buffer = ctx.createBuffer(1, 1, 22050);
                  const source = ctx.createBufferSource();
                  source.buffer = buffer;
                  source.connect(ctx.destination);
                  source.start(0);
                  await ctx.resume();
                  setTimeout(() => {
                    try {
                      source.disconnect();
                      ctx.close();
                    } catch {}
                  }, 0);
                } catch {}
              }
              let bufferToPlay: ArrayBuffer | null = pendingAudioBuffer;
              if (!bufferToPlay && !hasWelcomed) {
                // Fallback: prepare welcome TTS now if it wasn't ready yet
                const welcomeMessage =
                  "Hello! I'm Hazel, your family support assistant. I'm here to help you with any family concerns or challenges you might be facing.  How can I help you today?";
                try {
                  const tts = await textToAudio(welcomeMessage);
                  const base64 = (tts as any)?.audio;
                  if (base64) {
                    bufferToPlay = Uint8Array.from(atob(base64), (c) =>
                      c.charCodeAt(0)
                    ).buffer;
                  }
                } catch {}
              }
              if (bufferToPlay) {
                setStatus('speaking');
                await playAudio(bufferToPlay, setIsSpeaking, setAudioPlayer);
                setStatus('idle');
                setPendingAudioBuffer(null);
                setHasWelcomed(true);
                if (autoListenNext) {
                  setTimeout(() => {
                    startRecording();
                    setAutoListenNext(false);
                  }, 300);
                }
              }
            } catch {}
          }}
          className="fixed inset-0 z-50"
          style={{ background: 'transparent' }}
        />
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes audio-wave {
          0% { height: 6px; }
          50% { height: 24px; }
          100% { height: 6px; }
        }
        .animate-audio-wave {
          animation: audio-wave 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SpeechAssistant;
