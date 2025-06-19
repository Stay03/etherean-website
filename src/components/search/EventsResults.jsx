import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useEvents from '../../hooks/useEvents';
import SearchResultCard from './SearchResultCard';
import { Link } from 'react-router-dom';

const SectionLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const EventsResults = ({ searchQuery }) => {
  const params = useMemo(() => ({
    search: searchQuery,
    platform: 'EL', // Adjust as needed
    status: 'published', // Or broaden if necessary
    perPage: 3,
    page: 1,
    // Removed is_online filter for broader search
  }), [searchQuery]);

  const { events, isLoading, error, pagination } = useEvents(params);

  if (isLoading) return <SectionLoader />;
  if (error) return <p className="text-red-500">Error loading events: {error}</p>; // error is a string from useEvents
  if (!events || events.length === 0) {
    return <p className="text-gray-600">No events found matching "{searchQuery}".</p>;
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <SearchResultCard key={`event-${event.id}`} item={event} type="event" />
      ))}
      {pagination && pagination.totalItems > events.length && (
         <Link 
            to={`/events?search=${encodeURIComponent(searchQuery)}`} // EventsPage needs to handle search query in URL
            className="inline-block mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
        >
            View all {pagination.totalItems} events
        </Link>
      )}
    </div>
  );
};

EventsResults.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};

export default EventsResults;