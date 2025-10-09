// import React, { useState, useRef, useEffect } from 'react';
// import { useChat } from '../context/chatContext';
// import { useConversation } from '../contexts/ConversationContext';
// import { CloudCog, Link, Volume1, Volume2, X } from 'lucide-react';
// import { ChatInput } from './chat/ChatInput';
// import { geminiChat, textToAudio, uploadAudioFile } from '../api/hazelChatApi';
// import { playAudio } from '../utils/playAudio';
// import { PredictionChart } from './PredictionChart';
// import ActionPlan from './ActionPlan';

// export const EnhancedChatbot = ({ onClose }: { onClose?: () => void }) => {
//   const {
//     messages,
//     currentQuestion,
//     sendAnswer,
//     loading,
//     chatCompleted,
//     predictionData,
//     setStart,
//   } = useChat();

//   // Use the conversation context
//   const {
//     messages: conversationMessages,
//     addMessage,
//     updateMessage,
//     getConversationContext,
//   } = useConversation();

//   const [showPopup, setShowPopup] = useState(false);
//   const [input, setInput] = useState('');
//   const [showFamilyProfile, setShowFamilyProfile] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const [recording, setRecording] = useState<Blob | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [voiceGender, setVoiceGender] = useState<'MALE' | 'FEMALE' | 'NEUTRAL'>('NEUTRAL');
//   const [canInteract, setCanInteract] = useState(true);
//   const [showPrediction, setShowPrediction] = useState(false);
//   const [showProfessionals, setShowProfessionals] = useState(false);
//   const [playingId, setPlayingId] = useState<string | null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   // Gemini state
//   const [geminiThread, setGeminiThread] = useState<{id: string; type: 'user' | 'bot'; content: string}[]>([]);
//   const [isGeminiThinking, setIsGeminiThinking] = useState(false);
//   const [freeChatInput, setFreeChatInput] = useState('');
//   const [geminiError, setGeminiError] = useState<string | null>(null);

//   const recordingIdRef = useRef(`rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`);

//   // ... rest of the component code remains the same until handleSendMessage

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = {
//       type: 'user' as const,
//       content: input,
//       metadata: {
//         sentiment: 'neutral',
//         requiresFollowUp: false,
//       },
//     };

//     // Add to conversation context
//     addMessage(userMessage);

//     // Add to Gemini thread
//     const geminiMessage = {
//       id: `user-${Date.now()}`,
//       type: 'user' as const,
//       content: input,
//     };

//     setInput('');
//     setGeminiThread(prev => [...prev, geminiMessage]);

//     try {
//       setIsGeminiThinking(true);

//       // Get conversation context for the system prompt
//       const context = getConversationContext();

//       const systemPrompt = `You are Hazel, a compassionate and professional AI assistant for FamilyNation. Your persona is that of a warm and insightful therapist or psychiatrist.

// Previous conversation context:
// ${context}

// Guidelines:
// 1. Your primary goal is to understand the user's feelings and situation
// 2. Engage in a thoughtful, multi-turn conversation
// 3. Ask open-ended questions to help them reflect
// 4. Acknowledge their feelings and validate their experiences
// 5. Do not provide medical or therapeutic advice
// 6. If professional help is needed, guide them to connect with a human expert
// 7. Keep responses under 100 words
// 8. Be empathetic, calm, and professional`;

//       const response = await sendToGemini(input, systemPrompt, geminiThread);

//       // Add bot response to conversation context
//       const botMessage = {
//         type: 'bot' as const,
//         content: response,
//         metadata: {
//           sentiment: 'neutral',
//           requiresFollowUp: false,
//         },
//       };
//       addMessage(botMessage);

//       // Add to Gemini thread
//       const geminiBotMessage = {
//         id: `bot-${Date.now() + 1}`,
//         type: 'bot' as const,
//         content: response,
//       };
//       setGeminiThread(prev => [...prev, geminiBotMessage]);

//     } catch (error) {
//       console.error('Error sending message:', error);
//       setGeminiError('Failed to get response from AI. Please try again.');
//     } finally {
//       setIsGeminiThinking(false);
//     }
//   };

//   // ... rest of the component code remains the same

//   return (
//     <div className="chatbot-container">
//       {/* Your existing JSX */}
//       <div className="chat-messages">
//         {geminiThread.map((message) => (
//           <div key={message.id} className={`message ${message.type}`}>
//             {message.content}
//           </div>
//         ))}
//         {isGeminiThinking && <div className="typing-indicator">Hazel is typing...</div>}
//       </div>

//       <ChatInput
//         input={input}
//         setInput={setInput}
//         onSendMessage={handleSendMessage}
//         isProcessing={isGeminiThinking}
//       />

//       {/* Your existing modals and other UI elements */}
//     </div>
//   );
// };

// export default EnhancedChatbot;
