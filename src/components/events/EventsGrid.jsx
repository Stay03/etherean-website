import React from 'react';
import PropTypes from 'prop-types';
import EventCard from '../home/EventsSlider/EventCard';

/**
 * EventsGrid Component
 * Displays events in a responsive grid layout
 */
const EventsGrid = ({ events, isLoading, error }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse h-[420px]"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 text-lg font-semibold mb-2">
          Failed to load events
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Empty state
  if (!events || events.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No events found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }
  
  // Events grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="h-[420px]">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};

EventsGrid.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      description: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      location: PropTypes.string,
      location_url: PropTypes.string,
      is_online: PropTypes.bool,
      thumbnail: PropTypes.string,
      event_type: PropTypes.string
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

EventsGrid.defaultProps = {
  events: [],
  isLoading: false,
  error: null
};

export default EventsGrid;