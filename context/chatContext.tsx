import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { HazelQuestion } from '../types/hazel';
import { sendReply, startChat } from '../api/hazelChatApi';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface VoiceMessage {
  blob: Blob;
  transcript?: string;
}
interface PredictionData {
  stabilityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
  chartData?: {
    current: number;
    projected: number;
    risk?: number;
  };
}

interface ChatContextType {
  messages: Message[];
  currentQuestion: HazelQuestion | null;
  sendAnswer: (answer: string) => void;
  sendVoiceMessage: (audioBlob: Blob) => Promise<void>;
  loading: boolean;
  chatCompleted: boolean;
  predictionData: PredictionData | null;
  showPrediction: boolean;
  setShowPrediction: (show: boolean) => void;
  isProcessingVoice: boolean;
  setStart: (start: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({
  children,
  onComplete,
}: {
  children: ReactNode;
  onComplete?: (responses: string[]) => void;
}) => {
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<HazelQuestion | null>(
    null
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<string[]>([]);
  const [chatCompleted, setChatCompleted] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null
  );
  const [showPrediction, setShowPrediction] = useState(false);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        const data = await startChat();
        setSessionId(data.sessionId);
        setCurrentQuestion(data.question);
        setMessages([
          {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: data.message,
            options: data.question?.options,
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [start]);

  // NEW: Auto-show prediction when chat completes
  // useEffect(() => {
  //   if (chatCompleted && predictionData) {
  //     const timer = setTimeout(() => {
  //       setShowPrediction(true);
  //     }, 1500); // Show prediction after 1.5 seconds
  //     return () => clearTimeout(timer);
  //   }
  // }, [chatCompleted, predictionData]);

  const sendAnswer = async (answer: string) => {
    if (!sessionId) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: 'user', content: answer },
    ]);
    const newResponses = [...responses, answer];
    setResponses(newResponses);

    try {
      const res = await sendReply(sessionId, answer);

      // Add bot reply
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: res.message,
          options: res.question?.options,
        },
      ]);

      if (res.completed) {
        setCurrentQuestion(null);
        setChatCompleted(true);

        // NEW: Generate prediction data based on responses
        const prediction = generatePrediction(newResponses);
        setPredictionData(prediction);

        if (onComplete) onComplete(res.responses || newResponses);
      } else {
        setCurrentQuestion(res.question || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //Prediction generation function
  const generatePrediction = (responses: string[]): PredictionData => {
    let stabilityScore = 50; // Base score

    // Analyze intensity level (3rd question)
    const intensity = responses[2];
    if (intensity === 'Overwhelming') stabilityScore -= 30;
    else if (intensity === 'Stressed') stabilityScore -= 15;
    else if (intensity === 'Concerned') stabilityScore -= 5;

    // Analyze number of issues selected (2nd question - multi-select)
    const issues = responses[1] ? responses[1].split(',') : []; // Assuming comma-separated for multi-select
    stabilityScore -= issues.length * 5;

    // Clamp score
    stabilityScore = Math.max(0, Math.min(100, stabilityScore));

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (stabilityScore < 40) riskLevel = 'high';
    else if (stabilityScore < 70) riskLevel = 'medium';

    const projectedStability = Math.min(100, stabilityScore + 25);

    const message =
      riskLevel === 'high'
        ? `Based on your responses, I'm seeing a ${100 - stabilityScore}% risk of escalating challenges. But with the right support, we can improve stability by up to 60% in the next 3 months.`
        : riskLevel === 'medium'
          ? `Your current stability score is ${stabilityScore}%. With consistent support, we can increase this to 80%+ within 2-3 months.`
          : `Great! Your stability score is ${stabilityScore}%. We can help you maintain and build on this strong foundation.`;

    return {
      stabilityScore,
      riskLevel,
      message,
      chartData: {
        current: stabilityScore,
        projected: projectedStability,
        risk: 100 - stabilityScore,
      },
    };
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    if (!sessionId) return;

    setIsProcessingVoice(true);

    try {
      // In a real app, you would send the audio to a speech-to-text API
      // For now, we'll simulate transcription with a timeout

      // Simulate API call to transcribe audio
      const transcribedText = await transcribeAudio(audioBlob);

      if (transcribedText) {
        // Send the transcribed text as a regular message
        await sendAnswer(transcribedText);
      }
    } catch (error) {
      console.error('Error processing voice message:', error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          type: 'bot',
          content:
            "Sorry, I couldn't process your voice message. Please try typing your response.",
        },
      ]);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Mock transcription function - replace with actual API call
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, you would call:
        // - Google Speech-to-Text API
        // - Azure Cognitive Services
        // - AWS Transcribe
        // - Or any other speech recognition service

        // For demo purposes, we'll return a mock response
        const mockResponses = [
          "I've been feeling very stressed lately",
          'We need help with family counseling',
          'My children are having difficulties at school',
          "We're experiencing financial pressure",
          'I think we need professional support',
        ];
        const randomResponse =
          mockResponses[Math.floor(Math.random() * mockResponses.length)];
        resolve(randomResponse);
      }, 2000);
    });
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentQuestion,
        sendAnswer,
        sendVoiceMessage,
        loading,
        chatCompleted,
        predictionData,
        showPrediction,
        setShowPrediction,
        isProcessingVoice,
        setStart,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
