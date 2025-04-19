# Codebase Documentation

{
  "Extraction Date": "2025-04-19 01:25:57",
  "Include Paths": [
    "src/services/api/client.js",
    "src/services/api/endpoints.js",
    "src/services/api/quizService.js",
    "src/services/api/quizProgressService.js",
    "src/components/quiz/QuizManager.jsx",
    "src/components/quiz/QuizAnswersList.jsx",
    "src/components/quiz/QuizProgressSummary.jsx",
    "src/hooks/useQuizProgress.js",
    "src/hooks/useQuiz.js",
    "src/App.js"
  ]
}

### src/services/api/client.js
```
/**
 * Base API client for making HTTP requests
 * Centralizes request configuration and error handling
 */

const API_BASE_URL = 'http://localhost:8000/api';
// const API_BASE_URL = 'https://apimagic.xyz/ethereanAPI/api';

/**
 * Creates and returns API request options with proper headers
 * @param {Object} options - Request options
 * @returns {Object} - Configured request options
 */
const createRequestOptions = (options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  // Add authentication token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  return defaultOptions;
};

/**
 * Builds a URL with query parameters
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} - Full URL with query string
 */
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Add query parameters
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

/**
 * Handles API response
 * @param {Response} response - Fetch API response
 * @returns {Promise} - Resolved with data or rejected with error
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Create standardized error object
    const error = {
      status: response.status,
      statusText: response.statusText,
      message: data.message || 'An error occurred',
      errors: data.errors || {},
      data: data.data || null,
    };
    
    throw error;
  }
  
  return data;
};

/**
 * Makes a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const get = async (endpoint, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({ method: 'GET' });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const post = async (endpoint, data = {}, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const put = async (endpoint, data = {}, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`PUT request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const del = async (endpoint, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({ method: 'DELETE' });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`DELETE request failed for ${endpoint}:`, error);
    throw error;
  }
};

const apiClient = {
  get,
  post,
  put,
  delete: del,
};

export default apiClient;
```

### src/services/api/endpoints.js
```
/**
 * API endpoints definitions
 * Centralized location for all API endpoints used in the application
 */

const endpoints = {
  // Banner endpoints
  banners: {
    list: '/banners',
    get: (id) => `/banners/${id}`,
  },
  
  // Course endpoints
  courses: {
    list: '/courses',
    get: (id) => `/courses/${id}`,
    getBySlug: (slug) => `/courses/slug/${slug}`,
  },
  
  // Progress tracking endpoints
  progress: {
    startLesson: '/progress/start-lesson',
    completeLesson: '/progress/complete-lesson',
    getCourseProgress: (courseId) => `/progress/course/${courseId}`,
  },
  
  // Quiz endpoints
  quiz: {
    startAttempt: '/quiz-attempts',
    submitAnswer: '/quiz-answers',
    getProgress: (quizId) => `/quizzes/${quizId}/progress`,
  },
  
  // Add more endpoint categories as needed
  events: {
    list: '/events',
    get: (id) => `/events/${id}`,
  },
  
  // Authentication endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // User endpoints
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
  },
};

export default endpoints;
```

### src/services/api/quizService.js
```
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
```

### src/services/api/quizProgressService.js
```
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
```

### src/components/quiz/QuizManager.jsx
```
// src/components/quiz/QuizManager.jsx - Optimized version

import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, CheckCircle, ArrowLeft, Award, Info } from 'lucide-react';
import useQuiz from '../../hooks/useQuiz';
import useQuizProgress from '../../hooks/useQuizProgress';
import QuizProgressSummary from './QuizProgressSummary';
import QuizAnswersList from './QuizAnswersList';

// Memoized sub-components for better performance
const ProgressBar = memo(({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
));

const NavigationDots = memo(({ totalQuestions, currentQuestionIndex, answers, goToQuestion, quiz }) => (
  <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
    {Array.from({ length: totalQuestions }).map((_, index) => {
      const isCurrentQuestion = index === currentQuestionIndex;
      const questionId = quiz.questions[index].id;
      const isQuestionAnswered = !!answers[questionId];
      
      return (
        <motion.button
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => goToQuestion(index)}
          className={`h-8 w-8 rounded-full flex items-center justify-center focus:outline-none ${
            isCurrentQuestion 
              ? 'bg-amber-600 text-white' 
              : isQuestionAnswered 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {isQuestionAnswered ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <span className="text-xs font-medium">{index + 1}</span>
          )}
        </motion.button>
      );
    })}
  </div>
));

const MultipleChoiceQuestion = memo(({ 
  question, 
  answer, 
  isSubmitting, 
  handleSubmitAnswer 
}) => {
  const isAnswered = !!answer?.selected_option;
  
  return (
    <div className="space-y-3">
      {question.options.map(option => (
        <motion.button
          key={option.id}
          whileHover={{ scale: isAnswered ? 1 : 1.01 }}
          whileTap={{ scale: isAnswered ? 1 : 0.99 }}
          onClick={() => !isAnswered && handleSubmitAnswer({ optionId: option.id })}
          disabled={isSubmitting || isAnswered}
          className={`w-full text-left p-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
            answer?.selected_option?.id === option.id
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500 ring-offset-2'
              : isAnswered
                ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${
              answer?.selected_option?.id === option.id
                ? 'bg-amber-500 border-amber-500'
                : 'border-gray-400'
            }`}>
              {answer?.selected_option?.id === option.id && (
                <CheckCircle className="h-5 w-5 text-white" />
              )}
            </div>
            <span className="ml-3 text-gray-900 font-medium">{option.option_text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
});

const EssayQuestion = memo(({ 
  question, 
  answer, 
  isSubmitting, 
  handleSubmitAnswer,
  setCustomAnswers,
  answers,
  currentQuestionIndex
}) => {
  const isAnswered = answer?.isSubmitted === true;
  
  return (
    <div>
      <textarea
        className={`w-full p-3 border rounded-lg min-h-32 ${
          isAnswered 
            ? 'bg-gray-50 border-gray-200' 
            : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
        }`}
        placeholder="Enter your answer here..."
        value={answer?.answer_text || ''}
        onChange={(e) => {
          // Just update local preview, don't submit until button click
          const updatedAnswers = {
            ...answers,
            [question.id]: {
              ...answers[question.id],
              answer_text: e.target.value,
              questionIndex: currentQuestionIndex,
              isSubmitted: false
            }
          };
          setCustomAnswers(updatedAnswers);
        }}
        disabled={isSubmitting || isAnswered}
        readOnly={isAnswered}
      />
      <div className="mt-3 flex justify-end">
        <motion.button
          whileHover={{ scale: isAnswered ? 1 : 1.05 }}
          whileTap={{ scale: isAnswered ? 1 : 0.95 }}
          onClick={() => {
            if (!isAnswered && answer?.answer_text) {
              // Mark as submitted when the user clicks Save
              const updatedAnswers = {
                ...answers,
                [question.id]: {
                  ...answers[question.id],
                  isSubmitted: true
                }
              };
              setCustomAnswers(updatedAnswers);
              
              // Then submit to server
              handleSubmitAnswer({ text: answer.answer_text || '' });
            }
          }}
          disabled={isSubmitting || isAnswered || !answer?.answer_text}
          className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed'
              : isAnswered
                ? 'bg-green-500 cursor-not-allowed'
                : !answer?.answer_text
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {isSubmitting 
            ? 'Saving...' 
            : isAnswered 
              ? 'Saved' 
              : 'Save Answer'}
        </motion.button>
      </div>
    </div>
  );
});

/**
 * Enhanced Quiz Manager Component - Optimized for performance
 * Improved memoization, component splitting, and memory management
 */
const QuizManager = ({
  quiz,
  onComplete = () => {},
  onReturn = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('quiz');
  const [showResults, setShowResults] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [completionNotice, setCompletionNotice] = useState(false);
  
  // Initialize quiz hook with memoized callback
  const memoizedOnComplete = useCallback((data) => {
    onComplete(data);
  }, [onComplete]);
  
  const {
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
    
    submitAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    isCurrentQuestionAnswered,
    setCustomAnswers,
  } = useQuiz(quiz, memoizedOnComplete);
  
  // Fetch quiz progress data if quiz is complete or has an existing attempt
  const {
    progressData,
    isLoading: isLoadingProgress,
    error: progressError,
    refetchProgress
  } = useQuizProgress(quiz?.id);
  
  // Check if the quiz has existing completed data
  useEffect(() => {
    if (progressData?.data?.is_completed) {
      setShowResults(true);
    }
  }, [progressData]);
  
  // If quiz is completed during this session, show results
  useEffect(() => {
    if (isComplete && results) {
      setShowResults(true);
      refetchProgress(); // Refresh progress data when quiz is completed
    }
  }, [isComplete, results, refetchProgress]);
  
  // Detect if we're resuming a quiz based on existing answers
  useEffect(() => {
    if (quizAttempt?.answers && quizAttempt.answers.length > 0) {
      setIsResuming(true);
    } else {
      setIsResuming(false);
    }
  }, [quizAttempt]);
  
  // Check if all questions have been answered and show completion notice
  useEffect(() => {
    if (progress.isFullyAnswered && !showResults && !completionNotice) {
      setCompletionNotice(true);
      // Auto-refresh quiz progress after a short delay to get completion status from backend
      const timer = setTimeout(() => {
        refetchProgress();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [progress.isFullyAnswered, showResults, completionNotice, refetchProgress]);
  
  // Handle answer submission - memoized to prevent recreation
  const handleSubmitAnswer = useCallback(async (answer) => {
    if (isSubmitting) return;
    
    try {
      await submitAnswer(answer);
      
      // Auto-advance to next question after answering
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          goToNextQuestion();
        }
      }, 300);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  }, [isSubmitting, submitAnswer, currentQuestionIndex, totalQuestions, goToNextQuestion]);
  
  // Memoized handler for finding unanswered questions
  const handleFindUnanswered = useCallback(() => {
    if (!quiz?.questions) return;
    
    // Find first unanswered question
    for (let i = 0; i < quiz.questions.length; i++) {
      const questionId = quiz.questions[i].id;
      if (!answers[questionId]) {
        goToQuestion(i);
        break;
      }
    }
  }, [quiz?.questions, answers, goToQuestion]);
  
  // Get current question's answer - memoized
  const currentQuestionAnswer = useMemo(() => 
    currentQuestion ? answers[currentQuestion.id] : null,
  [currentQuestion, answers]);
  
  // If showing results view after completion
  if (showResults) {
    return (
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <button
              className={`pb-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                activeTab === 'quiz' 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('quiz')}
            >
              <Award className="mr-2 h-4 w-4" />
              Quiz Results
            </button>
            
            <button
              className={`pb-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                activeTab === 'answers' 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('answers')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Your Answers
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturn}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
          >
            <ArrowLeft className="mr-1.5 -ml-1 h-5 w-5" />
            Back to Lesson
          </motion.button>
        </div>
        
        {activeTab === 'quiz' && (
          <QuizProgressSummary 
            progressData={progressData} 
            isLoading={isLoadingProgress} 
            error={progressError} 
          />
        )}
        
        {activeTab === 'answers' && (
          <QuizAnswersList progressData={progressData} />
        )}
      </div>
    );
  }
  
  // Loading state
  if (isLoading || !currentQuestion) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-gray-600">Loading quiz...</p>
      </div>
    );
  }
  
// Error state
if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={onReturn}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <ArrowLeft className="mr-1.5 -ml-1 h-5 w-5" />
          Return to Lesson
        </button>
      </div>
    );
  }
  
  // Determine if current question is answered - use memoized value
  const isAnswered = isCurrentQuestionAnswered();
  
  return (
    <div className="p-6">
      {/* Resuming quiz notification */}
      {isResuming && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-100 flex items-start"
        >
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Resuming quiz:</span> You have already answered {Object.keys(answers).length} out of {totalQuestions} questions. Continue from where you left off.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Quiz completion notification */}
      {completionNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-md bg-green-50 border border-green-100 flex items-start"
        >
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-700">
              <span className="font-medium">Quiz complete!</span> You've answered all questions. Your results are being processed and will appear shortly.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>Question {progress.current} of {progress.total}</span>
          <span>{progress.answered} answered</span>
        </div>
        <ProgressBar percentage={progress.percentage} />
      </div>
      
      {/* Question content */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mb-8"
      >
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          {currentQuestion.question_text}
        </h3>
        
        {/* Question type-specific content using memoized components */}
        {currentQuestion.question_type === 'multiple_choice' && (
          <MultipleChoiceQuestion 
            question={currentQuestion}
            answer={currentQuestionAnswer}
            isSubmitting={isSubmitting}
            handleSubmitAnswer={handleSubmitAnswer}
          />
        )}
        
        {currentQuestion.question_type === 'true_false' && (
          <MultipleChoiceQuestion 
            question={currentQuestion}
            answer={currentQuestionAnswer}
            isSubmitting={isSubmitting}
            handleSubmitAnswer={handleSubmitAnswer}
          />
        )}
        
        {currentQuestion.question_type === 'essay' && (
          <EssayQuestion
            question={currentQuestion}
            answer={currentQuestionAnswer}
            isSubmitting={isSubmitting}
            handleSubmitAnswer={handleSubmitAnswer}
            setCustomAnswers={setCustomAnswers}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
          />
        )}
      </motion.div>
      
      {/* Navigation controls */}
      <div className="flex justify-between items-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
            currentQuestionIndex === 0
              ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="mr-1.5 -ml-1 h-5 w-5" />
          Previous
        </motion.button>
        
        {currentQuestionIndex < totalQuestions - 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextQuestion}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Next
            <ChevronRight className="ml-1.5 -mr-1 h-5 w-5" />
          </motion.button>
        )}
      </div>
      
      {/* Question navigation dots - using memoized component */}
      <div className="mt-8">
        <NavigationDots 
          totalQuestions={totalQuestions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          goToQuestion={goToQuestion}
          quiz={quiz}
        />
      </div>
      
      {/* Quiz completion status */}
      <div className="mt-8 bg-amber-50 border border-amber-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-sm font-medium text-amber-800">
              {progress.answered} of {totalQuestions} questions answered
            </span>
          </div>
          
          {currentQuestionIndex === totalQuestions - 1 && !progress.isFullyAnswered && (
            <div className="text-sm text-amber-700">
              {`${totalQuestions - progress.answered} questions still need to be answered`}
            </div>
          )}
          
          {progress.isFullyAnswered && (
            <div className="text-sm text-green-700 font-medium">
              All questions have been answered!
            </div>
          )}
        </div>
      </div>
      
      {/* Find unanswered questions button - show only if there are unanswered questions */}
      {progress.answered < totalQuestions && (
        <div className="mt-4 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFindUnanswered}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 underline"
          >
            Find unanswered questions
          </motion.button>
        </div>
      )}
    </div>
  );
};

// Wrap the component in React.memo for additional performance optimization
export default memo(QuizManager);
```

### src/components/quiz/QuizAnswersList.jsx
```
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, FileText, Edit, Clock } from 'lucide-react';

/**
 * Component to display detailed list of quiz answers
 * 
 * @param {Object} props
 * @param {Object} props.progressData - Quiz progress data from API
 */
const QuizAnswersList = ({ progressData }) => {
  // Log the progressData to see its structure
  console.log('QuizAnswersList received data:', progressData);
  
  if (!progressData || !progressData.attempt || !progressData.attempt.answers) {
    console.warn('Invalid answers data structure:', progressData);
    return null;
  }

  const { answers } = progressData.attempt;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-gray-600" />
          Answer Details
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {answers.map((answer, index) => (
          <AnswerItem key={answer.id} answer={answer} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Component to display a single answer item
 */
const AnswerItem = ({ answer, index }) => {
  const isMultipleChoice = answer.quiz_question.question_type === 'multiple_choice' || 
                           answer.quiz_question.question_type === 'true_false';
  const isEssay = answer.quiz_question.question_type === 'essay';
  const isEssayPendingGrading = isEssay && answer.graded_at === null;
  
  // Determine status icon and colors
  let StatusIcon = HelpCircle;
  let statusColor = 'text-gray-500';
  let bgColor = 'bg-gray-50';
  let borderColor = 'border-gray-200';
  let statusText = '';
  
  if (isMultipleChoice) {
    if (answer.is_correct === true) {
      StatusIcon = CheckCircle;
      statusColor = 'text-green-500';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      statusText = 'Correct';
    } else if (answer.is_correct === false) {
      StatusIcon = XCircle;
      statusColor = 'text-red-500';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      statusText = 'Incorrect';
    }
  } else if (isEssay) {
    if (isEssayPendingGrading) {
      StatusIcon = Clock;
      statusColor = 'text-amber-500';
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
      statusText = 'Pending Grading';
    } else {
      StatusIcon = Edit;
      statusColor = 'text-blue-500';
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-200';
      statusText = 'Graded';
    }
  }

  return (
    <div className={`p-4 ${bgColor} border-l-4 ${borderColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700">{index + 1}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h4 className="text-sm font-medium text-gray-900 mr-2">
              {answer.quiz_question.question_text}
            </h4>
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
              {answer.quiz_question.question_type === 'multiple_choice' 
                ? 'Multiple Choice' 
                : answer.quiz_question.question_type === 'true_false' 
                  ? 'True/False' 
                  : 'Essay'}
            </span>
            
            {/* Status badge - show for all questions */}
            {statusText && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                isMultipleChoice
                  ? answer.is_correct 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  : isEssayPendingGrading
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {statusText}
              </span>
            )}
          </div>
          
          <div className="mb-2">
            {isMultipleChoice ? (
              <div className="flex items-center">
                <StatusIcon className={`h-4 w-4 ${statusColor} mr-2`} />
                <span className="text-sm text-gray-700">
                  You answered: <span className="font-medium">{answer.selected_option?.option_text}</span>
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-1">
                  <StatusIcon className={`h-4 w-4 ${statusColor} mr-2`} />
                  <span className="text-sm text-gray-700">
                    {isEssayPendingGrading ? 'Essay Response (Pending Review)' : 'Essay Response'}
                  </span>
                </div>
                <div className="pl-6 mt-1 text-sm text-gray-700 border-l border-gray-200">
                  <p className="whitespace-pre-wrap">{answer.answer_text || 'No response provided'}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Show feedback if available */}
          {answer.feedback && (
            <div className="pl-6 mt-2 text-sm text-gray-600 italic">
              <p className="font-medium">Feedback:</p>
              <p>{answer.feedback}</p>
            </div>
          )}
          
          {/* For essay questions that are pending grading, show a message */}
          {isEssayPendingGrading && (
            <div className="pl-6 mt-2 flex items-center">
              <Clock className="h-4 w-4 text-amber-500 mr-2" />
              <p className="text-sm text-amber-600">
                This essay response is waiting to be graded by an instructor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAnswersList;
```

### src/components/quiz/QuizProgressSummary.jsx
```
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, CheckCircle, AlertTriangle, FileText, HelpCircle, ArrowRight } from 'lucide-react';

/**
 * Component to display quiz progress summary with robust data handling
 * 
 * @param {Object} props
 * @param {Object} props.progressData - Quiz progress data from API
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 * @param {Function} props.onContinue - Callback function when continue button is clicked
 */
const QuizProgressSummary = ({ progressData, isLoading, error, onContinue }) => {
  // Add console log to see exactly what data we're receiving
  console.log('QuizProgressSummary data received:', progressData);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-red-700">Error loading quiz progress: {error}</p>
        </div>
      </div>
    );
  }

  // FIXED: Check if the required properties exist directly on progressData
  // This fixes the issue where progressData doesn't have a 'data' property
  const hasValidData = progressData && 
                       typeof progressData.progress_percentage === 'number' &&
                       typeof progressData.total_questions === 'number' &&
                       typeof progressData.answered_questions === 'number' &&
                       typeof progressData.is_completed === 'boolean';
  
  if (!hasValidData) {
    console.warn('Invalid progress data structure:', progressData);
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <div className="flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-700">No progress data available</p>
        </div>
      </div>
    );
  }

  // Extract properties directly from progressData
  const { 
    progress_percentage,
    total_questions, 
    answered_questions, 
    is_completed, 
    fully_graded,
    has_essay_questions,
    essay_questions_pending_grading,
    current_score
  } = progressData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
    >
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-amber-600" />
          Quiz Progress Summary
        </h3>
      </div>

      <div className="p-4">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Completion: {progress_percentage}%
            </span>
            <span className="text-sm text-gray-500">
              {answered_questions}/{total_questions} questions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${is_completed ? 'bg-green-600' : 'bg-amber-600'}`}
              style={{ width: `${progress_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className={`p-3 rounded-lg border flex items-start ${is_completed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`p-2 rounded-full ${is_completed ? 'bg-green-100' : 'bg-amber-100'} mr-3`}>
              {is_completed ? 
                <CheckCircle className="h-5 w-5 text-green-600" /> : 
                <Clock className="h-5 w-5 text-amber-600" />
              }
            </div>
            <div>
              <h4 className={`text-sm font-medium ${is_completed ? 'text-green-800' : 'text-amber-800'}`}>
                {is_completed ? 'Quiz Completed' : 'Quiz In Progress'}
              </h4>
              <p className={`text-xs mt-1 ${is_completed ? 'text-green-700' : 'text-amber-700'}`}>
                {is_completed 
                  ? 'You have completed all questions in this quiz.' 
                  : `${total_questions - answered_questions} questions remaining.`}
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-lg border flex items-start ${fully_graded ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
            <div className={`p-2 rounded-full ${fully_graded ? 'bg-green-100' : 'bg-blue-100'} mr-3`}>
              <Award className={`h-5 w-5 ${fully_graded ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${fully_graded ? 'text-green-800' : 'text-blue-800'}`}>
                {fully_graded ? 'Fully Graded' : 'Grading Status'}
              </h4>
              <p className={`text-xs mt-1 ${fully_graded ? 'text-green-700' : 'text-blue-700'}`}>
                {has_essay_questions && essay_questions_pending_grading > 0 
                  ? `${essay_questions_pending_grading} essay question${essay_questions_pending_grading > 1 ? 's' : ''} pending review.` 
                  : fully_graded 
                    ? 'All questions have been graded.' 
                    : 'Multiple choice questions are graded automatically.'}
              </p>
            </div>
          </div>
        </div>



        {/* Score display */}
        {is_completed && (
          <div className="mt-5 text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Score</h4>
            <div className="inline-flex items-center justify-center p-4 bg-amber-50 rounded-full border border-amber-200">
              <span className="text-2xl font-bold text-amber-700">{current_score}%</span>
            </div>
            {has_essay_questions && essay_questions_pending_grading > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Note: Final score may change after essay questions are graded.
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizProgressSummary;
```

### src/hooks/useQuizProgress.js
```
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
```

### src/hooks/useQuiz.js
```
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
```

### src/App.js
```
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CourseLearnPage = lazy(() => import('./pages/CourseLearnPage'));
const MyItemsPage = lazy(() => import('./pages/MyItemsPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Create a wrapper component that will conditionally render the footer
const AppContent = () => {
  const location = useLocation();
  
  // Check if the current path is the learning page
  const isLearningPage = location.pathname.includes('/course/') && location.pathname.includes('/learn');
  
  return (
    <>
      {/* Header comes first at full width, outside any containers with padding */}
      <Header />
      
      {/* Main content div with padding */}
      <div className="bg-white p-4 sm:p-6 lg:p-6 min-h-screen">
        {/* White border container with rounded corners */}
        <div className="relative bg-gray-50 min-h-[calc(100vh-32px)] overflow-hidden rounded-[30px] ">
          <div className="relative font-questrial">
            {/* SVG for top-right corner rounded effect - laptop and desktop only */}
            <div className="absolute top-20 right-0 z-10 hidden lg:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M35 0V35C35 15.67 19.33 0 -1.53184e-05 0H35Z" fill="white"></path>
              </svg>
            </div>

            {/* Routes content with Suspense fallback */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:slug" element={<CourseDetailPage />} />
                <Route path="/course/:slug/learn" element={<CourseLearnPage />} />
                <Route path="/my-items" element={<MyItemsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
      
      {/* Conditionally render footer only when NOT on learning page */}
      {!isLearningPage && <Footer />}
      
      {/* Add ToastContainer for react-toastify */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
    <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
    <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
    <a 
      href="/"
      className="px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-300"
    >
      Return Home
    </a>
  </div>
);

export default App;
```

