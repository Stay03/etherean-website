import React from 'react';

/**
 * LessonCard Component
 * Displays a single lesson as a card in the grid view
 * Now with progression and completion states
 */
const LessonCard = ({ 
  lesson, 
  sectionTitle, 
  onClick,
  isComplete = false,
  isAvailable = true 
}) => {
  // Extract YouTube thumbnail if video URL exists
  const getYouTubeThumbnail = () => {
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
          // Use medium quality thumbnail
          return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
      }
      
      // Not a YouTube URL or format not recognized
      return null;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return null;
    }
  };
  
  const thumbnailUrl = getYouTubeThumbnail();
  
  return (
    <div 
      className={`group relative rounded-lg border overflow-hidden shadow-sm transition-all duration-200 ${
        !isAvailable 
          ? 'bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed' 
          : isComplete
            ? 'bg-white border-green-200 hover:shadow-md cursor-pointer'
            : 'bg-white border-gray-200 hover:shadow-md cursor-pointer'
      }`}
      onClick={() => isAvailable && onClick()}
    >
      {/* Lesson thumbnail or placeholder */}
      <div className="relative h-36 bg-gray-200">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={lesson.title} 
            className={`w-full h-full object-cover ${!isAvailable ? 'filter grayscale' : ''}`}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            lesson.quizzes && lesson.quizzes.length > 0 
              ? 'bg-green-50' 
              : 'bg-blue-50'
          }`}>
            <svg 
              className={`h-12 w-12 ${
                lesson.quizzes && lesson.quizzes.length > 0 
                  ? 'text-green-300' 
                  : 'text-blue-300'
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {lesson.quizzes && lesson.quizzes.length > 0 ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              )}
            </svg>
          </div>
        )}
        
        {/* Play button overlay for video lessons */}
        {lesson.video_url && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isAvailable ? 'bg-black bg-opacity-20 group-hover:bg-opacity-30' : 'bg-black bg-opacity-40'
          } transition-opacity`}>
            <div className={`rounded-full p-3 ${
              isAvailable ? 'bg-white bg-opacity-80 group-hover:bg-opacity-90' : 'bg-white bg-opacity-60'
            } transition-opacity`}>
              <svg className="h-8 w-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Locked overlay for unavailable lessons */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-full p-3">
              <svg className="h-8 w-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Completion indicator */}
        {isComplete && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Lesson content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">{sectionTitle}</p>
            <h3 className={`font-medium line-clamp-2 ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
              {lesson.title}
            </h3>
          </div>
        </div>
        
        {/* Lesson description - truncated */}
        {lesson.description && (
          <p className={`mt-2 text-sm line-clamp-2 ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
            {lesson.description}
          </p>
        )}
        
        {/* Lesson badges/tags */}
        <div className="mt-3 flex items-center space-x-2">
          {lesson.video_url && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isAvailable ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
              Video
            </span>
          )}
          
          {lesson.quizzes && lesson.quizzes.length > 0 && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isAvailable ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
            }`}>
              Quiz
            </span>
          )}
          
          {isComplete ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-600">
              Completed
            </span>
          ) : !isAvailable ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
              Locked
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-50 text-yellow-600">
              Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;