// import React from 'react';
// import { useResponsive } from '../hook/useResponsive';

// interface HeaderProps {
//   onExit: () => void;
//   userName: string;
// }

// export const Header: React.FC<HeaderProps> = ({ onExit, userName="johnson" }) => {
//   const {isMobile} = useResponsive()
//   // Use a mock avatar URL that generates an image from the user's name
//   const mockAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D9488&color=fff&bold=true`;

//   return (
//     <header className="bg-white shadow-md z-10 flex-shrink-0">
//       <div className="flex items-center justify-between h-16 px-6">
//         {/* Left side: Site Logo and Name */}
//         <div className="flex items-center">
//           {isMobile && <>menu</>}
//            <div className="flex items-center gap-2">
//             <img 
//               src={mockAvatarUrl} 
//               alt={userName} 
//               className="w-8 h-8 rounded-full border-2 border-gray-300" 
//             />
//             <span className="text-gray-700 font-medium hidden sm:block">
//              Johnson
//             </span>
//           </div>

//         </div>
        
//         {/* Right side: User Avatar and Log Out Button */}
//         <div className="flex items-center gap-4">
//           {/* User Avatar */}
         
//           {/* Log Out Button */}
//           <button
//             onClick={onExit}
//             className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
//           >
//             <LogOutIcon />
//             <span className="hidden md:block">Log Out</span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };


// const LogOutIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//     </svg>
// );
import React, { useState } from 'react';
import { useResponsive } from '../hook/useResponsive';
import { Sidebar } from "./sidebar/index";
import { SideBarMenu } from './sidebar/Sidebar';
interface HeaderProps {
  onExit: () => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({ onExit, userName = "johnson" }) => {
  const { isMobile } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=0D9488&color=fff&bold=true`;

  return (
    <>
      <header className="bg-white shadow-md z-20 flex-shrink-0 relative">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left side: Logo + Hamburger (if mobile) */}
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* Avatar + Name */}
            <div className="flex items-center gap-2">
              <img
                src={mockAvatarUrl}
                alt={userName}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
              />
              <span className="text-gray-700 font-medium hidden sm:block">
                {userName}
              </span>
            </div>
          </div>

          {/* Right side: Log Out */}
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <LogOutIcon />
              <span className="hidden md:block">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-30 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="relative z-40 w-64 bg-[#0D9488] h-full shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              ✕
            </button>
            <SideBarMenu />
          </div>
        </div>
      )}
    </>
  );
};

const LogOutIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);
