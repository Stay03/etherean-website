// src/components/quiz/navigation/ProgressBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Progress bar component for visualizing quiz completion
 * 
 * @param {Object} props
 * @param {number} props.percentage - Progress percentage (0-100)
 * @param {string} props.variant - Visual style variant (default, success, etc.)
 */
const ProgressBar = ({ percentage = 0, variant = 'default' }) => {
  // Ensure percentage is within valid range
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Determine color based on variant and progress
  let bgColor = 'bg-blue-600';
  
  if (variant === 'success' || clampedPercentage === 100) {
    bgColor = 'bg-green-600';
  } else if (variant === 'warning') {
    bgColor = 'bg-amber-600';
  }
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <motion.div 
        className={`h-2.5 rounded-full ${bgColor}`}
        initial={{ width: 0 }}
        animate={{ width: `${clampedPercentage}%` }}
        transition={{ 
          type: 'spring', 
          stiffness: 60, 
          damping: 15
        }}
      />
    </div>
  );
};

export default React.memo(ProgressBar);