import React from "react";
import type { UserProfileType } from "../../types";
import userPic from "/images/Profile Image.png";
import searchIcon from "/images/MagnifyingGlass.svg";
import notificationIcon from "/images/Alert-Bell-Notification-2--Streamline-Ultimate.svg";
import menuIcon from "/images/Filter-Sort-Lines-Descending--Streamline-Ultimate.svg";
interface NavbarProps {
  onMenuClick: () => void;
  user: UserProfileType;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, user }) => {
  return (
    <header className="bg-white border-b border-white-100">
      <div className="flex items-center justify-between h-16 lg:px-10 px-4 py-[19.5px]">
        {/* Left Section */}
        <div className="flex items-center flex-1 min-w-0">
          <button onClick={onMenuClick} className="lg:hidden mr-3 p-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="text-secondary-200 min-w-0">
            <h1 className="text-base lg:text-lg font-[500] truncate">Sales Overview</h1>
            <p className="text-xs hidden sm:block">Monitor all your content activity</p>
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div className="flex items-center text-secondary-200 flex-shrink-0">
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Button */}
            <button className="w-8 h-8 bg-white border border-white-200 rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors">
              <img src={searchIcon} alt="Search" className="w-4 h-4" />
            </button>

            {/* Notification Button */}
            <button className="w-8 h-8 bg-white border border-white-200 rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors relative">
              <img
                src={notificationIcon}
                alt="Notifications"
                className="w-4 h-4"
              />
            </button>

            {/* Menu Button */}
            <button className="w-8 h-8 bg-white border border-white-200 rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors">
              <img src={menuIcon} alt="Menu" className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Actions - Only Notification */}
          <div className="md:hidden flex items-center space-x-2 mr-3">
            <button className="w-8 h-8 bg-white border border-white-200 rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors relative">
              <img
                src={notificationIcon}
                alt="Notifications"
                className="w-4 h-4"
              />
            </button>
          </div>

          <div className="hidden md:block mx-5 h-[16px] border-l border-l-white-200"></div>

          {/* User Profile */}
          <div className="flex items-center">
            <div className="relative">
              <img
                src={userPic}
                alt="Profile"
                className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] rounded-full"
              />
              {/* Green active status circle */}
              <div className="absolute bottom-0 right-0 w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="hidden lg:block text-left mr-[10px] ml-[8px]">
              <p className="text-sm font-medium truncate max-w-[120px]">{user.name}</p>
              <p className="text-[10px] truncate max-w-[120px]">{user.email}</p>
            </div>
            
            {/* Username for medium screens */}
            <div className="hidden md:block lg:hidden text-left mr-[10px] ml-[8px]">
              <p className="text-sm font-medium truncate max-w-[80px]">{user.name}</p>
            </div>
            
            <button className="ml-2 lg:ml-4 p-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
