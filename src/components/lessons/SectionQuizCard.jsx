import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * SectionQuizCard Component
 * Displays a section quiz in a card format for the lesson grid
 */
const SectionQuizCard = ({ 
  quiz, 
  sectionTitle, 
  onClick, 
  isComplete = false, 
  isAvailable = true 
}) => {
  const getQuestionCount = () => {
    return quiz.questions?.length || 0;
  };

  const getCompletionIcon = () => {
    if (!isAvailable) {
      return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
    
    if (isComplete) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    return <Clock className="w-5 h-5 text-purple-500" />;
  };

  const getCardStyles = () => {
    if (!isAvailable) {
      return 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-70';
    }
    
    if (isComplete) {
      return 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer';
    }
    
    return 'bg-purple-50 border-purple-200 hover:bg-purple-100 cursor-pointer';
  };

  const getStatusText = () => {
    if (!isAvailable) return 'Locked';
    if (isComplete) return 'Completed';
    return 'Not Started';
  };

  const getStatusColor = () => {
    if (!isAvailable) return 'text-gray-500';
    if (isComplete) return 'text-green-600';
    return 'text-purple-600';
  };

  return (
    <div
      className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${getCardStyles()}`}
      onClick={isAvailable ? onClick : undefined}
    >
      {/* Quiz Type Badge */}
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <FileText className="w-3 h-3 mr-1" />
          Section Quiz
        </span>
      </div>

      {/* Status Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-shrink-0">
          {getCompletionIcon()}
        </div>
      </div>

      {/* Quiz Title */}
      <h3 className={`text-lg font-semibold mb-2 pr-8 ${
        isAvailable ? 'text-gray-900' : 'text-gray-500'
      }`}>
        {quiz.title}
      </h3>

      {/* Section Info */}
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <FileText className="w-4 h-4 mr-1 text-purple-500" />
        <span className="font-medium">{sectionTitle}</span>
      </div>

      {/* Quiz Description */}
      {quiz.description && (
        <p className={`text-sm mb-4 line-clamp-2 ${
          isAvailable ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {quiz.description}
        </p>
      )}

      {/* Quiz Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Question Count */}
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="w-4 h-4 mr-1" />
            <span>{getQuestionCount()} question{getQuestionCount() !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Status */}
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Progress Bar (if in progress or completed) */}
      {(isComplete || (!isAvailable && !isComplete)) && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isComplete ? 'bg-green-500' : 'bg-gray-300'
              }`}
              style={{ width: isComplete ? '100%' : '0%' }}
            />
          </div>
        </div>
      )}

      {/* Lock Overlay for unavailable quizzes */}
      {!isAvailable && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-500">Quiz Locked</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionQuizCard;