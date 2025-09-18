"use client";
import { useState, useRef, useEffect } from "react";
import { demoScript } from "./script";
import Image from "next/image";
import profile from "../../public/hazel-avatar.png.png";

interface Message {
  type: string;
  text?: string;
  options?: string[];
  chips?: string[];
  scale?: string[];
  input?: string;
  title?: string;
  steps?: string[];
  items?: any[];
  card?: any;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([demoScript[0]]);
  const [step, setStep] = useState(1);
  const [chatCompleted, setChatCompleted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleResponse = (response: string) => {
    if (chatCompleted) {
      if (response === "Restart Chat") {
        setMessages([demoScript[0]]);
        setStep(1);
        setChatCompleted(false);
      } else if (response === "Exit to Home") {
        window.location.href = "/";
      } else if (response === "View Resources") {
        window.location.href = "/#resources";
      }
      return;
    }

    setMessages((prev) => [...prev, { type: "user", text: response }]);

    if (step < demoScript.length) {
      setTimeout(() => {
        setMessages((prev) => [...prev, demoScript[step]]);
        setStep(step + 1);
      }, 600);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "aftercare",
            text: "✨ Thank you for chatting with Hazel 💜 What would you like to do next?",
            options: ["Restart Chat", "Exit to Home", "View Resources"],
          },
        ]);
        setChatCompleted(true);
      }, 700);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white">
          <Image
            alt="Hazel avatar"
            src={profile}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <h2 className="text-lg font-semibold">Hazel • FamilyNation</h2>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.type === "user" ? "text-right" : ""}>
            <div
              className={`inline-block px-4 py-3 rounded-2xl shadow-md max-w-[80%] break-words whitespace-pre-wrap transition-all ${
                msg.type === "user"
                  ? "bg-teal-500 text-white"
                  : "bg-indigo-100 text-gray-800"
              }`}
            >
              {msg.text && <p>{msg.text}</p>}

              {/* Options */}
              {msg.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => handleResponse(opt)}
                      className="px-4 py-2 rounded-full bg-indigo-500 text-white shadow hover:bg-indigo-600 transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Chips */}
              {msg.chips && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.chips.map((chip, j) => (
                    <button
                      key={j}
                      onClick={() => handleResponse(chip)}
                      className="px-4 py-2 rounded-full bg-indigo-200 text-indigo-800 hover:bg-indigo-300 transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Scale */}
              {msg.scale && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.scale.map((level, j) => (
                    <button
                      key={j}
                      onClick={() => handleResponse(level)}
                      className="flex-1 px-4 py-2 rounded-lg bg-indigo-500 text-white shadow hover:bg-indigo-600 transition"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              {msg.input === "text" && (
                <input
                  type="text"
                  placeholder="💬 Type your response..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleResponse((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="mt-3 w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}

              {/* Plan Card */}
              {msg.type === "plan" && (
                <div className="mt-3 bg-indigo-50 p-3 rounded-xl">
                  <h3 className="font-bold mb-2 text-indigo-700">{msg.title}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {msg.steps?.map((step, j) => (
                      <li key={j}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Referrals */}
              {msg.type === "referrals" && (
                <div className="mt-3 space-y-3">
                  <h3 className="font-bold text-indigo-700">{msg.title}</h3>
                  {msg.items?.map((r, j) => (
                    <div
                      key={j}
                      className="border rounded-lg p-3 text-sm shadow-md bg-indigo-50"
                    >
                      <p className="font-semibold">{r.name}</p>
                      <p>
                        {r.credential} • {r.distance}
                      </p>
                      <p>{r.hours}</p>
                      <p className="text-gray-700">{r.cost}</p>
                      <p className="text-xs mt-1">✨ Why here: {r.why}</p>
                      <button
                        onClick={() =>
                          handleResponse(`Request callback: ${r.name}`)
                        }
                        className="mt-2 px-3 py-1 bg-teal-500 text-white rounded-full text-sm shadow hover:bg-teal-600"
                      >
                        Request callback
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Community / Programming */}
              {(msg.type === "community" || msg.type === "programming") &&
                msg.card && (
                  <div className="mt-3 border rounded-lg p-3 shadow-md bg-indigo-50">
                    <p className="font-semibold">{msg.card.title}</p>
                    <p className="text-sm">{msg.card.time}</p>
                    <button
                      onClick={() => handleResponse(msg.card.action)}
                      className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded-full text-sm shadow hover:bg-indigo-600"
                    >
                      {msg.card.action}
                    </button>
                  </div>
                )}

              {/* Resources */}
              {msg.type === "resources" && (
                <div className="mt-3 space-y-2">
                  {msg.items?.map((r, j) => (
                    <div
                      key={j}
                      className="border p-2 rounded-lg shadow-sm text-sm bg-indigo-50"
                    >
                      {r.type === "article" ? "📄" : "🎧"} {r.title}
                    </div>
                  ))}
                </div>
              )}

              {/* Aftercare */}
              {msg.type === "aftercare" && msg.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => handleResponse(opt)}
                      className="flex-1 px-4 py-2 rounded-full bg-indigo-500 text-white shadow hover:bg-indigo-600 transition sm:flex-none"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </main>
    </div>
  );
}
