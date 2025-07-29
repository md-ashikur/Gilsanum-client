import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import type { UserProfileType } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
}

const userData: UserProfileType = {
  name: 'Amiril mu’',
  email: 'amrit@mgmai.example',
  avatar: 'https://via.placeholder.com/32',
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={handleMenuClick} user={userData} />

        {/* Page Content */}
        {children}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}
    </div>
  );
};

export default Layout;
