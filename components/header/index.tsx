import React from 'react';
import { HeaderComponent } from './Header';

interface HeaderProps {
  onExit: () => void;
  userName: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  onExit,
  userName = 'Johnson',
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <div>
      <HeaderComponent
        onExit={onExit}
        userName={userName}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
};

export default Header;
