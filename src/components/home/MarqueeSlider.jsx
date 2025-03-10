import React, { useEffect, useRef } from 'react';

const MarqueeSlider = () => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  
  // Values to display in the marquee
  const values = [
    "Liberty",
    "Enlightenment", 
    "Spirituality", 
    "Peace", 
    "Community"
  ];
  
  useEffect(() => {
    // Clone the content for seamless scrolling
    if (sliderRef.current && containerRef.current) {
      const slider = sliderRef.current;
      // Create a copy of the slider content
      const clone = slider.cloneNode(true);
      containerRef.current.appendChild(clone);
      
      // Animation function
      let position = 0;
      const speed = 0.5; // Speed of movement (pixels per frame)
      
      const animate = () => {
        if (containerRef.current) {
          position -= speed;
          
          // Reset position when first set of items have scrolled out of view
          if (position <= -slider.offsetWidth) {
            position = 0;
          }
          
          containerRef.current.style.transform = `translateX(${position}px)`;
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
    
    // Cleanup animation on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.style.transform = '';
      }
    };
  }, []);
  
  return (
    <div className="w-full overflow-hidden bg-blue-100">
      <div 
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        <div 
          ref={sliderRef}
          className="flex items-center py-4 px-4"
        >
          {values.map((value, index) => (
            <React.Fragment key={index}>
              <span className="text-4xl text-gray-800 px-2 font-medium">*</span>
              <span className="text-4xl text-gray-800 px-4 font-medium">{value}</span>
            </React.Fragment>
          ))}
          <span className="text-4xl text-gray-800 px-2 font-medium">*</span>
        </div>
      </div>
    </div>
  );
};

export default MarqueeSlider;