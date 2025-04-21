import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProductFilters Component
 * Filter controls for product listings
 */
const ProductFilters = ({ filters, onChange }) => {
  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'title_asc', label: 'Name: A to Z' },
    { value: 'title_desc', label: 'Name: Z to A' }
  ];

  // Handler for filter changes
  const handleFilterChange = (key, value) => {
    onChange({ [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Sort Order */}
      <div className="flex flex-col">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sort"
          value={filters.sort || 'newest'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filters */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <label htmlFor="min_price" className="text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            id="min_price"
            min="0"
            value={filters.min_price || ''}
            onChange={(e) => handleFilterChange('min_price', e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Min"
            className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm w-24"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="max_price" className="text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            id="max_price"
            min="0"
            value={filters.max_price || ''}
            onChange={(e) => handleFilterChange('max_price', e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Max"
            className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm w-24"
          />
        </div>
      </div>


    </div>
  );
};

ProductFilters.propTypes = {
  filters: PropTypes.shape({
    platform: PropTypes.string,
    type: PropTypes.string,
    is_online: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    sort: PropTypes.string,
    min_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }).isRequired,
  onChange: PropTypes.func.isRequired
};

export default ProductFilters;