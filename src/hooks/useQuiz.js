// src/hooks/useQuiz.js - Optimized version
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import quizService from '../services/api/quizService';

/**
 * Custom hook for quiz functionality
 * Optimized version with improved memoization and performance
 * 
 * @param {Object} quiz - Quiz data object
 * @param {Function} onComplete - Callback function to execute when quiz is completed
 * @returns {Object} - Quiz state and functions
 */
const useQuiz = (quiz, onComplete = () => {}) => {
  // Quiz attempt state
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);
  
  // Use refs to track if we've already started a quiz attempt
  const attemptStartedRef = useRef(false);
  const apiCallInProgressRef = useRef(false);
  const quizIdRef = useRef(quiz?.id);
  const previousAnswersLoadedRef = useRef(false);
  const statusCheckScheduledRef = useRef(false);
  const statusCheckIntervalRef = useRef(null);

  // Calculate current question and memoize it to prevent recalculations
  const { currentQuestion, totalQuestions } = useMemo(() => ({
    currentQuestion: quiz?.questions?.[currentQuestionIndex] || null,
    totalQuestions: quiz?.questions?.length || 0
  }), [quiz?.questions, currentQuestionIndex]);
  
  // Process and load previous answers from the quiz attempt - memoized
  const loadPreviousAnswers = useCallback((attempt) => {
    if (!attempt?.answers || attempt.answers.length === 0 || previousAnswersLoadedRef.current || !quiz?.questions) {
      return {};
    }
    
    // Mark that we've loaded previous answers
    previousAnswersLoadedRef.current = true;
    
    // Create a new answers object with the previous answers
    const prevAnswers = {};
    
    // Process each answer and format it to match our local state structure
    attempt.answers.forEach(answer => {
      if (!answer.quiz_question_id) return;
      
      // Find the question and its index in the quiz
      const questionIndex = quiz.questions.findIndex(q => q.id === answer.quiz_question_id);
      
      if (questionIndex === -1) return;
      
      // For multiple choice or true/false questions
      if (answer.selected_option_id) {
        // Find the option in the question
        const question = quiz.questions.find(q => q.id === answer.quiz_question_id);
        const option = question?.options.find(o => o.id === answer.selected_option_id);
        
        if (option) {
          prevAnswers[answer.quiz_question_id] = {
            questionId: answer.quiz_question_id,
            selected_option: {
              id: option.id,
              option_text: option.option_text
            },
            questionIndex: questionIndex,
            submitted: true
          };
        }
      } 
      // For essay questions
      else if (answer.answer_text) {
        prevAnswers[answer.quiz_question_id] = {
          questionId: answer.quiz_question_id,
          answer_text: answer.answer_text,
          questionIndex: questionIndex,
          submitted: true
        };
      }
    });
    
    return prevAnswers;
  }, [quiz?.questions]);
  
  // Start quiz attempt - memoized
  const startQuiz = useCallback(async () => {
    // Prevent starting if already started or in progress
    if (!quiz?.id || attemptStartedRef.current || apiCallInProgressRef.current || quizAttempt) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    apiCallInProgressRef.current = true;
    
    try {
      // Mark that we've started the attempt to prevent duplicate calls
      attemptStartedRef.current = true;
      
      const response = await quizService.startQuizAttempt(quiz.id);
      setQuizAttempt(response.data);
      
      // If the API response contains previous answers, load them
      if (response.data.answers && response.data.answers.length > 0) {
        const prevAnswers = loadPreviousAnswers(response.data);
        setAnswers(prevAnswers);
        
        // Navigate to the first unanswered question if available
        const answeredQuestionIds = Object.keys(prevAnswers).map(id => parseInt(id));
        const firstUnansweredIndex = quiz.questions.findIndex(
          q => !answeredQuestionIds.includes(q.id)
        );
        
        if (firstUnansweredIndex !== -1) {
          setCurrentQuestionIndex(firstUnansweredIndex);
        } else {
          // If all questions are answered, go to the last question
          setCurrentQuestionIndex(quiz.questions.length - 1);
        }
      } else {
        // If no previous answers, start from the first question
        setCurrentQuestionIndex(0);
      }
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to start quiz. Please try again.');
      // Reset the flag if there was an error
      attemptStartedRef.current = false;
    } finally {
      setIsLoading(false);
      apiCallInProgressRef.current = false;
    }
  }, [quiz?.id, quiz?.questions, quizAttempt, loadPreviousAnswers]);
  
  // Check if quiz ID has changed and reset state if needed
  useEffect(() => {
    if (quiz?.id !== quizIdRef.current) {
      // Clean up interval if it exists
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
      
      // Quiz has changed, reset everything
      quizIdRef.current = quiz?.id;
      attemptStartedRef.current = false;
      apiCallInProgressRef.current = false;
      previousAnswersLoadedRef.current = false;
      statusCheckScheduledRef.current = false;
      setQuizAttempt(null);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setIsSubmitting(false);
      setError(null);
      setIsLoading(false);
      setIsComplete(false);
      setResults(null);
    }
  }, [quiz?.id]);
  
  // Initialize quiz on first load, but only once
  useEffect(() => {
    // Only start the quiz if we haven't already started AND we don't have an attempt yet
    if (quiz && !quizAttempt && !isLoading && !attemptStartedRef.current && !apiCallInProgressRef.current) {
      startQuiz();
    }
    
    // Cleanup function
    return () => {
      // Clean up interval if it exists
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
        statusCheckIntervalRef.current = null;
      }
      
      if (!quiz) {
        // Only fully reset when component unmounts or quiz changes to null
        attemptStartedRef.current = false;
        apiCallInProgressRef.current = false;
        previousAnswersLoadedRef.current = false;
        statusCheckScheduledRef.current = false;
      }
    };
  }, [quiz, quizAttempt, isLoading, startQuiz]);
  
  // Function to manually set answers (used for loading previous answers)
  const setCustomAnswers = useCallback((customAnswers) => {
    setAnswers(customAnswers);
  }, []);
  
  // Function to manually set current question index
  const setCustomQuestionIndex = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  }, [totalQuestions]);
  
  // Submit answer for current question - no auto progression
  const submitAnswer = useCallback(async (answer) => {
    if (!quizAttempt || !currentQuestion || isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let response;
      
      // Handle different question types
      if (currentQuestion.question_type === 'essay') {
        response = await quizService.submitEssayAnswer(
          quizAttempt.id,
          currentQuestion.id,
          answer.text
        );
      } else {
        // Multiple choice or true/false
        response = await quizService.submitOptionAnswer(
          quizAttempt.id,
          currentQuestion.id,
          answer.optionId
        );
      }
      
      // Store the answer in local state using functional update pattern for better state handling
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          ...response.data,
          questionIndex: currentQuestionIndex
        }
      }));
      
      // Check if this was the last unanswered question via functional update pattern
      setAnswers(prevAnswers => {
        const updatedAnswers = {
          ...prevAnswers,
          [currentQuestion.id]: {
            ...response.data,
            questionIndex: currentQuestionIndex
          }
        };
        
        // If all questions are now answered, schedule a status check
        if (Object.keys(updatedAnswers).length === totalQuestions && !statusCheckScheduledRef.current) {
          statusCheckScheduledRef.current = true;
          
          // Wait a bit to let the backend process the completion
          setTimeout(async () => {
            try {
              // Check quiz status to see if backend has marked it complete
              const statusResponse = await quizService.getQuizAttempt(quizAttempt.id);
              
              if (statusResponse.data.is_completed) {
                setIsComplete(true);
                setResults(statusResponse.data);
                onComplete(statusResponse.data);
              } else {
                // Reset the flag if not completed yet, to allow for future checks
                statusCheckScheduledRef.current = false;
              }
            } catch (err) {
              statusCheckScheduledRef.current = false;
            }
          }, 2000);
        }
        
        return updatedAnswers;
      });
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to submit answer. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [quizAttempt, currentQuestion, currentQuestionIndex, isSubmitting, totalQuestions, onComplete]);
  
  // Move to next question
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentQuestionIndex, totalQuestions]);
  
  // Move to previous question
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentQuestionIndex]);
  
  // Jump to a specific question
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
      return true;
    }
    return false;
  }, [totalQuestions]);
  
  // Get answer for a specific question
  const getAnswerForQuestion = useCallback((questionId) => {
    return answers[questionId] || null;
  }, [answers]);
  
  // Check if current question has been answered - memoized
  const isCurrentQuestionAnswered = useCallback(() => {
    if (!currentQuestion) return false;
    
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    
    // For essay questions, check if the answer has been submitted, not just entered
    if (currentQuestion.question_type === 'essay') {
      return answer.isSubmitted === true;
    }
    
    // For multiple choice and true/false questions
    return !!answer.selected_option;
  }, [currentQuestion, answers]);
  
  // Calculate quiz progress - memoized
  const progress = useMemo(() => ({
    current: currentQuestionIndex + 1,
    total: totalQuestions,
    percentage: totalQuestions > 0 
      ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) 
      : 0,
    answered: Object.keys(answers).length,
    isFullyAnswered: Object.keys(answers).length === totalQuestions
  }), [currentQuestionIndex, totalQuestions, answers]);
  
  // Check quiz status periodically if all questions are answered but quiz is not marked complete
  useEffect(() => {
    // Clean up any existing interval first
    if (statusCheckIntervalRef.current) {
      clearInterval(statusCheckIntervalRef.current);
      statusCheckIntervalRef.current = null;
    }
    
    // If all questions are answered but quiz is not marked complete yet
    if (progress.isFullyAnswered && !isComplete && !statusCheckScheduledRef.current && quizAttempt) {
      statusCheckScheduledRef.current = true;
      
      // Set up an interval to check quiz status
      statusCheckIntervalRef.current = setInterval(async () => {
        try {
          // Check quiz status
          const statusResponse = await quizService.getQuizAttempt(quizAttempt.id);
          
          if (statusResponse.data.is_completed) {
            clearInterval(statusCheckIntervalRef.current);
            statusCheckIntervalRef.current = null;
            setIsComplete(true);
            setResults(statusResponse.data);
            onComplete(statusResponse.data);
          }
        } catch (err) {
          clearInterval(statusCheckIntervalRef.current);
          statusCheckIntervalRef.current = null;
          statusCheckScheduledRef.current = false;
        }
      }, 3000); // Check every 3 seconds
    }
    
    // Clean up interval when component unmounts
    return () => {
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
        statusCheckIntervalRef.current = null;
      }
    };
  }, [progress.isFullyAnswered, isComplete, quizAttempt, onComplete]);
  
  return {
    // State
    quizAttempt,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    isSubmitting,
    isLoading,
    error,
    isComplete,
    results,
    progress,
    
    // Actions - all properly memoized
    startQuiz,
    submitAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    getAnswerForQuestion,
    isCurrentQuestionAnswered,
    
    // Functions for quiz continuation
    setCustomAnswers,
    setCustomQuestionIndex,
    
    // Helper function for loading previous answers
    loadPreviousAnswers
  };
};

export default useQuiz;