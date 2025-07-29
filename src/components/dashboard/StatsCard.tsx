import React from 'react';
import type { StatsCardType } from '../../types';

interface StatsCardProps {
  stats: StatsCardType;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{stats.title}</span>
        <span className={`text-sm ${stats.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {stats.isPositive ? '📈' : '📉'} {stats.change}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stats.value}</div>
      <p className="text-xs text-gray-500 mt-1">
        {stats.description}{' '}
        {stats.highlightValue && (
          <span className="font-medium">{stats.highlightValue}</span>
        )}
      </p>
    </div>
  );
};

export default StatsCard;
