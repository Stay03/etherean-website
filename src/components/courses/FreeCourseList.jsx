import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCourseDetail from '../../hooks/useCourseDetail';
import CourseDescription from './CourseDescription';
import CourseSections from './CourseSections';
import EnrollButton from './EnrollButton';

/**
 * FreeCourseList Component
 * Displays free courses as interactive tabs with detailed course view
 * 
 * @param {Object[]} courses - Array of course objects
 * @param {boolean} isLoading - Whether courses are currently loading
 * @param {Object} error - Error object if fetch failed
 * @param {Function} onRetry - Function to retry loading courses
 */
const FreeCourseList = ({ courses, isLoading, error, onRetry }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSections, setExpandedSections] = useState(new Set([0])); // First section expanded by default
  
  // Get the active course slug for detailed data fetching
  const activeCourseSlug = courses && courses.length > 0 ? courses[activeTab]?.slug : null;
  
  // Fetch detailed course data for the active tab
  const { 
    course: courseDetail, 
    hasAccess, 
    isLoading: isLoadingDetail, 
    error: detailError, 
    refetch: refetchDetail 
  } = useCourseDetail(activeCourseSlug, true);

  // Handle tab change
  const handleTabChange = (index) => {
    setActiveTab(index);
    setExpandedSections(new Set([0])); // Reset to first section expanded when changing tabs
  };

  // Toggle section expanded state
  const toggleSection = (sectionIndex) => {
    setExpandedSections(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(sectionIndex)) {
        newSet.delete(sectionIndex);
      } else {
        newSet.add(sectionIndex);
      }
      return newSet;
    });
  };

  // Custom Course Sections Component with Video Thumbnail Design
  const CustomCourseSections = ({ sections = [] }) => {
    // Calculate total lessons
    const totalLessons = sections.reduce((total, section) => {
      return total + (section.lessons?.length || 0);
    }, 0);

    // Handle empty sections
    if (!sections || sections.length === 0) {
      return (
        <div className="py-4 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-600">No curriculum sections available for this course yet.</p>
        </div>
      );
    }

    return (
      <div className="course-sections">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {sections.length} {sections.length === 1 ? 'Section' : 'Sections'} • 
            {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
          </div>
        </div>
        
        <div className="border rounded-lg divide-y">
          {sections.map((section, index) => (
            <div key={section.id || index} className="course-section">
              {/* Section Header - Clickable */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${expandedSections.has(index) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {expandedSections.has(index) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                </div>
                <div className="text-sm text-gray-600">
                  {section.lessons?.length || 0} {(section.lessons?.length || 0) === 1 ? 'Lesson' : 'Lessons'}
                </div>
              </div>
              
              {/* Section Lessons - Video Thumbnail Grid */}
              {expandedSections.has(index) && section.lessons && section.lessons.length > 0 && (
                <div className="bg-gray-50 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id || lessonIndex} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                          {lesson.thumbnail ? (
                            <img
                              src={lesson.thumbnail}
                              alt={lesson.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Default Video Thumbnail */}
                          <div className={`w-full h-full ${lesson.thumbnail ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-500 font-medium">Video Lesson</p>
                            </div>
                          </div>
                          {/* Duration Badge */}
                          {lesson.duration && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                              {lesson.duration}
                            </div>
                          )}
                        </div>
                        
                        {/* Lesson Info */}
                        <div className="p-3">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{lesson.title}</h4>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Lesson {lessonIndex + 1}</span>
                            <button className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 transition-colors">
                              Preview
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Empty lessons message */}
              {expandedSections.has(index) && (!section.lessons || section.lessons.length === 0) && (
                <div className="bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-600">No lessons available in this section yet.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render loading skeleton
  if (isLoading && (!courses || courses.length === 0)) {
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2 mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse w-32"></div>
          ))}
        </div>
        <div className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
      </div>
    );
  }

  // Render error state
  if (error && (!courses || courses.length === 0)) {
    return (
      <div className="w-full py-10 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Unable to load courses
          </h3>
          <p className="text-red-700 mb-4">
            {error.message || 'An unexpected error occurred. Please try again later.'}
          </p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!isLoading && (!courses || courses.length === 0)) {
    return (
      <div className="w-full py-12 text-center">
        <div className="max-w-md mx-auto">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No free courses found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Course Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {courses.map((course, index) => (
          <button
            key={course.id}
            onClick={() => handleTabChange(index)}
            className={`px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === index
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {course.title}
          </button>
        ))}
      </div>

      {/* Active Course Content */}
      {courses && courses.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Course Image */}
            <div className="md:flex-shrink-0">
              <img
                className="h-64 w-full object-cover md:w-96"
                src={courses[activeTab].image || courses[activeTab].thumbnail || '/api/placeholder/400/300'}
                alt={courses[activeTab].title}
              />
            </div>
            
            {/* Course Details */}
            <div className="p-8 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {courses[activeTab].title}
              </h2>
              
              
              {/* Course Statistics */}
              {courseDetail && (
                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <span>{courseDetail.sections?.length || 0} sections</span>
                  <span className="mx-2">•</span>
                  <span>{courseDetail.sections?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0} lessons</span>
                  <span className="mx-2">•</span>
                  <span>{courseDetail.progression_enabled ? 'Progress tracking' : 'No progress tracking'}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-green-600">
                    Free
                  </span>
                </div>
                
                <div className="w-40">
                  {isLoadingDetail ? (
                    <div className="w-full py-3 px-4 rounded-md bg-gray-200 animate-pulse">
                      <div className="h-5 bg-gray-300 rounded w-24 mx-auto"></div>
                    </div>
                  ) : (
                    <EnrollButton 
                      course={{
                        product_id: courses[activeTab].id,
                        product_info: {
                          price: courses[activeTab].price || "0", // Use actual course price or default to 0
                          slug: courses[activeTab].slug
                        }
                      }}
                      hasAccess={hasAccess}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Unified Course Content */}
          <div className="border-t border-gray-200">
            <div className="p-6">
              {isLoadingDetail ? (
                <div className="animate-pulse space-y-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : detailError ? (
                <div className="text-center py-8">
                  <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-800 mb-2">
                    Unable to load course details
                  </h3>
                  <p className="text-red-700 mb-4">
                    {detailError.message || 'An error occurred while loading course details.'}
                  </p>
                  <button
                    onClick={refetchDetail}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : courseDetail && courseDetail.product_info ? (
                <div className="space-y-8">
                  {/* Course Overview Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h3>
                    <CourseDescription description={courseDetail.product_info.description || 'No description available.'} />
                  </div>
                  
                  {/* Course Curriculum Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Curriculum</h3>
                    <CustomCourseSections sections={courseDetail.sections || []} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Course details not available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FreeCourseList;