// src/components/quiz/QuizManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, CheckCircle, ArrowLeft, 
  Award, Info, Flag, Clock, HelpCircle, AlertTriangle } from 'lucide-react';
import { QuizProvider } from '../../contexts/QuizContext';
import QuizHeader from './QuizHeader';
import ProgressBar from './navigation/ProgressBar';
import NavigationControls from './navigation/NavigationControls';
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
import quizService from '../../services/api/quizService';
import quizProgressService from '../../services/api/quizProgressService';

/**
 * QuizManager - Main container component for the quiz experience
 * 
 * @param {Object} props
 * @param {Object} props.quiz - Quiz data object
 * @param {Function} props.onComplete - Callback when quiz is completed
 * @param {Function} props.onReturn - Callback to return to previous screen
 */
const QuizManager = ({ quiz, onComplete = () => {}, onReturn = () => {} }) => {
  return (
    <QuizProvider quiz={quiz} onComplete={onComplete}>
      <QuizManagerContent quiz={quiz} onComplete={onComplete} onReturn={onReturn} />
    </QuizProvider>
  );
};

/**
 * QuizManagerContent - Inner component that uses the quiz context
 */
const QuizManagerContent = ({ quiz, onComplete, onReturn }) => {
  // Local UI state
  const [activeTab, setActiveTab] = useState('quiz');
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
    progress: {
      current: 1,
      total: quiz?.questions?.length || 0,
      answered: 0,
      percentage: 0,
      isFullyAnswered: false
    }
  });
  
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
    progress
  } = quizState;
  
  // Timer effect for tracking elapsed time
  useEffect(() => {
    const startTime = new Date();
    
    const timerInterval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000); // in seconds
      setQuizState(prev => ({
        ...prev,
        elapsedTime: elapsed
      }));
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, []);
  
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
    
    setQuizState(prev => ({
      ...prev,
      isLoadingProgress: true,
      progressError: null
    }));
    
    try {
      const response = await quizProgressService.getQuizProgress(quiz.id);
      
      setQuizState(prev => ({
        ...prev,
        progressData: response.data,
        isLoadingProgress: false
      }));
      
      // If quiz is already completed, show results
      if (response.data?.is_completed) {
        setShowResults(true);
        setQuizState(prev => ({
          ...prev,
          isComplete: true,
          results: response.data
        }));
        
        onComplete(response.data);
      }
      
      return response.data;
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
  
  // Handle showing results when quiz is completed
  useEffect(() => {
    if (progressData?.is_completed) {
      setShowResults(true);
    }
    
    if (isComplete && results) {
      setShowResults(true);
      fetchQuizProgress();
    }
  }, [isComplete, results, progressData]);
  
  // Check if quiz is complete
  useEffect(() => {
    if (progress.isFullyAnswered && !showResults && !completionNotice) {
      setCompletionNotice(true);
      
      // Auto-refresh quiz progress after a delay
      const timer = setTimeout(() => {
        fetchQuizProgress();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [progress.isFullyAnswered, showResults, completionNotice]);
  
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
  
  // If showing results view after completion
  if (showResults) {
    return (
      <div className="rounded-xl bg-white shadow-md overflow-hidden">
        <QuizHeader 
          title={quiz?.title || "Quiz Results"}
          subtitle={quiz?.description}
          onReturn={onReturn}
        />
        
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-6">
              <button
                className={`pb-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === 'quiz' 
                    ? 'border-blue-600 text-blue-700' 
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('quiz')}
              >
                <Award className="mr-2 h-4 w-4" />
                Quiz Results
              </button>
              
              <button
                className={`pb-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === 'answers' 
                    ? 'border-blue-600 text-blue-700' 
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('answers')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Your Answers
              </button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'quiz' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <QuizProgressSummary 
                  progressData={progressData} 
                  isLoading={isLoadingProgress} 
                  error={progressError}
                  elapsedTime={elapsedTime}
                />
              </motion.div>
            )}
            
            {activeTab === 'answers' && (
              <motion.div
                key="answers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <QuizAnswersList progressData={{ attempt: { answers: Object.values(answers) } }} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReturn}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <ArrowLeft className="mr-1.5 -ml-1 h-5 w-5" />
              Back to Lesson
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
      <QuizHeader 
        title={quiz?.title || "Quiz"}
        subtitle={quiz?.description}
        onReturn={onReturn}
        showTimer
        elapsedTime={elapsedTime}
      />
      
      <div className="p-6">
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
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span className="font-medium">Question {progress.current} of {progress.total}</span>
            <div className="flex items-center space-x-4">
              <span>{progress.answered} answered</span>
              {flaggedQuestions.length > 0 && (
                <button 
                  onClick={() => setShowFlaggedPanel(!showFlaggedPanel)}
                  className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  {flaggedQuestions.length} Flagged
                </button>
              )}
            </div>
          </div>
          <ProgressBar percentage={progress.percentage} />
        </div>
        
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
                
        {/* Navigation controls */}
        <div className="mt-8">
          <NavigationControls 
            currentIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onPrevious={goToPreviousQuestion}
            onNext={goToNextQuestion}
          />
        </div>
        
        {/* Mobile Question navigator */}
        <div className="mt-8 block md:hidden">
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
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
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
        </div>
        
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
    </div>
  );
};

export default QuizManager;