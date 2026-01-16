import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-koho">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#EDEDED] relative">
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <div className="flex-1 overflow-auto relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
