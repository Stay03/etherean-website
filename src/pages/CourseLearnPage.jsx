import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useCourseDetail from '../hooks/useCourseDetail';
import { useAuth } from '../contexts/AuthContext';
import CourseSidebar from '../components/lessons/CourseSidebar';
import LessonGrid from '../components/lessons/LessonGrid';
import LessonViewer from '../components/lessons/LessonViewer';
import Breadcrumb from '../components/Breadcrumb';

/**
 * CourseLearnPage Component
 * Main page for displaying course content and lessons in learning mode
 */
const CourseLearnPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'lesson'
  
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

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: course ? course.product_info.title : 'Loading...', path: `/course/${slug}` }
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
      navigate(`/course/${slug}`);
    }
  }, [hasAccess, course, slug, isLoading, navigate]);

  // Find and set selected lesson based on URL param
  useEffect(() => {
    if (course && lessonIdFromUrl) {
      // Iterate through sections to find the lesson
      for (const section of course.sections || []) {
        const lesson = (section.lessons || []).find(l => l.id === parseInt(lessonIdFromUrl));
        if (lesson) {
          setSelectedLesson(lesson);
          setSelectedSection(section);
          setViewMode('lesson');
          break;
        }
      }
    }
  }, [course, lessonIdFromUrl]);

  // Handle lesson selection
  const handleLessonSelect = (lesson, section) => {
    setSelectedLesson(lesson);
    setSelectedSection(section);
    setViewMode('lesson');
    
    // Update URL with lesson ID
    navigate(`/course/${slug}/learn?lesson=${lesson.id}`, { replace: true });
  };

  // Handle returning to grid view
  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedLesson(null);
    
    // Remove lesson param from URL
    navigate(`/course/${slug}/learn`, { replace: true });
  };

  // Get all lessons from all sections (flattened)
  const getAllLessons = () => {
    if (!course || !course.sections) return [];
    
    return course.sections.reduce((allLessons, section) => {
      return allLessons.concat((section.lessons || []).map(lesson => ({
        ...lesson,
        sectionTitle: section.title,
        sectionId: section.id
      })));
    }, []);
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
            />
          </div>

         
          {/* Main content area */}
          <div className="w-full lg:w-3/4 p-6">
            {/* Main content - grid or lesson view */}
            
            <div>
              {viewMode === 'grid' ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {/* {course.product_info.title} - Course Content */}
                  </h1>
                  <LessonGrid 
                    sections={course.sections}
                    onLessonSelect={handleLessonSelect}
                  />
                </>
              ) : (
                <LessonViewer 
                  lesson={selectedLesson}
                  section={selectedSection}
                  course={course}
                  onBackToGrid={handleBackToGrid}
                  onNavigate={handleLessonSelect}
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