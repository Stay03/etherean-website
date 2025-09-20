import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronLeft, ArrowLeft, ArrowRight, Award, Clock, AlertTriangle, FileText } from 'lucide-react';
import QuizManager from '../quiz/QuizManager';
import useQuizProgress from '../../hooks/useQuizProgress';
import QuizProgressSummary from '../quiz/QuizProgressSummary';
import QuizAnswersList from '../quiz/QuizAnswersList';

/**
 * SectionQuizViewer Component
 * A specialized component for viewing and taking section-level quizzes
 * Similar to LessonViewer but focused on section quiz experience
 */
const SectionQuizViewer = ({
  quiz,
  section,
  course,
  onBackToGrid,
  onNavigate,
  availableLessons = [],
  progressionEnabled = false,
  nextLesson,
  onQuizComplete = () => {}
}) => {
  const [quizMode, setQuizMode] = useState(false);
  const [isTransitioningToQuiz, setIsTransitioningToQuiz] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const pagePositionRef = useRef(0);
  const [isNavigating] = useState(false);
  
  // Fetch quiz progress data
  const {
    progressData: quizProgressData,
    hasAttempts: quizHasAttempts,
    isLoading: isLoadingQuizProgress,
    error: quizProgressError,
    refetchProgress: refetchQuizProgress
  } = useQuizProgress(quiz?.id);
  
  // Reset states when quiz changes
  useEffect(() => {
    if (quiz?.id) {
      setQuizMode(false);
      setIsTransitioningToQuiz(false);
      window.scrollTo(0, 0);
      refetchQuizProgress();
    }
  }, [quiz?.id, refetchQuizProgress]);
  
  // Function to safely enter quiz mode
  const enterQuizMode = (quizData) => {
    if (isTransitioningToQuiz || quizMode) return;
    
    setIsTransitioningToQuiz(true);
    
    setTimeout(() => {
      setQuizMode(true);
      setIsTransitioningToQuiz(false);
    }, 100);
  };
  
  // Handle quiz completion
  const handleQuizComplete = (results) => {
    // Show confetti animation
    setShowConfetti(true);
    
    // Notify parent component
    onQuizComplete(results);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  
  if (!quiz || !section || !course) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center shadow-sm"
      >
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h3 className="mt-4 text-xl font-semibold text-amber-800">No Quiz Selected</h3>
        <p className="mt-3 text-amber-700">
          Please select a section quiz from the sidebar to begin.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBackToGrid}
          className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Course
        </motion.button>
      </motion.div>
    );
  }

  // If in quiz mode, show the quiz manager
  if (quizMode) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md"
      >
        {showConfetti && <Confetti />}
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuizMode(false)}
                  className="mr-3 text-gray-500 hover:text-purple-600 transition-colors"
                  aria-label="Back to quiz overview"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <h1 className="text-xl font-bold text-gray-900 truncate" title={quiz.title}>
                  {quiz.title}
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Section Quiz: <span className="font-medium">{section.title}</span>
              </p>
            </div>
          </div>
        </div>
        
        <QuizManager 
          quiz={quiz}
          onComplete={handleQuizComplete}
          onReturn={() => setQuizMode(false)}
        />
      </motion.div>
    );
  }

  // Loading overlay for navigation
  const NavigationLoadingOverlay = () => (
    <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-lg font-medium text-purple-800">Loading quiz...</p>
      </div>
    </div>
  );
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md relative"
    >
      {/* Navigation Loading Overlay */}
      {isNavigating && <NavigationLoadingOverlay />}
      
      {showConfetti && <Confetti />}
      
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBackToGrid}
                className="mr-3 text-gray-500 hover:text-purple-600 transition-colors"
                aria-label="Back to course"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-xl font-bold text-gray-900 truncate" title={quiz.title}>
                {quiz.title}
              </h1>
              {quiz.complete && (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completed
                </motion.span>
              )}
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <FileText className="mr-1.5 h-4 w-4 text-purple-500" />
              <span className="font-medium">{section.title}</span>
              <span className="mx-2">•</span>
              <span>{course.product_info.title}</span>
              <span className="mx-2 text-purple-600">•</span>
              <span className="text-purple-600 font-medium">Section Quiz</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex flex-col">
        {/* Quiz Description */}
        {quiz.description && (
          <div className="p-6 border-b border-gray-100">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                About this quiz
              </h3>
              <div className="prose prose-purple max-w-none">
                <p className="text-gray-700">{quiz.description}</p>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Quiz Progress Summary */}
        <div className="px-6 py-6">
          {/* Show loading indicator while fetching data */}
          {isLoadingQuizProgress && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
          
          {/* Show quiz progress summary when data is available */}
          {!isLoadingQuizProgress && quizProgressData && (
            <>
              <QuizProgressSummary 
                progressData={quizProgressData}
                isLoading={false}
                error={quizProgressError}
              />
              
              {/* Only show answers list when we have attempt data */}
              {quizProgressData && quizProgressData.attempt && (
                <QuizAnswersList progressData={quizProgressData} />
              )}
            </>
          )}
          
          {/* Quiz Overview - Show when no progress data yet */}
          {(!quizProgressData || !quizProgressData.is_completed) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 flex-1"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="mx-auto h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                  {quizProgressData?.is_completed ? (
                    <Award className="h-10 w-10 text-green-500" />
                  ) : quizHasAttempts ? (
                    <Clock className="h-10 w-10 text-blue-500" />
                  ) : (
                    <FileText className="h-10 w-10 text-purple-500" />
                  )}
                </div>
              </motion.div>
              
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-gray-900 mb-2"
              >
                {quizProgressData?.is_completed
                  ? "Quiz Completed"
                  : quizHasAttempts
                    ? "Continue Your Quiz"
                    : "Ready to Test Your Knowledge?"}
              </motion.h3>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6 max-w-md mx-auto"
              >
                {quizProgressData?.is_completed
                  ? "You've completed this section quiz. Review your answers and results below."
                  : quizHasAttempts
                    ? "You've already started this quiz. You can continue where you left off!"
                    : `This section quiz covers the material from ${section.title}. Test your understanding and knowledge.`}
              </motion.p>
              
              {/* Quiz Stats */}
              {quiz.questions && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-purple-50 rounded-lg p-4 mb-6 max-w-md mx-auto"
                >
                  <div className="flex justify-center items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{quiz.questions.length}</div>
                      <div className="text-sm text-purple-700">Questions</div>
                    </div>
                    {quizProgressData && quizProgressData.data && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {quizProgressData.data.progress_percentage}%
                        </div>
                        <div className="text-sm text-purple-700">Progress</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Quiz Action Button */}
          <div className="text-center my-8">
            {!quizProgressData?.is_completed && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!quizMode && !isTransitioningToQuiz) {
                    pagePositionRef.current = window.scrollY;
                    enterQuizMode(quiz);
                  }
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                disabled={isNavigating}
              >
                {quizHasAttempts ? "Continue Quiz" : "Start Quiz"}
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </motion.button>
            )}
          </div>
          
          {/* Navigation Buttons - Show when quiz is completed */}
          {quizProgressData?.is_completed && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackToGrid}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                disabled={isNavigating}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </motion.button>
              
              {nextLesson ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Find the section containing the next lesson
                    const nextSection = course.sections.find(section => 
                      section.lessons.some(lesson => lesson.id === nextLesson.id)
                    );
                    
                    if (nextSection) {
                      onNavigate(nextLesson, nextSection);
                    }
                  }}
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                  disabled={isNavigating}
                >
                  Next Lesson
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToGrid}
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                  disabled={isNavigating}
                >
                  Course Complete
                  <Award className="ml-2 h-4 w-4" />
                </motion.button>
              )}
            </div>
          )}
          
          {/* Add padding at the bottom */}
          <div className="pb-20"></div>
        </div>
      </div>
    </motion.div>
  );
};

// Confetti animation component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 100 }).map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-purple-500 rounded-full"
            initial={{ 
              x: 0, 
              y: 0,
              opacity: 1 
            }}
            animate={{ 
              x: Math.random() * 800 - 400, 
              y: Math.random() * 800 - 200,
              opacity: 0,
              scale: Math.random() * 2
            }}
            transition={{ 
              duration: 2 + Math.random() * 3,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              backgroundColor: ['#9333EA', '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionQuizViewer;