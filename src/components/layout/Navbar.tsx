import React from 'react';
import type { UserProfileType } from '../../types';
import userPic from '../../../public/images/Profile Image.png'; 
interface NavbarProps {
  onMenuClick: () => void;
  user: UserProfileType;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, user }) => {
  return (
    <header className="bg-white border-b border-white-100">
      <div className="flex items-center justify-between h-16 lg:px-10 px-5 py-[19.5px]">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden mr-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className='text-secondary-200'>
            <h1 className="text-lg font-[500]">Sales Overview</h1>
            <p className="text-xs">Monitor all your content activity</p>
          </div>
        </div>

      
        {/* Right Section - User Profile */}
        <div className="flex items-center text-secondary-200">
          <img src={userPic} alt="Profile" className="w-[36px] h-[36px] rounded-full" />
          <div className="hidden sm:block text-left mr-[10px] ml-[8px]">
            <p className="text-md font-medium ">{user.name}</p>
            <p className="text-[10px] ">{user.email}</p>
          </div>
          <button className="">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
