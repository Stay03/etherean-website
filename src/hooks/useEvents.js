import { useState, useEffect } from 'react';
import apiClient from '../services/api/client';
import endpoints from '../services/api/endpoints';

/**
 * Custom hook for fetching events
 * @param {Object} params - Query parameters for events API
 * @returns {Object} - Events data, loading state, and error state
 */
const useEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Default parameters for events
        const defaultParams = {
          platform: 'EL',
          is_online: 1,
          perPage: 10,
          status: 'published',
          orderBy: 'start_date',
          orderDir: 'asc',
        };
        
        // Merge with custom parameters
        const queryParams = {
          ...defaultParams,
          ...params,
        };
        
        const response = await apiClient.get(endpoints.events.list, queryParams);
        
        if (response.status === 'success' && response.data) {
          setEvents(response.data.data || []);
          setPagination({
            currentPage: response.data.current_page,
            totalPages: response.data.last_page,
            totalItems: response.data.total,
            perPage: response.data.per_page,
          });
          setError(null);
        } else {
          throw new Error('Invalid response format from events API');
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError(err.message || 'Failed to fetch events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [JSON.stringify(params)]); // Dependency on stringified params to prevent infinite loops

  return {
    events,
    pagination,
    isLoading,
    error
  };
};

export default useEvents;