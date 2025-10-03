import { FC } from 'react';
import { Mic, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  sendAnswer: (val: string) => void;
  isRecording: boolean;
  isProcessing: boolean;
  handleMicClick: () => void;
  canInteract?: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({
  input,
  setInput,
  sendAnswer,
  isRecording,
  handleMicClick,
  isProcessing,
  canInteract,
}) => (
  <div className="border-t p-3 bg-white">
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D9488] sm:text-sm md:text-base transition-all duration-300"
          placeholder={isRecording ? '' : 'Type your message...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              sendAnswer(input);
              setInput('');
            }
          }}
        />

        {/* Wave animation container */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <div className="flex items-end space-x-[1px] w-full h-full py-3">
              {Array.from({
                length:
                  typeof window !== 'undefined'
                    ? window.innerWidth >= 768
                      ? 350
                      : 120
                    : 120,
              }).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 max-w-[2px] bg-red-500 rounded-full animate-wave"
                  style={{
                    height: `${Math.sin((index / 30) * Math.PI * 4) * 15 + 50}%`,
                    animationDelay: `${(index % 4) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conditionally render Mic or Send */}
      {!input.trim() ? (
        <button
          className={`p-3 rounded-full transition-colors flex items-center justify-center
          ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-[#0D9488] hover:bg-[#0c7c6f]'}`}
          onClick={handleMicClick}
        >
          {isRecording ? (
            <Square size={20} className="text-white animate-pulse" />
          ) : !isProcessing ? (
            <Mic size={20} className="text-white" />
          ) : (
            <svg
              className="h-8 w-8 animate-spin text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="2" x2="12" y2="6" />{' '}
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          )}
        </button>
      ) : (
        <button
          className="bg-[#0D9488] hover:bg-[#0c7c6f] text-white px-4 py-2 rounded-xl sm:text-sm md:text-base"
          onClick={() => {
            sendAnswer(input);
            setInput('');
          }}
          disabled={!canInteract}
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
