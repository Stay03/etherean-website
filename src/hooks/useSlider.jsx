import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing slider functionality including navigation,
 * auto-advancement, touch/mouse interactions, and animations.
 * 
 * @param {Array} slides - Array of slide objects to display
 * @param {number} autoAdvanceInterval - Time in ms between auto-advancing slides (default: 7000)
 * @param {number} dragThreshold - Minimum pixel distance to trigger slide change on drag/swipe (default: 100)
 * @returns {Object} Slider state and handler functions
 */
const useSlider = (slides, autoAdvanceInterval = 7000, dragThreshold = 100) => {
  // Core state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(null); // 'left' or 'right'
  const [isAnimating, setIsAnimating] = useState(false);
  const slidesContainerRef = useRef(null);
  
  // Touch/Swipe state
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('right');
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('left');
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [isAnimating, slides.length]);

  const goToSlide = useCallback((index) => {
    if (isAnimating || index === currentSlide) return;
    
    setDirection(index > currentSlide ? 'right' : 'left');
    setIsAnimating(true);
    setCurrentSlide(index);
  }, [currentSlide, isAnimating]);

  // Handle animation end
  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Auto-advance slides (only when not dragging)
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [nextSlide, isDragging, autoAdvanceInterval]);

  // Keyboard navigation (accessibility)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEndX(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const difference = touchStartX - touchEndX;
    
    // Check if swipe was long enough to trigger slide change
    if (Math.abs(difference) > dragThreshold) {
      if (difference > 0) {
        // Swipe left -> next slide
        nextSlide();
      } else {
        // Swipe right -> previous slide
        prevSlide();
      }
    }
  }, [touchStartX, touchEndX, dragThreshold, nextSlide, prevSlide]);

  // Mouse drag event handlers
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    // Optional: add visual feedback during drag
  }, [isDragging]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging) return;
    
    const dragDistance = e.clientX - dragStartX;
    
    // Check if drag was long enough to trigger slide change
    if (Math.abs(dragDistance) > dragThreshold) {
      if (dragDistance < 0) {
        // Drag left -> next slide
        nextSlide();
      } else {
        // Drag right -> previous slide
        prevSlide();
      }
    }
    
    setIsDragging(false);
    document.body.style.userSelect = '';
  }, [isDragging, dragStartX, dragThreshold, nextSlide, prevSlide]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  return {
    // Current state
    currentSlide,
    direction,
    isAnimating,
    isDragging,
    slidesContainerRef,
    
    // Navigation methods
    nextSlide,
    prevSlide,
    goToSlide,
    handleTransitionEnd,
    
    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    
    // Mouse handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  };
};

export default useSlider;