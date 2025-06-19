import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api/client';
import endpoints from '../services/api/endpoints';

/**
 * EventCountdownBadge Component
 * Displays a countdown timer for upcoming events
 */
const EventCountdownBadge = ({ startDate }) => {
  const [timeLeft, setTimeLeft] = useState({});
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(startDate) - new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return {
          days,
          hours,
          minutes,
          seconds
        };
      }
      
      return null;
    };
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Set initial value
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [startDate]);
  
  if (!timeLeft) {
    return (
      <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
        Event Starting Now!
      </span>
    );
  }
  
  return (
    <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
      {timeLeft.days > 0 ? (
        `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
      ) : timeLeft.hours > 0 ? (
        `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
      ) : timeLeft.minutes > 0 ? (
        `${timeLeft.minutes}m ${timeLeft.seconds}s`
      ) : (
        `${timeLeft.seconds}s`
      )}
    </span>
  );
};

/**
 * EventDetailPage Component
 * Displays detailed information about a single event
 */
const EventDetailPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/events/${slug}`);
        
        if (response.status === 'success' && response.data) {
          setEvent(response.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch event details');
        }
      } catch (err) {
        console.error('Failed to fetch event details:', err);
        setError(err.message || 'Failed to fetch event details');
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [slug]);

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate event duration
  const calculateDuration = () => {
    if (!event?.start_date || !event?.end_date) return '';
    
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const durationMs = endDate - startDate;
    const durationHours = Math.round(durationMs / (1000 * 60 * 60));
    
    if (durationHours < 24) {
      return `${durationHours} hour${durationHours !== 1 ? 's' : ''}`;
    } else {
      const durationDays = Math.round(durationHours / 24);
      return `${durationDays} day${durationDays !== 1 ? 's' : ''}`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load event</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/events"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-600 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // No event found
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link 
            to="/events"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-600 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with image */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={event.thumbnail || '/images/event-placeholder.jpg'} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        
        {/* Event type and status badges */}
        <div className="absolute mt-20  top-8 right-8 flex space-x-3">
          <span className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold capitalize">
            {event.event_type}
          </span>
      
          {event.status === 'published' && new Date(event.start_date) > new Date() && (
            <EventCountdownBadge startDate={event.start_date} />
          )}
        </div>
        
        {/* Back button */}
        {/* <Link 
          to="/events"
          className="absolute top-8 left-8 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link> */}
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Event title and quick info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-gray-600">
            {/* Date and time */}
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDateTime(event.start_date)}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{calculateDuration()}</span>
            </div>

        

            {/* Location */}
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Event details card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
          
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Date and time */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start</p>
                  <p className="text-gray-900">{formatDateTime(event.start_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End</p>
                  <p className="text-gray-900">{formatDateTime(event.end_date)}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{event.location}</p>
              {event.location_url && (
                <a 
                  href={event.location_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-yellow-600 hover:text-yellow-700"
                >
                  View location
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Price and capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Price</h3>
                <p className="text-gray-600">
                  {parseFloat(event.price) === 0 ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}
                </p>
              </div>
              {event.capacity && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Capacity</h3>
                  <p className="text-gray-600">{event.capacity} attendees</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center">
          <Link 
            to="/events"
            className="px-8 py-4 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center"
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;