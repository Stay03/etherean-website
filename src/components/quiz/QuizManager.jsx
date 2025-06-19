// src/components/quiz/QuizManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, CheckCircle, ArrowLeft, 
  Award, Info, Flag, Clock, HelpCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { QuizProvider } from '../../contexts/QuizContext';
import QuizHeader from './QuizHeader';
import ProgressBar from './navigation/ProgressBar';
import QuestionNavigator from './navigation/QuestionNavigator';
import QuizProgressSummary from './results/QuizProgressSummary';
import QuizAnswersList from './results/QuizAnswersList';
import QuestionCard from './questions/QuestionCard';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import EssayQuestion from './questions/EssayQuestion';
import CompletionBanner from './feedback/CompletionBanner';
import LoadingState from './shared/LoadingState';
import ErrorState from './shared/ErrorState';
import FlaggedQuestionsPanel from './navigation/FlaggedQuestionsPanel';
import FixedNavigationBar from './navigation/FixedNavigationBar';
import quizService from '../../services/api/quizService';
import quizProgressService from '../../services/api/quizProgressService';

/**
 * QuizManager - Main container component for the quiz experience
 * Now with fixed navigation bar at the bottom
 * 
 * @param {Object} props
 * @param {Object} props.quiz - Quiz data object
 * @param {Function} props.onComplete - Callback when quiz is completed
 * @param {Function} props.onReturn - Callback to return to previous screen
 * @param {string} props.courseSlug - The slug of the current course
 */
const QuizManager = ({ quiz, onComplete = () => {}, onReturn = () => {}, courseSlug }) => {
  return (
    <QuizProvider quiz={quiz} onComplete={onComplete}>
      <QuizManagerContent quiz={quiz} onComplete={onComplete} onReturn={onReturn} courseSlug={courseSlug} />
    </QuizProvider>
  );
};

/**
 * QuizManagerContent - Inner component that uses the quiz context
 */
const QuizManagerContent = ({ quiz, onComplete, onReturn, courseSlug }) => {
  // Use navigate for routing
  const navigate = useNavigate();
  
  // Local UI state
  const [activeTab, setActiveTab] = useState('quiz');
  // Show results state to control when to show results view
  const [showResults, setShowResults] = useState(false);
  const [showFlaggedPanel, setShowFlaggedPanel] = useState(false);
  const [completionNotice, setCompletionNotice] = useState(false);
  
  // Initialize quiz state
  const [quizState, setQuizState] = useState({
    quizAttempt: null,
    currentQuestion: null,
    currentQuestionIndex: 0,
    totalQuestions: quiz?.questions?.length || 0,
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
    elapsedTime: 0,
    finalElapsedTime: null,
    progress: {
      current: 1,
      total: quiz?.questions?.length || 0,
      answered: 0,
      percentage: 0,
      isFullyAnswered: false
    }
  });
  
  // Handle returning to the learn page
  const handleBackToLearn = useCallback(() => {
    // Get the current URL path
    const currentPath = window.location.pathname;
    
    // Extract the course slug from the current URL
    const match = currentPath.match(/\/course\/([^\/]+)/);
    const extractedSlug = match ? match[1] : null;
    
    if (extractedSlug) {
      // First, try to remove any existing lesson parameters from the URL
      const cleanUrl = `/course/${extractedSlug}/learn`;
      
      // Use window.history.pushState to directly modify the URL without triggering router events
      window.history.pushState({}, '', cleanUrl);
      
      // Then force a page reload to ensure we get a fresh state
      window.location.reload();
    } else {
      // If we can't determine the slug, fall back to default behavior
      console.error('Could not determine course slug from URL, using fallback');
      onReturn();
    }
  }, [onReturn]);
  
  // Destructure state for easier access
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
    progressData,
    isLoadingProgress,
    progressError,
    flaggedQuestions,
    elapsedTime,
    finalElapsedTime,
    progress
  } = quizState;
  
  // Timer effect for tracking elapsed time
  useEffect(() => {
    if (isComplete || showResults) {
      // Don't start or continue the timer if quiz is complete or showing results
      return;
    }
    
    const timerInterval = setInterval(() => {
      setQuizState(prev => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 1 // Increment by 1 second
      }));
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [isComplete, showResults]);
  
  // Initialize quiz on first render
  useEffect(() => {
    if (!quiz?.id) return;
    
    const initQuiz = async () => {
      setQuizState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
      
      try {
        // Start quiz attempt
        const response = await quizService.startQuizAttempt(quiz.id);
        
        // Process existing answers if any
        const existingAnswers = {};
        
        if (response.data.answers && response.data.answers.length > 0) {
          response.data.answers.forEach(answer => {
            if (!answer.quiz_question_id) return;
            
            // Find the question in the quiz data
            const question = quiz.questions.find(q => q.id === answer.quiz_question_id);
            if (!question) return;
            
            // Process based on question type
            if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
              const option = question.options.find(o => o.id === answer.selected_option_id);
              
              if (option) {
                existingAnswers[answer.quiz_question_id] = {
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
              existingAnswers[answer.quiz_question_id] = {
                questionId: answer.quiz_question_id,
                answer_text: answer.answer_text,
                isSubmitted: true,
                feedback: answer.feedback
              };
            }
          });
          
          // Navigate to first unanswered question if available
          const answeredIds = Object.keys(existingAnswers).map(id => parseInt(id));
          const firstUnansweredIndex = quiz.questions.findIndex(
            q => !answeredIds.includes(q.id)
          );
          
          const startingIndex = firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0;
          
          setQuizState(prev => ({
            ...prev,
            quizAttempt: response.data,
            answers: existingAnswers,
            currentQuestionIndex: startingIndex,
            currentQuestion: quiz.questions[startingIndex],
            isLoading: false,
            progress: {
              ...prev.progress,
              current: startingIndex + 1,
              answered: Object.keys(existingAnswers).length,
              percentage: quiz.questions.length 
                ? Math.round((Object.keys(existingAnswers).length / quiz.questions.length) * 100) 
                : 0,
              isFullyAnswered: Object.keys(existingAnswers).length === quiz.questions.length
            }
          }));
        } else {
          // No existing answers, start fresh
          setQuizState(prev => ({
            ...prev,
            quizAttempt: response.data,
            currentQuestion: quiz.questions[0],
            isLoading: false
          }));
        }
        
        // Fetch quiz progress
        fetchQuizProgress();
      } catch (err) {
        setQuizState(prev => ({
          ...prev,
          error: err.message || 'Failed to start quiz',
          isLoading: false
        }));
      }
    };
    
    initQuiz();
  }, [quiz]);
  
  // Fetch quiz progress data
  const fetchQuizProgress = async () => {
    if (!quiz?.id) return;
    
    try {
      const response = await quizProgressService.getQuizProgress(quiz.id);
      
      // Create a brand new object to ensure React detects the state change
      const freshData = JSON.parse(JSON.stringify(response.data));
      
      setQuizState(prev => ({
        ...prev,
        progressData: freshData,
        isLoadingProgress: false
      }));
      
      // If quiz is completed, show results view
      if (freshData?.is_completed) {
        // Set completion state and freeze the timer
        setQuizState(prev => ({
          ...prev,
          isComplete: true,
          results: freshData,
          // Store the final elapsed time
          finalElapsedTime: prev.elapsedTime
        }));
        
        // Show results view
        setShowResults(true);
        
        // Call the onComplete callback for any parent component handling
        onComplete(freshData);
      }
      
      return freshData;
    } catch (err) {
      setQuizState(prev => ({
        ...prev,
        progressError: err.message || 'Failed to fetch progress',
        isLoadingProgress: false
      }));
    }
  };
  
  // Submit answer for current question
  const submitAnswer = async (answer) => {
    if (!quizAttempt || !currentQuestion || isSubmitting) return;
    
    setQuizState(prev => ({
      ...prev,
      isSubmitting: true
    }));
    
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
      
      // Update answers and check for completion
      const updatedAnswers = {
        ...answers,
        [currentQuestion.id]: {
          ...response.data,
          questionId: currentQuestion.id,
          questionIndex: currentQuestionIndex
        }
      };
      
      const answeredCount = Object.keys(updatedAnswers).length;
      const isFullyAnswered = answeredCount === totalQuestions;
      
      setQuizState(prev => ({
        ...prev,
        answers: updatedAnswers,
        isSubmitting: false,
        progress: {
          ...prev.progress,
          answered: answeredCount,
          percentage: totalQuestions > 0 
            ? Math.round((answeredCount / totalQuestions) * 100) 
            : 0,
          isFullyAnswered
        }
      }));
      
      // If all questions are answered, check completion status
      if (isFullyAnswered && !completionNotice) {
        setCompletionNotice(true);
        
        // Schedule a progress check after a delay
        setTimeout(() => {
          fetchQuizProgress();
        }, 1500);
      }
      
      return response.data;
    } catch (err) {
      setQuizState(prev => ({
        ...prev,
        error: err.message || 'Failed to submit answer',
        isSubmitting: false
      }));
      throw err;
    }
  };
  
  // Navigation functions
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        currentQuestion: quiz.questions[prev.currentQuestionIndex + 1],
        progress: {
          ...prev.progress,
          current: prev.currentQuestionIndex + 2
        }
      }));
    }
  }, [currentQuestionIndex, totalQuestions, quiz]);
  
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        currentQuestion: quiz.questions[prev.currentQuestionIndex - 1],
        progress: {
          ...prev.progress,
          current: prev.currentQuestionIndex
        }
      }));
    }
  }, [currentQuestionIndex, quiz]);
  
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: index,
        currentQuestion: quiz.questions[index],
        progress: {
          ...prev.progress,
          current: index + 1
        }
      }));
    }
  }, [totalQuestions, quiz]);
  
  // Flag question functions
  const flagCurrentQuestion = useCallback(() => {
    if (!currentQuestion) return;
    
    setQuizState(prev => {
      const isAlreadyFlagged = prev.flaggedQuestions.includes(currentQuestion.id);
      const updatedFlags = isAlreadyFlagged
        ? prev.flaggedQuestions.filter(id => id !== currentQuestion.id)
        : [...prev.flaggedQuestions, currentQuestion.id];
      
      return {
        ...prev,
        flaggedQuestions: updatedFlags
      };
    });
  }, [currentQuestion]);
  
  const unflagQuestion = useCallback((questionId) => {
    setQuizState(prev => ({
      ...prev,
      flaggedQuestions: prev.flaggedQuestions.filter(id => id !== questionId)
    }));
  }, []);
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = useCallback(() => {
    if (!currentQuestion) return false;
    
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    
    // For essay questions, check if submitted
    if (currentQuestion.question_type === 'essay') {
      return answer.isSubmitted === true;
    }
    
    // For multiple choice or true/false
    return !!answer.selected_option;
  }, [currentQuestion, answers]);
  
  // Handle finding first unanswered question
  const handleFindUnanswered = useCallback(() => {
    if (!quiz?.questions) return;
    
    for (let i = 0; i < quiz.questions.length; i++) {
      const questionId = quiz.questions[i].id;
      if (!answers[questionId]) {
        goToQuestion(i);
        break;
      }
    }
  }, [quiz?.questions, answers, goToQuestion]);
  
  // Add useEffect that watches for showResults changes
  useEffect(() => {
    if (showResults && progressData === null) {
      // If we're showing results but don't have progress data yet, fetch it
      fetchQuizProgress();
    }
  }, [showResults]);
  
  // Check if quiz is complete
  useEffect(() => {
    if (progress.isFullyAnswered && !completionNotice) {
      setCompletionNotice(true);
      
      // Auto-refresh quiz progress after a delay
      const timer = setTimeout(() => {
        fetchQuizProgress().then(() => {
          // Force a re-render after fetching progress
          setQuizState(prev => ({...prev}));
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [progress.isFullyAnswered, completionNotice]);
  
  // Add useEffect that refreshes when progress data indicates completion
  useEffect(() => {
    if (progressData?.is_completed && !showResults) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progressData?.is_completed]);
  
  // Get current question's answer
  const currentQuestionAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  
  // Determine if current question is flagged
  const isCurrentQuestionFlagged = currentQuestion 
    ? flaggedQuestions.includes(currentQuestion.id) 
    : false;
  
  // Handle answer submission with auto-advance
  const handleSubmitAnswer = async (answer) => {
    if (isSubmitting) return;
    
    try {
      await submitAnswer(answer);
      
      // Auto-advance to next question after answering (with slight delay for feedback)
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          goToNextQuestion();
        }
      }, 600);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };
  
  // Add conditional rendering for showResults
  if (showResults) {
    // Use finalElapsedTime if available, otherwise use current elapsedTime
    const timeToShow = finalElapsedTime || elapsedTime;
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* <QuizHeader 
          title="Quiz Results"
          subtitle={quiz?.title || ""}
          onReturn={onReturn}
          showTimer={false}
        /> */}
        
        <div className="p-6">
          <QuizProgressSummary 
            progressData={progressData}
            isLoading={isLoadingProgress}
            error={progressError}
            elapsedTime={timeToShow}
          />
          
          <div className="mt-8">
            <QuizAnswersList progressData={progressData} />
          </div>
          
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToLearn} // Changed to use the new navigation function
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Lesson
            </motion.button>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading || !currentQuestion) {
    return <LoadingState message="Loading quiz..." />;
  }
  
  // Error state
  if (error) {
    return <ErrorState error={error} onReturn={onReturn} />;
  }
  
  // Determine if current question is answered
  const isAnswered = isCurrentQuestionAnswered();
  
  return (
    <div className="rounded-xl bg-white shadow-lg overflow-hidden">
      {/* <QuizHeader 
        title={quiz?.title || "Quiz"}
        subtitle={quiz?.description}
        onReturn={onReturn}
        elapsedTime={elapsedTime}
        showTimer
        /> */}
      
      <div className="p-6 pb-24">
        {/* Resuming quiz notification */}
        {quizAttempt?.answers && quizAttempt.answers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
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
          <CompletionBanner />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left side - Question navigator on larger screens */}
          <div className="hidden md:block">
            <QuestionNavigator 
              questions={quiz.questions}
              currentIndex={currentQuestionIndex}
              answers={answers}
              flaggedQuestions={flaggedQuestions}
              onSelectQuestion={goToQuestion}
            />
          </div>
          
          {/* Main quiz content */}
          <div className="md:col-span-3">
            {/* Flagged questions panel (conditionally rendered) */}
            {showFlaggedPanel && (
              <FlaggedQuestionsPanel 
                questions={quiz.questions}
                flaggedQuestions={flaggedQuestions}
                onSelectQuestion={goToQuestion}
                onClose={() => setShowFlaggedPanel(false)}
                unflagQuestion={unflagQuestion}
              />
            )}
            
            {/* Question content */}
            <QuestionCard
              question={currentQuestion}
              showFlagOption
              isFlagged={isCurrentQuestionFlagged}
              onToggleFlag={flagCurrentQuestion}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mt-4"
                >
                  {/* Question type-specific content */}
                  {(currentQuestion.question_type === 'multiple_choice' || 
                    currentQuestion.question_type === 'true_false') && (
                    <MultipleChoiceQuestion 
                      question={currentQuestion}
                      answer={currentQuestionAnswer}
                      isSubmitting={isSubmitting}
                      onSubmitAnswer={handleSubmitAnswer}
                    />
                  )}
                  
                  {currentQuestion.question_type === 'essay' && (
                    <EssayQuestion
                      question={currentQuestion}
                      answer={currentQuestionAnswer}
                      isSubmitting={isSubmitting}
                      onSubmitAnswer={handleSubmitAnswer}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </QuestionCard>
          </div>
        </div>
                
        {/* Mobile Question navigator (above fixed navigation) */}
        <div className="mt-8 mb-10 block md:hidden">
          <QuestionNavigator 
            questions={quiz.questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            flaggedQuestions={flaggedQuestions}
            onSelectQuestion={goToQuestion}
            variant="horizontal"
          />
        </div>
        
        {/* Quiz completion status */}
        {/* <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                {progress.answered} of {totalQuestions} questions answered
              </span>
            </div>
            
            <div className="text-sm">
              {currentQuestionIndex === totalQuestions - 1 && !progress.isFullyAnswered && (
                <div className="text-amber-700">
                  {`${totalQuestions - progress.answered} questions still need to be answered`}
                </div>
              )}
              
              {progress.isFullyAnswered && (
                <div className="text-green-700 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  All questions have been answered!
                </div>
              )}
            </div>
          </div>
        </div> */}
        
        {/* Find unanswered questions button - show only if there are unanswered questions */}
        {progress.answered < totalQuestions && (
          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFindUnanswered}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <HelpCircle className="h-4 w-4 mr-1.5" />
              Find unanswered questions
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Fixed Navigation Bar - always visible at bottom of screen */}
      <FixedNavigationBar 
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answeredQuestions={progress.answered}
        progressPercentage={progress.percentage}
        onPrevious={goToPreviousQuestion}
        onNext={goToNextQuestion}
      />
    </div>
  );
};

export default QuizManager;