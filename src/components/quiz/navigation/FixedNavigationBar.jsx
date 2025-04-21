// src/components/quiz/navigation/FixedNavigationBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

/**
 * Fixed navigation bar with progress bar and navigation controls
 * Stays at the bottom of the screen while scrolling
 * 
 * @param {Object} props
 * @param {number} props.currentIndex - Current question index
 * @param {number} props.totalQuestions - Total number of questions
 * @param {number} props.answeredQuestions - Number of answered questions
 * @param {number} props.progressPercentage - Progress percentage (0-100)
 * @param {Function} props.onPrevious - Callback for previous button
 * @param {Function} props.onNext - Callback for next button
 */
const FixedNavigationBar = ({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  progressPercentage,
  onPrevious,
  onNext
}) => {
  // Check if we're on the first or last question
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md px-4 py-3">
      <div className="max-w-6xl mx-auto">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
            <span className="font-medium">Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{answeredQuestions} of {totalQuestions} answered</span>
          </div>
          <ProgressBar percentage={progressPercentage} />
        </div>
        
        {/* Navigation buttons */}
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
          
          {/* Question indicators (dots) */}
          <div className="hidden sm:flex space-x-1">
            {Array.from({ length: Math.min(totalQuestions, 10) }).map((_, idx) => {
              // Only show max 10 dots on smaller screens
              const questionIndex = Math.floor(idx * (totalQuestions / Math.min(totalQuestions, 10)));
              const isCurrent = questionIndex === currentIndex;
              
              return (
                <div 
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    isCurrent 
                      ? 'bg-blue-600' 
                      : questionIndex < currentIndex 
                        ? 'bg-blue-300' 
                        : 'bg-gray-300'
                  }`}
                />
              );
            })}
          </div>
          
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
      </div>
    </div>
  );
};

export default FixedNavigationBar;