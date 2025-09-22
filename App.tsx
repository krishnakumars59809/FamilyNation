import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Chatbot } from './components/Chatbot';
import type { View } from './types';
import { PlaceholderView } from './components/PlaceholderView';
import { ChatProvider } from './context/chatContext';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isChatbotOpen, setChatbotOpen] = useState(false);

  const handleExit = useCallback(() => {
    // In a real scenario, this would redirect to a safe, neutral page.
    window.location.href = 'https://www.google.com';
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={setCurrentView} />;
      case 'groups':
      case 'discussions':
      case 'community':
      case 'connect':
      case 'podcasts':
      case 'webinars':
      case 'resources':
      case 'events':
        return <PlaceholderView view={currentView} />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onExit={handleExit} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6 lg:p-8">
          {renderView()}
        </main>
      </div>

      {/* Floating button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setChatbotOpen(true)}
          className="bg-brand-dark hover:bg-brand text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-3"
        >
          <SparkleIcon />
          We Need Help Now!
        </button>
      </div>

      {/* Chat popup */}
      {isChatbotOpen && (
        <ChatProvider
          onComplete={(responses) => {
            console.log("✅ Chat finished, responses:", responses);
          }}
        >
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="relative w-full max-w-md h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
              <Chatbot onClose={() => setChatbotOpen(false)} />

              {/* Close button inside modal */}
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
                onClick={() => setChatbotOpen(false)}
              >
                &times;
              </button>
            </div>
          </div>
        </ChatProvider>
      )}
    </div>
  );
}

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12l2.293-2.293a1 1 0 011.414 0L10 12zM15 3l2.293 2.293a1 1 0 010 1.414L12 12l-2.293 2.293a1 1 0 01-1.414 0L6 12l2.293-2.293a1 1 0 011.414 0L12 12zM19 5l-2.293 2.293a1 1 0 01-1.414 0L13 5m0 14l-2.293-2.293a1 1 0 010-1.414L13 13l2.293-2.293a1 1 0 011.414 0L19 13l-2.293 2.293a1 1 0 01-1.414 0L13 13z" />
  </svg>
);
