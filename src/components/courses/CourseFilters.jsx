import React, { useState } from 'react';

/**
 * CourseFilters Component
 * Provides filtering and sorting options for courses
 * 
 * @param {Object} filters - Current filter values
 * @param {Function} onChange - Function to handle filter changes
 */
const CourseFilters = ({ filters, onChange }) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Sort options for dropdown
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'title-asc', label: 'Title: A to Z' },
    { value: 'title-desc', label: 'Title: Z to A' },
  ];

  // Handle sort change
  const handleSortChange = (e) => {
    onChange({ sort_by: e.target.value });
  };

  // Toggle filter menu on mobile
  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-medium text-gray-800">Course Catalog</h2>
        
        {/* Mobile filter button */}
        <div className="md:hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            onClick={toggleFilterMenu}
          >
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
            </span>
            <svg className={`h-4 w-4 transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Desktop filter row */}
        <div className="hidden md:flex md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort By</span>
            <div className="relative">
              <select
                value={filters.sort_by || 'newest'}
                onChange={handleSortChange}
                className="appearance-none pl-4 pr-10 py-2 text-sm border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer min-w-[160px]"
                aria-label="Sort courses"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter panel */}
      {isFilterMenuOpen && (
        <div className="md:hidden mt-4 p-4 bg-white shadow-lg rounded-md border border-gray-200 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
            <button 
              onClick={toggleFilterMenu}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close filters"
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Sort Filter for Mobile */}
            <div className="filter-group">
              <label htmlFor="mobile-sort-filter" className="block text-xs font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="relative">
                <select
                  id="mobile-sort-filter"
                  value={filters.sort_by || 'newest'}
                  onChange={handleSortChange}
                  className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFilters;