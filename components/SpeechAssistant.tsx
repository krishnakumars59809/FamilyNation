import React, { useEffect, useRef, useState } from 'react';
import { detectOS } from '../utils/detectOS';
import { MonitorIcon } from 'lucide-react';
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

  // Show recommendations button after 5 messages and only if it hasn't been shown before
  const [hasShownRecommendations, setHasShownRecommendations] = useState(false);
  const isIOS = operatingSystem.toLowerCase().includes('ios');
      console.log("isIOS:",isIOS)

  useEffect(() => {
    if (conversationHistory.length >= 5 && !hasShownRecommendations) {
      setShowRecommendations(true);
    }
  }, [conversationHistory.length, hasShownRecommendations]);

  // Detect OS on component mount
  useEffect(() => {
    try {
      const detectedOS = detectOS();
      console.log("detectedOS:",detectedOS)
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
    // Skip auto-listen for iOS devices (must start via tap)
    if (isIOS) return;

    if (status === 'idle' && !isProcessing && !isSpeaking) {
      const timer = setTimeout(() => {
        if (!isRecording && !isProcessing) {
          startRecording();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, isProcessing, isSpeaking, isRecording, isIOS]);

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
      //  "hello"
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
    if (
      !isSpeaking &&
      autoListenNext &&
      !isRecording &&
      !isProcessing &&
      !isIOS
    ) {
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
        <div className="flex items-center space-x-3">
          <button className="px-3 py-1.5 mr-2 bg-[#0D9488] hover:bg-[#0c7c6f] text-white rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors">
            <MonitorIcon size={16} />
            <span>{operatingSystem}</span>
          </button>
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
        <div className="h-[10vh] md:h-full w-full md:w-[40%] flex flex-col items-center justify-end md:justify-center p-6 text-center bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="relative mb-0 md:mb-8">
            {/* Animated microphone icon */}
            {/* Mic button container */}
            <div
              className={`relative top-16 md:top-0 w-14 h-14 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
                status === 'listening'
                  ? 'bg-red-100 scale-110'
                  : status === 'processing' || status === 'speaking'
                    ? 'bg-green-50'
                    : 'bg-white'
              } shadow-lg ${
                isIOS ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
              }`}
              onClick={() => {
                if (!isIOS) return; // only clickable on iOS
                if (status === 'processing' || status === 'speaking') return; // prevent mid-process tap
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
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
          </div>
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
