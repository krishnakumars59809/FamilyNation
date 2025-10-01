import { FC } from 'react';
import { Mic, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  sendAnswer: (val: string) => void;
  isRecording: boolean;
  handleMicClick: () => void;
}

export const ChatInput: FC<ChatInputProps> = ({
  input,
  setInput,
  sendAnswer,
  isRecording,
  handleMicClick,
}) => (
  <div className="border-t p-3 bg-white">
    <div className="flex items-center gap-2">
      {/* Text input */}
      <input
        type="text"
        className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D9488] sm:text-sm md:text-base"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) {
            sendAnswer(input);
            setInput('');
          }
        }}
      />

      {/* Conditionally render Mic or Send */}
      {!input.trim() ? (
        <button
          className={`p-3 rounded-full transition-colors flex items-center justify-center
          ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-[#0D9488] hover:bg-[#0c7c6f]'}`}
          onClick={handleMicClick}
        >
          {isRecording ? (
            <Square size={20} className="text-white animate-pulse" />
          ) : (
            <Mic size={20} className="text-white" />
          )}
        </button>
      ) : (
        <button
          className="bg-[#0D9488] hover:bg-[#0c7c6f] text-white px-4 py-2 rounded-xl sm:text-sm md:text-base"
          onClick={() => {
            sendAnswer(input);
            setInput('');
          }}
        >
          Send
        </button>
      )}
    </div>
    <p className="text-xs text-gray-500 mt-2 text-center">
      Hazel is here to listen and support your family
    </p>
  </div>
);
