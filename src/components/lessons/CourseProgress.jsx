import React from 'react';

/**
 * CourseProgress Component
 * Displays the user's progress through the course
 * Designed for the sidebar
 */
const CourseProgress = ({ course }) => {
  // For demo purposes - in a real app, this would come from the backend
  const completedLessons = 0;
  const completedQuizzes = 0;
  
  // Calculate total lessons and quizzes
  const getTotalLessons = () => {
    if (!course || !course.sections) return 0;
    
    return course.sections.reduce((total, section) => {
      return total + (section.lessons?.length || 0);
    }, 0);
  };
  
  const getTotalQuizzes = () => {
    if (!course || !course.quizzes) return 0;
    return course.quizzes.length;
  };
  
  const totalLessons = getTotalLessons();
  const totalQuizzes = getTotalQuizzes();
  
  // Calculate progress percentages
  const lessonProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const quizProgress = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;
  const overallProgress = totalLessons > 0 ? Math.round(((completedLessons + completedQuizzes) / (totalLessons + totalQuizzes)) * 100) : 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Your Progress</h2>
        <span className="text-xs font-medium text-gray-600">
          {overallProgress}% Complete
        </span>
      </div>
      
      {/* Overall progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className="bg-yellow-500 h-2 rounded-full" 
          style={{ width: `${overallProgress}%` }}
        ></div>
      </div>
      
      {/* Progress stats in a more compact format */}
      <div className="space-y-2">
        {/* Lessons progress */}
        <div>
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="text-gray-600">Lessons</span>
            <span className="font-medium text-gray-900">
              {completedLessons}/{totalLessons}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full" 
              style={{ width: `${lessonProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Quizzes progress */}
        <div>
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="text-gray-600">Quizzes</span>
            <span className="font-medium text-gray-900">
              {completedQuizzes}/{totalQuizzes}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-green-500 h-1 rounded-full" 
              style={{ width: `${quizProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Course stats in a compact format */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-500">Sections</div>
          <div className="text-sm font-medium">{course.sections?.length || 0}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-500">Lessons</div>
          <div className="text-sm font-medium">{totalLessons}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-500">Quizzes</div>
          <div className="text-sm font-medium">{totalQuizzes}</div>
        </div>
      </div>
      
      {/* Completion status - very compact */}
      {completedLessons > 0 ? (
        <div className="mt-3 text-xs text-green-600 font-medium text-center">
          In Progress
        </div>
      ) : (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Start your first lesson to track progress
        </div>
      )}
    </div>
  );
};

export default CourseProgress;