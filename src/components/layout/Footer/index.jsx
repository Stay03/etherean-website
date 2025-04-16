import React, { memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component
 * Displays site quote, join button, and footer links
 */
const Footer = () => {
  return (
    <footer className=" bg-[#292929] text-white  py-40 px-6 rounded-[40px] m-4">
      <div className="max-w-6xl mx-auto">
        {/* Quote and CTA section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="max-w-lg mb-6 md:mb-0">
            <p className="text-2xl md:text-5xl fw-[700] leading-relaxed">
              Love is a fruit in season at all times, and within 
              reach of every hand. It is the greatest gift anyone 
              can give.
            </p>
          </div>
          
          <div>
            <Link 
              to="/membership" 
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-[#292929] font-semibold py-3 px-6 rounded-full transition-colors duration-300 text-lg"
            >
              Join Our Community
            </Link>
          </div>
        </div>
        
        {/* Divider line */}
        <div className="h-px bg-gray-700 w-full my-8"></div>
        
        {/* Bottom section with copyright and links */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-lg">© Etherean Mission Int.</p>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-lg">
              Contact
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-lg">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-lg">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);