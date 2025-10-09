import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    sentiment?: 'positive' | 'negative' | 'neutral';
    topics?: string[];
    requiresFollowUp?: boolean;
  };
}

interface ConversationContextType {
  messages: Message[];
  conversationId: string;
  conversationPhase:
    | 'introduction'
    | 'assessment'
    | 'exploration'
    | 'resolution'
    | 'followup';
  contextSummary: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  getConversationContext: () => string;
  clearConversation: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId] = useState<string>(() => `conv_${uuidv4()}`);
  const [conversationPhase, setConversationPhase] = useState<
    'introduction' | 'assessment' | 'exploration' | 'resolution' | 'followup'
  >('introduction');
  const [contextSummary, setContextSummary] = useState<string>('');

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversation = localStorage.getItem(
      `conversation_${conversationId}`
    );
    if (savedConversation) {
      try {
        const parsed = JSON.parse(savedConversation);
        setMessages(parsed.messages || []);
        setConversationPhase(parsed.phase || 'introduction');
        setContextSummary(parsed.contextSummary || '');
      } catch (error) {
        console.error('Failed to load conversation from localStorage', error);
      }
    }
  }, [conversationId]);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      const conversationData = {
        messages,
        phase: conversationPhase,
        contextSummary,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        `conversation_${conversationId}`,
        JSON.stringify(conversationData)
      );
    }
  }, [messages, conversationPhase, contextSummary, conversationId]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      updateContextSummary(updated);
      return updated;
    });
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  };

  const updateContextSummary = (currentMessages: Message[]) => {
    // Simple summarization - in a real app, you might want to use an API for better summarization
    const recentMessages = currentMessages.slice(-5); // Consider last 5 messages
    const summary = recentMessages
      .map((msg) => `${msg.type === 'user' ? 'User' : 'Hazel'}: ${msg.content}`)
      .join('\n');

    setContextSummary(summary);
  };

  const getConversationContext = (): string => {
    return (
      contextSummary ||
      messages
        .slice(-10) // Get last 10 messages for context
        .map(
          (msg) => `${msg.type === 'user' ? 'User' : 'Hazel'}: ${msg.content}`
        )
        .join('\n')
    );
  };

  const clearConversation = () => {
    setMessages([]);
    setContextSummary('');
    setConversationPhase('introduction');
    localStorage.removeItem(`conversation_${conversationId}`);
  };

  return (
    <ConversationContext.Provider
      value={{
        messages,
        conversationId,
        conversationPhase,
        contextSummary,
        addMessage,
        updateMessage,
        getConversationContext,
        clearConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = (): ConversationContextType => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      'useConversation must be used within a ConversationProvider'
    );
  }
  return context;
};
