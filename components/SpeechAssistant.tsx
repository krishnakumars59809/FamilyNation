import React, { useEffect, useState } from 'react';
import { useVoiceRecorder } from '../hook/useVoiceRecorder';
import { uploadAudioFile } from '../api/hazelChatApi';
import { playAudio } from '../utils/playAudio';
import { sendToPerplexity } from '../api/perflexityApi';

const systemPrompt = `You are Hazel, a compassionate and professional AI therapist from FamilyNation. 
Your persona is that of a warm, insightful, and trusted therapist. 
Your primary role is to create a safe, non-judgmental space where users feel comfortable sharing their concerns, 
and to provide them with supportive guidance and actionable advice.

Keep your responses concise (1-2 sentences) and conversational. Focus on active listening, 
asking thoughtful questions, and providing empathetic support.`;

const SpeechAssistant: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } = useVoiceRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [conversationContext, setConversationContext] = useState<Array<{ type: 'user' | 'bot'; content: string }>>([]);

  // Process audio and get response
  const processAudio = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    setStatus('processing');
    setError(null);

    try {
      // 1. Convert speech to text
      const file = new File([audioBlob], `speech-${Date.now()}.wav`, { type: 'audio/wav' });
      const sttResponse = await uploadAudioFile(file);
      const userText = sttResponse?.text?.trim();
      
      if (!userText) {
        throw new Error('Could not understand your voice. Please try again.');
      }

      // Update conversation context
      const updatedContext = [
        ...conversationContext,
        { type: 'user' as const, content: userText }
      ];
      setConversationContext(updatedContext);

      // 2. Get response from Perplexity AI
      const reply = await sendToPerplexity(
        userText,
        systemPrompt,
        conversationContext,
        true // Enable web search for more accurate responses
      );

      // Update conversation context with bot's response
      setConversationContext(prev => [
        ...prev,
        { type: 'bot' as const, content: reply }
      ]);

      // 3. Convert response to speech
      const ttsResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply }),
      });
      
      if (!ttsResponse.ok) {
        throw new Error('Could not generate speech response');
      }
      
      const audioData = await ttsResponse.arrayBuffer();
      
      // 4. Play the audio response
      setStatus('speaking');
      await playAudio(audioData, setIsSpeaking);
      setStatus('idle');
      
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
      processAudio();
    }
  }, [audioBlob]);

  // Handle recording state changes
  useEffect(() => {
    if (isRecording) {
      setStatus('listening');
    } else if (status === 'listening') {
      setStatus('processing');
    }
  }, [isRecording, status]);

  // Handle speaking state changes
  useEffect(() => {
    if (isSpeaking) {
      setStatus('speaking');
    } else if (status === 'speaking') {
      setStatus('idle');
    }
  }, [isSpeaking, status]);

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      case 'error':
        return 'Error occurred';
      default:
        return 'Hold to speak';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="p-4 bg-[#1E3A8A] text-white flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${
                status === 'error' ? 'bg-red-500' : 'bg-[#F87171]'
              }`}></div>
            </div>
          </div>
          <h2 className="font-bold">Voice Assistant</h2>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm transition-colors"
          >
            Back to Chat
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          {/* Animated microphone icon */}
          <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${
            status === 'listening' 
              ? 'bg-red-100 scale-110' 
              : status === 'processing' || status === 'speaking'
                ? 'bg-blue-50'
                : 'bg-white'
          } shadow-lg`}>
            <div className={`p-6 rounded-full ${
              status === 'listening' 
                ? 'bg-red-500 text-white' 
                : status === 'processing' 
                  ? 'bg-blue-100 text-blue-600' 
                  : status === 'speaking'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
            }`}>
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
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : status === 'speaking' ? (
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-1 h-4 bg-green-500 rounded-full animate-audio-wave" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-6 bg-green-500 rounded-full animate-audio-wave" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-1 h-8 bg-green-500 rounded-full animate-audio-wave" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1 h-6 bg-green-500 rounded-full animate-audio-wave" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-1 h-4 bg-green-500 rounded-full animate-audio-wave" style={{ animationDelay: '400ms' }}></div>
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
                <div className="absolute inset-0 rounded-full border-4 border-red-100 opacity-70 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
          </div>
          
          {/* Status text */}
          <div className="mt-6 text-center">
            <p className={`text-lg font-medium ${
              status === 'error' ? 'text-red-600' : 'text-gray-700'
            }`}>
              {error || getStatusText()}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
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
      </div>

      {/* Add animation styles */}
      <style jsx global>{`
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
