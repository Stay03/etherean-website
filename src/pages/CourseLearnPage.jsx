import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useCourseDetail from '../hooks/useCourseDetail';
import useProgressionStatus from '../hooks/useProgressionStatus';
import { useAuth } from '../contexts/AuthContext';
import toast from '../utils/toastConfig'; // Import our custom toast configuration
import CourseSidebar from '../components/lessons/CourseSidebar';
import LessonGrid from '../components/lessons/LessonGrid';
import LessonViewer from '../components/lessons/LessonViewer';
import Breadcrumb from '../components/Breadcrumb';

/**
 * CourseLearnPage Component
 * Main page for displaying course content and lessons in learning mode
 * Now with progression tracking support, custom Toastify integration,
 * and lesson navigation loading states
 */
const CourseLearnPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'lesson'
  // Add this flag to prevent auto-navigation when explicitly switching to grid view
  const [manualGridView, setManualGridView] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // Track lesson navigation state
  // Add a flag to indicate explicit lesson selection
  const [explicitLessonSelection, setExplicitLessonSelection] = useState(false);
  
  // Get lessonId from URL if present
  const searchParams = new URLSearchParams(location.search);
  const lessonIdFromUrl = searchParams.get('lesson');

  // Fetch course details using custom hook with detailed=true
  const { 
    course, 
    hasAccess,
    isLoading, 
    error, 
    refetch 
  } = useCourseDetail(slug, true);

  // Use our custom progression hook to determine available content
  const {
    availableSections,
    availableLessons,
    nextLesson,
    isLessonAvailable,
    progressionEnabled,
    courseProgress
  } = useProgressionStatus(course);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: course ? course.product_info.title : 'Loading...', path: `/course/${slug}` },
    { label: 'Learning Area', path: `/course/${slug}/learn` }
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // Redirect to course detail page if user doesn't have access
  useEffect(() => {
    if (!isLoading && !hasAccess && course) {
      toast.error('You don\'t have access to this course');
      navigate(`/course/${slug}`);
    }
  }, [hasAccess, course, slug, isLoading, navigate]);

  // Effect to handle URL changes
  useEffect(() => {
    if (!course) return;
    
    // If there's a lesson ID in the URL, switch to lesson view
    if (lessonIdFromUrl) {
      const lessonId = parseInt(lessonIdFromUrl);
      
      // Find the lesson and its section regardless of progression status
      let foundLesson = null;
      let foundSection = null;
      
      // Look for the lesson in all sections
      for (const section of course.sections || []) {
        const lesson = (section.lessons || []).find(l => l.id === lessonId);
        if (lesson) {
          foundLesson = lesson;
          foundSection = section;
          break;
        }
      }
      
      // If we found the lesson
      if (foundLesson) {
        // Check if it's either available in progression, completed, or progression is disabled
        const isCompleted = foundLesson.complete === true;
        if (!progressionEnabled || isLessonAvailable(lessonId) || isCompleted || explicitLessonSelection) {
          setSelectedLesson(foundLesson);
          setSelectedSection(foundSection);
          setViewMode('lesson');
          return; // Exit the effect once we've found and set the lesson
        }
      }
      
      // If lesson not found or not accessible (not available and not completed), redirect to first available lesson
      // Skip this redirection if we explicitly selected a lesson
      if (nextLesson && !explicitLessonSelection) {
        toast.info('That lesson is not available yet. Here\'s your next lesson.');
        navigate(`/course/${slug}/learn?lesson=${nextLesson.id}`, { replace: true });
      } else {
        // If no next lesson is available, show grid view
        setViewMode('grid');
        setSelectedLesson(null);
        setSelectedSection(null);
        navigate(`/course/${slug}/learn`, { replace: true });
      }
    } else {
      // No lesson in URL - show grid view (but don't auto-navigate to next lesson if we explicitly chose grid view)
      if (!manualGridView && progressionEnabled && nextLesson && viewMode !== 'grid' && !explicitLessonSelection) {
        // If progression is enabled and no lesson selected, suggest the next lesson
        navigate(`/course/${slug}/learn?lesson=${nextLesson.id}`, { replace: true });
      } else {
        // Otherwise, show grid view
        setViewMode('grid');
        setSelectedLesson(null);
        setSelectedSection(null);
      }
    }
    
    // Reset explicit lesson selection flag after processing
    setExplicitLessonSelection(false);
  }, [course, lessonIdFromUrl, progressionEnabled, nextLesson, isLessonAvailable, slug, navigate, viewMode, manualGridView, explicitLessonSelection]);

  // Handle lesson selection with progression check
  const handleLessonSelect = (lesson, section) => {
    // alert('Lesson selected: ' + lesson.title);
    // Reset the manual grid view flag when selecting a lesson
    setManualGridView(false);
    
    // Set navigating state to show loading UI
    setIsNavigating(true);
    
    // Set explicit lesson selection flag to true to override progression
    setExplicitLessonSelection(true);
    
    // Allow selecting lessons that are either available in progression, completed, or if progression is disabled
    const isCompleted = lesson.complete === true;
    if (!progressionEnabled || isLessonAvailable(lesson.id) || isCompleted) {
      setSelectedLesson(lesson);
      setSelectedSection(section);
      setViewMode('lesson');
      
      // Update URL with lesson ID
      navigate(`/course/${slug}/learn?lesson=${lesson.id}`, { replace: true });
      
      // Set a timeout to simulate loading and give time for resources to load
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    } else {
      // Show a toast that the lesson is locked
      toast.warning('This lesson is locked. Complete previous lessons first.');
      setIsNavigating(false);
    }
  };

  // Handle returning to grid view
  const handleBackToGrid = () => {
    // Set the manual grid view flag to prevent auto-navigation
    setManualGridView(true);
    setViewMode('grid');
    setSelectedLesson(null);
    setSelectedSection(null);
    
    // Remove lesson param from URL
    navigate(`/course/${slug}/learn`, { replace: true });
  };

  // Handle lesson completion - refresh course data
  const handleLessonComplete = async (lessonId) => {
    // Show a success message
    toast.success('Lesson completed successfully!');
    
    // Refresh the course data to update progression
    refetch();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/4 h-64 bg-gray-200 rounded-lg"></div>
              <div className="w-full lg:w-3/4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
              <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                {error.status === 404 ? 'Course not found' : 'Unable to load course'}
              </h3>
              <p className="text-red-700 mb-4">
                {error.message || 'An unexpected error occurred. Please try again later.'}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back to Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure course exists
  if (!course || !course.sections) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
              <svg className="h-12 w-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Course Not Found</h3>
              <p className="text-yellow-700 mb-4">
                The course you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                Browse All Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={breadcrumbItems} 
        onNavigate={(path) => navigate(path)} 
      />
  
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Course sidebar - always visible */}
          <div className="w-full lg:w-1/4 bg-white border-r border-gray-200">
            <CourseSidebar 
              course={course}
              selectedLesson={selectedLesson}
              onLessonSelect={handleLessonSelect}
              onBackToGrid={handleBackToGrid}
              availableSections={availableSections}
              availableLessons={availableLessons}
              progressionEnabled={progressionEnabled}
              isNavigating={isNavigating}
            />
          </div>

          {/* Main content area */}
          <div className="w-full lg:w-3/4 p-6">
            {/* Main content - grid or lesson view */}
            <div>
              {viewMode === 'grid' ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {course.product_info.title} - Course Content
                  </h1>
                  
                  <LessonGrid 
                    sections={availableSections}
                    onLessonSelect={handleLessonSelect}
                    availableLessons={availableLessons}
                    progressionEnabled={progressionEnabled}
                    isNavigating={isNavigating}
                  />
                </>
              ) : (
                <LessonViewer 
                  lesson={selectedLesson}
                  section={selectedSection}
                  course={course}
                  onBackToGrid={handleBackToGrid}
                  onNavigate={handleLessonSelect}
                  availableLessons={availableLessons}
                  progressionEnabled={progressionEnabled}
                  onLessonComplete={handleLessonComplete}
                  isNavigating={isNavigating}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearnPage;