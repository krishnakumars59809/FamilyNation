import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { startChat, sendReply } from "@/api/hazelChatApi";
import { HazelQuestion } from "@/types/hazel";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  options?: string[];
}

interface ChatContextType {
  messages: Message[];
  currentQuestion: HazelQuestion | null;
  sendAnswer: (answer: string) => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children, onComplete }: { children: ReactNode, onComplete?: (responses: string[]) => void; }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<HazelQuestion | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        const data = await startChat();
        setSessionId(data.sessionId);
        setCurrentQuestion(data.question);
        setMessages([{ id: `bot-${Date.now()}`, type: "bot", content: data.message, options: data.question?.options }]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  const sendAnswer = async (answer: string) => {
    if (!sessionId) return;

    // Add user message
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: "user", content: answer }]);
    const newResponses = [...responses, answer];
    setResponses(newResponses);

    try {
      const res = await sendReply(sessionId, answer);

      // Add bot reply
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, type: "bot", content: res.message, options: res.question?.options }]);
      
      if (res.completed) {
             setCurrentQuestion(null);
      // ✅ Call the page-level callback
 if (onComplete) onComplete(res.responses || newResponses);
      } else {
        setCurrentQuestion(res.question || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, currentQuestion, sendAnswer, loading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
