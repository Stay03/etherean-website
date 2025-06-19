import { useState, useEffect, useCallback } from 'react';
import courseService from '../services/api/courseService';

/**
 * Custom hook to fetch and manage free courses data
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.limit - Maximum number of courses to fetch (default: 4)
 * @returns {Object} - Object containing free courses data, loading state, error state, and refetch function
 */
const useFreeCourses = (options = {}) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch free courses from API
  const fetchFreeCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await courseService.getFreeCourses({
        limit: options.limit || 4
      });
      
      // Check if response has the expected structure
      if (response && response.courses && response.courses.data) {
        // Transform courses data for featured section format
        const transformedCourses = response.courses.data.map(course => ({
          id: `course-${course.id}`,
          title: course.title,
          description: course.description || course.short_description || 'Free course - Start learning today!',
          imageUrl: course.featured_image || course.thumbnail || '/assets/default-course.jpg',
          linkUrl: `/course/${course.slug}`,
          category: 'Free Course'
        }));
        
        setCourses(transformedCourses);
      } else {
        setCourses([]);
        setError({ message: 'No free courses found' });
      }
    } catch (err) {
      setCourses([]);
      setError(err);
      console.error('Failed to fetch free courses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [options.limit]);

  // Fetch courses on mount and when options change
  useEffect(() => {
    fetchFreeCourses();
  }, [fetchFreeCourses]);

  return {
    courses,
    isLoading,
    error,
    refetch: fetchFreeCourses
  };
};

export default useFreeCourses;