import { useState, useEffect, useCallback, useRef } from 'react';
import courseService from '../services/api/courseService';

/**
 * Custom hook to fetch and manage course detail data
 * Optimized to prevent excessive API calls
 * 
 * @param {string} slug - Course slug
 * @param {boolean} detailed - Whether to fetch detailed course data
 * @returns {Object} - Object containing course data, loading state, error state, and refetch function
 */
const useCourseDetail = (slug, detailed = false) => {
  const [course, setCourse] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use a ref to track if initial fetch has occurred
  const hasInitialFetch = useRef(false);

  // Function to fetch course details from API
  const fetchCourseDetail = useCallback(async (forceRefresh = false) => {
    if (!slug) return;
    
    // Skip if we've already fetched and this isn't a forced refresh
    if (hasInitialFetch.current && !forceRefresh && !error) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await courseService.getCourseBySlug(slug, detailed);
      
      // Check if response has the expected structure
      if (response && response.course) {
        setCourse(response.course);
        // Set hasAccess from the API response
        setHasAccess(response.has_access === true);
        hasInitialFetch.current = true;
      } else {
        setCourse(null);
        setHasAccess(false);
        setError({ 
          status: 400, 
          message: 'Unexpected API response format' 
        });
      }
    } catch (err) {
      setCourse(null);
      setHasAccess(false);
      setError({
        status: err.status || 500,
        message: err.message || 'An error occurred while fetching the course'
      });
      console.error('Failed to fetch course details:', err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, detailed, error]);

  // Fetch course only on initial render or when slug/detailed changes
  useEffect(() => {
    hasInitialFetch.current = false; // Reset when slug or detailed changes
    fetchCourseDetail();
  }, [slug, detailed, fetchCourseDetail]);

  // Expose a refetch function that forces a refresh
  const refetch = useCallback(() => {
    return fetchCourseDetail(true);
  }, [fetchCourseDetail]);

  return {
    course,
    hasAccess,
    isLoading,
    error,
    refetch
  };
};

export default useCourseDetail;