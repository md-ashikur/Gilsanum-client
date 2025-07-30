import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import type { ChartDataType } from '../../types';
import sales from "/images/Dual-Sim-Signal-4--Streamline-Ultimate.svg";

interface SalesAnalyticsProps {
  data: ChartDataType[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataType }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white text-secondary-200 text-xs px-3 py-2 border border-white-200 rounded-[4px] shadow-lg">
        <div className="text-[12px] mb-1">Income:</div>
        <div className="font-semibold text-[14px]">${data.value.toLocaleString()}</div>
       
      </div>
    );
  }
  return null;
};

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ data }) => {
  return (
    <div className="lg:col-span-2 bg-white w-[617px] h-[364px] rounded-[8px] p-4 border border-white-200 overflow-hidden">
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
         <div className="relative ml-10">
           <select className="appearance-none bg-white border border-white-200 rounded-[8px] px-[10px] py-2 text-sm text-secondary-200 pr-6 focus:outline-none ">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
           <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-200 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
         </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 0, right: 0, left: 0, bottom: 40 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#A3A3A3' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#A3A3A3' }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${value / 1000}k`;
                }
                return value.toString();
              }}
              domain={[0,'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* First bar (Refund) */}
            <Bar 
              dataKey="refund" 
              radius={[50, 50, 50, 50]}
              maxBarSize={37}
              fill="#D9D9D933"
              stroke="none"
            />
            {/* Second bar (Checkout) */}
            <Bar 
              dataKey="value" 
              radius={[50, 50, 50, 50]}
              maxBarSize={20}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isHighlighted ? '#4169E1' : '#D9D9D933'}
                  stroke="none"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesAnalytics;
