import React, { useEffect, useRef, useState } from 'react';
import { useVoiceRecorder } from '../hook/useVoiceRecorder';
import { uploadAudioFile } from '../api/hazelChatApi';
import { sendToPerplexity } from '../api/perflexityApi';

const systemPrompt = `You are a helpful AI assistant. Keep responses concise and conversational.`;

const VoiceAssistant: React.FC = () => {
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } = useVoiceRecorder();
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const conversationContext = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const speechSynthesis = useRef<SpeechSynthesisUtterance | null>(null);

  // Handle speech synthesis
  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      if (speechSynthesis.current) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.voice = window.speechSynthesis.getVoices().find(v => v.lang === 'en-US') || null;
      
      utterance.onend = () => {
        setStatus('idle');
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        setError('Error generating speech');
        setStatus('error');
        resolve();
      };

      speechSynthesis.current = utterance;
      window.speechSynthesis.speak(utterance);
      setStatus('speaking');
    });
  };

  // Process audio and get response
  const processAudio = async () => {
    if (!audioBlob) return;
    
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

      // 2. Get response from Perplexity AI
      const reply = await sendToPerplexity(
        userText,
        systemPrompt,
        conversationContext.current,
        true // Enable web search
      );

      // Update conversation context
      conversationContext.current = [
        ...conversationContext.current,
        { role: 'user', content: userText },
        { role: 'assistant', content: reply }
      ];

      // 3. Speak the response
      await speak(reply);
      
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
      resetRecording();
    }
  };

  // Process audio when new recording is available
  useEffect(() => {
    if (audioBlob) {
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

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative">
        {/* Microphone Button */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          onMouseLeave={isRecording ? stopRecording : undefined}
          disabled={status === 'processing' || status === 'speaking'}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
            status === 'listening'
              ? 'bg-red-500 scale-110'
              : status === 'processing' || status === 'speaking'
                ? 'bg-blue-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {status === 'processing' ? (
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : status === 'speaking' ? (
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-4 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-6 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '100ms' }}></div>
              <div className="w-1.5 h-8 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '200ms' }}></div>
              <div className="w-1.5 h-6 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '300ms' }}></div>
              <div className="w-1.5 h-4 bg-white rounded-full animate-audio-wave" style={{ animationDelay: '400ms' }}></div>
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
        </button>

        {/* Status indicator */}
        <div className="mt-4 text-center">
          <p className={`text-lg font-medium ${
            status === 'error' ? 'text-red-600' : 'text-gray-700'
          }`}>
            {error || getStatusText()}
          </p>
        </div>

        {/* Visual feedback */}
        {status === 'listening' && (
          <div className="absolute inset-0 rounded-full border-4 border-red-200 opacity-70 animate-ping -z-10"></div>
        )}
      </div>

      <style jsx global>{`
        @keyframes audio-wave {
          0% { height: 10px; }
          50% { height: 24px; }
          100% { height: 10px; }
        }
        .animate-audio-wave {
          animation: audio-wave 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;
