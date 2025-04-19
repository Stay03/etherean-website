import React from 'react';

/**
 * CourseProgress Component
 * Displays the user's progress through the course
 * Uses the progression data from API
 */
const CourseProgress = ({ course }) => {
  // Extract progression data from course - fallback to zeros if not available
  const progression = course?.progression || {
    total_sections: 0,
    completed_sections: 0,
    sections_percentage: 0,
    total_lessons: 0,
    completed_lessons: 0,
    lessons_percentage: 0,
    total_quizzes: 0,
    completed_quizzes: 0,
    quizzes_percentage: 0,
    overall_percentage: 0
  };
  
  // Destructure the progression data for easier access
  const {
    total_sections,
    completed_sections,
    sections_percentage,
    total_lessons,
    completed_lessons,
    lessons_percentage,
    total_quizzes,
    completed_quizzes,
    quizzes_percentage,
    overall_percentage
  } = progression;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Your Progress</h2>
        <span className="text-xs font-medium text-gray-600">
          {overall_percentage}% Complete
        </span>
      </div>
      
      {/* Overall progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className="bg-yellow-500 h-2 rounded-full" 
          style={{ width: `${overall_percentage}%` }}
        ></div>
      </div>
      
      {/* Progress stats in a more compact format */}
      <div className="space-y-2">
        {/* Lessons progress */}
        <div>
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="text-gray-600">Lessons</span>
            <span className="font-medium text-gray-900">
              {completed_lessons}/{total_lessons}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full" 
              style={{ width: `${lessons_percentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Quizzes progress - only show if there are quizzes */}
        {total_quizzes > 0 && (
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-gray-600">Quizzes</span>
              <span className="font-medium text-gray-900">
                {completed_quizzes}/{total_quizzes}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full" 
                style={{ width: `${quizzes_percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Course stats in a compact format */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-500">Sections</div>
          <div className="text-sm font-medium">{total_sections}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-500">Lessons</div>
          <div className="text-sm font-medium">{total_lessons}</div>
        </div>
        {total_quizzes > 0 && (
          <div className="bg-gray-50 rounded p-2">
            <div className="text-xs text-gray-500">Quizzes</div>
            <div className="text-sm font-medium">{total_quizzes}</div>
          </div>
        )}
      </div>
      
      {/* Completion status */}
      {completed_lessons > 0 || completed_quizzes > 0 ? (
        <div className="mt-3 text-xs text-green-600 font-medium text-center">
          {overall_percentage === 100 ? "Course Complete!" : "In Progress"}
        </div>
      ) : (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Start your first lesson to track progress
        </div>
      )}
      
      {/* Next lesson prompt if available */}
      {course?.next_item && overall_percentage < 100 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-700">Next up:</p>
          <p className="text-sm font-medium text-yellow-600 truncate" title={course.next_item.title}>
            {course.next_item.title}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;