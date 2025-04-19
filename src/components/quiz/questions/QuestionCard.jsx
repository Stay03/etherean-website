// src/components/quiz/questions/QuestionCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';

/**
 * Container component for quiz questions with consistent styling
 * 
 * @param {Object} props
 * @param {Object} props.question - Question data
 * @param {React.ReactNode} props.children - Question content components
 * @param {boolean} props.showFlagOption - Whether to show the flag button
 * @param {boolean} props.isFlagged - Whether the question is flagged
 * @param {Function} props.onToggleFlag - Callback when flag button is clicked
 */
const QuestionCard = ({ 
  question, 
  children, 
  showFlagOption = false,
  isFlagged = false,
  onToggleFlag
}) => {
  if (!question) return null;
  
  // Get question type label
  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'multiple_choice':
        return 'Multiple Choice';
      case 'true_false':
        return 'True/False';
      case 'essay':
        return 'Essay Question';
      default:
        return 'Question';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getQuestionTypeLabel(question.question_type)}
            </span>
            
            {question.difficulty && (
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${question.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900">
            {question.question_text}
          </h3>
          
          {question.description && (
            <p className="mt-1 text-sm text-gray-600">{question.description}</p>
          )}
        </div>
        
        {showFlagOption && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFlag}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${isFlagged ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            aria-label={isFlagged ? "Unflag question" : "Flag question for review"}
            title={isFlagged ? "Unflag question" : "Flag question for review"}
          >
            <Flag className="h-5 w-5" />
            <span className="sr-only">
              {isFlagged ? "Unflag question" : "Flag question for review"}
            </span>
          </motion.button>
        )}
      </div>
      
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
};

export default QuestionCard;