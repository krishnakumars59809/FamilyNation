import { useChat } from "@/context/chatContext";
import { useState } from "react";

export const Chatbot = ({ onClose }: { onClose: () => void }) => {
  const { messages, currentQuestion, sendAnswer, loading } = useChat();
  console.log("kk messages:", messages);
  const [input, setInput] = useState("");

  if (loading) return <div className="p-4">Loading Hazel...</div>;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header with close */}
      <div className="p-3 bg-brand-dark text-white flex justify-between items-center">
        <span>Hazel Support</span>
        <button onClick={onClose}>&times;</button>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p>{msg.content}</p>
              {msg.options && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      className="px-3 py-1 bg-brand text-white rounded"
                      onClick={() => sendAnswer(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      {currentQuestion && !currentQuestion.options && (
        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                sendAnswer(input);
                setInput("");
              }
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (input.trim()) {
                sendAnswer(input);
                setInput("");
              }
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};
