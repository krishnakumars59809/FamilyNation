import React, { useEffect, useRef, useState } from 'react';
import { useResponsive } from '../../hook/useResponsive';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import familyNationLogo from '../../assets/images/familyNationlogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../api/userApi';

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
  const navigate = useNavigate();
  const { user, getCurrentUser } = useUser();
  console.log('kk user:', user);
  const mockAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=0D9488&color=fff&bold=true`;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
    setIsOpen(false);
  };

  const getUser = async () => {
    await getCurrentUser();
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <header className="bg-white shadow-md z-20 flex-shrink-0 relative">
      <div className="flex items-center justify-between h-20 px-6">
        {/* <div className="flex items-center gap-2"> */}
        {/* Sidebar toggle */}
        {/* <button
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
        </button> */}

        {/* </div> */}

        <div>
          <div className="flex gap-1 lg:gap-4 items-center">
            <Link to="/">
              <img src={logo} className="h-10 w-10 md:h-14 w-14 bg-white" />
            </Link>
            {/* <Link to="/">
              <img src={familyNationLogo} width={50} height={50} className="" />
              </Link> */}
            <Link to="/">
              <div className="mt-2">
                <span className="text-2xl md:text-4xl italic font-bold bg-gradient-to-r from-green-500 to-green-900 bg-clip-text text-transparent">
                  FamilyNation
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Log Out */}
        <div className="flex items-center gap-4">
          <div ref={dropdownRef}>
            {/* User Avatar */}
            {user && (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  src={mockAvatarUrl}
                  alt={userName}
                  className="w-8 h-8 rounded-full border-2 border-green-700"
                />
                <span className="text-gray-700 font-medium hidden sm:block capitalize">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            )}

            {/* Dropdown menu */}
            {isOpen && (
              <div
                className="absolute mt-6 bg-white border border-gray-200 shadow-lg rounded-md
                     z-50 text-sm cursor-pointer"
                // onMouseEnter={() => setIsOpen(true)}
                // onMouseLeave={() => setIsOpen(false)}
              >
                <Link to="/profile">
                  <button className="px-4 py-2 text-left hover:bg-gray-100 w-full cursor-pointer">
                    Profile
                  </button>
                </Link>

                <button
                  className="px-4 py-2 flex gap-2 text-left hover:bg-gray-100 w-full text-red-500 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {user ? (
            <button
              onClick={onExit}
              className="text-red-500 hover:text-red-600 font-bold py-2 transition-colors duration-300 flex items-center gap-2"
            >
              <LogOutIcon />
              <span className="hidden md:block"></span>
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
