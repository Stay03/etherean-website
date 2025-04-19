// src/components/quiz/questions/EssayQuestion.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, Clock, AlertCircle } from 'lucide-react';

/**
 * Component for rendering essay quiz questions
 * 
 * @param {Object} props
 * @param {Object} props.question - Question data
 * @param {Object} props.answer - User's answer data (if any)
 * @param {boolean} props.isSubmitting - Whether an answer is being submitted
 * @param {Function} props.onSubmitAnswer - Callback when an answer is submitted
 */
const EssayQuestion = ({
  question,
  answer,
  isSubmitting,
  onSubmitAnswer
}) => {
  // Track essay text and validation state
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  
  // Check if the question has already been answered
  const isAnswered = answer?.isSubmitted === true;
  
  // Set the text if there's an existing answer
  useEffect(() => {
    if (answer?.answer_text) {
      setText(answer.answer_text);
      validateText(answer.answer_text);
    }
  }, [answer]);
  
  // Validate text when it changes
  const validateText = (value) => {
    // Simple validation: check if text is not empty and meets minimum length
    const minLength = question.min_length || 1;
    
    if (!value || value.trim() === '') {
      setIsValid(false);
      setValidationMessage('Answer cannot be empty');
    } else if (value.length < minLength) {
      setIsValid(false);
      setValidationMessage(`Answer must be at least ${minLength} characters`);
    } else {
      setIsValid(true);
      setValidationMessage('');
    }
    
    return value && value.trim() !== '' && value.length >= minLength;
  };
  
  // Handle textarea input
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    validateText(value);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid || isSubmitting || isAnswered) return;
    
    try {
      await onSubmitAnswer({ text });
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {/* Word counter and character limits */}
        {question.min_length || question.max_length ? (
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              {question.min_length && `Minimum ${question.min_length} characters`}
            </span>
            <span>
              {question.max_length && `Maximum ${question.max_length} characters`}
            </span>
          </div>
        ) : null}
        
        {/* Textarea */}
        <div className="relative">
          <textarea
            className={`w-full p-3 border rounded-lg min-h-40 transition-colors focus:outline-none focus:ring-2 ${
              isAnswered 
                ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                : isValid
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder={question.placeholder || "Enter your answer here..."}
            value={text}
            onChange={handleTextChange}
            disabled={isSubmitting || isAnswered}
            readOnly={isAnswered}
            maxLength={question.max_length}
            rows={6}
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {text.length} {question.max_length && `/ ${question.max_length}`} characters
          </div>
        </div>
        
        {/* Validation message */}
        {validationMessage && !isAnswered && (
          <p className="text-xs text-red-600 mt-1">{validationMessage}</p>
        )}
        
        {/* Submission status */}
        {isAnswered && (
          <div className="flex items-center mt-2">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-green-700">
              Your answer has been submitted
            </span>
          </div>
        )}
      </div>
      
      {/* Pending review notice for essays */}
      {isAnswered && (
        <div className="p-3 rounded-md bg-yellow-50 border border-yellow-100">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Pending Review
              </p>
              <p className="mt-1 text-sm text-yellow-700">
                Essay answers are reviewed by an instructor. Check back later to see feedback.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Submit button */}
      {!isAnswered && (
        <div className="flex justify-end mt-2">
          <motion.button
            whileHover={{ scale: isValid && !isSubmitting ? 1.05 : 1 }}
            whileTap={{ scale: isValid && !isSubmitting ? 0.95 : 1 }}
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors
              ${!isValid || isSubmitting 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
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
    </form>
  );
};

export default EssayQuestion;