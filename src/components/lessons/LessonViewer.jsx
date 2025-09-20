import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, 
         Play, FileText, ArrowLeft, ArrowRight, Award, Clock, AlertTriangle } from 'lucide-react';
import lessonService from '../../services/api/lessonService';
import QuizManager from '../quiz/QuizManager';
import useQuizProgress from '../../hooks/useQuizProgress';
import QuizProgressSummary from '../quiz/QuizProgressSummary';
import QuizAnswersList from '../quiz/QuizAnswersList';

/**
 * Enhanced LessonViewer Component
 * A modern, interactive UI for viewing lesson content with improved UX
 * Features:
 * - Smooth animations and transitions
 * - Responsive design with improved mobile experience
 * - Enhanced progress tracking and visualization with fixed progress bar
 * - Improved quiz experience integration with progress tracking
 * - Accessibility improvements
 * - Fixed video position with naturally flowing content
 * - Uses main app scrolling without nested scrollable areas
 * - Fixed footer and progress bar at bottom of viewport
 * - Loading indicator for lesson navigation
 */
const LessonViewer = ({
  lesson,
  section,
  course,
  onBackToGrid,
  onNavigate,
  availableLessons = [],
  progressionEnabled = false,
  nextLesson,
  onLessonComplete = () => {},
  onQuizComplete = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [expanded, setExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isTransitioningToQuiz, setIsTransitioningToQuiz] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const pagePositionRef = useRef(0);
  const contentRef = useRef(null);
  const [isNavigating, setIsNavigating] = useState(false); // Track lesson navigation state
  const previousLessonIdRef = useRef(lesson?.id); // Store previous lesson id for comparison
  
  // Fetch quiz progress data if we're in quiz tab
  const {
    progressData: quizProgressData,
    hasAttempts: quizHasAttempts,
    isLoading: isLoadingQuizProgress,
    error: quizProgressError,
    refetchProgress: refetchQuizProgress
  } = useQuizProgress(
    activeTab === 'quiz' && lesson?.quizzes?.length > 0 
      ? lesson.quizzes[0].id 
      : null
  );
  
  // Reset to content tab when lesson changes and handle navigation state
  useEffect(() => {
    // If lesson ID changed, we're navigating between lessons
    if (lesson?.id && previousLessonIdRef.current !== lesson.id) {
      setIsNavigating(true); // Set navigation loading state
      
      // Simulating content loading time
      const navigationTimer = setTimeout(() => {
        setIsNavigating(false); // Turn off loading state after content loads
        window.scrollTo(0, 0); // Scroll to top for new lesson
      }, 700); // Adjust timing based on your needs
      
      // Update previous lesson id
      previousLessonIdRef.current = lesson.id;
      
      // Reset states
      setActiveTab('content');
      setQuizMode(false);
      setCurrentQuiz(null);
      setIsTransitioningToQuiz(false);
      
      // Track that user started the lesson
      trackLessonStart(lesson.id);
      
      return () => clearTimeout(navigationTimer);
    } else if (lesson?.id) {
      // For initial load
      trackLessonStart(lesson.id);
      previousLessonIdRef.current = lesson.id;
    }
  }, [lesson?.id]);

  // Track scroll progress based on main window scroll
  const [readProgress, setReadProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const element = contentRef.current;
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // Calculate how far down the page we've scrolled as a percentage
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      // If lesson content is in view, also factor in how much of it is visible
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        // How much of the element has passed through the viewport
        const visiblePercent = Math.min(
          ((windowHeight - elementTop) / elementHeight) * 100, 
          100
        );
        
        // Use a weighted approach that favors overall scroll progress
        // but also considers content visibility
        const weightedProgress = (scrollPercent * 0.7) + (visiblePercent * 0.3);
        setReadProgress(Math.min(Math.max(weightedProgress, 0), 100));
      } else {
        // If lesson content isn't in view yet, just use scroll position
        setReadProgress(Math.min(Math.max(scrollPercent, 0), 100));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial calculation
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);
  
  // Track that user started the lesson
  const trackLessonStart = async (lessonId) => {
    try {
      await lessonService.startLesson(lessonId);
    } catch (error) {
      console.error('Error tracking lesson start:', error);
    }
  };
  
  // Function to safely enter quiz mode and prevent duplicate transitions
  const enterQuizMode = (quizData) => {
    if (isTransitioningToQuiz || quizMode) return;
    
    setIsTransitioningToQuiz(true);
    
    setTimeout(() => {
      setCurrentQuiz(quizData);
      setQuizMode(true);
      setIsTransitioningToQuiz(false);
    }, 100);
  };
  
  // Check if the current quiz has been started by the user
  const isQuizStarted = (quiz) => {
    if (!quiz || !quiz.questions) return false;
    return quiz.questions.some(question => question.user_answer != null);
  };
  
  // Get the number of answered questions for the current quiz
  const getAnsweredQuestionsCount = (quiz) => {
    if (!quiz || !quiz.questions) return 0;
    return quiz.questions.filter(question => question.user_answer != null).length;
  };

  // Handle tab change with scroll position preservation
  const handleTabChange = (tabName) => {
    pagePositionRef.current = window.scrollY;
    setActiveTab(tabName);
    
    // If changing to quiz tab, refresh quiz progress data
    if (tabName === 'quiz' && lesson?.quizzes?.length > 0) {
      refetchQuizProgress();
    }
    
    setTimeout(() => {
      window.scrollTo(0, pagePositionRef.current);
    }, 10);
  };

  // Custom navigation handler to show loading state
  const handleNavigate = (targetLesson, targetSection, targetQuiz = null) => {
    setIsNavigating(true);
    
    // Call the parent navigation handler
    onNavigate(targetLesson, targetSection, targetQuiz);
  };
  
  // Check if a lesson is available (for progression)
  const isLessonAvailable = (lessonId) => {
    if (!progressionEnabled) return true;
    return availableLessons.some(lesson => lesson.id === lessonId);
  };
  
  // Find next and previous lessons
  const getAdjacentLessons = () => {
    // Create a combined list of lessons and section quizzes
    const allItems = [];
    course.sections.forEach(section => {
      // Add lessons
      (section.lessons || []).forEach(lesson => {
        allItems.push({
          ...lesson,
          sectionId: section.id,
          section: section,
          type: 'lesson'
        });
      });
      
      // Add section quizzes if they exist
      (section.quizzes || []).forEach(quiz => {
        allItems.push({
          ...quiz,
          sectionId: section.id,
          section: section,
          type: 'section_quiz',
          isQuiz: true
        });
      });
    });
    
    const currentIndex = allItems.findIndex(item => item.id === lesson.id && item.type === 'lesson');
    
    // Find actual next/previous items regardless of progression status
    const actualPrevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
    const actualNextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
    
    // Find progression-aware next/previous items
    let prevItem = actualPrevItem;
    let nextItem = actualNextItem;
    
    if (progressionEnabled) {
      if (prevItem && prevItem.type === 'lesson' && !isLessonAvailable(prevItem.id)) {
        prevItem = null;
      }
      
      if (nextItem && nextItem.type === 'lesson' && !isLessonAvailable(nextItem.id)) {
        nextItem = null;
      }
      
      // For quizzes, we need to check if the section is available
      if (nextItem && nextItem.type === 'section_quiz') {
        // Check if the section containing this quiz is available
        const sectionAvailable = availableLessons.some(l => l.sectionId === nextItem.sectionId);
        if (!sectionAvailable) {
          nextItem = null;
        }
      }
    }
    
    // Separate lessons from other items for backward compatibility
    const actualPrevLesson = actualPrevItem && actualPrevItem.type === 'lesson' ? actualPrevItem : null;
    const actualNextLesson = actualNextItem && actualNextItem.type === 'lesson' ? actualNextItem : null;
    const prevLesson = prevItem && prevItem.type === 'lesson' ? prevItem : null;
    const nextLesson = nextItem && nextItem.type === 'lesson' ? nextItem : null;
    
    return { 
      prev: prevLesson, 
      next: nextLesson,
      actualPrev: actualPrevLesson,
      actualNext: actualNextLesson,
      isLastLesson: currentIndex === allItems.length - 1 || 
        (currentIndex === allItems.length - 2 && allItems[allItems.length - 1]?.type === 'section_quiz')
    }
  };
  
  const { prev, next: adjacentNext, actualNext, isLastLesson } = getAdjacentLessons();
  
  // Use the nextLesson from props if available, otherwise use the adjacent next
  // Make sure to recalculate this when nextLesson changes
  const nextItem = useMemo(() => nextLesson || adjacentNext, [nextLesson, adjacentNext]);
  
  if (!lesson || !section || !course) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center shadow-sm"
      >
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h3 className="mt-4 text-xl font-semibold text-amber-800">No Lesson Selected</h3>
        <p className="mt-3 text-amber-700">
          Please select a lesson from the sidebar or grid view to begin learning.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBackToGrid}
          className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Grid View
        </motion.button>
      </motion.div>
    );
  }

  // Handle completing the lesson
  const handleCompleteLesson = async () => {
    if (isCompleting || lesson.complete) return;
    
    setIsCompleting(true);
    setCompletionError(null);
    
    try {
      await lessonService.markLessonComplete(lesson.id);
      
      lesson.complete = true;
      onLessonComplete(lesson.id);
      
      // Show confetti animation for completion
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      if (lesson.quizzes && lesson.quizzes.length > 0) {
        setTimeout(() => {
          enterQuizMode(lesson.quizzes[0]);
        }, 1000);
      } else {
        if (nextItem) {
          setTimeout(() => {
            handleNavigate(nextItem, nextItem.section);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      setCompletionError('Failed to mark lesson as complete. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    // Show confetti animation
    setShowConfetti(true);
    
    // Call the onQuizComplete callback to refresh course data
    onQuizComplete(lesson.id);
    
    // We no longer need to navigate away immediately since
    // the QuizManager now shows the results view automatically
    
    setTimeout(() => {
      setShowConfetti(false);
      
      // After confetti animation, if there's a next lesson we can offer to navigate to it
      if (nextItem) {
        // Instead of automatically navigating, we could show a prompt or button
        // Or we can keep the automatic navigation with a longer delay
        // since the user now has time to view the results first
        
        // Option 1: Longer delay before auto-navigation
        setTimeout(() => {
          handleNavigate(nextItem, nextItem.section);
        }, 5000);  // Give user 5 seconds to see results before navigating
        
        // Option 2: Or remove auto-navigation and let user choose when to continue
        // The QuizManager's results view already has a "Return to Lesson" button
      }
      // Removed the else block that would set quizMode to false
      // since we're now showing results view inside QuizManager
    }, 2000);
  };
  
  // Extract YouTube video ID if present
  const getVideoEmbedUrl = () => {
    if (!lesson.video_url) return null;
    
    try {
      // YouTube handling
      if (lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be')) {
        let videoId = '';
        
        if (lesson.video_url.includes('v=')) {
          videoId = lesson.video_url.split('v=')[1].split('&')[0];
        } else if (lesson.video_url.includes('youtu.be')) {
          videoId = lesson.video_url.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?rel=0`;
        }
      }
      
      // Vimeo handling
      if (lesson.video_url.includes('vimeo.com')) {
        // Handle URLs with path parameters like: vimeo.com/1059520688/76e33ebd54
        const complexVimeoRegex = /vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/;
        const complexMatch = lesson.video_url.match(complexVimeoRegex);
        
        if (complexMatch && complexMatch[1] && complexMatch[2]) {
          return `https://player.vimeo.com/video/${complexMatch[1]}?h=${complexMatch[2]}&title=0&byline=0&portrait=0&badge=0&autopause=0`;
        }
        
        // Handle standard URLs like: vimeo.com/12345678
        const standardVimeoRegex = /vimeo\.com\/(\d+)/;
        const standardMatch = lesson.video_url.match(standardVimeoRegex);
        
        if (standardMatch && standardMatch[1]) {
          return `https://player.vimeo.com/video/${standardMatch[1]}?title=0&byline=0&portrait=0&badge=0&autopause=0`;
        }
        
        // If the URL already contains the embed format, return it directly with essential parameters
        if (lesson.video_url.includes('player.vimeo.com/video/')) {
          // Add essential parameters if they're not already present
          const url = new URL(lesson.video_url);
          url.searchParams.set('title', '0');
          url.searchParams.set('byline', '0');
          url.searchParams.set('portrait', '0');
          url.searchParams.set('badge', '0');
          url.searchParams.set('autopause', '0');
          return url.toString();
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };
  
  // Then in your JSX, replace all instances of youtubeEmbedUrl with videoEmbedUrl:
  const videoEmbedUrl = getVideoEmbedUrl();
 
  
  
  // Determine if the current quiz has been started but not completed
  const currentQuizStarted = lesson.quizzes && lesson.quizzes.length > 0 
    ? isQuizStarted(lesson.quizzes[0]) 
    : false;
  
  // Get the number of answered questions for the first quiz
  const answeredQuestionsCount = lesson.quizzes && lesson.quizzes.length > 0 
    ? getAnsweredQuestionsCount(lesson.quizzes[0]) 
    : 0;
  
  const totalQuestionsCount = lesson.quizzes && lesson.quizzes.length > 0 
    ? lesson.quizzes[0].questions.length 
    : 0;
  
  // If in quiz mode, show the quiz manager
  if (quizMode && currentQuiz) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md"
      >
        {showConfetti && <Confetti />}
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuizMode(false)}
                    className="mr-3 text-gray-500 hover:text-amber-600 transition-colors"
                    aria-label="Back to lesson"
                  >
                    {/* <ChevronLeft className="w-5 h-5" /> */}
                  </motion.button>
                <h1 className="text-xl font-bold text-gray-900 truncate" title={currentQuiz.title}>
                  {currentQuiz.title}
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                From: <span className="font-medium">{lesson.title}</span>
              </p>
            </div>
          </div>
        </div>
        
        <QuizManager 
          quiz={currentQuiz}
          onComplete={handleQuizComplete}
          onReturn={() => setQuizMode(false)}
        />
      </motion.div>
    );
  }

  // Loading overlay for lesson navigation
  const NavigationLoadingOverlay = () => (
    <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
        <p className="text-lg font-medium text-amber-800">Loading lesson content...</p>
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
      
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onBackToGrid}
                  className="mr-3 text-gray-500 hover:text-amber-600 transition-colors"
                  aria-label="Back to grid view"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              <h1 className="text-xl font-bold text-gray-900 truncate" title={lesson.title}>
                {lesson.title}
              </h1>
              {lesson.complete && (
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
              <BookOpen className="mr-1.5 h-4 w-4 text-amber-500" />
              <span className="font-medium">{section.title}</span>
              <span className="mx-2">•</span>
              <span>{course.title}</span>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex space-x-2">
            {prev && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(prev, prev.section)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                  disabled={isNavigating}
                >
                  <ChevronLeft className="mr-1.5 -ml-1 h-5 w-5" />
                  Previous Lesson
                </motion.button>
            )}
            
            {nextItem && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(nextItem, nextItem.section)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                  disabled={isNavigating}
                >
                  Next
                  <ChevronRight className="ml-1.5 -mr-1 h-5 w-5" />
                </motion.button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs - only show quiz tab if there are quizzes */}
      {lesson.quizzes && lesson.quizzes.length > 0 ? (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                ${activeTab === 'content' 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => handleTabChange('content')}
              disabled={isNavigating}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Lesson Content
            </button>
            
            <button
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                ${activeTab === 'quiz' 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => handleTabChange('quiz')}
              disabled={isNavigating}
            >
              <FileText className="mr-2 h-4 w-4" />
              Quiz
              <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-green-100 text-green-800">
                {lesson.quizzes.length}
              </span>
              
              {/* Show quiz complete badge if the quiz is marked as complete in the lesson data */}
              {lesson.quizzes[0].complete && (
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-green-100 text-green-800">
                  <CheckCircle className="inline-block h-3 w-3 mr-1" />
                  Complete
                </span>
              )}
              
              {/* Show progress badge if in progress */}
              {!lesson.quizzes[0].complete && quizHasAttempts && quizProgressData?.data?.progress_percentage > 0 && (
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-blue-100 text-blue-800">
                  {quizProgressData.data.progress_percentage}%
                </span>
              )}
            </button>
          </nav>
        </div>
      ) : null}
      
      {/* Content Section */}
      {activeTab === 'content' && (
        <div ref={contentRef} className="flex flex-col">
          {/* Video Content */}
          {videoEmbedUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 pb-0"
            >
              <div className="relative pt-[56.25%] rounded-xl overflow-hidden shadow-md">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={videoEmbedUrl}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          )}
          
          {/* Text Content */}
          <div className="p-6">
            {/* Description */}
            {lesson.description && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-amber-500" />
                  About this lesson
                </h3>
                <div className={`prose prose-amber ${expanded ? '' : 'max-h-32 overflow-hidden relative'}`}>
                  <p className="text-gray-700">{lesson.description}</p>
                  {!expanded && lesson.description.length > 150 && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white"></div>
                  )}
                </div>
                
                {lesson.description.length > 150 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center transition-colors"
                    disabled={isNavigating}
                  >
                    {expanded ? 'Show less' : 'Show more'}
                    {expanded ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                    }
                  </motion.button>
                )}
              </motion.div>
            )}
            
            {/* Content */}
            {lesson.content && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-amber-500" />
                  Lesson Content
                </h3>
                <div 
                  className="prose prose-amber max-w-none prose-headings:text-amber-900 prose-a:text-amber-600 prose-strong:text-amber-700 prose-table:table-auto prose-thead:border-amber-500 prose-th:border-amber-300 prose-td:border-gray-200"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </motion.div>
            )}
            
            {/* Progress tracking information */}
            {progressionEnabled && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`p-4 mt-8 rounded-lg ${
                  lesson.complete ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${lesson.complete ? 'bg-green-100' : 'bg-amber-100'}`}>
                    {lesson.complete ? 
                      <CheckCircle className="h-6 w-6 text-green-500" /> : 
                      <Play className="h-6 w-6 text-amber-500" />
                    }
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${lesson.complete ? 'text-green-800' : 'text-amber-800'}`}>{lesson.complete ? 'Lesson Completed' : 'Mark as Complete to Progress'}
                    </h3>
                    <div className={`mt-2 text-sm ${lesson.complete ? 'text-green-700' : 'text-amber-700'}`}>
                      {lesson.complete ? (
                        lesson.quizzes && lesson.quizzes.length > 0 ? (
                          <p>You have completed this lesson. Take the quiz to test your knowledge.</p>
                        ) : (
                          <p>You have completed this lesson. Continue to the next lesson to progress in the course.</p>
                        )
                      ) : (
                        <p>Complete this lesson to unlock the next content in this course.</p>
                      )}
                    </div>
                    
                    {lesson.complete && lesson.quizzes && lesson.quizzes.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTabChange('quiz')}
                        className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                        disabled={isNavigating}
                      >
                        Take Quiz Now
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Add padding at the bottom to prevent content from being hidden behind fixed elements */}
            <div className="pb-36"></div>
          </div>
        </div>
      )}
      
      {/* Quiz Tab Content */}
      {activeTab === 'quiz' && !quizMode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-6"
        >
          {/* Show loading indicator while fetching data */}
          {isLoadingQuizProgress && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
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
          
          {/* Quiz Actions - Only show this section if we don't have quizProgressData yet or if lesson is not complete */}
          {(!quizProgressData || !lesson.complete) && (
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
            <div className="mx-auto h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
              {!lesson.complete ? (
                <AlertTriangle className="h-10 w-10 text-amber-500" />
              ) : quizProgressData?.is_completed ? (
                <Award className="h-10 w-10 text-green-500" />
              ) : quizHasAttempts ? (
                <Clock className="h-10 w-10 text-blue-500" />
              ) : (
                <Award className="h-10 w-10 text-amber-500" />
              )}
            </div>
          </motion.div>
          
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-gray-900 mb-2"
          >
            {!lesson.complete 
              ? "Complete the lesson first"
              : quizProgressData?.is_completed
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
            {!lesson.complete 
              ? "You need to complete this lesson before taking the quiz."
              : quizProgressData?.is_completed
                ? "You've completed this quiz. Review your answers and results below."
                : quizHasAttempts
                  ? "You've already started this quiz. You can continue where you left off!"
                  : "Take this quiz to check your understanding of the lesson material."}
          </motion.p>
        </motion.div>
      )}
          
          {/* Quiz Action Button - Only show when quiz is not completed */}
      <div className="text-center my-8">
        {lesson.complete && !quizProgressData?.is_completed && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!quizMode && !isTransitioningToQuiz) {
                pagePositionRef.current = window.scrollY;
                enterQuizMode(lesson.quizzes[0]);
              }
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
            disabled={isNavigating}
          >
            {quizHasAttempts ? "Continue Quiz" : "Start Quiz"}
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </motion.button>
        )}
        
        {!lesson.complete && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('content')}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            disabled={isNavigating}
          >
            Back to Lesson
            <ArrowLeft className="ml-2 -mr-1 h-5 w-5" />
          </motion.button>
        )}
      </div>
          {/* Add padding at the bottom to prevent content from being hidden behind fixed elements */}
          <div className="pb-20"></div>
        </motion.div>
      )}
            
      {/* Course Progress - Fixed to viewport bottom above the footer */}
      {progressionEnabled && activeTab === 'content' && (
        <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-gray-50 border-t border-gray-200 shadow-md z-30">
          <div className="flex items-center max-w-7xl mx-auto">
            <Clock className="h-4 w-4 text-amber-600 mr-2" />
            <div className="flex-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 rounded-full h-full transition-all duration-300"
                  style={{ width: `${readProgress}%` }}
                ></div>
              </div>
            </div>
            <span className="ml-2 text-xs font-medium text-amber-800">{Math.round(readProgress)}% read</span>
          </div>
        </div>
      )}
            
      {/* Footer - Fixed at the viewport bottom */}
      {activeTab === 'content' && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-50 to-amber-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center z-20">
          <div className="text-sm text-gray-600 mb-3 sm:mb-0">
            {completionError && (
              <div className="text-red-600 mb-2 flex items-center">
                <AlertTriangle className="mr-1 h-4 w-4" />
                {completionError}
              </div>
            )}
            {!completionError && (
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4 text-amber-500" />
                {progressionEnabled 
                  ? "Complete lessons to unlock more content"
                  : "Continue learning and track your progress!"}
              </div>
            )}
          </div>
              
          <div className="flex space-x-3">
            {prev && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate(prev, prev.section)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                disabled={isNavigating}
              >
                <ChevronLeft className="mr-2 -ml-1 h-5 w-5" />
                Previous Lesson
              </motion.button>
            )}
            
            {lesson.complete ? (
              lesson.quizzes && lesson.quizzes.length > 0 && activeTab !== 'quiz' && !lesson.quizzes[0].complete ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabChange('quiz')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                  disabled={isNavigating}
                >
                  Take Quiz
                  <FileText className="ml-2 -mr-1 h-5 w-5" />
                </motion.button>
              ) : nextItem ? (
                // Check if next item is a quiz
                nextItem.isQuiz ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Navigate to the section quiz
                      if (onNavigate && nextItem.section) {
                        // We need to call the parent's onNavigate with the quiz info
                        // But onNavigate expects a lesson, so we'll need to handle this differently
                        // Let's use a custom function to navigate to quizzes
                        if (typeof onNavigate === 'function') {
                          // Pass the quiz and section to the parent component
                          // The parent component (CourseLearnPage) will handle the navigation
                          onNavigate(null, nextItem.section, nextItem); // Pass quiz as third parameter
                        }
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                    disabled={isNavigating}
                  >
                    Take Quiz
                    <FileText className="ml-2 -mr-1 h-5 w-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigate(nextItem, nextItem.section)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                    disabled={isNavigating}
                  >
                    Next Lesson
                    <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                  </motion.button>
                )
              ) : isLastLesson ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToGrid}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                  disabled={isNavigating}
                >
                  Course Complete
                  <Award className="ml-2 -mr-1 h-5 w-5" />
                </motion.button>
              ) : actualNext ? (
                // Check if actualNext item is a quiz
                actualNext.isQuiz ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Navigate to the section quiz
                      if (typeof onNavigate === 'function') {
                        onNavigate(null, actualNext.section, actualNext); // Pass quiz as third parameter
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                    disabled={isNavigating}
                  >
                    Take Quiz
                    <FileText className="ml-2 -mr-1 h-5 w-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigate(actualNext, actualNext.section)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                    disabled={isNavigating}
                  >
                    Next Lesson
                    <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                  </motion.button>
                )
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToGrid}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                  disabled={isNavigating}
                >
                  Course Complete
                  <Award className="ml-2 -mr-1 h-5 w-5" />
                </motion.button>
              )
            ) : (
              <motion.button
                whileHover={isCompleting || isNavigating ? {} : { scale: 1.05 }}
                whileTap={isCompleting || isNavigating ? {} : { scale: 0.95 }}
                onClick={handleCompleteLesson}
                disabled={isCompleting || isNavigating}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  isCompleting || isNavigating
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                }`}
              >
                {isCompleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Mark as Complete
                    <CheckCircle className="ml-2 -mr-1 h-5 w-5" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      )}
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
            className="w-2 h-2 bg-amber-500 rounded-full"
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
              backgroundColor: ['#FFC107', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LessonViewer;