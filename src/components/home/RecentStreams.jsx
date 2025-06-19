import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import apiClient from '../../services/api/client';

// Individual YouTube video card component
const VideoCard = memo(({ video, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date to be more readable
  const formattedDate = new Date(video.published_at || video.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle image error
  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load thumbnail');
  }, []);

  return (
    <div 
      className="group flex flex-col rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl bg-white h-full"
      onClick={() => onClick(video)}
    >
      {/* Thumbnail container with aspect ratio */}
      <div className="relative pt-[56.25%] overflow-hidden bg-gray-200">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-500 text-center px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Thumbnail image */}
        <img 
          src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
          alt={video.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse-ring">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" viewBox="0 0 384 512" fill="currentColor">
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Video details */}
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-yellow-600 mt-auto">{formattedDate}</p>
      </div>
    </div>
  );
});

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    url: PropTypes.string,
    published_at: PropTypes.string,
    date: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

// Video modal component for playing videos
const VideoModal = memo(({ video, isOpen, onClose }) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity">
      <div className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors duration-200"
          aria-label="Close video"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Video embed */}
        <div className="relative pt-[56.25%] w-full">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Video title and info */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h3>
          <p className="text-yellow-600">
            {new Date(video.published_at || video.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
});

VideoModal.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    published_at: PropTypes.string,
    date: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

// Add custom animation keyframes
const pulseRingAnimation = `
@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(234, 179, 8, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(234, 179, 8, 0);
  }
}

.animate-pulse-ring {
  animation: pulse-ring 1.7s cubic-bezier(0.66, 0, 0, 1) infinite;
}
`;

// Main RecentStreams component
const RecentStreams = ({ initialVideos = [] }) => {
  const [videos, setVideos] = useState(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/youtube/videos/recent');
        
        if (response.status === 'success' && response.data && response.data.length > 0) {
          setVideos(response.data);
        } else {
          setError('No videos found');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
      } finally {
        // Add a small delay to avoid loading flash
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchVideos();
  }, []);

  // Handle video card click
  const handleVideoClick = useCallback((video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  }, []);

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Give time for animation before clearing selected video
    setTimeout(() => setSelectedVideo(null), 300);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pulseRingAnimation }} />
      <section className="w-full bg-white py-16 px-4 relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute left-0 bottom-0 w-32 h-32 bg-yellow-500 opacity-5 rounded-full -ml-16 -mb-16"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Section header with exact styling specifications */}
        <div className="mb-10">
          <div className="h-px bg-gray-300 w-full my-4"></div>
          
          {/* Modified flex container to stack on mobile */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
            <p className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
              Recent Streams
            </p>
            
            {/* View All button that wraps to next line on mobile */}
            <a 
              href="https://www.youtube.com/@EthereanMissionInternational" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-500 ease-in-out self-start"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 mt-8">
            {/* Featured video loading placeholder */}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
              <div className="pt-[56.25%] bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
              </div>
            </div>
            
            {/* Regular videos loading placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-lg bg-white">
                  <div className="pt-[56.25%] bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{error}</h3>
            <p className="text-gray-600 mb-4">Please try again later or check your connection.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-yellow-500 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          /* Videos grid with featured video */
          <div className="grid grid-cols-1 gap-8 mt-8">
            {/* Featured (most recent) video */}
            {videos.length > 0 && (
              <div className="relative">
                <div className="absolute top-4 left-4 z-10 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full font-semibold">
                  Latest Video
                </div>
                <VideoCard 
                  key={videos[0].id} 
                  video={videos[0]} 
                  onClick={handleVideoClick} 
                />
              </div>
            )}
            
            {/* Regular videos grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.slice(1).map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onClick={handleVideoClick} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Video modal */}
      <VideoModal 
        video={selectedVideo} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
    </>
  );
};

RecentStreams.propTypes = {
  initialVideos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      url: PropTypes.string,
      published_at: PropTypes.string,
      date: PropTypes.string
    })
  )
};

export default memo(RecentStreams);