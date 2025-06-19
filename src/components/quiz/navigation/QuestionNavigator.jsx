// src/components/quiz/navigation/QuestionNavigator.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Flag, HelpCircle, Edit, Clock, FileText } from 'lucide-react';

/**
 * Enhanced navigation component for selecting specific quiz questions
 * Uses distinct colors and icons for different question states
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
          const answer = answers[question.id];
          const isAnswered = !!answer;
          const isFlagged = flaggedQuestions.includes(question.id);
          const isEssay = question.question_type === 'essay';
          const isMultipleChoice = question.question_type === 'multiple_choice' || question.question_type === 'true_false';
          
          // Determine icon and styling based on question state
          let StatusIcon = HelpCircle;
          let bgColor = 'bg-white';
          let textColor = 'text-gray-700';
          let borderColor = 'border-gray-300';
          let iconColor = 'text-gray-500';
          
          // Current question takes precedence in styling
          if (isCurrentQuestion) {
            bgColor = 'bg-blue-600';
            textColor = 'text-white';
            borderColor = 'border-blue-600';
            iconColor = 'text-white';
            StatusIcon = isAnswered ? (
              isEssay ? Edit : answer.is_correct ? CheckCircle : XCircle
            ) : question.question_type === 'essay' ? Edit : HelpCircle;
          }
          // Answered question - multiple choice with correct/incorrect status
          else if (isAnswered && isMultipleChoice) {
            if (answer.is_correct) {
              bgColor = 'bg-green-50';
              textColor = 'text-green-700';
              borderColor = 'border-green-200';
              iconColor = 'text-green-500';
              StatusIcon = CheckCircle;
            } else {
              bgColor = 'bg-red-50';
              textColor = 'text-red-700';
              borderColor = 'border-red-200';
              iconColor = 'text-red-500';
              StatusIcon = XCircle;
            }
          }
          // Answered essay question
          else if (isAnswered && isEssay) {
            bgColor = 'bg-amber-50';
            textColor = 'text-amber-700';
            borderColor = 'border-amber-200';
            iconColor = 'text-amber-500';
            StatusIcon = Edit;
          }
          // Flagged but not answered or current
          else if (isFlagged) {
            bgColor = 'bg-red-50';
            textColor = 'text-red-600';
            borderColor = 'border-red-200';
            iconColor = 'text-red-500';
            StatusIcon = Flag;
          }
          // Unanswered and not current - show question type
          else {
            StatusIcon = question.question_type === 'essay' ? Edit : FileText;
          }
          
          // Add flag indicator for flagged questions
          const ringStyle = isFlagged ? 'ring-2 ring-red-500 ring-offset-1' : '';
          
          return (
            <motion.button
              key={question.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectQuestion(index)}
              className={`flex items-center justify-center ${variant === 'horizontal' 
                ? 'h-10 w-10 rounded-full' 
                : 'py-2 px-3 rounded-lg'} border ${bgColor} ${textColor} ${borderColor}
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${ringStyle}`}
              aria-label={`Go to question ${index + 1}${isAnswered ? ' (answered)' : ''}${isFlagged ? ' (flagged)' : ''}`}
            >
              {variant === 'horizontal' ? (
                // Horizontal variant (numbers with icons)
                <div className="relative">
                  <StatusIcon className={`h-4 w-4 ${iconColor}`} />
                  
                  {/* Small number indicator */}
                  <span className="absolute -top-1.5 -right-1.5 text-[10px] font-semibold bg-white text-gray-700 rounded-full w-3 h-3 flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
              ) : (
                // Vertical variant (numbers with text and icons)
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    <span className="text-xs">
                      {question.question_type === 'essay' 
                        ? 'Essay' 
                        : question.question_type === 'multiple_choice'
                          ? 'Multiple Choice'
                          : 'True/False'}
                    </span>
                  </div>
                  
                  <StatusIcon className={`h-4 w-4 ${iconColor}`} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Mobile-friendly legend for horizontal layout */}
      {variant === 'horizontal' && (
        <div className="px-3 py-2 border-t border-gray-200 flex justify-center flex-wrap gap-x-3 gap-y-1">
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-gray-600">Correct</span>
          </div>
          <div className="flex items-center">
            <XCircle className="h-3 w-3 text-red-500 mr-1" />
            <span className="text-xs text-gray-600">Incorrect</span>
          </div>
          <div className="flex items-center">
            <Edit className="h-3 w-3 text-amber-500 mr-1" />
            <span className="text-xs text-gray-600">Essay</span>
          </div>
          <div className="flex items-center">
            <Flag className="h-3 w-3 text-red-500 mr-1" />
            <span className="text-xs text-gray-600">Flagged</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(QuestionNavigator);