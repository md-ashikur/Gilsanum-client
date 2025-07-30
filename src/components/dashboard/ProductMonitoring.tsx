import React from 'react';
import type { ProductItemType } from '../../types';
import product from '/images/Startup-Product-Rocket-Box--Streamline-Ultimate.svg';
interface ProductMonitoringProps {
  products: ProductItemType[];
}

const ProductMonitoring: React.FC<ProductMonitoringProps> = ({ products }) => {
  return (
    <div className="bg-white w-[468px] h-[364px] rounded-xl p-4 text-secondary-200 border border-gray-100">
      <div className="flex  items-center justify-between mb-2">
        <div className='flex flex-col space-x-1'>
          <div className='flex items-center space-x-1'>
          <img src={product} alt="" className="w-6 h-6" />
          <h3 className=" text-secondary-200 ">Product Monitoring</h3>
        </div>
        <p className="text-xs text-secondary-200 opacity-50">Popular Product</p>
        </div>
        <div className="relative">
          <select className="appearance-none bg-white border border-white-200 rounded-lg px-3 py-2 text-sm text-secondary-200 focus:outline-none ">
            <option>Order</option>
            <option>Popular Product</option>
            <option>New Products</option>
            <option>Top Selling</option>
          </select>
          <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-200 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      

      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`flex items-center justify-between py-3 px-4 rounded-xl ${
              index === 0 ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className={`text-xl font-bold w-6 ${
                index === 0 ? 'text-blue-500' : 'text-gray-400'
              }`}>
                {product.rank.toString().padStart(2, '0')}
              </span>
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <span className="font-medium text-secondary-200 text-base">{product.name}</span>
            </div>
            <span className={`text-sm font-semibold ${
              index === 0 ? 'text-blue-500' : 'text-gray-500'
            }`}>
              {product.orders.toLocaleString()} Orders
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors underline">
        view all details
      </button>
    </div>
  );
};

export default ProductMonitoring;
