import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-koho">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-100 relative">
        <Topbar />
        <div className="flex-1 overflow-auto relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
