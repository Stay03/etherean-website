import React, { useState, useCallback, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * EventCard component for displaying individual event information
 * Includes image loading state handling, error fallbacks, and countdown timer
 * Adapted to work with the API response format
 * Improved to handle multi-day events properly
 */
const EventCard = ({ event }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time from ISO string
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Check if event spans multiple days
  const isMultiDayEvent = () => {
    if (!event.start_date || !event.end_date) return false;
    
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    // Set time portions to 0 to compare only dates
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    return startDay.getTime() !== endDay.getTime();
  };

  // Format a date with the specified date format
  const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Calculate event duration in hours
  const calculateDurationHours = () => {
    if (!event.start_date || !event.end_date) return 0;
    
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    // Calculate difference in milliseconds and convert to hours
    const durationMs = endDate - startDate;
    const durationHours = Math.round(durationMs / (1000 * 60 * 60));
    
    return durationHours;
  };

  // Format date range for display based on whether it's a multi-day event
  const formatDateTimeRange = () => {
    if (!event.start_date || !event.end_date) return '';
    
    const durationHours = calculateDurationHours();
    const durationText = durationHours > 0 ? ` [${durationHours} hr${durationHours !== 1 ? 's' : ''}]` : '';
    
    if (isMultiDayEvent()) {
      // For multi-day events, show full date with specific start and end times
      return (
        <>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateOnly(event.start_date)} - {formatDateOnly(event.end_date)}
          </p>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDateOnly(event.start_date)}, {formatTime(event.start_date)} to {formatDateOnly(event.end_date)}, {formatTime(event.end_date)}{durationText}
          </p>
        </>
      );
    } else {
      // For same-day events, show date once and time range
      return (
        <>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.start_date)}
          </p>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(event.start_date)} - {formatTime(event.end_date)}{durationText}
          </p>
        </>
      );
    }
  };

  // Determine if event is upcoming or past
  const getEventStatus = () => {
    if (!event.start_date) return 'unknown';
    const now = new Date();
    const eventDate = new Date(event.start_date);
    
    if (eventDate > now) {
      return 'upcoming';
    } else if (event.end_date && new Date(event.end_date) > now) {
      return 'ongoing';
    } else {
      return 'past';
    }
  };

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      if (!event.start_date) return;
      
      const now = new Date();
      const eventStart = new Date(event.start_date);
      
      // Only show countdown for upcoming events within 30 days
      if (eventStart <= now || (eventStart - now) > 30 * 24 * 60 * 60 * 1000) {
        setIsCountdownActive(false);
        return;
      }
      
      setIsCountdownActive(true);
      
      const totalSeconds = Math.floor((eventStart - now) / 1000);
      
      if (totalSeconds <= 0) {
        setIsCountdownActive(false);
        return;
      }
      
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    // Initial update
    updateCountdown();
    
    // Set up interval for countdown
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(countdownInterval);
  }, [event.start_date]);

  // Handle successful image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle image error by using fallback
  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  // Image sources with fallback
  const imageSource = imageError ? 
    '/images/event-placeholder.jpg' : 
    (event.thumbnail || '/images/event-placeholder.jpg');
  
  // Generate event link
  const eventLink = `/events/${event.slug}`;

  // Get the event type label
  const eventType = event.event_type || 'Event';
  
  // Get status label and style
  const getStatusLabelAndStyle = () => {
    const status = getEventStatus();
    
    switch (status) {
      case 'upcoming':
        return {
          label: 'Upcoming',
          className: 'bg-green-100 text-green-800'
        };
      case 'ongoing':
        return {
          label: 'Happening Now',
          className: 'bg-blue-100 text-blue-800'
        };
      case 'past':
        return {
          label: 'Past',
          className: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };
  
  const { label: statusLabel, className: statusClassName } = getStatusLabelAndStyle();
  
  return (
    <div className="relative h-full flex flex-col group overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl">
      {/* Event image container with fixed aspect ratio */}
      <div className="relative w-full h-full overflow-hidden bg-gray-200">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Background image */}
        <img 
          src={imageSource}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>

        {/* Event type tag */}
        <div className="absolute top-4 left-4 z-10 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full font-semibold">
          {eventType}
        </div>
        
        {/* Event status tag (upcoming/past/happening now) */}
        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${statusClassName}`}>
          {statusLabel}
        </div>
        
        {/* Countdown timer - only show for upcoming events when hovered */}
        {isCountdownActive && (
          <div className="absolute top-16 right-4 z-10 mt-2 bg-black/70 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
            <p className="text-white text-xs mb-1 font-medium text-center">Starting in</p>
            <div className="flex space-x-2">
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.days}
                </div>
                <span className="text-white text-xs mt-1">Day{timeRemaining.days !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.hours}
                </div>
                <span className="text-white text-xs mt-1">Hr{timeRemaining.hours !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.minutes}
                </div>
                <span className="text-white text-xs mt-1">Min</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.seconds}
                </div>
                <span className="text-white text-xs mt-1">Sec</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Event details container - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col">
          <h3 className="text-white text-2xl font-bold mb-2">{event.title}</h3>
          
          <div className="text-white/90 space-y-1 mb-4">
            {formatDateTimeRange()}
            
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location || 'Online'}
            </p>
          </div>
          
          <Link 
            to={eventLink} 
            className="inline-flex items-center self-start px-6 py-2 rounded-full bg-yellow-500 text-gray-900 font-semibold hover:bg-white transition-colors duration-300"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
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
  }).isRequired
};

export default memo(EventCard);