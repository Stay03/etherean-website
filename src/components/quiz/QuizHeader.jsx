// src/components/quiz/QuizHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
// import QuizTimer from './shared/QuizTimer';

/**
 * Header component for quiz displaying title, subtitle and controls
 * 
 * @param {Object} props
 * @param {string} props.title - Quiz title
 * @param {string} props.subtitle - Quiz subtitle/description
 * @param {Function} props.onReturn - Callback function when return button is clicked
 * @param {boolean} props.showTimer - Whether to show the quiz timer
 * @param {number} props.elapsedTime - Elapsed time in seconds
 */
const QuizHeader = ({ 
  title, 
  subtitle, 
  onReturn,
  showTimer = false,
  elapsedTime = 0
}) => {
  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const pad = (num) => num.toString().padStart(2, '0');
    
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onReturn}
            className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Return"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-blue-100 mt-1 max-w-2xl">{subtitle}</p>
            )}
          </div>
        </div>
        
        {showTimer && (
          <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
            <Clock className="h-4 w-4 mr-2 text-blue-200" />
            <div className="text-sm font-medium tracking-wider">
              {formatTime(elapsedTime)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHeader;