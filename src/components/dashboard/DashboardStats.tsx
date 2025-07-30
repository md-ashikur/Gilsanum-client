import React, { useState, useRef, useEffect } from 'react';
import StatsCard from './StatsCard';
import type { StatsCardType } from '../../types';
import customerWidgetIcon from '/images/Remote-Access--Streamline-Ultimate.svg';
import downloadIcon from '/images/Download-Bottom--Streamline-Ultimate.svg';

import calendar from '/images/Calendar-Edit-1--Streamline-Ultimate.svg';
import monthlyIcon from '/images/Money-Bag-Dollar--Streamline-Ultimate.svg';
import orderIcon from '/images/Shipment-Star--Streamline-Ultimate.svg';
import salesIcon from '/images/Shopping-Basket-Star--Streamline-Ultimate.svg';
import newCustomerIcon from '/images/Multiple-Users-1--Streamline-Ultimate.svg';

const statsData: StatsCardType[] = [
  {
    id: 'monthly-earnings',
    title: 'Monthly Earnings',
    icon: monthlyIcon,
    value: '$108,906',
    change: '5.2%',
    isPositive: false,
    pre_description: 'You can earn',
    highlightValue: '$5,098',
    post_description: 'this month',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    icon: orderIcon,
    value: '+2,345',
    change: '6.2%',
    isPositive: true,
    pre_description: 'You received',
    highlightValue: '190',
    post_description: 'more orders this month',
  },
  {
    id: 'total-sales',
    title: 'Total Sales',
    icon: salesIcon,
    value: '$256,740',
    change: '3.1%',
    isPositive: false,
    pre_description: 'Sales revenue fell by',
    highlightValue: '$10,200',
    post_description: 'this month',
  },
  {
    id: 'new-customers',
    title: 'New Customers',
    icon: newCustomerIcon,
    value: '+1,230',
    change: '5.7%',
    isPositive: true,
    pre_description: 'Gained',
    highlightValue: '65',
    post_description: 'new customers this month',
  },
];

const DashboardStats: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  
  // Set default dates to current month (first day to last day)
  const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  };
  
  const { start: defaultStart, end: defaultEnd } = getCurrentMonthDates();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    
    return `${day} ${month}`;
  };

  const handlePeriodClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Function to set date ranges based on period selection
  const setPeriodDates = (period: string) => {
    const now = new Date();
    let start: Date, end: Date;

    switch (period) {
      case 'Day': {
        // Current day
        start = new Date(now);
        end = new Date(now);
        break;
      }

      case 'Week': {
        // Current week (Sunday to Saturday)
        const dayOfWeek = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        end = new Date(now);
        end.setDate(now.getDate() + (6 - dayOfWeek));
        break;
      }
      
      case 'Month': {
        // Current month
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      }
      
      case 'Year': {
        // Current year
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      }
      
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Handle start date change with validation
  const handleStartDateChange = (newStartDate: string) => {
    if (newStartDate && endDate && new Date(newStartDate) > new Date(endDate)) {
      // If start date is after end date, adjust end date
      setEndDate(newStartDate);
    }
    setStartDate(newStartDate);
  };

  // Handle end date change with validation
  const handleEndDateChange = (newEndDate: string) => {
    if (newEndDate && startDate && new Date(newEndDate) < new Date(startDate)) {
      // If end date is before start date, adjust start date
      setStartDate(newEndDate);
    }
    setEndDate(newEndDate);
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
    <div className="mb-8 text-secondary-200">
      {/* Header with date filter and download button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="border border-white-200 px-4 py-3 rounded-[8px] relative flex items-center space-x-2" ref={datePickerRef}>
            <img src={calendar} alt="" />
            <button
              onClick={handlePeriodClick}
              className=" outline-none cursor-pointer hover:text-gray-900 flex items-center space-x-1"
            >
              <span className='text-secondary-200 opacity-80 '>{selectedPeriod}</span>
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
                      setSelectedPeriod('Day');
                      setPeriodDates('Day');
                      setShowDatePicker(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Day
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('Week');
                      setPeriodDates('Week');
                      setShowDatePicker(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Week
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('Month');
                      setPeriodDates('Month');
                      setShowDatePicker(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Month
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('Year');
                      setPeriodDates('Year');
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
                        max={endDate} // Prevent start date from being after end date
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate} // Prevent end date from being before start date
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="w-full text-sm border border-white-200 rounded px-3 py-2 outline-none focus:border-white-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="border border-white-200 px-4 py-3 rounded-[8px]">{formatDisplayDate(startDate)}</span>
            <span>to</span>
            <span className="border border-white-200 px-4 py-3 rounded-[8px]">{formatDisplayDate(endDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center border border-white-200 rounded-[8px] px-4 py-3 space-x-2">
            <img src={customerWidgetIcon} alt="" />
            <span className=" text-secondary-200 opacity-80 text-sm">Customer Widget</span>
          </button>
          
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
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-[8px] flex items-center space-x-2 text-sm transition-colors"
          >
             <img src={downloadIcon} alt="" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stats) => (
          <StatsCard key={stats.id} stats={stats} />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
