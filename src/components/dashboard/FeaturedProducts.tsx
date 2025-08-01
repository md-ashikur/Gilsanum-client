import React, { useState, useRef, useEffect, useMemo } from "react";
import { useGetProductsQuery } from "../../store/api";
import filter from "/images/filter-horizontal.svg";
import location from "/images/location-04.svg";
import ProductMap from "./ProductMap";


interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  shop?: {
    name: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

const FeaturedProducts: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [saleType, setSaleType] = useState<string>("for_sale");
  const [showSaleDropdown, setShowSaleDropdown] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState({
    from: "09-10-2025",
    to: "09-11-2025"
  });
  const [datePreset, setDatePreset] = useState<string>("");
  const [amountFilter, setAmountFilter] = useState<string>("low_to_high");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterModalRef = useRef<HTMLDivElement>(null);
  const { data: response, isLoading, error } = useGetProductsQuery({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSaleDropdown(false);
      }
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target as Node)
      ) {
        setShowFilterModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const products: Product[] = useMemo(() => response?.data || [], [response?.data]);

  // Calculate max price from products
  const maxPrice = products.length > 0 ? Math.max(...products.map(product => product.price)) : 1000;
  
  // Update price range when products load
  useEffect(() => {
    if (products.length > 0) {
      const calculatedMaxPrice = Math.max(...products.map(product => product.price));
      setPriceRange([0, calculatedMaxPrice]);
    }
  }, [products]);
  
  // Reset filters
  const resetDateRange = () => {
    setDateRange({ from: "09-10-2025", to: "09-11-2025" });
    setDatePreset("");
  };

  const resetAmount = () => {
    setAmountFilter("low_to_high");
  };

  const resetPriceRange = () => {
    setPriceRange([0, maxPrice]);
  };

  const resetAllFilters = () => {
    resetDateRange();
    resetAmount();
    resetPriceRange();
  };

  const applyFilters = () => {
    console.log("Applying filters:", { dateRange, amountFilter, priceRange });
    // Filters are now applied dynamically, so we just close the modal
    setShowFilterModal(false);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    
    // Check if date range is not default
    if (dateRange.from !== "09-10-2025" || dateRange.to !== "09-11-2025") {
      count++;
    }
    
    // Check if amount filter is not default
    if (amountFilter !== "low_to_high") {
      count++;
    }
    
    // Check if price range is not default
    if (priceRange[0] !== 0 || priceRange[1] !== maxPrice) {
      count++;
    }
    
    return count;
  };

  const setDatePresetValue = (preset: string) => {
    setDatePreset(preset);
    const today = new Date();
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].split('-').reverse().join('-');
    };

    switch (preset) {
      case "today": {
        const todayFormatted = formatDate(today);
        setDateRange({ from: todayFormatted, to: todayFormatted });
        break;
      }
      case "week": {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        setDateRange({ from: formatDate(weekAgo), to: formatDate(today) });
        break;
      }
      case "month": {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        setDateRange({ from: formatDate(monthAgo), to: formatDate(today) });
        break;
      }
    }
  };

  // Filter and sort products dynamically
  const filteredProducts = products
    .filter((product: Product) => {
      // Text search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Price range filter
      const matchesPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Amount filter
      let matchesAmount = true;
      switch (amountFilter) {
        case "under_100":
          matchesAmount = product.price < 100;
          break;
        case "100_to_500":
          matchesAmount = product.price >= 100 && product.price <= 500;
          break;
        case "over_500":
          matchesAmount = product.price > 500;
          break;
        default:
          matchesAmount = true;
      }
      
      // Date range filter (you can implement this based on product date if available)
      // For now, we'll assume all products match the date range
      const matchesDateRange = true;
      
      return matchesSearch && matchesPriceRange && matchesAmount && matchesDateRange;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          // Apply amount filter sorting
          switch (amountFilter) {
            case "low_to_high":
              return a.price - b.price;
            case "high_to_low":
              return b.price - a.price;
            default:
              return 0;
          }
      }
    });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center text-red-500">Failed to load products</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 my-6 border border-white-200 space-y-3">
      {/* Header */}
      <div className="text-secondary-200 flex items-center gap-2">
        {/* For Sale Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowSaleDropdown(!showSaleDropdown)}
            className="border border-white-200 py-3 px-[14px] rounded-[8px] flex items-center justify-between min-w-[120px] bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">
              {saleType === "for_sale"
                ? "For sale"
                : saleType === "for_rent"
                ? "For rent"
                : saleType === "sold"
                ? "Sold"
                : "For sale"}
            </span>
            <div className="flex flex-col items-center justify-center w-4 h-4 space-y-1">
              <svg
                className="w-3 h-2 text-secondary-200"
                fill="currentColor"
                viewBox="0 0 12 8"
              >
                <path d="M6 0l6 8H0z" />
              </svg>
              <svg
                className="w-3 h-2 text-secondary-200"
                fill="currentColor"
                viewBox="0 0 12 8"
              >
                <path d="M6 8L0 0h12z" />
              </svg>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showSaleDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setSaleType("for_sale");
                  setShowSaleDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
              >
                For sale
              </button>
              <button
                onClick={() => {
                  setSaleType("for_rent");
                  setShowSaleDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                For rent
              </button>
              <button
                onClick={() => {
                  setSaleType("sold");
                  setShowSaleDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg"
              >
                Sold
              </button>
            </div>
          )}
        </div>

        {/* Search Bar - Full Width */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Shop"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="border border-white-200 rounded-lg py-3 px-[14px] text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter Button */}
        <div className="relative" ref={filterModalRef}>
          <button 
            onClick={() => setShowFilterModal(!showFilterModal)}
            className="bg-secondary-200 hover:bg-secondary-200 text-white w-[48px] h-[48px] rounded-[8px] flex items-center justify-center"
          >
            <img src={filter} alt="Filter" className="w-6 h-6" />
          </button>

          {/* Filter Dropdown */}
          {showFilterModal && (
            <div className="absolute top-full right-0 mt-1 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-sm text-[#555E67]">Filter by:</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600 sm:hidden"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Date Range Section */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-secondary-200 font-semibold text-sm">Date Range</h4>
                  <button
                    onClick={resetDateRange}
                    className="text-secondary-200 font-semibold hover:text-blue-700 text-xs sm:text-sm"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        value={dateRange.from.split('-').reverse().join('-')}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value.split('-').reverse().join('-') }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        value={dateRange.to.split('-').reverse().join('-')}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value.split('-').reverse().join('-') }))}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    <button
                      onClick={() => setDatePresetValue("today")}
                      className={`px-2 sm:px-3 py-2 text-xs rounded-md border ${
                        datePreset === "today" 
                          ? "bg-blue-50 border-blue-200 text-blue-700" 
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setDatePresetValue("week")}
                      className={`px-2 sm:px-3 py-2 text-xs rounded-md border ${
                        datePreset === "week" 
                          ? "bg-blue-50 border-blue-200 text-blue-700" 
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => setDatePresetValue("month")}
                      className={`px-2 sm:px-3 py-2 text-xs rounded-md border ${
                        datePreset === "month" 
                          ? "bg-blue-50 border-blue-200 text-blue-700" 
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      This Month
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount Section */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-secondary-200 font-semibold text-sm">Amount</h4>
                  <button
                    onClick={resetAmount}
                    className="text-secondary-200 font-semibold text-xs sm:text-sm"
                  >
                    Reset
                  </button>
                </div>
                
                <select
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="low_to_high">Low to High (Lowest First)</option>
                  <option value="high_to_low">High to Low (Highest First)</option>
                  <option value="under_100">Under $100</option>
                  <option value="100_to_500">$100 - $500</option>
                  <option value="over_500">Over $500</option>
                </select>
              </div>

              {/* Price Range Section */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-secondary-200 font-semibold text-sm">Price Range</h4>
                  <button
                    onClick={resetPriceRange}
                    className="text-secondary-200 font-semibold text-xs sm:text-sm"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative h-6">
                    {/* Track */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
                    
                    {/* Active track */}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-secondary-200 rounded-full"
                      style={{
                        left: `${(priceRange[0] / maxPrice) * 100}%`,
                        width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`
                      }}
                    ></div>
                    
                    {/* Lower handle */}
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value < priceRange[1]) {
                          setPriceRange([value, priceRange[1]]);
                        }
                      }}
                      className="absolute top-1/2 transform -translate-y-1/2 w-full h-6 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-secondary-200 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    
                    {/* Upper handle */}
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > priceRange[0]) {
                          setPriceRange([priceRange[0], value]);
                        }
                      }}
                      className="absolute top-1/2 transform -translate-y-1/2 w-full h-6 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-secondary-200 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-primary-500 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Reset All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-3 sm:px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  Apply Filter({getActiveFilterCount()})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      

      {/* Results count and sort */}
      <div className="text-secondary-200 flex items-center justify-between">
        <span>
          1 - {Math.min(filteredProducts.length, 8)} of{" "}
          {filteredProducts.length} Results
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSortBy(e.target.value)
            }
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-[14px] pr-10 focus:outline-none cursor-pointer min-w-[120px]"
          >
            <option value="default">Default sort</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <div className="flex flex-col items-center justify-center w-4 h-4 space-y-1">
              <svg
                className="w-3 h-2 text-secondary-200"
                fill="currentColor"
                viewBox="0 0 12 8"
              >
                <path d="M6 0l6 8H0z" />
              </svg>
              <svg
                className="w-3 h-2 text-secondary-200"
                fill="currentColor"
                viewBox="0 0 12 8"
              >
                <path d="M6 8L0 0h12z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
        {/* Product Map */}
        <div className="lg:col-span-2 col-span-1">
          <ProductMap 
            searchTerm={searchTerm}
            filteredProducts={filteredProducts}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 col-span-1 grid lg:grid-cols-2 gap-4">
          {filteredProducts
            .slice(0, 4)
            .map((product: Product, index: number) => (
              <div key={product.id} className="relative group cursor-pointer ">
                <div className="aspect-square bg-gray-100 rounded-[12px] overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Featured badge */}
                  {index < 2 && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1">
                      <div className="bg-secondary-200 text-white px-3 py-[6px] rounded-full text-sm flex items-center space-x-1">
                        <span>FEATURED</span>
                      
                      </div>
                        <div className="bg-secondary-200 text-white rounded-full  flex items-center justify-center p-2">
                          <img src={location} className="w-4 h-4" alt="" />
                        </div>
                    </div>
                  )}

                  {/* Price overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-secondary-200/70 from-black/60 to-transparent p-4">
                    <div className="text-white">
                      <div className="text-sm font-medium opacity-80">{product.name}</div>
                      <div className="text-xl font-semibold">
                        ${product.price?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
