import React, { useState, useRef, useEffect } from 'react';
import StatsCard from './StatsCard';
import type { StatsCardType } from '../../types';

const statsData: StatsCardType[] = [
  {
    id: 'monthly-earnings',
    title: 'Monthly Earnings',
    value: '$108,906',
    change: '5.2%',
    isPositive: true,
    description: 'You can earn',
    highlightValue: '$5,098 this month',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    value: '+2,345',
    change: '6.2%',
    isPositive: true,
    description: 'You received',
    highlightValue: '190 more orders this month',
  },
  {
    id: 'total-sales',
    title: 'Total Sales',
    value: '$256,740',
    change: '3.1%',
    isPositive: false,
    description: 'Sales revenue fell by',
    highlightValue: '$10,200 this month',
  },
  {
    id: 'new-customers',
    title: 'New Customers',
    value: '+1,230',
    change: '5.7%',
    isPositive: true,
    description: 'Gained',
    highlightValue: '65 new customers this month',
  },
];

const DashboardStats: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [startDate, setStartDate] = useState('2024-03-01');
  const [endDate, setEndDate] = useState('2024-03-30');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'long' 
    });
  };

  const handlePeriodClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-8">
      {/* Header with date filter and download button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center space-x-2" ref={datePickerRef}>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <button
              onClick={handlePeriodClick}
              className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer hover:text-gray-900 flex items-center space-x-1"
            >
              <span>{selectedPeriod}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown date picker for period selection */}
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-[280px]">
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Select Period</h3>
                  <button
                    onClick={() => {
                      setSelectedPeriod('Week');
                      setShowDatePicker(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Week
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('Month');
                      setShowDatePicker(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Month
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('Year');
                      setShowDatePicker(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Year
                  </button>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Custom Date Range</label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{formatDisplayDate(startDate)}</span>
            <span className="text-sm text-gray-400">to</span>
            <span className="text-sm text-gray-600">{formatDisplayDate(endDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Customer Widget</span>
          </div>
          
          <button 
            onClick={() => {
              // Generate CSV data based on current stats
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Metric,Value,Change,Period\n"
                + statsData.map(stat => `${stat.title},${stat.value},${stat.change},${selectedPeriod}`).join("\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `dashboard-stats-${startDate}-to-${endDate}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stats) => (
          <StatsCard key={stats.id} stats={stats} />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
