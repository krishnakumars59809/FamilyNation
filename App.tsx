import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ActionPlan from './components/ActionPlan';
import { PlaceholderView } from './components/PlaceholderView';
import { Dashboard } from './components/Dashboard';
import { ChatProvider } from './context/chatContext';
import { Chatbot } from './components/Chatbot';
import HappyFamilyImg from './assets/images/happy-family.png';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { SideBarMenu } from './components/sidebar/Sidebar';
import { EyeIcon, MessageCircle } from 'lucide-react';
import RegisterForm from './pages/auth/Registerform';
import LoginForm from './pages/auth/Loginform';
import FamilyRegisterForm from './pages/auth/FamilyRegisterForm';
import Header from './components/header/index';
import ProfilePage from './pages/ProfilePage';
import { useUser } from './api/userApi';
import Footer from './components/footer';
import './index.css';
const App = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isChatbotOpen, setChatbotOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar hidden by default
  const [isHidden, setHidden] = useState(false); // Eye overlay hidden by default

  useEffect(() => {
    setHidden(true);
  }, []);

  return (
    <div className="relative flex h-screen font-sans italic overflow-hidden">
      {/* Background */}
      {/* <div
        className="fixed inset-0 w-full h-full bg-contain bg-center -z-20"
        style={{ backgroundImage: `url(${HappyFamilyImg})` }}
      /> */}
      <div className="fixed inset-0 bg-black/20 -z-10" />

      {/* Sidebar */}
      <div
        className={`flex-shrink-0 bg-gradient-to-r from-emerald-900 from-10% to-emerald-900 to-90% h-full shadow-xl transition-all duration-300 ${
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
        <main className="flex-1 overflow-y-auto transition-all duration-300">
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
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/family-register" element={<FamilyRegisterForm />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <Footer />
        </main>
      </div>

      {/* Eye toggle button */}
      <div className="fixed top-64 lg:top-40 right-0 lg:right-4 z-50">
        <Link to="https://www.amazon.com" target="_blank">
          <button
            // onClick={() => setHidden(!isHidden)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-3 shadow-lg flex items-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Fullscreen hide overlay */}
      <>
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
      {/* <div className="fixed bottom-8 right-8 z-40">
        <button
          // onClick={() => (!user ? navigate('/login') : setChatbotOpen(true))}
          onClick={() => setChatbotOpen(true)}
          className="bg-gradient-to-r from-[#1d4ed8] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1e40af] text-white font-bold py-4 md:py-6 lg:py-4 px-4 md:px-6 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-3"
        >
          <MessageCircle
            size={20}
            stroke="white"
            fill="white"
            className="text-white"
          />
          <span className="hidden md:block">Need Help Now ?</span>
        </button>
      </div> */}

      {/* Chat popup */}
      {isChatbotOpen && (
        <ChatProvider>
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="relative w-full max-w-6xl h-[100vh] bg-white lg:rounded-xl shadow-lg overflow-hidden">
              <Chatbot onClose={() => setChatbotOpen(false)} />
            </div>
          </div>
        </ChatProvider>
      )}
    </div>
  );
};

export default App;
