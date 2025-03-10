import React, { useState, useCallback, memo } from 'react';
import heroImage from '../../assets/DSC01280-scaled.jpg';
import heroImage2 from '../../assets/DSC01281-scaled.jpg';
import heroImage3 from '../../assets/section-bg-one.jpg';
import useSlider from '../../hooks/useSlider';

// Define slides outside of the component to prevent recreation on each render
const slides = [
  { 
    id: 1, 
    image: heroImage, 
    alt: 'Etherean Hero Image',
    title: 'Welcome to Etherean Life',
    description: 'Discover tools for activation and free expression of your innate potentials.',
    ctaText: 'Learn More',
    ctaLink: '/about'
  },
  { 
    id: 2, 
    image: heroImage2, 
    alt: 'Etherean Hero Image 2',
    title: 'Find Your Inner Peace',
    description: 'Our mission is to help you realize your inner peace through spiritual growth.',
    ctaText: 'Join Our Community',
    ctaLink: '/membership'
  },
  { 
    id: 3, 
    image: heroImage3, 
    alt: 'Etherean Hero Image 3',
    title: 'Welcome to Etherean Life',
    ctaText: 'Learn More',
    ctaLink: '/about'
  },
];

const HeroSlider = () => {
  // Use our custom slider hook
  const {
    currentSlide,
    isAnimating,
    isDragging,
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
    handleMouseLeave
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

  return (
    <div className="relative w-full h-[calc(100vh-40px)] overflow-hidden group rounded-b-3xl">
      {/* Slides container with animation */}
      <div 
        ref={slidesContainerRef}
        className="w-full h-full flex transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: `translateX(-${currentSlide * 100}%)`,
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
              backgroundPosition: 'top',
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
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                )}
                <div className="inline-flex items-center">
                  <a 
                    href={slide.ctaLink} 
                    className={`inline-block font-semibold text-2xl md:text-3xl py-3 px-8 rounded-full transition-colors duration-300 ${
                      hoveredCTA ? 'bg-white text-[#292929]' : 'bg-yellow-500 text-[#292929]'
                    }`}
                    style={{ lineHeight: '1.3' }}
                    onMouseEnter={handleCTAHoverEnter}
                    onMouseLeave={handleCTAHoverLeave}
                  >
                    {slide.ctaText}
                  </a>
                  <a
                    href={slide.ctaLink}
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
                  </a>
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

      {/* Left arrow - visible on hover */}
      <button 
        onClick={prevSlide}
        disabled={isAnimating}
        className={`
          absolute left-5 top-1/2 transform -translate-y-1/2 
          bg-white/70 hover:bg-white/90 p-2 rounded-full 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow - visible on hover */}
      <button 
        onClick={nextSlide}
        disabled={isAnimating}
        className={`
          absolute right-5 top-1/2 transform -translate-y-1/2 
          bg-white/70 hover:bg-white/90 p-2 rounded-full 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default memo(HeroSlider);