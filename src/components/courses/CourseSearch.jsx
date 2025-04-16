import React, { useState, useEffect } from 'react';

/**
 * CourseSearch Component
 * Provides a search box for filtering courses by title or description
 *
 * @param {string} initialValue - Initial search value
 * @param {Function} onSearch - Function to handle search submission
 */
const CourseSearch = ({ initialValue = '', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
 
  // Update local state when prop changes (e.g., when URL is updated externally)
  useEffect(() => {
    setSearchTerm(initialValue);
    setDebouncedTerm(initialValue);
  }, [initialValue]);
 
  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
   
    return () => clearTimeout(timer);
  }, [searchTerm]);
 
  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedTerm !== initialValue) {
      onSearch(debouncedTerm);
    }
  }, [debouncedTerm, onSearch, initialValue]);
 
  // Handle input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
 
  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-l-md bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all duration-200"
              placeholder="Search courses..."
              autoComplete="off"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2.5 border border-transparent rounded-r-md text-sm font-medium bg-amber-500 text-gray-900 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm min-w-[100px]"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseSearch;