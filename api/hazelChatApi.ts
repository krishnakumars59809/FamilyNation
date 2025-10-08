// src/api/chatApi.ts
import { apiClient } from './apiClient';
import { StartChatResponse, ReplyResponse } from '../types/hazel';

export const startChat = (): Promise<StartChatResponse> => {
  return apiClient(`/chat/start`, { method: 'POST' });
};

export const sendReply = (
  sessionId: string,
  answer: string
): Promise<ReplyResponse> => {
  return apiClient(`/chat/reply`, {
    method: 'POST',
    body: JSON.stringify({ sessionId, answer }),
  });
};

export const uploadAudioFile = (file: File): Promise<{ text: string }> => {
  const formData = new FormData();
  formData.append('audio', file);
  return apiClient(
    `/chat/transcribe`,
    {
      method: 'POST',
      body: formData,
    },
    true
  );
};

export const textToAudio = (text: string): Promise<ReplyResponse> => {
  return apiClient(`/chat/textToAudio`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

export const geminiChat = (
  text: string,
  useSearch?: boolean
): Promise<ReplyResponse> => {
  return apiClient(`/chat/chat`, {
    method: 'POST',
    body: JSON.stringify({ messages: text, useSearch }),
  });
};
