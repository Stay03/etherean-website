import React, { useState, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import ProductSearch from '../components/products/ProductSearch';
import Breadcrumb from '../components/Breadcrumb';
import useProducts from '../hooks/useProducts';

/**
 * ShopPage Component
 * Main page that displays products with filtering and search capabilities
 */
const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Extract filter values from URL or use defaults
  const initialFilters = {
    platform: 'EL', // Default platform
    type: 'physical', // Default type
    is_online: true, // Default availability
    visibility: '1', // Default visibility
    sort: queryParams.get('sort') || 'newest',
    search: queryParams.get('search') || '',
    min_price: queryParams.get('min_price') ? Number(queryParams.get('min_price')) : '',
    max_price: queryParams.get('max_price') ? Number(queryParams.get('max_price')) : '',
    page: parseInt(queryParams.get('page') || '1', 10),
    per_page: parseInt(queryParams.get('per_page') || '12', 10)
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' }
  ];

  // State for filters
  const [filters, setFilters] = useState(initialFilters);

  // Use custom hook to fetch products data
  const { 
    products, 
    pagination, 
    isLoading, 
    error, 
    refetch 
  } = useProducts(filters);

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, value);
      }
    });
    
    navigate({ search: params.toString() });
  };

  // Handle search submission
  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    
    // Update URL with new page
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate({ search: params.toString() });
  };

  // Toggle filter panel on mobile
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={breadcrumbItems} 
        onNavigate={(path) => navigate(path)} 
      />
      
      
      {/* Filters and Search Section */}
      <div className="w-full bg-gray-50 py-6 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4">
            {/* Search and Filter Toggle for Mobile */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <ProductSearch 
                initialValue={filters.search} 
                onSearch={handleSearch} 
              />
              
              {/* Mobile Filter Toggle */}
              <button 
                className="md:hidden px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {/* Filters - Always visible on desktop, toggle on mobile */}
            <div className={`${showFilters || 'hidden md:block'}`}>
              <ProductFilters 
                filters={filters} 
                onChange={updateFilters} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Count and Active Filters Summary */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <p className="text-gray-600">
              {isLoading ? 'Loading products...' : 
                `Showing ${products.length} of ${pagination?.total || 0} products`
              }
            </p>
            
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  Search: {filters.search}
                  <button
                    onClick={() => updateFilters({ search: '' })}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.min_price && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  Min Price: ${filters.min_price}
                  <button
                    onClick={() => updateFilters({ min_price: '' })}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.max_price && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  Max Price: ${filters.max_price}
                  <button
                    onClick={() => updateFilters({ max_price: '' })}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {/* Clear All Filters Button - Only show if at least one filter is active */}
              {(filters.search || filters.min_price || filters.max_price) && (
                <button
                  onClick={() => updateFilters({ 
                    search: '', 
                    min_price: '', 
                    max_price: '' 
                  })}
                  className="px-3 py-1 text-sm font-medium text-yellow-700 hover:text-yellow-900"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
        
        <ProductList 
          products={products} 
          isLoading={isLoading} 
          error={error} 
          pagination={pagination}
          onPageChange={handlePageChange}
          onRetry={refetch}
        />
      </div>
    </div>
  );
};

export default memo(ShopPage);