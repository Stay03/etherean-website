// src/components/quiz/questions/MultipleChoiceQuestion.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Save } from 'lucide-react';

/**
 * Component for rendering multiple choice or true/false quiz questions
 * with a manual save button rather than auto-submit
 * 
 * @param {Object} props
 * @param {Object} props.question - Question data
 * @param {Object} props.answer - User's answer data (if any)
 * @param {boolean} props.isSubmitting - Whether an answer is being submitted
 * @param {Function} props.onSubmitAnswer - Callback when an answer is submitted
 */
const MultipleChoiceQuestion = ({
  question,
  answer,
  isSubmitting,
  onSubmitAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Check if question has already been answered
  const isAnswered = !!answer?.selected_option;
  
  // Set the selected option if there's an existing answer
  useEffect(() => {
    if (answer?.selected_option) {
      setSelectedOption(answer.selected_option.id);
    }
  }, [answer]);
  
  // Handle option selection (just update local state, don't submit)
  const handleOptionSelect = (optionId) => {
    if (isAnswered || isSubmitting) return;
    setSelectedOption(optionId);
  };
  
  // Handle save/submit button click
  const handleSubmit = async () => {
    if (isAnswered || isSubmitting || !selectedOption) return;
    
    try {
      await onSubmitAnswer({ optionId: selectedOption });
      
      // Show feedback briefly
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Feedback message */}
      <AnimatePresence>
        {showFeedback && answer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-3 rounded-md mb-4 ${
              answer.is_correct === true 
                ? 'bg-green-50 border border-green-100' 
                : answer.is_correct === false 
                  ? 'bg-red-50 border border-red-100' 
                  : 'bg-blue-50 border border-blue-100'
            }`}
          >
            <div className="flex items-start">
              {answer.is_correct === true ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              ) : answer.is_correct === false ? (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              )}
              
              <div>
                <p className={`text-sm font-medium ${
                  answer.is_correct === true 
                    ? 'text-green-800' 
                    : answer.is_correct === false 
                      ? 'text-red-800' 
                      : 'text-blue-800'
                }`}>
                  {answer.is_correct === true 
                    ? 'Correct!' 
                    : answer.is_correct === false 
                      ? 'Incorrect' 
                      : 'Answer recorded'}
                </p>
                
                {answer.feedback && (
                  <p className="mt-1 text-sm text-gray-600">{answer.feedback}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Options */}
      <div className="space-y-2">
        {question.options.map(option => {
          // Determine if this option was selected
          const isSelected = selectedOption === option.id;
          
          // Determine if this option is correct (only show after answering)
          const isCorrectOption = isAnswered && option.is_correct;
          
          // Determine styling based on state
          let optionStyle = '';
          
          if (isAnswered) {
            if (answer.selected_option.id === option.id) {
              optionStyle = answer.is_correct 
                ? 'bg-green-50 border-green-300 ring-green-500'
                : 'bg-red-50 border-red-300 ring-red-500';
            } else if (isCorrectOption) {
              optionStyle = 'bg-green-50 border-green-300';
            } else {
              optionStyle = 'bg-gray-50 border-gray-200 opacity-70';
            }
          } else {
            optionStyle = isSelected
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500 ring-offset-2'
              : 'bg-white border-gray-300 hover:bg-gray-50';
          }
          
          return (
            <motion.button
              key={option.id}
              whileHover={isAnswered ? {} : { scale: 1.01 }}
              whileTap={isAnswered ? {} : { scale: 0.99 }}
              onClick={() => handleOptionSelect(option.id)}
              disabled={isSubmitting || isAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-all focus:outline-none ${optionStyle}
                ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
              type="button" // Ensure it doesn't submit forms
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-5 w-5 rounded-full border 
                  ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className="ml-3 text-gray-900 font-medium">{option.option_text}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Save Answer button (only show if not answered yet) */}
      {!isAnswered && (
        <div className="flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: selectedOption && !isSubmitting ? 1.05 : 1 }}
            whileTap={{ scale: selectedOption && !isSubmitting ? 0.95 : 1 }}
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
            className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors
              ${!selectedOption || isSubmitting 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            type="button"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Answer
              </>
            )}
          </motion.button>
        </div>
      )}
      
      {/* Loading indicator while submitting */}
      {isSubmitting && (
        <div className="flex justify-center mt-4">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Submitting...</span>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;