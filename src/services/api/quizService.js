// src/services/api/quizService.js
import apiClient from './client';
import endpoints from './endpoints';

/**
 * Quiz Service - Handles quiz-related API requests
 * Enhanced to better handle quiz continuation and resuming
 */
const quizService = {
  /**
   * Start a new quiz attempt or resume an existing one
   * @param {number} quizId - The ID of the quiz
   * @returns {Promise} - Promise that resolves with the attempt data
   */
  startQuizAttempt: async (quizId) => {
    try {
      // The server will return an existing attempt if one exists
      const response = await apiClient.post(endpoints.quiz.startAttempt, {
        quiz_id: quizId
      });
      
      console.log('Quiz attempt started/resumed:', response);
      
      return response;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      throw error;
    }
  },
  
  /**
   * Submit answer for a multiple choice or true/false question
   * @param {number} attemptId - The ID of the quiz attempt
   * @param {number} questionId - The ID of the question
   * @param {number} optionId - The ID of the selected option
   * @returns {Promise} - Promise that resolves with the answer data
   */
  submitOptionAnswer: async (attemptId, questionId, optionId) => {
    try {
      const response = await apiClient.post(endpoints.quiz.submitAnswer, {
        quiz_attempt_id: attemptId,
        quiz_question_id: questionId,
        selected_option_id: optionId
      });
      
      return response;
    } catch (error) {
      console.error('Error submitting option answer:', error);
      throw error;
    }
  },
  
  /**
   * Submit answer for an essay question
   * @param {number} attemptId - The ID of the quiz attempt
   * @param {number} questionId - The ID of the question
   * @param {string} answerText - The text of the essay answer
   * @returns {Promise} - Promise that resolves with the answer data
   */
  submitEssayAnswer: async (attemptId, questionId, answerText) => {
    try {
      const response = await apiClient.post(endpoints.quiz.submitAnswer, {
        quiz_attempt_id: attemptId,
        quiz_question_id: questionId,
        answer_text: answerText
      });
      
      return response;
    } catch (error) {
      console.error('Error submitting essay answer:', error);
      throw error;
    }
  },
  
  

  
  /**
   * Get progress data for a quiz
   * @param {number} quizId - The ID of the quiz
   * @returns {Promise} - Promise that resolves with the progress data
   */
  getQuizProgress: async (quizId) => {
    try {
      const response = await apiClient.get(
        endpoints.quiz.getProgress(quizId)
      );
      
      return response;
    } catch (error) {
      console.error('Error getting quiz progress:', error);
      throw error;
    }
  }
};

export default quizService;