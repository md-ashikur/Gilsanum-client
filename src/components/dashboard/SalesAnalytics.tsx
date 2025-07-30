import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import type { ChartDataType } from '../../types';
import sales from "../../../public/images/Dual-Sim-Signal-4--Streamline-Ultimate.svg";
interface SalesAnalyticsProps {
  data: ChartDataType[];
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ data }) => {
  // Find the highlighted item for tooltip
  const highlightedItem = data.find(item => item.isHighlighted);

  return (
    <div className="lg:col-span-2 bg-white w-[617px] h-[364px] rounded-[8px] p-6 border border-white-200">
      <div className="flex items-center justify-between mb-6">
        <div className='flex items-center space-x-2'>
          <img src={sales} alt="" />
        <h3 className="opacity-80 text-secondary-200"> Sale Analytics</h3>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-[14px] h-[14px] bg-primary-100 rounded-[2px]"></div>
            <span className="text-secondary-200 opacity-80">Refund</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-[14px] h-[14px] bg-primary-500 rounded-[2px]"></div>
            <span className="text-secondary-200 opacity-80">Checkout</span>
          </div>
          <select className="border border-white-200 rounded-[8px] px-3 py-2  text-secondary-200 opacity-80 bg-white outline-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 relative ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Bar 
              dataKey="value" 
              radius={[50, 50, 50, 50]}
              maxBarSize={37}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isHighlighted ? '#4169E1' : '#A8C5FF'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Custom tooltip for highlighted item */}
        {highlightedItem && (
          <div 
            className="absolute bg-white border border-white-200 text-xs px-2 py-1 rounded shadow-sm text-center pointer-events-none"
            style={{
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10
            }}
          >
            <div className="text-[10px] text-gray-500">Income:</div>
            <div className="font-medium text-secondary-200">${highlightedItem.value.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAnalytics;
