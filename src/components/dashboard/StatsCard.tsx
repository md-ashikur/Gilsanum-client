import React, { useState, useRef, useEffect } from 'react';
import type { StatsCardType } from '../../types';
import positiveIcon from '/images/Graph-Stats-Descend--Streamline-Ultimate (1).svg';
import negativeIcon from '/images/Graph-Stats-Descend--Streamline-Ultimate.svg';
interface StatsCardProps {
  stats: StatsCardType;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (action: string) => {
    console.log(`${action} clicked for ${stats.title}`);
    setShowDropdown(false);
    // Add your menu action logic here
  };

  return (
    <div className="bg-[#F9F9F9] rounded-[8px] border border-white-200">
      <div className='bg-white text-secondary-200 rounded-[8px] p-3'>
        <div className="flex items-center justify-between mb-2">
          <div className='flex items-center space-x-2'>
            <img src={stats.icon} alt="" />
            <span className="text-xs font-medium">{stats.title}</span>
          </div>
          
          {/* 3-dot menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="text-secondary-200 hover:text-gray-600"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleMenuClick('view-details')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Details</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuClick('export-data')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export Data</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuClick('compare')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Compare Period</span>
                  </button>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={() => handleMenuClick('settings')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className="text-2xl font-medium">{stats.value}</div>

          {/* Percentage change with color and arrow */}
          <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded ${stats.isPositive ? 'text-[#058F3F] bg-[#058F3F]/10' : 'text-[#F51D1D] bg-[#F51D1D]/10'}`}>
            {stats.isPositive ? (
              <div className=''>
                <img src={positiveIcon} alt="" />
              </div>
            ) : (
             <div>
              <img src={negativeIcon} alt="" />
             </div>
            )}
            <span>{stats.change}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-secondary-200 px-3 py-2">
        {stats.pre_description}{' '}
        {stats.highlightValue && (
          <span className="font-bold">{stats.highlightValue}</span>
        )}
        {' '}{stats.post_description && (
          <span>{stats.post_description}</span>
        )}
      </p>
    </div>
  );
};

export default StatsCard;
