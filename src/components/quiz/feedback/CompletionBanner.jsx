// src/components/quiz/feedback/CompletionBanner.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Loader } from 'lucide-react';

/**
 * Banner that displays when all quiz questions have been answered
 * 
 * @param {Object} props
 * @param {boolean} props.isProcessing - Whether results are still processing
 */
const CompletionBanner = ({ isProcessing = true }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start"
    >
      <div className="flex-shrink-0 mr-3">
        {isProcessing ? (
          <div className="p-1 bg-green-100 rounded-full">
            <Loader className="h-5 w-5 text-green-600 animate-spin" />
          </div>
        ) : (
          <div className="p-1 bg-green-100 rounded-full">
            <Award className="h-5 w-5 text-green-600" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-green-800">
            {isProcessing 
              ? "Quiz complete! Processing results..." 
              : "Quiz complete! Results ready"}
          </h3>
        </div>
        
        <p className="mt-1 text-sm text-green-700">
          {isProcessing 
            ? "You've answered all questions. Your results are being processed and will appear shortly."
            : "You've completed the quiz. View your results to see how you did."}
        </p>
        
        {isProcessing && (
          <div className="mt-2 flex items-center">
            <div className="w-full bg-green-200 rounded-full h-1">
              <motion.div 
                className="bg-green-600 h-1 rounded-full"
                initial={{ width: "5%" }}
                animate={{ 
                  width: "95%",
                  transition: { duration: 3, ease: "easeInOut" }
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompletionBanner;