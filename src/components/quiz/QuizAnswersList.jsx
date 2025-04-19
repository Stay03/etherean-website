import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, FileText, Edit, Clock } from 'lucide-react';

/**
 * Component to display detailed list of quiz answers
 * 
 * @param {Object} props
 * @param {Object} props.progressData - Quiz progress data from API
 */
const QuizAnswersList = ({ progressData }) => {
  // Log the progressData to see its structure
  console.log('QuizAnswersList received data:', progressData);
  
  if (!progressData || !progressData.attempt || !progressData.attempt.answers) {
    console.warn('Invalid answers data structure:', progressData);
    return null;
  }

  const { answers } = progressData.attempt;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-gray-600" />
          Answer Details
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {answers.map((answer, index) => (
          <AnswerItem key={answer.id} answer={answer} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Component to display a single answer item
 */
const AnswerItem = ({ answer, index }) => {
  const isMultipleChoice = answer.quiz_question.question_type === 'multiple_choice' || 
                           answer.quiz_question.question_type === 'true_false';
  const isEssay = answer.quiz_question.question_type === 'essay';
  const isEssayPendingGrading = isEssay && answer.graded_at === null;
  
  // Determine status icon and colors
  let StatusIcon = HelpCircle;
  let statusColor = 'text-gray-500';
  let bgColor = 'bg-gray-50';
  let borderColor = 'border-gray-200';
  let statusText = '';
  
  if (isMultipleChoice) {
    if (answer.is_correct === true) {
      StatusIcon = CheckCircle;
      statusColor = 'text-green-500';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      statusText = 'Correct';
    } else if (answer.is_correct === false) {
      StatusIcon = XCircle;
      statusColor = 'text-red-500';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      statusText = 'Incorrect';
    }
  } else if (isEssay) {
    if (isEssayPendingGrading) {
      StatusIcon = Clock;
      statusColor = 'text-amber-500';
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
      statusText = 'Pending Grading';
    } else {
      StatusIcon = Edit;
      statusColor = 'text-blue-500';
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-200';
      statusText = 'Graded';
    }
  }

  return (
    <div className={`p-4 ${bgColor} border-l-4 ${borderColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700">{index + 1}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h4 className="text-sm font-medium text-gray-900 mr-2">
              {answer.quiz_question.question_text}
            </h4>
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
              {answer.quiz_question.question_type === 'multiple_choice' 
                ? 'Multiple Choice' 
                : answer.quiz_question.question_type === 'true_false' 
                  ? 'True/False' 
                  : 'Essay'}
            </span>
            
            {/* Status badge - show for all questions */}
            {statusText && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                isMultipleChoice
                  ? answer.is_correct 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  : isEssayPendingGrading
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {statusText}
              </span>
            )}
          </div>
          
          <div className="mb-2">
            {isMultipleChoice ? (
              <div className="flex items-center">
                <StatusIcon className={`h-4 w-4 ${statusColor} mr-2`} />
                <span className="text-sm text-gray-700">
                  You answered: <span className="font-medium">{answer.selected_option?.option_text}</span>
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-1">
                  <StatusIcon className={`h-4 w-4 ${statusColor} mr-2`} />
                  <span className="text-sm text-gray-700">
                    {isEssayPendingGrading ? 'Essay Response (Pending Review)' : 'Essay Response'}
                  </span>
                </div>
                <div className="pl-6 mt-1 text-sm text-gray-700 border-l border-gray-200">
                  <p className="whitespace-pre-wrap">{answer.answer_text || 'No response provided'}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Show feedback if available */}
          {answer.feedback && (
            <div className="pl-6 mt-2 text-sm text-gray-600 italic">
              <p className="font-medium">Feedback:</p>
              <p>{answer.feedback}</p>
            </div>
          )}
          
          {/* For essay questions that are pending grading, show a message */}
          {isEssayPendingGrading && (
            <div className="pl-6 mt-2 flex items-center">
              <Clock className="h-4 w-4 text-amber-500 mr-2" />
              <p className="text-sm text-amber-600">
                This essay response is waiting to be graded by an instructor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAnswersList;