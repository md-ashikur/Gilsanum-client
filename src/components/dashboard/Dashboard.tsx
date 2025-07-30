import React from 'react';
import DashboardStats from './DashboardStats';
import SalesAnalytics from './SalesAnalytics';
import ProductMonitoring from './ProductMonitoring';
import type { ChartDataType, ProductItemType } from '../../types';

const chartData: ChartDataType[] = [
  { month: 'Jan', value: 32000 },
  { month: 'Feb', value: 24000 },
  { month: 'Mar', value: 108906, isHighlighted: true },
  { month: 'Apr', value: 36000 },
  { month: 'May', value: 20000 },
  { month: 'Jun', value: 16000 },
];

const productsData: ProductItemType[] = [
  {
    id: 'smartwatch',
    rank: 1,
    name: 'Smartwatch',
    orders: 1500,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 'speaker',
    rank: 2,
    name: 'Speaker',
    orders: 900,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 'drone',
    rank: 3,
    name: 'Drone',
    orders: 800,
    image: 'https://via.placeholder.com/40',
  },
  {
    id: 'handphone',
    rank: 4,
    name: 'Handphone',
    orders: 16,
    image: 'https://via.placeholder.com/40',
  },
];

const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-10 ">
     

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts and Product Monitoring */}
      <div className="flex gap-6">
        <SalesAnalytics data={chartData} />
        <ProductMonitoring products={productsData} />
      </div>
    </main>
  );
};

export default Dashboard;
