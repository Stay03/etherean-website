// src/hooks/useQuizState.js
import { useContext, useEffect } from 'react';
import QuizContext from '../contexts/QuizContext';
import { QuizProvider } from '../contexts/QuizContext';

/**
 * Custom hook for accessing and managing quiz state
 * Provides a convenient wrapper around QuizContext
 * 
 * @param {Object} quiz - Quiz data object
 * @param {Function} onComplete - Callback when quiz is completed
 * @returns {Object} - Quiz state and actions
 */
const useQuizState = (quiz, onComplete) => {
  // Access the context
  const context = useContext(QuizContext);
  
  // Throw an error if the hook is used outside of a provider
  if (context === undefined) {
    throw new Error('useQuizState must be used within a QuizProvider');
  }
  
  return context;
};

/**
 * Wrapper component that provides quiz state
 * Simplifies usage by combining the context and hook
 */
export const QuizStateProvider = ({ children, quiz, onComplete }) => {
  return (
    <QuizProvider quiz={quiz} onComplete={onComplete}>
      {children}
    </QuizProvider>
  );
};

export default useQuizState;