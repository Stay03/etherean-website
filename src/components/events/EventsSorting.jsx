import React from 'react';
import PropTypes from 'prop-types';

/**
 * EventsSorting Component
 * Provides sorting options for events
 */
const EventsSorting = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'start_date:desc', label: 'Date (Newest First)' },
    { value: 'start_date:asc', label: 'Date (Oldest First)' },
    { value: 'title:asc', label: 'Name (A-Z)' },
    { value: 'title:desc', label: 'Name (Z-A)' },
  ];
  
  const currentValue = `${sortBy.field}:${sortBy.direction}`;
  
  const handleChange = (e) => {
    const [field, direction] = e.target.value.split(':');
    onSortChange({ field, direction });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm text-gray-600">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentValue}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

EventsSorting.propTypes = {
  sortBy: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired
  }).isRequired,
  onSortChange: PropTypes.func.isRequired
};

export default EventsSorting;