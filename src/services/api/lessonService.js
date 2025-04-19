import api from './client';
import endpoints from './endpoints';

/**
 * Service for handling lesson-related API calls
 */
const lessonService = {
  /**
   * Mark a lesson as complete
   * @param {number} lessonId - ID of the lesson to mark as complete
   * @returns {Promise} - Promise resolving to API response
   */
  markLessonComplete: async (lessonId) => {
    try {
      const response = await api.post(endpoints.progress.completeLesson, { lesson_id: lessonId });
      return response.data;
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      throw error;
    }
  },
  
  /**
   * Mark lesson as started (track that user began the lesson)
   * @param {number} lessonId - ID of the lesson to mark as started
   * @returns {Promise} - Promise resolving to API response
   */
  startLesson: async (lessonId) => {
    try {
      const response = await api.post(endpoints.progress.startLesson, { lesson_id: lessonId });
      return response.data;
    } catch (error) {
      console.error('Error starting lesson:', error);
      throw error;
    }
  },
  
  /**
   * Get lesson details by ID
   * @param {number} lessonId - ID of the lesson to fetch
   * @returns {Promise} - Promise resolving to lesson details
   */
  getLessonById: async (lessonId) => {
    try {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson details:', error);
      throw error;
    }
  },
  

  
  /**
   * Get course progress
   * @param {number} courseId - ID of the course
   * @returns {Promise} - Promise resolving to course progress
   */
  getCourseProgress: async (courseId) => {
    try {
      const response = await api.get(endpoints.progress.getCourseProgress(courseId));
      return response.data;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw error;
    }
  }
};

export default lessonService;