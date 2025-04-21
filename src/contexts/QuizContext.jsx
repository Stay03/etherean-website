// src/contexts/QuizContext.jsx
import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import quizService from '../services/api/quizService';
import quizProgressService from '../services/api/quizProgressService';

// Create context
const QuizContext = createContext();

// Initial state
const initialState = {
  quizAttempt: null,
  currentQuestionIndex: 0,
  answers: {},
  isSubmitting: false,
  isLoading: true,
  error: null,
  isComplete: false,
  results: null,
  progressData: null,
  isLoadingProgress: false,
  progressError: null,
  flaggedQuestions: [],
  startTime: null,
  elapsedTime: 0,
  finalElapsedTime: null,
  // Add showResults state to control when to show results view
  showResults: false
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_QUIZ_ATTEMPT: 'SET_QUIZ_ATTEMPT',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_ANSWER: 'SET_ANSWER',
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_COMPLETE: 'SET_COMPLETE',
  SET_RESULTS: 'SET_RESULTS',
  SET_PROGRESS_DATA: 'SET_PROGRESS_DATA',
  SET_PROGRESS_LOADING: 'SET_PROGRESS_LOADING',
  SET_PROGRESS_ERROR: 'SET_PROGRESS_ERROR',
  TOGGLE_FLAG_QUESTION: 'TOGGLE_FLAG_QUESTION',
  UNFLAG_QUESTION: 'UNFLAG_QUESTION',
  UPDATE_ELAPSED_TIME: 'UPDATE_ELAPSED_TIME',
  SET_START_TIME: 'SET_START_TIME',
  RESET_STATE: 'RESET_STATE',
  // Add a new action type for showing results
  SET_SHOW_RESULTS: 'SET_SHOW_RESULTS',
  // Add action for freezing final elapsed time
  SET_FINAL_ELAPSED_TIME: 'SET_FINAL_ELAPSED_TIME'
};

// Reducer function
function quizReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ActionTypes.SET_QUIZ_ATTEMPT:
      return { 
        ...state, 
        quizAttempt: action.payload,
        isLoading: false,
      };
    
    case ActionTypes.SET_CURRENT_QUESTION:
      return { ...state, currentQuestionIndex: action.payload };
    
    case ActionTypes.SET_ANSWER:
      return { 
        ...state, 
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer
        }
      };
    
    case ActionTypes.SET_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    
    case ActionTypes.SET_COMPLETE:
      return { ...state, isComplete: action.payload };
    
    case ActionTypes.SET_RESULTS:
      return { ...state, results: action.payload };
    
    case ActionTypes.SET_PROGRESS_DATA:
      return { ...state, progressData: action.payload, isLoadingProgress: false };
    
    case ActionTypes.SET_PROGRESS_LOADING:
      return { ...state, isLoadingProgress: action.payload };
    
    case ActionTypes.SET_PROGRESS_ERROR:
      return { ...state, progressError: action.payload, isLoadingProgress: false };
    
    case ActionTypes.TOGGLE_FLAG_QUESTION:
      const questionId = action.payload;
      const isFlagged = state.flaggedQuestions.includes(questionId);
      
      return {
        ...state,
        flaggedQuestions: isFlagged
          ? state.flaggedQuestions.filter(id => id !== questionId)
          : [...state.flaggedQuestions, questionId]
      };
    
    case ActionTypes.UNFLAG_QUESTION:
      return {
        ...state,
        flaggedQuestions: state.flaggedQuestions.filter(id => id !== action.payload)
      };
    
    case ActionTypes.UPDATE_ELAPSED_TIME:
      return { ...state, elapsedTime: action.payload };
    
    case ActionTypes.SET_START_TIME:
      return { ...state, startTime: action.payload };
    
    case ActionTypes.SET_SHOW_RESULTS:
      return { ...state, showResults: action.payload };
    
    case ActionTypes.SET_FINAL_ELAPSED_TIME:
      return { ...state, finalElapsedTime: action.payload };
    
    case ActionTypes.RESET_STATE:
      return { 
        ...initialState,
        startTime: new Date(),
        elapsedTime: 0
      };
      
    default:
      return state;
  }
}

// Provider component
export const QuizProvider = ({ children, quiz, onComplete }) => {
  const [state, dispatch] = useReducer(quizReducer, {
    ...initialState,
    startTime: new Date(), // Initialize start time on mount
  });
  
// Timer effect for tracking elapsed time
useEffect(() => {
    if (!state.startTime || state.isComplete || state.showResults) {
      // Don't start or continue timer if:
      // - startTime is not set
      // - quiz is complete
      // - showing results view
      return;
    }
    
    const timerInterval = setInterval(() => {
      dispatch({ 
        type: ActionTypes.UPDATE_ELAPSED_TIME, 
        payload: state.elapsedTime + 1 // Increment by 1 second
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [state.startTime, state.isComplete, state.showResults, state.elapsedTime]);

  // Initialize quiz attempt
  useEffect(() => {
    if (!quiz?.id) return;
    
    const initQuiz = async () => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      try {
        const response = await quizService.startQuizAttempt(quiz.id);
        dispatch({ type: ActionTypes.SET_QUIZ_ATTEMPT, payload: response.data });
        
        // Load existing answers if any
        if (response.data.answers && response.data.answers.length > 0) {
          const existingAnswers = processExistingAnswers(response.data.answers, quiz);
          
          // Add each answer to state
          Object.entries(existingAnswers).forEach(([questionId, answer]) => {
            dispatch({ 
              type: ActionTypes.SET_ANSWER, 
              payload: { questionId: parseInt(questionId), answer } 
            });
          });
          
          // Navigate to first unanswered question if available
          const answeredIds = Object.keys(existingAnswers).map(id => parseInt(id));
          const firstUnansweredIndex = quiz.questions.findIndex(
            q => !answeredIds.includes(q.id)
          );
          
          if (firstUnansweredIndex !== -1) {
            dispatch({ 
              type: ActionTypes.SET_CURRENT_QUESTION, 
              payload: firstUnansweredIndex 
            });
          }
        }
      } catch (error) {
        dispatch({ 
          type: ActionTypes.SET_ERROR, 
          payload: error.message || 'Failed to start quiz' 
        });
      }
    };
    
    initQuiz();
    fetchQuizProgress(quiz.id);
    
    // Reset state when quiz changes
    return () => {
      dispatch({ type: ActionTypes.RESET_STATE });
    };
  }, [quiz?.id]);
  
  // Process existing answers from the attempt
  const processExistingAnswers = (answersList, quizData) => {
    const processedAnswers = {};
    
    answersList.forEach(answer => {
      if (!answer.quiz_question_id) return;
      
      // Find the question in the quiz data
      const question = quizData.questions.find(q => q.id === answer.quiz_question_id);
      if (!question) return;
      
      // Format the answer based on question type
      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        const option = question.options.find(o => o.id === answer.selected_option_id);
        
        if (option) {
          processedAnswers[answer.quiz_question_id] = {
            questionId: answer.quiz_question_id,
            selected_option: {
              id: option.id,
              option_text: option.option_text
            },
            is_correct: answer.is_correct,
            feedback: answer.feedback
          };
        }
      } else if (question.question_type === 'essay') {
        processedAnswers[answer.quiz_question_id] = {
          questionId: answer.quiz_question_id,
          answer_text: answer.answer_text,
          isSubmitted: true,
          feedback: answer.feedback
        };
      }
    });
    
    return processedAnswers;
  };
  
  // Fetch quiz progress data
  const fetchQuizProgress = async (quizId) => {
    if (!quizId) return;
    
    dispatch({ type: ActionTypes.SET_PROGRESS_LOADING, payload: true });
    
    try {
      const response = await quizProgressService.getQuizProgress(quizId);
      dispatch({ 
        type: ActionTypes.SET_PROGRESS_DATA, 
        payload: response.data 
      });
      
      // If quiz is already completed, show results view
      if (response.data?.is_completed) {
        // Freeze the elapsed time
        dispatch({ 
          type: ActionTypes.SET_FINAL_ELAPSED_TIME, 
          payload: state.elapsedTime 
        });
        
        dispatch({ type: ActionTypes.SET_COMPLETE, payload: true });
        dispatch({ type: ActionTypes.SET_RESULTS, payload: response.data });
        dispatch({ type: ActionTypes.SET_SHOW_RESULTS, payload: true });
        
        if (onComplete) {
          onComplete(response.data);
        }
      }
      
      return response.data;
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_PROGRESS_ERROR, 
        payload: error.message || 'Failed to fetch progress' 
      });
    }
  };
  
  // Submit an answer
  const submitAnswer = async (answer) => {
    if (!state.quizAttempt || !quiz.questions[state.currentQuestionIndex]) {
      return;
    }
    
    const currentQuestion = quiz.questions[state.currentQuestionIndex];
    dispatch({ type: ActionTypes.SET_SUBMITTING, payload: true });
    
    try {
      let response;
      
      // Handle different question types
      if (currentQuestion.question_type === 'essay') {
        response = await quizService.submitEssayAnswer(
          state.quizAttempt.id,
          currentQuestion.id,
          answer.text
        );
      } else {
        // Multiple choice or true/false
        response = await quizService.submitOptionAnswer(
          state.quizAttempt.id,
          currentQuestion.id,
          answer.optionId
        );
      }
      
      // Add answer to state
      dispatch({
        type: ActionTypes.SET_ANSWER,
        payload: {
          questionId: currentQuestion.id,
          answer: {
            ...response.data,
            questionId: currentQuestion.id,
            questionIndex: state.currentQuestionIndex
          }
        }
      });
      
      // Check if quiz is complete
      const answeredQuestions = Object.keys(state.answers).length + 1; // +1 for current answer
      if (answeredQuestions === quiz.questions.length) {
        // Schedule a check for quiz completion after a delay
        setTimeout(() => {
          fetchQuizProgress(quiz.id);
        }, 1000);
      }
      
      return response.data;
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: error.message || 'Failed to submit answer' 
      });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_SUBMITTING, payload: false });
    }
  };
  
  // Navigation functions
  const goToNextQuestion = () => {
    if (state.currentQuestionIndex < quiz.questions.length - 1) {
      dispatch({
        type: ActionTypes.SET_CURRENT_QUESTION,
        payload: state.currentQuestionIndex + 1
      });
    }
  };
  
  const goToPreviousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      dispatch({
        type: ActionTypes.SET_CURRENT_QUESTION,
        payload: state.currentQuestionIndex - 1
      });
    }
  };
  
  const goToQuestion = (index) => {
    if (index >= 0 && index < quiz.questions.length) {
      dispatch({
        type: ActionTypes.SET_CURRENT_QUESTION,
        payload: index
      });
    }
  };
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!quiz.questions[state.currentQuestionIndex]) return false;
    
    const questionId = quiz.questions[state.currentQuestionIndex].id;
    const answer = state.answers[questionId];
    
    if (!answer) return false;
    
    // For essay questions, check if submitted
    if (quiz.questions[state.currentQuestionIndex].question_type === 'essay') {
      return answer.isSubmitted === true;
    }
    
    // For multiple choice or true/false
    return !!answer.selected_option;
  };
  
  // Flag and unflag questions
  const flagCurrentQuestion = () => {
    if (!quiz.questions[state.currentQuestionIndex]) return;
    
    const questionId = quiz.questions[state.currentQuestionIndex].id;
    dispatch({
      type: ActionTypes.TOGGLE_FLAG_QUESTION,
      payload: questionId
    });
  };
  
  const unflagQuestion = (questionId) => {
    dispatch({
      type: ActionTypes.UNFLAG_QUESTION,
      payload: questionId
    });
  };

  // Show results view
  const showResults = () => {
    // Freeze the elapsed time first
    dispatch({
      type: ActionTypes.SET_FINAL_ELAPSED_TIME,
      payload: state.elapsedTime
    });
    
    dispatch({
      type: ActionTypes.SET_SHOW_RESULTS,
      payload: true
    });
  };
  
  // Calculate progress statistics
  const progress = useMemo(() => {
    const answeredCount = Object.keys(state.answers).length;
    
    return {
      current: state.currentQuestionIndex + 1,
      total: quiz?.questions?.length || 0,
      answered: answeredCount,
      percentage: quiz?.questions?.length 
        ? Math.round((answeredCount / quiz.questions.length) * 100) 
        : 0,
      isFullyAnswered: answeredCount === (quiz?.questions?.length || 0)
    };
  }, [state.answers, state.currentQuestionIndex, quiz?.questions?.length]);
  
  // Combine all values into a context value object
  const contextValue = {
    // State
    quizAttempt: state.quizAttempt,
    currentQuestion: quiz?.questions?.[state.currentQuestionIndex] || null,
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: quiz?.questions?.length || 0,
    answers: state.answers,
    isSubmitting: state.isSubmitting,
    isLoading: state.isLoading,
    error: state.error,
    isComplete: state.isComplete,
    results: state.results,
    progress,
    flaggedQuestions: state.flaggedQuestions,
    elapsedTime: state.elapsedTime,
    finalElapsedTime: state.finalElapsedTime,
    showResults: state.showResults,
    
    // Progress data
    progressData: state.progressData,
    isLoadingProgress: state.isLoadingProgress,
    progressError: state.progressError,
    
    // Actions
    submitAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    isCurrentQuestionAnswered,
    flagCurrentQuestion,
    unflagQuestion,
    refetchProgress: () => fetchQuizProgress(quiz?.id),
    showResults
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContext;