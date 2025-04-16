import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseProgress from './CourseProgress';

/**
 * CourseSidebar Component
 * Provides navigation for the course learning area
 */
const CourseSidebar = ({ course, selectedLesson, onLessonSelect, onBackToGrid }) => {
  const [expandedSections, setExpandedSections] = useState({});
  
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

  return (
    <div className=" overflow-y-auto py-6 px-4 sticky top-0">
      {/* Course title and back button */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 truncate" title={course.product_info.title}>
          {/* {course.product_info.title} */}
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
      
      {/* Section list */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Course Content
        </h3>
        
        {course.sections && course.sections.map((section, index) => (
          <div key={section.id} className="border border-gray-200 rounded-md overflow-hidden">
            {/* Section header */}
            <button
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 text-xs flex items-center justify-center mr-2">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900 text-sm">{section.title}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  {section.lessons?.length || 0} lessons
                </span>
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
              </div>
            </button>
            
            {/* Lesson list */}
            {isSectionExpanded(section.id) && section.lessons && (
              <div className="bg-white divide-y divide-gray-100">
                {section.lessons.map((lesson, lessonIndex) => (
                  <button
                    key={lesson.id}
                    className={`w-full text-left p-3 pl-11 text-sm hover:bg-gray-50 transition-colors ${
                      isLessonSelected(lesson.id) ? 'bg-yellow-50 border-l-4 border-yellow-500 pl-9' : ''
                    }`}
                    onClick={() => onLessonSelect(lesson, section)}
                  >
                    <div className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center mr-2">
                        {lessonIndex + 1}
                      </span>
                      <span className="text-gray-800 truncate" title={lesson.title}>
                        {lesson.title}
                      </span>
                    </div>
                    
                    {/* Lesson info badges */}
                    <div className="mt-1 pl-7 flex items-center space-x-2">
                      {lesson.video_url && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600">
                          Video
                        </span>
                      )}
                      {lesson.quizzes && lesson.quizzes.length > 0 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-600">
                          Quiz
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;