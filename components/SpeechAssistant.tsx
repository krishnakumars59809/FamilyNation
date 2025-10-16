import React, { useEffect, useRef, useState } from 'react';
import { useVoiceRecorder } from '../hook/useVoiceRecorder';
import { uploadAudioFile, textToAudio } from '../api/hazelChatApi';
import { playAudio } from '../utils/playAudio';
import { sendToPerplexity } from '../api/perflexityApi';
import { systemPrompt } from './constants/systemPrompt';

const SpeechAssistant: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
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
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      id: string;
      type: 'user' | 'bot';
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [autoListenNext, setAutoListenNext] = useState(false);
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

      // Play the audio and set up auto-listen for after speech completes
      playAudio(audioBuffer, setIsSpeaking, () => {
        // This callback runs when audio finishes playing
        if (autoListenNext) {
          // Small delay before starting to listen again
          setTimeout(() => {
            startRecording();
          }, 500);
        }
      });

      // Enable auto-listen for the next user input
      setAutoListenNext(true);
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

  // Auto-start listening when component mounts or after processing
  useEffect(() => {
    if (status === 'idle' && !isProcessing && !isSpeaking) {
      // Small delay before starting to listen again
      const timer = setTimeout(() => {
        if (!isRecording && !isProcessing) {
          startRecording();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status, isProcessing, isSpeaking, isRecording]);

  // Handle speaking state changes
  useEffect(() => {
    if (isSpeaking) {
      setStatus('speaking');
    } else if (status === 'speaking') {
      setStatus('idle');

      // Auto-start listening after Hazel finishes speaking if autoListenNext is true
      if (autoListenNext && !isProcessing) {
        // Small delay before starting to listen again
        const timer = setTimeout(() => {
          startRecording();
          setAutoListenNext(false); // Reset after starting to listen
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [isSpeaking, status, autoListenNext, isProcessing, startRecording]);

  // Welcome greeting when component mounts
  useEffect(() => {
    if (!hasWelcomed) {
      const welcomeMessage =
        "Hello! I'm Hazel, your family support assistant. I'm here to help you with any family concerns or challenges you might be facing.  How can I help you today?";

      const playWelcome = async () => {
        try {
          setStatus('speaking');

          // Add welcome message to conversation history
          const welcomeEntry = {
            id: `welcome-${Date.now()}`,
            type: 'bot' as const,
            content: welcomeMessage,
            timestamp: new Date(),
          };
          setConversationHistory([welcomeEntry]);

          const tts = await textToAudio(welcomeMessage);
          const base64 = (tts as any)?.audio;
          if (base64) {
            const audioBuffer = Uint8Array.from(atob(base64), (c) =>
              c.charCodeAt(0)
            ).buffer;
            // Enable auto-listen after Hazel finishes speaking
            setAutoListenNext(true);
            await playAudio(audioBuffer, setIsSpeaking);
          }
          setStatus('idle');
        } catch (err) {
          console.error('Error playing welcome message:', err);
          setStatus('idle');
        } finally {
          setHasWelcomed(true);
        }
      };

      // Small delay to ensure component is fully mounted
      const timer = setTimeout(playWelcome, 500);
      return () => clearTimeout(timer);
    }
  }, [hasWelcomed]);

  // Auto-start microphone recording when Hazel finishes speaking
  useEffect(() => {
    if (!isSpeaking && autoListenNext && !isRecording && !isProcessing) {
      setAutoListenNext(false);
      // slight delay to avoid race with state updates
      setTimeout(() => {
        startRecording();
      }, 200);
    }
  }, [isSpeaking, autoListenNext, isRecording, isProcessing, startRecording]);

  // No on-screen text per requirements

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-4 bg-[#1E3A8A] text-white flex justify-between items-center">
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
        {onBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center"
            aria-label="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Horizontal Layout: 60% History + 40% Voice UI */}
      <div className="h-[80vh] md:h-full flex-1 flex flex-col md:flex-row">
        {/* Conversation History - 60% */}
        <div className="h-[70vh] md:h-full w-full md:w-[60%] border-r bg-white overflow-y-auto">
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
              } shadow-lg`}
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
      </div>

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
