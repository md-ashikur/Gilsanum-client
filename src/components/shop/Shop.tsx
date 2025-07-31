

import React, { useState, useMemo } from 'react';
import { useGetProductsQuery } from '../../store/api';
import { useUIStore } from '../../store/uiStore';
import type { ShopFilterType } from '../../types';

const Shop: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ShopFilterType>({
    category: 'All',
    priceRange: { min: 0, max: 2000 },
    featured: false
  });

  const { addNotification } = useUIStore();

  // Prepare query parameters for the API
  const queryParams = useMemo(() => ({
    category: filters.category !== 'All' ? filters.category : undefined,
    featured: filters.featured || undefined,
    search: searchQuery || undefined,
    minPrice: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
    maxPrice: filters.priceRange.max < 2000 ? filters.priceRange.max : undefined,
    sort: 'default'
  }), [searchQuery, filters]);

  const { data: response, isLoading, error } = useGetProductsQuery(queryParams);

  React.useEffect(() => {
    if (error) {
      addNotification('error', 'Failed to load products');
    }
  }, [error, addNotification]);

  const filteredProducts = response?.data || [];
  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="All">For sale</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Shop"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">1 - {filteredProducts.length} of {filteredProducts.length} Results</span>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Default sort</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name || product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {product.featured && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    FEATURED
                  </span>
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name || product.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.location?.address || product.category}</p>
                {product.rating && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {product.rating} ({product.reviews})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
