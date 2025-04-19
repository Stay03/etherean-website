// src/components/quiz/navigation/NavigationControls.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Navigation controls for moving between quiz questions
 * 
 * @param {Object} props
 * @param {number} props.currentIndex - Current question index
 * @param {number} props.totalQuestions - Total number of questions
 * @param {Function} props.onPrevious - Callback for previous button
 * @param {Function} props.onNext - Callback for next button
 */
const NavigationControls = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext
}) => {
  // Check if we're on the first or last question
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  
  return (
    <div className="flex justify-between items-center">
      {/* Previous button */}
      <motion.button
        whileHover={isFirstQuestion ? {} : { scale: 1.05 }}
        whileTap={isFirstQuestion ? {} : { scale: 0.95 }}
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
          isFirstQuestion
            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Previous question"
      >
        <ChevronLeft className="mr-1.5 -ml-1 h-5 w-5" />
        Previous
      </motion.button>
      
      {/* Next button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={isLastQuestion}
        className={`inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLastQuestion
            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-transparent bg-blue-600 text-white hover:bg-blue-700'
        }`}
        aria-label="Next question"
      >
        Next
        <ChevronRight className="ml-1.5 -mr-1 h-5 w-5" />
      </motion.button>
    </div>
  );
};

export default React.memo(NavigationControls);