// src/components/quiz/navigation/FlaggedQuestionsPanel.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag } from 'lucide-react';

/**
 * Panel that displays a list of flagged questions for quick navigation
 * 
 * @param {Object} props
 * @param {Array} props.questions - Array of question objects
 * @param {Array} props.flaggedQuestions - Array of flagged question IDs
 * @param {Function} props.onSelectQuestion - Callback when a question is selected
 * @param {Function} props.onClose - Callback when panel is closed
 * @param {Function} props.unflagQuestion - Callback to unflag a question
 */
const FlaggedQuestionsPanel = ({
  questions = [],
  flaggedQuestions = [],
  onSelectQuestion,
  onClose,
  unflagQuestion
}) => {
  // If no flagged questions, don't render
  if (!flaggedQuestions.length) return null;
  
  // Filter to only flagged questions and sort by index
  const flaggedItems = questions
    .filter(question => flaggedQuestions.includes(question.id))
    .map((question, idx) => {
      const questionIndex = questions.findIndex(q => q.id === question.id);
      return { ...question, index: questionIndex };
    })
    .sort((a, b) => a.index - b.index);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white border border-red-200 rounded-lg shadow-md mb-6 overflow-hidden"
      >
        <div className="bg-red-50 p-3 border-b border-red-200 flex justify-between items-center">
          <div className="flex items-center">
            <Flag className="h-4 w-4 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">
              Flagged Questions ({flaggedItems.length})
            </h3>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="p-2">
          <div className="divide-y divide-gray-100">
            {flaggedItems.map(question => (
              <div key={question.id} className="py-2 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onSelectQuestion(question.index)}
                    className="flex-grow text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-medium mr-2">
                        {question.index + 1}
                      </span>
                      <span className="text-sm text-gray-900 line-clamp-1">
                        {question.question_text}
                      </span>
                    </div>
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => unflagQuestion(question.id)}
                    className="ml-2 p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="Unflag question"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlaggedQuestionsPanel;