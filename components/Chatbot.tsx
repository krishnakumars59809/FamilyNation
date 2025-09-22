import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, Resource } from '../types';
import { getHazelResponseStream, generateResourceReport, resetChat } from '../services/geminiService';
import { ResourceCard } from './ResourceCard';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReportPrompt, setShowReportPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClose = useCallback(() => {
    resetChat();
    setMessages([]);
    setShowReportPrompt(false);
    onClose();
  }, [onClose]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { sender: 'hazel', text: "Hello, I'm Hazel, your personal guide. Thank you for reaching out. How may I help you right now?" }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setShowReportPrompt(false);

    try {
        const stream = await getHazelResponseStream(input);
        
        let firstChunk = true;
        for await (const textChunk of stream) {
            if (firstChunk) {
                setMessages(prev => [...prev, { sender: 'hazel', text: textChunk }]);
                firstChunk = false;
            } else {
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += textChunk;
                    return newMessages;
                });
            }
        }
    } catch (error) {
        console.error("Error streaming response:", error);
        setMessages(prev => [...prev, { sender: 'hazel', text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
        setIsLoading(false);
        setShowReportPrompt(true);
    }
  };
  
  const handleGenerateReport = async () => {
    setIsLoading(true);
    setShowReportPrompt(false);
    setMessages(prev => [...prev, { sender: 'hazel', text: "Of course. I'm compiling a list of personalized resources for you now. This may take a moment..." }]);

    const conversationSummary = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
    const resources = await generateResourceReport(conversationSummary);
    
    const resourceMessage: ChatMessage = {
      sender: 'hazel',
      text: "Here are some resources that I believe could be helpful. Please review them at your convenience.",
      resources: resources,
    };
    
    setMessages(prev => [...prev, resourceMessage]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b bg-brand-light">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-lg mr-3">H</div>
            <div>
                <h2 className="text-lg font-semibold text-brand-dark">Hazel</h2>
                <p className="text-sm text-brand-dark/80">Your AI Support Agent</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.resources && (
                    <div className="mt-4 space-y-3">
                        {msg.resources.map((res, i) => <ResourceCard key={i} resource={res} />)}
                    </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && !showReportPrompt && (
            <div className="flex justify-start my-2">
              <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
                <div className="flex items-center">
                  <span className="typing-indicator"></span>
                  <span className="typing-indicator animation-delay-200"></span>
                  <span className="typing-indicator animation-delay-400"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {showReportPrompt && (
            <div className="p-4 border-t bg-white">
                <button 
                    onClick={handleGenerateReport}
                    className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Generate a Personalized Resource Report
                </button>
            </div>
        )}

        <div className="p-4 border-t bg-white">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="bg-brand hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-r-md disabled:bg-gray-400 transition-colors"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .typing-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #9CA3AF;
          margin: 0 2px;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .animation-delay-200 { animation-delay: -0.2s; }
        .animation-delay-400 { animation-delay: -0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
};
