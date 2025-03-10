import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that tracks window scroll position and determines if the
 * scroll position has passed a specified threshold.
 * 
 * @param {number} threshold - Scroll position in pixels to trigger the scrolled state (default: 50)
 * @param {boolean} defaultValue - Default initial value for isScrolled (default: false)
 * @returns {boolean} isScrolled - Whether the page has scrolled past the threshold
 */
const useScrollPosition = (threshold = 50, defaultValue = false) => {
  const [isScrolled, setIsScrolled] = useState(defaultValue);

  // Memoized scroll handler to prevent recreation on each render
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > threshold);
  }, [threshold]);

  // Set up scroll event listener
  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case page is loaded at a scrolled position
    handleScroll();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isScrolled;
};

export default useScrollPosition;