import React from 'react';
import type { ChartDataType } from '../../types';

interface SalesAnalyticsProps {
  data: ChartDataType[];
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📊 Sale Analytics</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Refund</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Checkout</span>
          </div>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-center space-x-8">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 192; // 192px = h-48
          const isHighlighted = item.isHighlighted;
          
          return (
            <div key={item.month} className="text-center">
              <div
                className={`w-12 rounded-t mb-2 relative ${
                  isHighlighted 
                    ? 'bg-blue-500' 
                    : index % 2 === 0 
                      ? 'bg-blue-100' 
                      : 'bg-purple-200'
                }`}
                style={{ height: `${height}px` }}
              >
                {isHighlighted && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    ${item.value.toLocaleString()}
                  </div>
                )}
              </div>
              <span className={`text-xs ${isHighlighted ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesAnalytics;
