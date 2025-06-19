import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Default fallback image if banner images fail to load
import fallbackHeroImage from '../../assets/section-bg-one.jpg';

// Custom hook for slider functionality with real-time dragging
const useSlider = (slides) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const slidesContainerRef = useRef(null);
  const containerWidth = useRef(0);
  const autoplayTimerRef = useRef(null);
  const autoplayInterval = 5000; // 5 seconds between slides

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (slidesContainerRef.current) {
        containerWidth.current = slidesContainerRef.current.clientWidth;
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    // Only autoplay if we have more than one slide
    if (slides.length <= 1) return;

    const startAutoplay = () => {
      autoplayTimerRef.current = setInterval(() => {
        // Go to next slide, or back to first slide if at the end
        setCurrentSlide(prevSlide => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
        setIsAnimating(true);
        setDragOffset(0);
      }, autoplayInterval);
    };

    // Start autoplay
    startAutoplay();

    // Clear interval on unmount
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [slides.length]);

  // Pause autoplay when user interacts with slider
  const pauseAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  }, []);

  // Resume autoplay after user interaction
  const resumeAutoplay = useCallback(() => {
    pauseAutoplay();
    
    // Only autoplay if we have more than one slide
    if (slides.length <= 1) return;
    
    autoplayTimerRef.current = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
      setIsAnimating(true);
      setDragOffset(0);
    }, autoplayInterval);
  }, [pauseAutoplay, slides.length]);

  // Handle slide transition
  const goToSlide = useCallback((index) => {
    // Only allow going to valid slide indices
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
      setIsAnimating(true);
    }
    
    // Always reset drag offset
    setDragOffset(0);
    
    // Reset autoplay when manually changing slides
    resumeAutoplay();
  }, [slides.length, resumeAutoplay]);

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      goToSlide(newIndex);
    }
  }, [currentSlide, isAnimating, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      goToSlide(newIndex);
    }
  }, [currentSlide, isAnimating, goToSlide, slides.length]);

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Touch events
  const handleTouchStart = useCallback((e) => {
    if (isAnimating) return;
    
    pauseAutoplay();
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    
    // Disable the transition during dragging
    if (slidesContainerRef.current) {
      slidesContainerRef.current.style.transition = 'none';
    }
  }, [isAnimating, pauseAutoplay]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = dragStartX - currentX;
    
    // Calculate the drag percentage of container width
    let offsetPercentage = (diff / containerWidth.current) * 100;
    
    // Add resistance when dragging beyond the first or last slide
    if ((currentSlide === 0 && offsetPercentage < 0) || 
        (currentSlide === slides.length - 1 && offsetPercentage > 0)) {
      // Apply resistance factor (0.3 means it moves at 30% of normal speed)
      offsetPercentage *= 0.3;
    }
    
    setDragOffset(offsetPercentage);
  }, [isDragging, dragStartX, currentSlide, slides.length]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    // Enable the transition effect again
    if (slidesContainerRef.current) {
      slidesContainerRef.current.style.transition = 'transform 1000ms ease-in-out';
    }
    
    // If dragged more than 20% of slide width, change slide
    if (Math.abs(dragOffset) > 20) {
      // Check if we're at the edge slides
      if (dragOffset > 0) {
        nextSlide();
      } else if (dragOffset < 0) {
        prevSlide();
      } else {
        // At edge, just reset
        setDragOffset(0);
      }
    } else {
      // If not dragged enough, reset to current slide (clear offset)
      setDragOffset(0);
    }
    
    setIsDragging(false);
    resumeAutoplay();
  }, [isDragging, dragOffset, nextSlide, prevSlide, resumeAutoplay]);

  // Mouse events for desktop dragging
  const handleMouseDown = useCallback((e) => {
    if (isAnimating) return;
    
    pauseAutoplay();
    setIsDragging(true);
    setDragStartX(e.clientX);
    
    // Disable the transition during dragging
    if (slidesContainerRef.current) {
      slidesContainerRef.current.style.transition = 'none';
    }
    
    // Prevent default to avoid text selection while dragging
    e.preventDefault();
  }, [isAnimating, pauseAutoplay]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = dragStartX - currentX;
    
    // Calculate the drag percentage of container width
    let offsetPercentage = (diff / containerWidth.current) * 100;
    
    // Add resistance when dragging beyond the first or last slide
    if ((currentSlide === 0 && offsetPercentage < 0) || 
        (currentSlide === slides.length - 1 && offsetPercentage > 0)) {
      // Apply resistance factor (0.3 means it moves at 30% of normal speed)
      offsetPercentage *= 0.3;
    }
    
    setDragOffset(offsetPercentage);
    
    // Prevent default to avoid text selection
    e.preventDefault();
  }, [isDragging, dragStartX, currentSlide, slides.length]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging) return;
    
    // Enable the transition effect again
    if (slidesContainerRef.current) {
      slidesContainerRef.current.style.transition = 'transform 1000ms ease-in-out';
    }
    
    // If dragged more than 20% of slide width, change slide
    if (Math.abs(dragOffset) > 20) {
      // Check if we're at the edge slides
      if (dragOffset > 0) {
        nextSlide();
      } else if (dragOffset < 0) {
        prevSlide();
      } else {
        // At edge, just reset
        setDragOffset(0);
      }
    } else {
      // If not dragged enough, reset to current slide
      setDragOffset(0);
    }
    
    setIsDragging(false);
    resumeAutoplay();
    
    // Prevent default to maintain consistency
    e.preventDefault();
  }, [isDragging, dragOffset, nextSlide, prevSlide, resumeAutoplay]);

  const handleMouseLeave = useCallback((e) => {
    if (isDragging) {
      handleMouseUp(e);
    }
    resumeAutoplay();
  }, [isDragging, handleMouseUp, resumeAutoplay]);

  // When hover over the slider, pause autoplay
  const handleMouseEnter = useCallback(() => {
    pauseAutoplay();
  }, [pauseAutoplay]);

  return {
    currentSlide,
    isAnimating,
    isDragging,
    dragOffset,
    slidesContainerRef,
    nextSlide,
    prevSlide,
    goToSlide,
    handleTransitionEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
    pauseAutoplay,
    resumeAutoplay,
  };
};

/**
 * Hero Slider Component for displaying banner images
 * @param {Object} props - Component props
 * @param {Array} props.banners - Array of banner objects from API
 * @param {boolean} props.isLoading - Loading state
 * @param {string|null} props.error - Error message if any
 */
const HeroSlider = ({ banners = [], isLoading = false, error = null }) => {
  // Transform banners to slide format
  const slides = banners.map(banner => ({
    id: banner.id,
    image: banner.image_url,
    alt: banner.title,
    title: banner.title,
    description: banner.description || banner.subtitle, // Use description or fallback to subtitle
    ctaText: banner.button_text,
    ctaLink: banner.button_url,
  }));

  // If no banners are available, show a fallback slide
  if (slides.length === 0 && !isLoading) {
    slides.push({
      id: 'fallback',
      image: fallbackHeroImage,
      alt: 'Etherean Life',
      title: 'Welcome to Etherean Life',
      description: 'Discover tools for activation and free expression of your innate potentials.',
      ctaText: 'Learn More',
      ctaLink: '/about',
    });
  }

  // Use our custom slider hook
  const {
    currentSlide,
    isAnimating,
    isDragging,
    dragOffset,
    slidesContainerRef,
    nextSlide,
    prevSlide,
    goToSlide,
    handleTransitionEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
  } = useSlider(slides);

  // CTA hover state (not included in the slider hook as it's specific to this UI)
  const [hoveredCTA, setHoveredCTA] = useState(false);
  
  // Memoized handler for CTA hover
  const handleCTAHoverEnter = useCallback(() => setHoveredCTA(true), []);
  const handleCTAHoverLeave = useCallback(() => setHoveredCTA(false), []);

  // Error handling for images - memoized
  const handleImageError = useCallback((index) => {
    console.error(`Failed to load image for slide ${index + 1}`);
    // You could set a placeholder or fallback image here
  }, []);

  // Calculate the transform value based on current slide and drag offset
  const transformValue = `translateX(-${(currentSlide * 100) + dragOffset}%)`;

  // If loading, show a skeleton screen
  if (isLoading) {
    return (
      <div className="relative w-full h-[calc(100vh-40px)] overflow-hidden rounded-b-[30px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-white/30 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="relative w-full h-[calc(100vh-40px)] overflow-hidden rounded-b-[30px] bg-gray-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Failed to load banners</h2>
          <p className="text-center max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[calc(100vh-40px)] overflow-hidden group rounded-b-[30px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides container with animation */}
      <div 
        ref={slidesContainerRef}
        className="w-full h-full flex transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: transformValue,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onTransitionEnd={handleTransitionEnd}
        // Touch events for mobile
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // Mouse events for desktop dragging
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Render all slides side by side */}
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '100vh', // Ensures minimum height of viewport
            }}
            aria-hidden={index !== currentSlide}
          >
            {/* Dark overlay */}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            ></div>
            
            {/* Slide content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center pt-20">
                {/* Animated title with fade-in effect when active */}
                <h1 
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                  }`}
                  style={{ transitionDelay: index === currentSlide ? '300ms' : '0ms' }}
                >
                  {slide.title}
                </h1>
                
                {/* Animated description with fade-in effect when active */}
                {slide.description && (
                  <p 
                    className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                    }`}
                    style={{ transitionDelay: index === currentSlide ? '500ms' : '0ms' }}
                  >
                    {slide.description}
                  </p>
                )}
                
                {/* CTA button with fade-in effect when active */}
                <div 
                  className={`inline-flex items-center transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                  }`}
                  style={{ transitionDelay: index === currentSlide ? '700ms' : '0ms' }}
                >
                  {/* Use Link for internal links, and 'a' for external links */}
                  {slide.ctaLink && slide.ctaLink.startsWith('/') ? (
                    <Link 
                      to={slide.ctaLink} 
                      className={`inline-block font-semibold text-2xl md:text-3xl py-3 px-8 rounded-full transition-colors duration-300 ${
                        hoveredCTA ? 'bg-white text-[#292929]' : 'bg-yellow-500 text-[#292929]'
                      }`}
                      style={{ lineHeight: '1.3' }}
                      onMouseEnter={handleCTAHoverEnter}
                      onMouseLeave={handleCTAHoverLeave}
                    >
                      {slide.ctaText}
                    </Link>
                  ) : (
                    <a 
                      href={slide.ctaLink} 
                      className={`inline-block font-semibold text-2xl md:text-3xl py-3 px-8 rounded-full transition-colors duration-300 ${
                        hoveredCTA ? 'bg-white text-[#292929]' : 'bg-yellow-500 text-[#292929]'
                      }`}
                      style={{ lineHeight: '1.3' }}
                      onMouseEnter={handleCTAHoverEnter}
                      onMouseLeave={handleCTAHoverLeave}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {slide.ctaText}
                    </a>
                  )}
                  
                  {/* Arrow icon */}
                  {slide.ctaLink && slide.ctaLink.startsWith('/') ? (
                    <Link
                      to={slide.ctaLink}
                      className={`rounded-full flex items-center justify-center h-14 w-14 transition-colors duration-300 ${
                        hoveredCTA ? 'bg-white' : 'bg-yellow-500'
                      }`}
                      onMouseEnter={handleCTAHoverEnter}
                      onMouseLeave={handleCTAHoverLeave}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-6 w-6 transform rotate-[315deg] ${
                          hoveredCTA ? 'text-[#292929]' : 'text-[#292929]'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <a
                      href={slide.ctaLink}
                      className={`rounded-full flex items-center justify-center h-14 w-14 transition-colors duration-300 ${
                        hoveredCTA ? 'bg-white' : 'bg-yellow-500'
                      }`}
                      onMouseEnter={handleCTAHoverEnter}
                      onMouseLeave={handleCTAHoverLeave}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-6 w-6 transform rotate-[315deg] ${
                          hoveredCTA ? 'text-[#292929]' : 'text-[#292929]'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Hidden image for preloading */}
            <img 
              src={slide.image} 
              alt={slide.alt} 
              className="hidden"
              onError={() => handleImageError(index)} 
            />
          </div>
        ))}
      </div>

      {/* Left arrow - visible on hover or always visible on mobile */}
      <button 
        onClick={prevSlide}
        disabled={isAnimating || slides.length <= 1}
        className={`
          absolute left-5 top-1/2 transform -translate-y-1/2 
          bg-white/70 hover:bg-white/90 p-2 rounded-full 
          transition-opacity duration-300
          md:opacity-0 md:group-hover:opacity-100 opacity-70
          ${isAnimating || slides.length <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow - visible on hover or always visible on mobile */}
      <button 
        onClick={nextSlide}
        disabled={isAnimating || slides.length <= 1}
        className={`
          absolute right-5 top-1/2 transform -translate-y-1/2 
          bg-white/70 hover:bg-white/90 p-2 rounded-full 
          transition-opacity duration-300
          md:opacity-0 md:group-hover:opacity-100 opacity-70
          ${isAnimating || slides.length <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators - only show if we have multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

HeroSlider.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      image_url: PropTypes.string.isRequired,
      button_text: PropTypes.string,
      button_url: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

// Wrap with React.memo to prevent unnecessary re-renders
export default memo(HeroSlider);