import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

// Import images from assets folder
import libraryImage from '../../assets/library.jpg';
import empHeaderImage from '../../assets/emp-header.jpg';
import ppkgImage from '../../assets/ppkg.jpg';
import neosImage from '../../assets/neos.webp';

// Default featured items data structure
const DEFAULT_FEATURED_ITEMS = [
  {
    id: 'feature1',
    title: 'Cosmic Consciousness',
    description: 'Explore the connection between universal awareness and personal transformation',
    imageUrl: libraryImage,
    linkUrl: '/programs/cosmic-consciousness',
    category: 'Program'
  },
  {
    id: 'feature2',
    title: 'Quantum Healing',
    description: 'Harness energy frequencies to restore balance and promote cellular regeneration',
    imageUrl: empHeaderImage,
    linkUrl: '/practices/quantum-healing',
    category: 'Practice'
  },
  {
    id: 'feature3',
    title: 'Astral Projection Workshop',
    description: 'Learn techniques to safely explore consciousness beyond physical limitations',
    imageUrl: ppkgImage,
    linkUrl: '/workshops/astral-projection',
    category: 'Workshop'
  },
  {
    id: 'feature4',
    title: 'Ancient Wisdom Library',
    description: 'Access our curated collection of spiritual texts from traditions worldwide',
    imageUrl: neosImage,
    linkUrl: '/resources/wisdom-library',
    category: 'Resource'
  }
];

// Individual Feature Card component
// Individual Feature Card component
// Individual Feature Card component
const FeatureCard = memo(({ item, index }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Handle image loading
    const handleImageLoad = useCallback(() => {
      setIsLoading(false);
    }, []);
  
    // Handle image error
    const handleImageError = useCallback(() => {
      setIsLoading(false);
      setError('Failed to load image');
    }, []);
  
    // Derive a fallback color based on index for error state
    const fallbackColors = [
      'bg-gradient-to-br from-purple-700 to-indigo-900',
      'bg-gradient-to-br from-yellow-500 to-amber-700',
      'bg-gradient-to-br from-blue-500 to-cyan-700',
      'bg-gradient-to-br from-green-600 to-emerald-800'
    ];
  
    return (
      <a 
        href={item.linkUrl}
        className="group relative block w-full h-80 overflow-hidden rounded-2xl transition-all duration-500 transform hover:-translate-y-1"
      >
        {/* Top-right decorative curve SVG */}
        <div className="absolute top-0 right-0 z-10 pointer-events-none transition-all duration-700 ease-in-out group-hover:opacity-0">
          <svg width="111" height="111" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 0C19.33 0 35 15.67 35 35V41C35 60.33 50.67 76 70 76H76C95.33 76 111 91.67 111 111V0H0Z" fill="white" />
          </svg>
        </div>
        
        {/* Document icon that appears on hover */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v16h10V4H7z" clipRule="evenodd" />
              <path d="M15 8H9v2h6V8zM15 12H9v2h6v-2zM15 16H9v2h6v-2z" />
            </svg>
          </div>
        </div>
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Image or fallback */}
        {error ? (
          <div className={`absolute inset-0 ${fallbackColors[index % fallbackColors.length]}`}>
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,100 M100,0 L0,100" stroke="white" strokeWidth="1" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-200">
            {/* Image with no overlay */}
            <img 
              src={item.imageUrl}
              alt={item.title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}
        
        {/* Light blue footer with only h3 title and angled arrow */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-100 p-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 transition-transform duration-300 group-hover:translate-x-2">
            {item.title}
          </h3>
          
          {/* Arrow icon rotated -45 degrees */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 transform -rotate-45 transition-all duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </a>
    );
  });

FeatureCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    linkUrl: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

// Main Featured Section component
const FeaturedSection = ({ featuredItems = DEFAULT_FEATURED_ITEMS }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for smoother transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-white py-16 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full -ml-32 -mt-32"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-yellow-500 opacity-5 rounded-full -mr-48 -mb-48"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Section header with exact styling specifications */}
        <div className="mb-10">
          <div className="h-px bg-gray-300 w-full my-4"></div>
          
          {/* Modified flex container to stack on mobile */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
            <p className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
              Featured
            </p>
            
            
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-lg bg-gray-200 h-80 animate-pulse">
                <div className="h-full w-full relative">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="h-5 w-20 bg-gray-300 rounded mb-3"></div>
                    <div className="h-8 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Featured items grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {featuredItems.map((item, index) => (
              <FeatureCard 
                key={item.id} 
                item={item} 
                index={index} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

FeaturedSection.propTypes = {
  featuredItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      linkUrl: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired
    })
  )
};

export default memo(FeaturedSection);