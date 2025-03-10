import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { memo } from 'react';
import Header from './components/layout/Header';
import HeroSlider from './components/home/HeroSlider';
import MarqueeSlider from './components/home/MarqueeSlider';

// Memoize any components that rarely change
const MemoizedMarqueeSlider = memo(MarqueeSlider);

function App() {
  return (
    <Router>
      {/* Header comes first at full width, outside any containers with padding */}
      
      <Header />
      
      {/* Main content div with padding */}
      <div className="bg-white p-4 sm:p-6 lg:p-6 min-h-screen">
        {/* White border container with rounded corners */}
        <div className="relative bg-gray-50 min-h-[calc(100vh-32px)] overflow-hidden rounded-[30px] ">
          <div className="relative font-questrial">
            {/* SVG for top-right corner rounded effect - laptop and desktop only */}
            <div className="absolute top-20 right-0 z-10 hidden lg:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M35 0V35C35 15.67 19.33 0 -1.53184e-05 0H35Z" fill="white"></path>
              </svg>
            </div>

            {/* Full width container with sections */}
            <div className="w-full">
              {/* Hero section - Full width and full height */}
              <div className="w-full relative h-screen bg-white">
                <HeroSlider />
              </div>
              
              {/* CTA Section - Full width white background */}
              <div className="w-full bg-white py-16 cta-area style-2">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="section-title">
                    <div className="sec-content">
                      <p className="title text-gray-800
                        text-4xl leading-tight tracking-tighter
                        sm:text-5xl sm:leading-snug
                        md:text-5xl md:leading-relaxed
                        lg:text-6xl lg:leading-tight lg:tracking-tight
                        xl:text-center 2xl:text-center">
                        Our Mission is to provide you with the Tools for the activation and free expression of your innate potentials for the realization of your inner peace. Simple, We are the restorers of PEACE.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marquee Slider - Using memoized component */}
              <MemoizedMarqueeSlider />
              
              {/* Container for other content */}
              <div className="container mx-auto px-4">
                {/* Routes content */}
                <Routes>
                  <Route path="/" element={<div>{/* Other home page content can go here */}</div>} />
                  {/* Add more routes as needed */}
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;