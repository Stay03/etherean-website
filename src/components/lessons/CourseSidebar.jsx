import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseProgress from './CourseProgress';

/**
 * CourseSidebar Component
 * Provides navigation for the course learning area
 * Now with progression support
 */
const CourseSidebar = ({ 
  course, 
  selectedLesson, 
  onLessonSelect, 
  onBackToGrid,
  availableSections = [],
  availableLessons = [],
  progressionEnabled = false
}) => {
  const [expandedSections, setExpandedSections] = useState({});
  
  // Auto-expand the section that contains the selected lesson
  useEffect(() => {
    if (selectedLesson) {
      setExpandedSections(prev => ({
        ...prev,
        [selectedLesson.section_id]: true
      }));
    }
  }, [selectedLesson]);
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Check if section is expanded
  const isSectionExpanded = (sectionId) => {
    // If there's a selected lesson within this section, automatically expand it
    if (selectedLesson && selectedLesson.section_id === sectionId) {
      return true;
    }
    
    return !!expandedSections[sectionId];
  };
  
  // Check if a lesson is the selected one
  const isLessonSelected = (lessonId) => {
    return selectedLesson && selectedLesson.id === lessonId;
  };

  // Check if a lesson is available (for progression)
  const isLessonAvailable = (lessonId) => {
    if (!progressionEnabled) return true;
    return availableLessons.some(lesson => lesson.id === lessonId);
  };

  // Check if a section is available (for progression)
  const isSectionAvailable = (sectionId) => {
    if (!progressionEnabled) return true;
    return availableSections.some(section => section.id === sectionId);
  };

  // When we have no course data yet
  if (!course || !course.product_info) {
    return (
      <div className="overflow-y-auto py-6 px-4 sticky top-0">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto py-6 px-4 sticky top-0">
      {/* Course title and back button */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 truncate" title={course.product_info.title}>
          {course.product_info.title}
        </h2>
        <div className="flex space-x-4">
          <Link
            to={`/course/${course.product_info.slug}`}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Course Details
          </Link>
          <button
            onClick={onBackToGrid}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
        </div>
      </div>
      
      {/* Course Progress */}
      <div className="mb-6">
        <CourseProgress course={course} />
      </div>

      {/* Progression notice if enabled */}
      {progressionEnabled && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Progression Mode:</span> Complete lessons in order to unlock next content.
            </p>
          </div>
        </div>
      )}
      
      {/* Section list */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Course Content
        </h3>
        
        {course.sections && course.sections.map((section, index) => {
          const sectionAvailable = isSectionAvailable(section.id);
          
          return (
            <div key={section.id} className={`border rounded-md overflow-hidden ${
              sectionAvailable ? 'border-gray-200' : 'border-gray-100'
            }`}>
              {/* Section header */}
              <button
                className={`w-full flex items-center justify-between p-3 transition-colors focus:outline-none ${
                  sectionAvailable 
                    ? 'bg-gray-50 hover:bg-gray-100' 
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
                onClick={() => sectionAvailable && toggleSection(section.id)}
                disabled={!sectionAvailable}
              >
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2 ${
                    sectionAvailable 
                      ? section.complete 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {section.complete ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className={`font-medium text-sm ${
                    sectionAvailable ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center">
                  {!sectionAvailable && (
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  <span className="text-xs text-gray-500 mr-2">
                    {section.lessons?.length || 0} lessons
                  </span>
                  {sectionAvailable && (
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        isSectionExpanded(section.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              
              {/* Lesson list */}
              {sectionAvailable && isSectionExpanded(section.id) && section.lessons && (
                <div className="bg-white divide-y divide-gray-100">
                  {section.lessons.map((lesson, lessonIndex) => {
                    const lessonAvailable = isLessonAvailable(lesson.id);
                    
                    return (
                      <button
                        key={lesson.id}
                        className={`w-full text-left p-3 pl-11 text-sm transition-colors ${
                          lessonAvailable
                            ? isLessonSelected(lesson.id)
                              ? 'bg-yellow-50 border-l-4 border-yellow-500 pl-9'
                              : 'hover:bg-gray-50'
                            : 'bg-gray-50 cursor-not-allowed opacity-70'
                        }`}
                        onClick={() => lessonAvailable && onLessonSelect(lesson, section)}
                        disabled={!lessonAvailable}
                      >
                        <div className="flex items-center">
                          <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center mr-2 ${
                            lessonAvailable
                              ? lesson.complete
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {lesson.complete ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              lessonIndex + 1
                            )}
                          </span>
                          <span className={`truncate ${
                            lessonAvailable ? 'text-gray-800' : 'text-gray-500'
                          }`} title={lesson.title}>
                            {lesson.title}
                          </span>
                          
                          {!lessonAvailable && (
                            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </div>
                        
                        {/* Lesson info badges */}
                        <div className="mt-1 pl-7 flex items-center space-x-2">
                          {lesson.video_url && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              lessonAvailable ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                              Video
                            </span>
                          )}
                          {lesson.quizzes && lesson.quizzes.length > 0 && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              lessonAvailable ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                              Quiz
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseSidebar;