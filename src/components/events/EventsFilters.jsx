import React from 'react';
import PropTypes from 'prop-types';

/**
 * EventsFilters Component
 * Provides filtering options for events
 */
const EventsFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      {/* Event Type Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Event Type</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="eventType"
              value="all"
              checked={filters.eventType === 'all'}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">All Events</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="eventType"
              value="online"
              checked={filters.eventType === 'online'}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">Online Events</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="eventType"
              value="in-person"
              checked={filters.eventType === 'in-person'}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">In-Person Events</span>
          </label>
        </div>
      </div>
      
      {/* Status Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="all"
              checked={filters.status === 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">All</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="upcoming"
              checked={filters.status === 'upcoming'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">Upcoming</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="ongoing"
              checked={filters.status === 'ongoing'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">Happening Now</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="past"
              checked={filters.status === 'past'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">Past</span>
          </label>
        </div>
      </div>
      
      {/* Clear Filters */}
      {(filters.eventType !== 'all' || filters.status !== 'all') && (
        <button
          onClick={() => onFilterChange({
            eventType: 'all',
            dateRange: 'all',
            status: 'all'
          })}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

EventsFilters.propTypes = {
  filters: PropTypes.shape({
    eventType: PropTypes.string.isRequired,
    dateRange: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default EventsFilters;