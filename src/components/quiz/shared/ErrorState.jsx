// src/components/quiz/shared/ErrorState.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * Error state component for quiz
 * 
 * @param {Object} props
 * @param {string} props.error - Error message to display
 * @param {Function} props.onReturn - Callback for return button
 * @param {Function} props.onRetry - Callback for retry button (optional)
 */
const ErrorState = ({ error, onReturn, onRetry }) => {
  return (
    <div className="min-h-72 p-8 rounded-lg bg-white border border-gray-200 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4"
        >
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </motion.div>
        
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          Error Loading Quiz
        </motion.h3>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6 max-w-md"
        >
          {error || "We encountered an error while loading your quiz. Please try again or return to the lesson."}
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturn}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Lesson
          </motion.button>
          
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="px-4 py-2 rounded-lg border border-transparent bg-blue-600 text-white font-medium inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorState;