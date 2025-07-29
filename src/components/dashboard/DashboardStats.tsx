import React from 'react';
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stats) => (
        <StatsCard key={stats.id} stats={stats} />
      ))}
    </div>
  );
};

export default DashboardStats;
