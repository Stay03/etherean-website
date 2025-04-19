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