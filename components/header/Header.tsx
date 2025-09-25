import React from 'react';
import { useResponsive } from '../../hook/useResponsive';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onExit: () => void;
  userName: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const HeaderComponent: React.FC<HeaderProps> = ({
  onExit,
  userName = 'Johnson',
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { isMobile } = useResponsive();
  const user = true;

  const mockAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=0D9488&color=fff&bold=true`;

  return (
    <header className="bg-white shadow-md z-20 flex-shrink-0 relative">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* User Avatar */}
          {user && (
            <div className="flex items-center gap-2">
              <img
                src={mockAvatarUrl}
                alt={userName}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
              />
              <span className="text-gray-700 font-medium hidden sm:block capitalize">
                {userName}
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="text-2xl font-bold font-montserrat pl-7">
            <Link to="/dashboard">
              <img src={logo} width={50} height={50} className="bg-white " />
            </Link>
          </div>
        </div>
        {/* Log Out */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={onExit}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <LogOutIcon />
              <span className="hidden md:block">Exit</span>
            </button>
          ) : (
            <Link to="/login">
              <button className="text-green-500 hover:text-green-700 hover:bg-green-50 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2">
                <LogInIcon />
                <span className="hidden md:block">Login</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
