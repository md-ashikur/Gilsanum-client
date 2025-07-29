import React from 'react';
import type { ProductItemType } from '../../types';

interface ProductMonitoringProps {
  products: ProductItemType[];
}

const ProductMonitoring: React.FC<ProductMonitoringProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">👀 Product Monitoring</h3>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm">
          <option>Popular Product</option>
          <option>New Products</option>
          <option>Top Selling</option>
        </select>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0 ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-gray-400">
                {product.rank.toString().padStart(2, '0')}
              </span>
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="font-medium text-gray-700">{product.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {product.orders.toLocaleString()} Orders
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
        View all Ranks
      </button>
    </div>
  );
};

export default ProductMonitoring;
