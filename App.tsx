import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ActionPlan from "./components/ActionPlan";
import { PlaceholderView } from "./components/PlaceholderView";
import { Dashboard } from "./components/Dashboard";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { SparkleIcon } from "lucide-react";
import { ChatProvider } from "./context/chatContext";
import { Chatbot } from "./components/Chatbot";

const App = () => {
  const [isChatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onExit={() => (window.location.href = "https://www.google.com")}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6 lg:p-8">
          <Routes>
            <Route
              path="/"
              element={<Dashboard setChatbotOpen={setChatbotOpen} />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard setChatbotOpen={setChatbotOpen} />}
            />
            <Route
              path="/recommended"
              element={
                <>
                  <ActionPlan />
                </>
              }
            />

            {/* Placeholder routes */}
            <Route path="/groups" element={<PlaceholderView view="groups" />} />
            <Route
              path="/discussions"
              element={<PlaceholderView view="discussions" />}
            />
            <Route
              path="/community"
              element={<PlaceholderView view="community" />}
            />
            {/* Add others as needed */}
          </Routes>
        </main>
      </div>

      {/* Floating button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setChatbotOpen(true)}
          className="bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-3"
        >
          <SparkleIcon />
          We Need Help Now!
        </button>
      </div>

      {/* Chat popup */}
      {isChatbotOpen && (
        <ChatProvider
        >
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
              <Chatbot onClose={() => setChatbotOpen(false)} />
            </div>
          </div>
        </ChatProvider>
      )}
    </div>
  );
};

export default App;
