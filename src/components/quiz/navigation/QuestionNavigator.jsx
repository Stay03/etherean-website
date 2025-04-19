// src/components/quiz/navigation/QuestionNavigator.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Flag, HelpCircle } from 'lucide-react';

/**
 * Navigation component for selecting specific quiz questions
 * Supports both horizontal (mobile) and vertical (desktop) variants
 * 
 * @param {Object} props
 * @param {Array} props.questions - Array of question objects
 * @param {number} props.currentIndex - Current question index
 * @param {Object} props.answers - Object containing user answers
 * @param {Array} props.flaggedQuestions - Array of flagged question IDs
 * @param {Function} props.onSelectQuestion - Callback when a question is selected
 * @param {string} props.variant - Layout variant ('vertical' or 'horizontal')
 */
const QuestionNavigator = ({
  questions = [],
  currentIndex = 0,
  answers = {},
  flaggedQuestions = [],
  onSelectQuestion,
  variant = 'vertical'
}) => {
  // If no questions, don't render
  if (!questions.length) return null;
  
  // Determine classes based on variant
  const containerClasses = variant === 'horizontal'
    ? 'flex flex-wrap justify-center gap-2 py-2 px-4 overflow-x-auto'
    : 'flex flex-col space-y-2 p-2';
  
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg ${variant === 'horizontal' ? '' : 'sticky top-4'}`}>
      <div className="bg-gray-100 p-2 border-b border-gray-200 rounded-t-lg">
        <h3 className="text-sm font-medium text-gray-700 text-center">
          Question Navigator
        </h3>
      </div>
      
      <div className={containerClasses}>
        {questions.map((question, index) => {
          // Check answer and flag status
          const isCurrentQuestion = index === currentIndex;
          const isAnswered = !!answers[question.id];
          const isFlagged = flaggedQuestions.includes(question.id);
          
          // Determine styling based on status
          let bgColor = 'bg-white';
          let textColor = 'text-gray-700';
          let borderColor = 'border-gray-300';
          let hoverBg = 'hover:bg-gray-50';
          
          if (isCurrentQuestion) {
            bgColor = 'bg-blue-600';
            textColor = 'text-white';
            borderColor = 'border-blue-600';
            hoverBg = '';
          } else if (isAnswered) {
            bgColor = 'bg-green-50';
            textColor = 'text-green-700';
            borderColor = 'border-green-200';
            hoverBg = 'hover:bg-green-100';
          }
          
          return (
            <motion.button
              key={question.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectQuestion(index)}
              className={`flex items-center justify-center ${variant === 'horizontal' 
                ? 'h-10 w-10 rounded-full' 
                : 'py-2 px-3 rounded-lg'} border ${bgColor} ${textColor} ${borderColor} ${hoverBg} 
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isFlagged ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
            >
              {variant === 'horizontal' ? (
                // Horizontal variant (numbers with icons)
                <>
                  {isAnswered ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : isFlagged ? (
                    <Flag className="h-4 w-4 text-red-500" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </>
              ) : (
                // Vertical variant (numbers with text and icons)
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium">Question {index + 1}</span>
                  <div className="flex space-x-1">
                    {isAnswered && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {isFlagged && (
                      <Flag className="h-4 w-4 text-red-500" />
                    )}
                    {!isAnswered && !isFlagged && (
                      <HelpCircle className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(QuestionNavigator);