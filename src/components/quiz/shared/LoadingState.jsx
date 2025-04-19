// src/components/quiz/shared/LoadingState.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading state component for quiz
 * 
 * @param {Object} props
 * @param {string} props.message - Loading message to display
 */
const LoadingState = ({ message = 'Loading...' }) => {
  // Animation variants for staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-72 flex flex-col items-center justify-center p-8 rounded-lg bg-white border border-gray-200 shadow-sm">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
      >
        {/* Loading spinner */}
        <motion.div 
          variants={item}
          className="w-12 h-12 mb-4 relative"
        >
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </motion.div>
        
        {/* Loading message */}
        <motion.p 
          variants={item}
          className="text-gray-700 font-medium mt-2"
        >
          {message}
        </motion.p>
        
        {/* Loading description */}
        <motion.p 
          variants={item}
          className="text-sm text-gray-500 text-center max-w-xs mt-2"
        >
          We're loading your quiz and any previous progress. This should only take a moment.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingState;