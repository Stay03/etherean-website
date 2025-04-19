// src/components/quiz/results/QuizProgressSummary.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, CheckCircle, AlertTriangle, FileText, HelpCircle, ArrowRight, Star } from 'lucide-react';

/**
 * Enhanced component to display quiz progress summary with visual elements
 * 
 * @param {Object} props
 * @param {Object} props.progressData - Quiz progress data from API
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 * @param {number} props.elapsedTime - Time spent in seconds
 */
const QuizProgressSummary = ({ 
  progressData, 
  isLoading, 
  error,
  elapsedTime = 0
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
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

  // Check for valid data
  if (!progressData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
        <div className="flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-700">No progress data available</p>
        </div>
      </div>
    );
  }

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const pad = (num) => num.toString().padStart(2, '0');
    
    if (hours > 0) {
      return `${hours}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
    }
    
    return `${minutes}m ${pad(remainingSeconds)}s`;
  };

  // Extract data from progressData
  const { 
    progress_percentage = 0,
    total_questions = 0, 
    answered_questions = 0, 
    is_completed = false, 
    fully_graded = false,
    has_essay_questions = false,
    essay_questions_pending_grading = 0,
    current_score = 0,
    correct_answers = 0,
    incorrect_answers = 0,
    time_spent = elapsedTime
  } = progressData;

  // Score rating based on percentage
  const getScoreRating = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 80) return { label: 'Very Good', color: 'text-green-600' };
    if (score >= 70) return { label: 'Good', color: 'text-yellow-600' };
    if (score >= 60) return { label: 'Satisfactory', color: 'text-yellow-600' };
    return { label: 'Needs Improvement', color: 'text-red-600' };
  };

  const scoreRating = getScoreRating(current_score);

  return (
    <div className="space-y-6">
      {/* Score overview card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Quiz Results</h3>
            
            <div className="mt-4 relative">
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
                <div className="text-4xl font-bold">{current_score}%</div>
              </div>
              
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                {scoreRating.label}
              </div>
            </div>
            
            {has_essay_questions && essay_questions_pending_grading > 0 && (
              <p className="text-sm text-blue-100 mt-4 text-center">
                Note: Score may change after essay grading is complete
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {/* Score details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">Correct</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-green-700">{correct_answers}</div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-900">Incorrect</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-red-700">{incorrect_answers}</div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Time Spent</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-700">{formatTime(time_spent)}</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-6">
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
                className="h-2.5 rounded-full bg-green-600"
                style={{ width: `${progress_percentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Status cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg border border-green-200 bg-green-50 flex items-start">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  Quiz Complete
                </h4>
                <p className="text-xs mt-1 text-green-700">
                  You have completed all questions in this quiz.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border flex items-start bg-blue-50 border-blue-200">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  {fully_graded ? 'Fully Graded' : 'Grading Status'}
                </h4>
                <p className="text-xs mt-1 text-blue-700">
                  {has_essay_questions && essay_questions_pending_grading > 0 
                    ? `${essay_questions_pending_grading} essay question${essay_questions_pending_grading > 1 ? 's' : ''} pending review.` 
                    : fully_graded 
                      ? 'All questions have been graded.' 
                      : 'Multiple choice questions are graded automatically.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Performance insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-md font-medium text-gray-800 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            Performance Insights
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {/* Completion time */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                Time Analysis
              </h4>
              <p className="text-sm text-gray-600">
                You completed this quiz in {formatTime(time_spent)}, which is 
                {time_spent < 120 ? ' very quick!' : time_spent < 300 ? ' a good pace.' : ' thorough and detailed.'} 
                {total_questions > 0 && ` That's an average of ${Math.round(time_spent / total_questions)} seconds per question.`}
              </p>
            </div>
            
            {/* Strength areas */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Areas of Strength
              </h4>
              <p className="text-sm text-gray-600">
                {current_score >= 80 
                  ? 'You demonstrated excellent knowledge across most areas covered in this quiz.'
                  : current_score >= 60
                    ? 'You showed good understanding of key concepts in this quiz.'
                    : 'You correctly answered several questions, showing some understanding of the material.'}
              </p>
            </div>
            
            {/* Improvement areas */}
            {current_score < 100 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-500 mr-1" />
                  Areas for Improvement
                </h4>
                <p className="text-sm text-gray-600">
                  {current_score >= 80 
                    ? 'Review the few questions you missed to achieve mastery of the subject.'
                    : current_score >= 60
                      ? 'Focus on reviewing the questions you missed to strengthen your understanding.'
                      : 'Consider revisiting the course material to strengthen your knowledge before retaking the quiz.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizProgressSummary;