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
    // Priority order for time:
    // 1. Use elapsed time passed as prop if available (this is the "frozen" time)
    // 2. Use time_spent from progressData if available
    // 3. Default to 0 if neither is available
    time_spent = progressData.time_spent || 0
  } = progressData;

  // Use the elapsed time prop if provided, otherwise fall back to time_spent from data
  const displayTime = elapsedTime > 0 ? elapsedTime : time_spent;

  // Calculate correct and incorrect answers based on the answers data (if available)
  // This ensures we're using the correct data, not just what's in the summary
  let correct_answers = 0;
  let incorrect_answers = 0;
  let current_score = 0;

  if (progressData.attempt && progressData.attempt.answers && Array.isArray(progressData.attempt.answers)) {
    // Count actual correct/incorrect answers from the answers array
    progressData.attempt.answers.forEach(answer => {
      if (answer.is_correct === true) {
        correct_answers++;
      } else if (answer.is_correct === false && answer.quiz_question.question_type !== 'essay') {
        // Only count as incorrect if it's not an essay question
        incorrect_answers++;
      }
    });
    
    // Calculate the score based on these counts
    if (total_questions > 0) {
      current_score = (correct_answers / total_questions) * 100;
    }
  } else {
    // Fallback to values provided in the summary if available
    correct_answers = progressData.correct_answers || 0;
    incorrect_answers = progressData.incorrect_answers || 0;
    current_score = progressData.current_score || 0;
  }

  // Format the score to 2 decimal places
  const formattedScore = current_score.toFixed(2);

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
                <div className="text-4xl font-bold">{formattedScore}%</div>
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
              <div className="mt-2 text-2xl font-bold text-blue-700">{formatTime(displayTime)}</div>
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
        {(() => {
          // Handle edge case: no time spent
          if (displayTime <= 0) {
            return (
              <p className="text-sm text-gray-600">
                Time data is not available for this quiz attempt.
              </p>
            );
          }
          
          // Handle edge case: no questions answered
          if (total_questions <= 0) {
            return (
              <p className="text-sm text-gray-600">
                You spent {formatTime(displayTime)} on this quiz.
              </p>
            );
          }
          
          // Calculate average time per question
          const avgTimePerQuestion = displayTime / total_questions;
          
          // Handle suspiciously quick completion (potential guessing)
          if (avgTimePerQuestion < 3 && total_questions > 5) {
            return (
              <p className="text-sm text-gray-600">
                You completed this quiz in {formatTime(displayTime)} (averaging just {Math.round(avgTimePerQuestion)} seconds per question). 
                This is extremely quick, which might indicate guessing. Consider taking more time to read questions carefully.
              </p>
            );
          }
          
          // Normal time analysis with more granular categories
          let timeAssessment;
          if (avgTimePerQuestion < 10) {
            timeAssessment = "very quickly, suggesting you're familiar with the material or worked at a fast pace";
          } else if (avgTimePerQuestion < 30) {
            timeAssessment = "at a good, steady pace";
          } else if (avgTimePerQuestion < 60) {
            timeAssessment = "thoroughly, taking time to consider each question";
          } else {
            timeAssessment = "very methodically, dedicating significant time to each question";
          }
          
          return (
            <p className="text-sm text-gray-600">
              You completed this quiz in {formatTime(displayTime)} {timeAssessment}. 
              That's an average of {Math.round(avgTimePerQuestion)} seconds per question.
              {has_essay_questions && " Note that essay questions typically require more time than multiple choice questions."}
            </p>
          );
        })()}
      </div>
      
      {/* Strength areas */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          Areas of Strength
        </h4>
        {(() => {
          // Handle edge case: no questions answered correctly
          if (correct_answers <= 0) {
            return (
              <p className="text-sm text-gray-600">
                You haven't answered any questions correctly in this attempt. Don't be discouraged - 
                review the material and try again with a focus on understanding the key concepts.
              </p>
            );
          }
          
          // Handle edge case: perfect score
          if (current_score >= 100) {
            return (
              <p className="text-sm text-gray-600">
                Excellent work! You achieved a perfect score, demonstrating mastery of all concepts covered in this quiz.
                {total_questions >= 10 ? " This is particularly impressive given the comprehensive nature of this assessment." : ""}
              </p>
            );
          }
          
          // Normal strength analysis with more detailed feedback
          const strengthPercentage = (correct_answers / total_questions) * 100;
          
          if (strengthPercentage >= 90) {
            return (
              <p className="text-sm text-gray-600">
                You demonstrated excellent knowledge across most areas covered in this quiz, correctly answering {correct_answers} out of {total_questions} questions.
                {total_questions >= 15 ? " Your consistent performance across a wide range of questions shows comprehensive understanding." : ""}
              </p>
            );
          } else if (strengthPercentage >= 70) {
            return (
              <p className="text-sm text-gray-600">
                You showed strong understanding of key concepts, correctly answering {correct_answers} out of {total_questions} questions. 
                {incorrect_answers <= 2 ? " With just a few more correct answers, you'll achieve an excellent score." : ""}
              </p>
            );
          } else if (strengthPercentage >= 50) {
            return (
              <p className="text-sm text-gray-600">
                You demonstrated good understanding of some core concepts, correctly answering {correct_answers} out of {total_questions} questions.
              </p>
            );
          } else {
            return (
              <p className="text-sm text-gray-600">
                You correctly answered {correct_answers} out of {total_questions} questions, showing understanding of some aspects of the material.
              </p>
            );
          }
        })()}
      </div>
      
      {/* Improvement areas */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <ArrowRight className="h-4 w-4 text-blue-500 mr-1" />
          Areas for Improvement
        </h4>
        {(() => {
          // Handle edge case: perfect score
          if (current_score >= 100) {
            return (
              <p className="text-sm text-gray-600">
                You've mastered all concepts in this quiz! If you want to challenge yourself further, consider exploring advanced topics in this subject area.
              </p>
            );
          }
          
          // Handle edge case: no questions answered
          if (answered_questions <= 0) {
            return (
              <p className="text-sm text-gray-600">
                You haven't completed any questions in this quiz. Get started by answering the questions to receive personalized feedback.
              </p>
            );
          }
          
          // Handle edge case: essay questions pending
          if (has_essay_questions && essay_questions_pending_grading > 0) {
            return (
              <p className="text-sm text-gray-600">
                Your final assessment will be more complete once your {essay_questions_pending_grading} essay question{essay_questions_pending_grading > 1 ? 's' : ''} {essay_questions_pending_grading > 1 ? 'are' : 'is'} graded. 
                For now, focus on reviewing the multiple-choice questions you missed.
                {incorrect_answers > 0 ? ` You answered ${incorrect_answers} question${incorrect_answers > 1 ? 's' : ''} incorrectly.` : ''}
              </p>
            );
          }
          
          // Normal improvement analysis with more detailed feedback
          if (current_score >= 90 && current_score < 100) {
            return (
              <p className="text-sm text-gray-600">
                You're very close to perfection! Review the {incorrect_answers} question{incorrect_answers > 1 ? 's' : ''} you missed to achieve complete mastery of the subject.
              </p>
            );
          } else if (current_score >= 70) {
            return (
              <p className="text-sm text-gray-600">
                Focus on reviewing the {incorrect_answers} question{incorrect_answers > 1 ? 's' : ''} you missed to strengthen your understanding. 
                Pay special attention to any patterns in the types of questions you found challenging.
              </p>
            );
          } else if (current_score >= 50) {
            return (
              <p className="text-sm text-gray-600">
                Consider revisiting key course materials related to the {incorrect_answers} questions you missed. 
                {total_questions - answered_questions > 0 ? ` Also, complete the remaining ${total_questions - answered_questions} unanswered question${total_questions - answered_questions > 1 ? 's' : ''}.` : ''}
              </p>
            );
          } else {
            return (
              <p className="text-sm text-gray-600">
                It's recommended to thoroughly review the course material to strengthen your understanding of these topics. 
                Focus particularly on fundamental concepts, as strengthening your foundation will help with more advanced concepts.
                {total_questions - answered_questions > 0 ? ` Make sure to answer all questions - you still have ${total_questions - answered_questions} unanswered.` : ''}
              </p>
            );
          }
        })()}
      </div>
      
      {/* Learning recommendations - New section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FileText className="h-4 w-4 text-purple-500 mr-1" />
          Learning Recommendations
        </h4>
        {(() => {
          // Handle edge case: quiz not started
          if (answered_questions <= 0) {
            return (
              <p className="text-sm text-gray-600">
                Recommendations will be available after you begin answering questions.
              </p>
            );
          }
          
          // Handle edge case: quiz not completed
          if (!is_completed && progress_percentage < 100) {
            return (
              <p className="text-sm text-gray-600">
                Complete all questions to receive personalized learning recommendations.
                You've completed {progress_percentage}% so far.
              </p>
            );
          }
          
          // Different recommendations based on score
          if (current_score >= 90) {
            return (
              <p className="text-sm text-gray-600">
                Your high performance suggests you're ready for more advanced material in this subject area.
                Consider challenging yourself with additional resources or the next level of coursework.
              </p>
            );
          } else if (current_score >= 70) {
            return (
              <p className="text-sm text-gray-600">
                To solidify your understanding, try reviewing specific sections related to the questions you missed.
                You have a good foundation but would benefit from targeted review of certain concepts.
              </p>
            );
          } else if (current_score >= 50) {
            return (
              <p className="text-sm text-gray-600">
                Consider revisiting key course modules and practice with additional exercises to improve your mastery of this material.
                Focus especially on the fundamental concepts that form the foundation of this subject.
              </p>
            );
          } else {
            return (
              <p className="text-sm text-gray-600">
                It would be beneficial to schedule additional study time for this material.
                Consider seeking help from an instructor or using supplementary learning resources to strengthen your understanding of these concepts.
              </p>
            );
          }
        })()}
      </div>
    </div>
  </div>
</motion.div>
    </div>
  );
};

export default QuizProgressSummary;