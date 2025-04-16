import React, { useState, useEffect, useCallback, memo } from 'react';

/**
 * VisitUsSection Component
 * 
 * Displays a "Visit Us This Weekend" section with a full-width Google Maps embed
 */
const VisitUsSection = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for smoother transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle map loading success
  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
    setMapError(false);
  }, []);

  // Handle map loading error
  const handleMapError = useCallback(() => {
    setMapError(true);
    setMapLoaded(false);
  }, []);

  return (
    <section className="w-full bg-white py-16 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full -ml-32 -mt-32"></div>
      <div className="absolute right-0 bottom-0 w-32 h-32 bg-yellow-500 opacity-5 rounded-full -mr-16 -mb-16"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Section header with styling consistent with other sections */}
        <div className="mb-10">
          <div className="h-px bg-gray-300 w-full my-4"></div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
            <div>
              <p className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929]">
                Visit Us This Weekend
              </p>
              <p className="text-gray-600 mt-2 text-lg">Join our spiritual community and experience inner peace</p>
            </div>
            
            {/* Get Directions button */}
            <a 
              href="https://maps.google.com/?q=Etherean+Mission" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-500 ease-in-out self-start"
            >
              Get Directions
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Full width map container */}
        <div className="w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
          {/* Loading state */}
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Error state */}
          {mapError && !isLoading && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-600 text-center font-medium mb-2">Unable to load map</p>
              <p className="text-gray-500 text-center text-sm mb-4">Please check your internet connection and try again</p>
              <a
                href="https://maps.google.com/?q=Etherean+Mission"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-yellow-500 text-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition-colors duration-300"
              >
                Open in Google Maps
              </a>
            </div>
          )}
          
          {/* Google Maps iframe */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3970.955845017831!2d-0.27318295867290304!3d5.573546906080792!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4bdc8ac45f3a2ea5!2sEtherean%20Mission!5e0!3m2!1sen!2sgh!4v1581769265838!5m2!1sen!2sgh"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleMapLoad}
            onError={handleMapError}
            className={`${(isLoading || mapError) ? 'hidden' : 'block'}`}
            title="Etherean Mission Location"
          ></iframe>
        </div>
        
        {/* Weekend workshop banner */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-start mb-4 md:mb-0">
            <div className="bg-yellow-500 rounded-full p-2 mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">This Weekend: Spiritual Growth Workshop</h4>
              <p className="text-gray-600">Join us for a transformative experience this Saturday and Sunday. Everyone is welcome!</p>
            </div>
          </div>
          <a 
            href="/events"
            className="inline-flex items-center px-6 py-2 text-base font-medium rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-300 self-start md:self-center"
          >
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default memo(VisitUsSection);