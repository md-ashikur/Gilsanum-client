import React, { useState } from 'react';
import { useGetPopularProductsQuery } from '../../store/api';
import { useUIStore } from '../../store/uiStore';
import product from '/images/Startup-Product-Rocket-Box--Streamline-Ultimate.svg';

const ProductMonitoring: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'orders' | 'popular' | 'new' | 'top_selling'>('orders');
  
  const { data: response, isLoading, error } = useGetPopularProductsQuery({ 
    limit: 4 
  });
  const { addNotification } = useUIStore();

  React.useEffect(() => {
    if (error) {
      addNotification('error', 'Failed to load popular products');
    }
  }, [error, addNotification]);

  const products = React.useMemo(() => response?.data || [], [response?.data]);

  React.useEffect(() => {
    // Set the first product as selected by default when data loads
    if (products && products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    switch (sortOption) {
      case 'orders':
        return sorted.sort((a, b) => b.orders - a.orders);
      case 'popular':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'new':
        return sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'top_selling':
        return sorted.sort((a, b) => b.orders - a.orders);
      default:
        return sorted;
    }
  }, [products, sortOption]);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as 'orders' | 'popular' | 'new' | 'top_selling');
  };

  if (isLoading) {
    return (
      <div className="bg-white w-[468px] h-[364px] rounded-xl p-4 text-secondary-200 border border-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-[468px] h-[364px] rounded-xl p-4 text-secondary-200 border border-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Failed to load products</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 text-xs mt-1 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="bg-white w-[468px] h-[364px] rounded-xl p-4 text-secondary-200 border border-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-[468px] h-[364px] rounded-xl p-4 text-secondary-200 border border-gray-100">
      <div className="flex  items-center justify-between mb-2">
        <div className='flex flex-col space-x-1'>
          <div className='flex items-center space-x-1'>
          <img src={product} alt="" className="w-6 h-6" />
          <h3 className=" text-secondary-200 ">Product Monitoring</h3>
        </div>
        <p className="text-xs text-secondary-200 opacity-50">
          {sortOption === 'orders' && 'Most Orders'}
          {sortOption === 'popular' && 'Popular Products'}
          {sortOption === 'new' && 'New Products'}
          {sortOption === 'top_selling' && 'Top Selling'}
        </p>
        </div>
        <div className="relative">
          <select 
            className="appearance-none bg-white border border-white-200 rounded-lg px-3 py-2 text-sm text-secondary-200 focus:outline-none cursor-pointer"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="orders">Orders</option>
            <option value="popular">Popular Product</option>
            <option value="new">New Products</option>
            <option value="top_selling">Top Selling</option>
          </select>
          <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-200 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      

      <div className="space-y-3">
        {sortedProducts.map((product, index) => {
          const isSelected = selectedProductId === product.id;
          const displayRank = index + 1;
          
          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className={`flex items-center justify-between py-3 px-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : 'hover:border-l-4 hover:border-l-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`text-xl font-bold w-6 transition-colors duration-200 ${
                  isSelected ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {displayRank.toString().padStart(2, '0')}
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <span className="font-medium text-secondary-200 text-base">{product.name}</span>
              </div>
              <span className={`text-sm font-semibold transition-colors duration-200 ${
                isSelected ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {product.orders.toLocaleString()} Orders
              </span>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors underline">
        view all details
      </button>
    </div>
  );
};

export default ProductMonitoring;
