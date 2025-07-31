import React from "react";
import DashboardStats from "./DashboardStats";
import SalesAnalytics from "./SalesAnalytics";
import ProductMonitoring from "./ProductMonitoring";
import FeaturedProducts from "./FeaturedProducts";

const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-10 ">
      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts and Product Monitoring */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SalesAnalytics />
        </div>
        <div className="lg:col-span-2">
          <ProductMonitoring />
        </div>
      </div>
      <FeaturedProducts />
    </main>
  );
};

export default Dashboard;
