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
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
        <div className="lg:col-span-3 col-span-1">
          <SalesAnalytics />
        </div>
        <div className="lg:col-span-2 col-span-1">
          <ProductMonitoring />
        </div>
      </div>
      <FeaturedProducts />
    </main>
  );
};

export default Dashboard;
