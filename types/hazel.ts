export interface HazelQuestion {
  id: string;
  question: string;
  type: "buttons" | "chips" | "scale" | "text";
  multiSelect: boolean;
  options?: string[];
  placeholder?: string;
}

export interface StartChatResponse {
  sessionId: string;
  message: string;
  question: HazelQuestion;
}

export interface ReplyResponse {
  message: string;
  question?: HazelQuestion;
  completed?: boolean;
  responses?: string[];
}
