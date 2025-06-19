import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EventCard from './EventsSlider/EventCard';
import useEvents from '../../hooks/useEvents';

/**
 * EventsSlider component
 * Displays a draggable slider of event cards
 * Shows 2 cards on desktop/tablet and 1 card on mobile
 */
const EventsSlider = () => {
  // Fetch events using the custom hook
  const { 
    events, 
    isLoading, 
    error 
  } = useEvents({
    platform: 'EL',
    is_online: 1,
    perPage: 10,
    status: 'published',
    orderBy: 'start_date',
    orderDir: 'desc'
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const maxSlides = Math.max(0, (events?.length || 0) - slidesPerView);

  // Update slider dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const isMobile = window.innerWidth < 768;
        const newSlidesPerView = isMobile ? 1 : 2;
        
        setSlidesPerView(newSlidesPerView);
        setSlideWidth(containerWidth / newSlidesPerView);
        
        // Reset current slide if needed when changing slides per view
        if (currentSlide > (events?.length || 0) - newSlidesPerView) {
          setCurrentSlide(Math.max(0, (events?.length || 0) - newSlidesPerView));
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [events?.length, currentSlide]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    const clampedIndex = Math.max(0, Math.min(index, maxSlides));
    setCurrentSlide(clampedIndex);
    setIsAnimating(true);
    setDragOffset(0);
  }, [maxSlides]);

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, isAnimating, goToSlide]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, isAnimating, goToSlide]);

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
  }, [isAnimating]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = dragStartX - currentX;
    
    // Calculate drag percentage relative to slide width
    let offsetInPixels = diff;
    
    // Add resistance at edges
    if ((currentSlide === 0 && offsetInPixels < 0) || 
        (currentSlide >= maxSlides && offsetInPixels > 0)) {
      offsetInPixels *= 0.3;
    }
    
    setDragOffset(offsetInPixels);
  }, [isDragging, dragStartX, currentSlide, maxSlides]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 500ms ease-in-out';
    }
    
    const swipeThreshold = slideWidth * 0.2;
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset > 0 && currentSlide < maxSlides) {
        nextSlide();
      } else if (dragOffset < 0 && currentSlide > 0) {
        prevSlide();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    
    setIsDragging(false);
  }, [isDragging, dragOffset, slideWidth, nextSlide, prevSlide, currentSlide, maxSlides]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
    
    e.preventDefault();
  }, [isAnimating]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = dragStartX - currentX;
    
    let offsetInPixels = diff;
    
    if ((currentSlide === 0 && offsetInPixels < 0) || 
        (currentSlide >= maxSlides && offsetInPixels > 0)) {
      offsetInPixels *= 0.3;
    }
    
    setDragOffset(offsetInPixels);
    e.preventDefault();
  }, [isDragging, dragStartX, currentSlide, maxSlides]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging) return;
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 500ms ease-in-out';
    }
    
    const swipeThreshold = slideWidth * 0.2;
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset > 0 && currentSlide < maxSlides) {
        nextSlide();
      } else if (dragOffset < 0 && currentSlide > 0) {
        prevSlide();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    
    setIsDragging(false);
    e.preventDefault();
  }, [isDragging, dragOffset, slideWidth, nextSlide, prevSlide, currentSlide, maxSlides]);

  const handleMouseLeave = useCallback((e) => {
    if (isDragging) {
      handleMouseUp(e);
    }
  }, [isDragging, handleMouseUp]);

  // Calculate transform value for slider
  const transformValue = `translateX(${-currentSlide * slideWidth - dragOffset}px)`;
  
  // Check if navigation buttons should be disabled
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= maxSlides;

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-px bg-gray-300 w-full my-4"></div>
            <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
              <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
                Upcoming &amp; Past Events
              </h2>
            </div>
          </div>
          
          <div className="h-[480px] md:h-[520px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-px bg-gray-300 w-full my-4"></div>
            <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
              <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
                Upcoming &amp; Past Events
              </h2>
            </div>
          </div>
          
          <div className="h-[480px] md:h-[520px] flex items-center justify-center text-center">
            <div>
              <p className="text-red-500 mb-4">Failed to load events</p>
              <p className="text-gray-600">Please try again later</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No events state
  if (!events || events.length === 0) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-px bg-gray-300 w-full my-4"></div>
            <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
              <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
                Upcoming &amp; Past Events
              </h2>
            </div>
          </div>
          
          <div className="h-[480px] md:h-[520px] flex items-center justify-center text-center">
            <div>
              <p className="text-gray-600 mb-4">No events available at this time</p>
              <Link 
                to="/events" 
                className="inline-flex items-center px-6 py-2 text-sm font-medium rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-300"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-yellow-500 opacity-5 rounded-full -ml-48"></div>
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full -mr-32 -mb-32"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-10">
          <div className="h-px bg-gray-300 w-full my-4"></div>
          
          <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
            <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
              Upcoming &amp; Past Events
            </h2>
            
            <Link 
              to="/events" 
              className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-500 ease-in-out self-start"
            >
              All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Events slider */}
        <div className="relative">
          {/* Slider container with ref for measuring */}
          <div 
            ref={containerRef}
            className="w-full overflow-hidden rounded-2xl"
          >
            {/* Draggable slider */}
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out h-[480px] md:h-[520px]"
              style={{ 
                transform: transformValue,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onTransitionEnd={handleTransitionEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="flex-shrink-0 h-full p-2"
                  style={{ width: `${slideWidth}px` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows - positioned at top right */}
          <div className="absolute top-[-60px] right-0 flex space-x-3 z-10">
            <button 
              onClick={prevSlide}
              disabled={isFirstSlide || isAnimating}
              className={`
                w-12 h-12 flex items-center justify-center
                bg-white rounded-full shadow-md
                text-gray-800 hover:text-yellow-500 transition-colors
                ${isFirstSlide ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100 cursor-pointer'}
              `}
              aria-label="Previous events"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              disabled={isLastSlide || isAnimating}
              className={`
                w-12 h-12 flex items-center justify-center
                bg-white rounded-full shadow-md
                text-gray-800 hover:text-yellow-500 transition-colors
                ${isLastSlide ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100 cursor-pointer'}
              `}
              aria-label="Next events"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slide indicators/dots */}
        {events.length > slidesPerView && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-yellow-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(EventsSlider);  