import React from 'react';

interface HeaderProps {
  onExit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExit }) => {
  return (
    <header className="bg-white shadow-md z-10 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
            <div className="bg-brand-dark p-2 rounded-md mr-3">
                <UsersIcon className="text-white"/>
            </div>
            <h1 className="text-xl font-semibold text-gray-700">FamilyNation</h1>
        </div>
        <button
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <LogOutIcon />
          <span>EXIT PAGE</span>
        </button>
      </div>
    </header>
  );
};

const UsersIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


const LogOutIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
