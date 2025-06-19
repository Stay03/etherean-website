// src/components/quiz/results/QuizAnswersList.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, HelpCircle, 
         FileText, Edit, Clock, Search, Filter } from 'lucide-react';

/**
 * Enhanced component to display detailed list of quiz answers
 * 
 * @param {Object} props
 * @param {Object} props.progressData - Quiz progress data from API
 */
const QuizAnswersList = ({ progressData }) => {
  const [expandedAnswer, setExpandedAnswer] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'correct', 'incorrect', 'pending'
  const [searchText, setSearchText] = useState('');
  
  // Validate data structure
  if (!progressData?.attempt?.answers || !Array.isArray(progressData.attempt.answers)) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center">
          <FileText className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-700">No answer data available</p>
        </div>
      </div>
    );
  }

  const { answers } = progressData.attempt;
  
  // For debugging data structure (remove in production)
  console.log("Answers data:", answers);
  
  // Search and filter functionality
  const filteredAnswers = answers.filter(answer => {
    // Safe access to question text - ensure it exists
    const questionText = answer.quiz_question?.question_text || '';
    const answerText = answer.answer_text || '';
    const optionText = answer.selected_option?.option_text || '';
    
    const matchesSearch = searchText === '' || 
      questionText.toLowerCase().includes(searchText.toLowerCase()) ||
      answerText.toLowerCase().includes(searchText.toLowerCase()) ||
      optionText.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
      (filterType === 'correct' && answer.is_correct === true) ||
      (filterType === 'incorrect' && answer.is_correct === false) ||
      (filterType === 'pending' && answer.quiz_question?.question_type === 'essay' && !answer.graded_at);
    
    return matchesSearch && matchesFilter;
  });

  const toggleExpanded = (answerId) => {
    setExpandedAnswer(expandedAnswer === answerId ? null : answerId);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="text-md font-semibold text-gray-900 flex items-center mb-4">
          <FileText className="mr-2 h-5 w-5 text-gray-600" />
          Answer Details
        </h3>
        
        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search questions and answers..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          <div className="flex">
            <div className="relative inline-flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All answers</option>
                <option value="correct">Correct only</option>
                <option value="incorrect">Incorrect only</option>
                <option value="pending">Pending review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredAnswers.length === 0 ? (
          <div className="p-6 text-center">
            <HelpCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">No answers match your filters</p>
          </div>
        ) : (
          filteredAnswers.map((answer, index) => (
            <AnswerItem 
              key={answer.id || index} 
              answer={answer} 
              index={index} 
              isExpanded={expandedAnswer === answer.id}
              onToggleExpand={() => toggleExpanded(answer.id)}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

/**
 * Component to display a single answer item
 */
const AnswerItem = ({ answer, index, isExpanded, onToggleExpand }) => {
  // Log the full answer object for debugging (remove in production)
  console.log(`Answer item ${index}:`, answer);
  
  // Safely handle potential undefined or missing values
  const questionType = answer.quiz_question?.question_type || '';
  const isMultipleChoice = questionType === 'multiple_choice' || questionType === 'true_false';
  const isEssay = questionType === 'essay';
  const isEssayPendingGrading = isEssay && answer.graded_at === null;
  
  // Extract options array from the quiz_question
  const options = answer.quiz_question?.options || [];
  
  // Log options for debugging (remove in production)
  console.log(`Options for answer ${index}:`, options);
  
  // Determine status icon and colors
  let StatusIcon = HelpCircle;
  let statusColor = 'text-gray-500';
  let bgColor = 'bg-white hover:bg-gray-50';
  let borderColor = 'border-gray-200';
  let statusText = '';
  
  if (isMultipleChoice) {
    if (answer.is_correct === true) {
      StatusIcon = CheckCircle;
      statusColor = 'text-green-500';
      bgColor = 'bg-green-50 hover:bg-green-100';
      borderColor = 'border-green-200';
      statusText = 'Correct';
    } else if (answer.is_correct === false) {
      StatusIcon = XCircle;
      statusColor = 'text-red-500';
      bgColor = 'bg-red-50 hover:bg-red-100';
      borderColor = 'border-red-200';
      statusText = 'Incorrect';
    }
  } else if (isEssay) {
    if (isEssayPendingGrading) {
      StatusIcon = Clock;
      statusColor = 'text-amber-500';
      bgColor = 'bg-amber-50 hover:bg-amber-100';
      borderColor = 'border-amber-200';
      statusText = 'Pending Grading';
    } else {
      StatusIcon = Edit;
      statusColor = 'text-blue-500';
      bgColor = 'bg-blue-50 hover:bg-blue-100';
      borderColor = 'border-blue-200';
      statusText = 'Graded';
    }
  }

  return (
    <div className={`border-l-4 ${borderColor} transition-colors ${bgColor}`}>
      {/* Answer header - always visible */}
      <button
        onClick={onToggleExpand}
        className="w-full text-left py-4 px-4 focus:outline-none focus:bg-opacity-80"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className="text-sm font-medium text-gray-700">{index + 1}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-sm font-medium text-gray-900 pr-8 sm:pr-0">
                {answer.quiz_question?.question_text || 'Question text not available'}
              </h4>
              
              <div className="flex items-center mt-1 sm:mt-0">
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 mr-2">
                  {isMultipleChoice 
                    ? 'Multiple Choice' 
                    : isEssay 
                      ? 'Essay' 
                      : 'Unknown Type'}
                </span>
                
                {/* Status badge */}
                {statusText && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
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
            </div>
            
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center">
                <StatusIcon className={`h-4 w-4 ${statusColor} mr-2`} />
                <span className="text-sm text-gray-700">
                  {isMultipleChoice 
                    ? `You answered: ${answer.selected_option?.option_text || 'No response'}` 
                    : 'Essay Response'}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse answer details' : 'Expand answer details'}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </button>
      
      {/* Expandable answer details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              {isMultipleChoice && (
                <div className="pl-14">
                  <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Available Options:</h5>
                    <ul className="space-y-2">
                      {options && options.length > 0 ? (
                        options.map(option => (
                          <li key={option.id || Math.random()} className="flex items-start">
                            <div className={`mr-2 mt-0.5 ${
                              option.is_correct 
                                ? 'text-green-500' 
                                : answer.selected_option?.id === option.id 
                                  ? 'text-red-500'
                                  : 'text-gray-400'
                            }`}>
                              {option.is_correct 
                                ? <CheckCircle className="h-4 w-4" /> 
                                : answer.selected_option?.id === option.id
                                  ? <XCircle className="h-4 w-4" />
                                  : <div className="h-4 w-4 border border-gray-300 rounded-full"></div>}
                            </div>
                            <span className={`text-sm ${
                              option.is_correct 
                                ? 'text-green-800 font-medium' 
                                : answer.selected_option?.id === option.id
                                  ? 'text-red-800 font-medium'
                                  : 'text-gray-600'
                            }`}>
                              {option.option_text || 'Option text not available'}
                              {option.is_correct && ' (Correct)'}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No options available</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              
              {isEssay && (
                <div className="pl-14">
                  <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Your Response:</h5>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {answer.answer_text || 'No response provided'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Feedback section if available */}
              {answer.feedback && (
                <div className="pl-14 mt-3">
                  <div className={`p-3 rounded-md ${
                    isMultipleChoice 
                      ? answer.is_correct 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Feedback:</h5>
                    <p className="text-sm text-gray-600">{answer.feedback}</p>
                  </div>
                </div>
              )}
              
              {/* For essay questions that are pending grading */}
              {isEssayPendingGrading && (
                <div className="pl-14 mt-3">
                  <div className="p-3 rounded-md bg-amber-50 border border-amber-200 flex items-center">
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    <p className="text-sm text-amber-700">
                      This essay response is waiting to be graded by an instructor.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizAnswersList;