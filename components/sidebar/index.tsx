import React from 'react';
import { SideBarMenu } from './Sidebar';
import { useResponsive } from '../../hook/useResponsive';

export const Sidebar: React.FC = () => {
  const { isMobile } = useResponsive();
  return <>{!isMobile && <SideBarMenu />}</>;
};
