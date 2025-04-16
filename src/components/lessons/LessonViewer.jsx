import React, { useState, useEffect } from 'react';

/**
 * LessonViewer Component
 * Displays the selected lesson content
 */
const LessonViewer = ({ lesson, section, course, onBackToGrid, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [expanded, setExpanded] = useState(false);
  
  // Reset to content tab when lesson changes
  useEffect(() => {
    setActiveTab('content');
  }, [lesson?.id]);
  
  if (!lesson || !section || !course) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-3 text-lg font-medium text-yellow-800">No Lesson Selected</h3>
        <p className="mt-2 text-yellow-700">
          Please select a lesson from the sidebar or grid view.
        </p>
        <button
          onClick={onBackToGrid}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Back to Grid View
        </button>
      </div>
    );
  }
  
  // Find next and previous lessons
  const getAdjacentLessons = () => {
    // Get all lessons from all sections in order
    const allLessons = course.sections.flatMap(s => 
      (s.lessons || []).map(l => ({
        ...l,
        sectionId: s.id,
        section: s
      }))
    );
    
    // Find current lesson index
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    
    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    };
  };
  
  const { prev, next } = getAdjacentLessons();
  
  // Extract YouTube video ID if present
  const getYouTubeEmbedUrl = () => {
    if (!lesson.video_url) return null;
    
    try {
      // Handle YouTube URLs
      if (lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be')) {
        let videoId = '';
        
        if (lesson.video_url.includes('v=')) {
          // Format: youtube.com/watch?v=VIDEO_ID
          videoId = lesson.video_url.split('v=')[1].split('&')[0];
        } else if (lesson.video_url.includes('youtu.be')) {
          // Format: youtu.be/VIDEO_ID
          videoId = lesson.video_url.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Not a YouTube URL or format not recognized
      return null;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return null;
    }
  };
  
  const youtubeEmbedUrl = getYouTubeEmbedUrl();
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Lesson Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center">
              <button
                onClick={onBackToGrid}
                className="mr-3 text-gray-500 hover:text-gray-700"
                title="Back to grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900 truncate" title={lesson.title}>
                {lesson.title}
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              From: <span className="font-medium">{section.title}</span>
            </p>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex space-x-2">
            {prev && (
              <button
                onClick={() => onNavigate(prev, prev.section)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                title={prev.title}
              >
                <svg className="mr-1.5 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            )}
            
            {next && (
              <button
                onClick={() => onNavigate(next, next.section)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                title={next.title}
              >
                Next
                <svg className="ml-1.5 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          <button
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'content' 
                ? 'border-yellow-500 text-yellow-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveTab('content')}
          >
            Lesson Content
          </button>
          
          {lesson.quizzes && lesson.quizzes.length > 0 && (
            <button
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'quiz' 
                  ? 'border-yellow-500 text-yellow-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => setActiveTab('quiz')}
            >
              Quiz
              <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-green-100 text-green-800">
                {lesson.quizzes.length}
              </span>
            </button>
          )}
        </nav>
      </div>
      
      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'content' && (
          <div>
            {/* Video Content */}
            {youtubeEmbedUrl && (
              <div className="mb-6">
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={youtubeEmbedUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Description */}
            {lesson.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this lesson</h3>
                <div className={`prose prose-yellow ${expanded ? '' : 'max-h-32 overflow-hidden relative'}`}>
                  <p>{lesson.description}</p>
                </div>
                
                {lesson.description.length > 150 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center"
                  >
                    {expanded ? 'Show less' : 'Show more'}
                    <svg
                      className={`ml-1 h-5 w-5 transform ${expanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            {lesson.content && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson Content</h3>
                <div 
                  className="prose prose-yellow max-w-none" 
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </div>
            )}
            
            {/* Additional Resources (placeholder) */}
            <div className="bg-gray-50 rounded-lg p-4 mt-8">
              <h3 className="text-sm font-medium text-gray-900">Additional Resources</h3>
              <p className="mt-1 text-sm text-gray-600">
                Complete this lesson and any associated quizzes to track your progress.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'quiz' && lesson.quizzes && lesson.quizzes.length > 0 && (
          <div>
            {/* Quiz content would be implemented here */}
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-3 text-lg font-medium text-green-800">Quiz Available</h3>
              <p className="mt-2 text-green-700">
                This lesson has {lesson.quizzes.length} quiz{lesson.quizzes.length > 1 ? 'zes' : ''} available.
              </p>
              <p className="mt-1 text-sm text-green-600">
                Quiz functionality would be implemented here.
              </p>
              <p className="mt-4 text-xs text-green-500">
                Quiz Title: {lesson.quizzes[0].title}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 mb-3 sm:mb-0">
          Continue learning and track your progress!
        </div>
        
        <div className="flex space-x-3">
          {prev && (
            <button
              onClick={() => onNavigate(prev, prev.section)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous Lesson
            </button>
          )}
          
          {next ? (
            <button
              onClick={() => onNavigate(next, next.section)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Next Lesson
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onBackToGrid}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Complete Course
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;