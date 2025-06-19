import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, CheckCircle, AlertTriangle, FileText, HelpCircle, ArrowRight } from 'lucide-react';

/**
 * Component to display quiz progress summary with robust data handling
 * 
 * @param {Object} props
 * @param {Object} props.progressData - Quiz progress data from API
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 * @param {Function} props.onContinue - Callback function when continue button is clicked
 */
const QuizProgressSummary = ({ progressData, isLoading, error, onContinue }) => {
  // Add console log to see exactly what data we're receiving
  console.log('QuizProgressSummary data received:', progressData);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-red-700">Error loading quiz progress: {error}</p>
        </div>
      </div>
    );
  }

  // FIXED: Check if the required properties exist directly on progressData
  // This fixes the issue where progressData doesn't have a 'data' property
  const hasValidData = progressData && 
                       typeof progressData.progress_percentage === 'number' &&
                       typeof progressData.total_questions === 'number' &&
                       typeof progressData.answered_questions === 'number' &&
                       typeof progressData.is_completed === 'boolean';
  
  if (!hasValidData) {
    console.warn('Invalid progress data structure:', progressData);
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <div className="flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-700">No progress data available</p>
        </div>
      </div>
    );
  }

  // Extract properties directly from progressData
  const { 
    progress_percentage,
    total_questions, 
    answered_questions, 
    is_completed, 
    fully_graded,
    has_essay_questions,
    essay_questions_pending_grading,
    current_score
  } = progressData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
    >
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-amber-600" />
          Quiz Progress Summary
        </h3>
      </div>

      <div className="p-4">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Completion: {progress_percentage}%
            </span>
            <span className="text-sm text-gray-500">
              {answered_questions}/{total_questions} questions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${is_completed ? 'bg-green-600' : 'bg-amber-600'}`}
              style={{ width: `${progress_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className={`p-3 rounded-lg border flex items-start ${is_completed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`p-2 rounded-full ${is_completed ? 'bg-green-100' : 'bg-amber-100'} mr-3`}>
              {is_completed ? 
                <CheckCircle className="h-5 w-5 text-green-600" /> : 
                <Clock className="h-5 w-5 text-amber-600" />
              }
            </div>
            <div>
              <h4 className={`text-sm font-medium ${is_completed ? 'text-green-800' : 'text-amber-800'}`}>
                {is_completed ? 'Quiz Completed' : 'Quiz In Progress'}
              </h4>
              <p className={`text-xs mt-1 ${is_completed ? 'text-green-700' : 'text-amber-700'}`}>
                {is_completed 
                  ? 'You have completed all questions in this quiz.' 
                  : `${total_questions - answered_questions} questions remaining.`}
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-lg border flex items-start ${fully_graded ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
            <div className={`p-2 rounded-full ${fully_graded ? 'bg-green-100' : 'bg-blue-100'} mr-3`}>
              <Award className={`h-5 w-5 ${fully_graded ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${fully_graded ? 'text-green-800' : 'text-blue-800'}`}>
                {fully_graded ? 'Fully Graded' : 'Grading Status'}
              </h4>
              <p className={`text-xs mt-1 ${fully_graded ? 'text-green-700' : 'text-blue-700'}`}>
                {has_essay_questions && essay_questions_pending_grading > 0 
                  ? `${essay_questions_pending_grading} essay question${essay_questions_pending_grading > 1 ? 's' : ''} pending review.` 
                  : fully_graded 
                    ? 'All questions have been graded.' 
                    : 'Multiple choice questions are graded automatically.'}
              </p>
            </div>
          </div>
        </div>



        {/* Score display */}
        {is_completed && (
          <div className="mt-5 text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Score</h4>
            <div className="inline-flex items-center justify-center p-4 bg-amber-50 rounded-full border border-amber-200">
              <span className="text-2xl font-bold text-amber-700">{current_score}%</span>
            </div>
            {has_essay_questions && essay_questions_pending_grading > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Note: Final score may change after essay questions are graded.
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizProgressSummary;