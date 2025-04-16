import React, { useState } from 'react';

/**
 * LessonCard Component
 * Displays a lesson in card format for the grid view
 */
const LessonCard = ({ lesson, sectionTitle, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  // Extract video thumbnail from YouTube URL if available
  const getVideoThumbnail = () => {
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
          return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
      
      // Default or unsupported video URL
      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };
  
  const videoThumbnail = getVideoThumbnail();
  
  // Get a random pastel color for cards without thumbnails
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  const randomColor = React.useMemo(() => getRandomPastelColor(), []);
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* Card thumbnail or placeholder */}
      <div className="relative aspect-video bg-gray-100">
        {videoThumbnail && !imageError ? (
          <img
            src={videoThumbnail}
            alt={lesson.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center" 
            style={{ backgroundColor: randomColor }}
          >
            {lesson.video_url ? (
              <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
        
        {/* Play button for videos */}
        {lesson.video_url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-yellow-500 bg-opacity-90 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Section label */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {sectionTitle}
          </span>
        </div>
        
        {/* Lesson indicators */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {lesson.video_url && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Video
            </span>
          )}
          {lesson.quizzes && lesson.quizzes.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Quiz
            </span>
          )}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {lesson.title}
        </h3>
        
        {lesson.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {lesson.description}
          </p>
        )}
        
        {/* View button */}
        <div className="mt-auto">
          <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            View Lesson
            <svg className="ml-1 -mr-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;