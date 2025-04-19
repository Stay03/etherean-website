import api from './client';
import endpoints from './endpoints';

/**
 * Service for handling quiz progress-related API calls
 */
const quizProgressService = {
  /**
   * Get quiz progress data
   * @param {number} quizId - ID of the quiz to get progress for
   * @returns {Promise} - Promise resolving to API response with quiz progress data
   */
  getQuizProgress: async (quizId) => {
    try {
      const response = await api.get(endpoints.quiz.getProgress(quizId));
      return response;
    } catch (error) {
      console.error('Error fetching quiz progress:', error);
      throw error;
    }
  },
};

export default quizProgressService;