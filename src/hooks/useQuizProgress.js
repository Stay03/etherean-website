import { useState, useEffect, useCallback } from 'react';
import quizProgressService from '../services/api/quizProgressService';

/**
 * Custom hook for managing quiz progress data
 * 
 * @param {number} quizId - ID of the quiz to get progress for
 * @returns {Object} - Object containing quiz progress state and functions
 */
const useQuizProgress = (quizId) => {
  const [progressData, setProgressData] = useState(null);
  const [hasAttempts, setHasAttempts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch quiz progress data
  const fetchQuizProgress = useCallback(async () => {
    if (!quizId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await quizProgressService.getQuizProgress(quizId);
      setProgressData(response.data);
      setHasAttempts(response.has_attempts);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch quiz progress data');
      console.error('Error fetching quiz progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  // Fetch progress data on mount and when quizId changes
  useEffect(() => {
    if (quizId) {
      fetchQuizProgress();
    } else {
      // Reset state when quizId is not provided
      setProgressData(null);
      setHasAttempts(false);
    }
  }, [quizId, fetchQuizProgress]);

  return {
    progressData,
    hasAttempts,
    isLoading,
    error,
    refetchProgress: fetchQuizProgress
  };
};

export default useQuizProgress;