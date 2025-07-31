import React from 'react';
import DashboardStats from './DashboardStats';
import SalesAnalytics from './SalesAnalytics';
import ProductMonitoring from './ProductMonitoring';

const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-10 ">
     

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts and Product Monitoring */}
      <div className="flex gap-4">
        <SalesAnalytics />
        <ProductMonitoring />
      </div>
    </main>
  );
};

export default Dashboard;
