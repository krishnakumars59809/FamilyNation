import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ActionPlan from './components/ActionPlan';
import { PlaceholderView } from './components/PlaceholderView';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { ChatProvider } from './context/chatContext';
import { Chatbot } from './components/Chatbot';
import HappyFamilyImg from './assets/images/happy-family.png';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { SideBarMenu } from './components/sidebar/Sidebar';
import { EyeIcon } from 'lucide-react';

const App = () => {
  const [isChatbotOpen, setChatbotOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHidden, setHidden] = useState(false); 

  return (
    <div className="relative flex h-screen font-sans overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 w-full h-full bg-contain bg-center -z-20"
        style={{ backgroundImage: `url(${HappyFamilyImg})` }}
      />
      <div className="fixed inset-0 bg-black/20 -z-10" />

      {/* Sidebar */}
      <div
        className={`flex-shrink-0 bg-[#0D9488] h-full shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        {sidebarOpen && <SideBarMenu />}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header
          onExit={() => (window.location.href = 'https://www.google.com')}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen} // toggle sidebar
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 transition-all duration-300">
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

      {/* Eye toggle button */}
      <div className="fixed top-20 right-10 z-50">
        <button
          onClick={() => setHidden(!isHidden)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Fullscreen hide overlay */}
      <>
        {/* Fullscreen hide overlay */}
        <div
          className={`fixed inset-0 z-40 flex justify-center items-center transform ease-in-out
    ${
      !isHidden
        ? 'translate-x-0 opacity-100 duration-700' // quick open
        : '-translate-x-full opacity-0 duration-700' // slow close
    }
  `}
        >
          <div
            className="absolute inset-0 w-full h-full bg-contain bg-center"
            style={{ backgroundImage: `url(${HappyFamilyImg})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setChatbotOpen(true)}
          className="bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-6 lg:py-4 px-6 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-3"
        >
          <span>💬 We Need Help Now!</span>
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
