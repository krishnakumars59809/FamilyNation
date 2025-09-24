import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ActionPlan from './components/ActionPlan';
import { PlaceholderView } from './components/PlaceholderView';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/sidebar/index';
import { Header } from './components/Header';
import { EyeIcon, SparkleIcon } from 'lucide-react';
import { ChatProvider } from './context/chatContext';
import { Chatbot } from './components/Chatbot';
import HappyFamilyImg from './assets/images/happy-family.png';
import './index.css';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [isChatbotOpen, setChatbotOpen] = useState(false);
  const [isHidden, setHidden] = useState(false);

  return (
    <div className="relative flex h-screen font-sans overflow-x-hidden">
      <div

        className="fixed inset-0 w-full h-full bg-contain bg-center -z-20 "
        style={{ backgroundImage: `url(${HappyFamilyImg})` }}
      />
      {/* Optional overlay to improve readability */}
      <div className="fixed inset-0 bg-black/20 -z-10" />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onExit={() => (window.location.href = 'https://www.google.com')}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          <Routes>
            <Route
              path="/"
              element={<Dashboard setChatbotOpen={setChatbotOpen} />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard setChatbotOpen={setChatbotOpen} />}
            />
            <Route path="/recommended" element={<ActionPlan />} />
            <Route path="/groups" element={<PlaceholderView view="groups" />} />
            <Route
              path="/discussions"
              element={<PlaceholderView view="discussions" />}
            />
            <Route
              path="/community"
              element={<PlaceholderView view="community" />}
            />
          </Routes>
        </main>
      </div>

      {/* Global Hide Button */}
      {!isHidden && (
        <button
          onClick={() => setHidden(true)}
          className="fixed top-[4.6rem] right-6 z-[100] bg-[#1E3A8A] hover:bg-[#274bb3] text-white font-bold py-3 px-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z"
              clipRule="evenodd"
            />
            <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
          </svg>
        </button>
      )}

      {/* Fullscreen Hide Overlay */}
      <div
        className={`fixed inset-0 bg-cover bg-center transform transition-all duration-700 ease-in-out ${
          isHidden
            ? 'translate-x-0 opacity-100 scale-100'
            : '-translate-x-full opacity-0 scale-95'
        } w-full h-screen z-[200]`}
        style={{ backgroundImage: `url(${HappyFamilyImg})` }}
      >
        {/* Show Button */}
        <div className="absolute top-6 right-6 z-[250]">
          <button
            onClick={() => setHidden(false)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setChatbotOpen(true)}
          className="bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-6 lg:py-4 px-6 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-3"
        >
          <div className="animate-pulse lg:animate-none">
            <SparkleIcon />
          </div>
          <span className="hidden lg:block"> We Need Help Now!</span>
        </button>
      </div>

      {/* Chat popup */}
      {isChatbotOpen && (
        <ChatProvider>
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="relative w-full max-w-6xl h-[100vh] bg-white rounded-xl shadow-lg overflow-hidden">
              <Chatbot onClose={() => setChatbotOpen(false)} />
            </div>
          </div>
        </ChatProvider>
      )}
    </div>
  );
};

export default App;
