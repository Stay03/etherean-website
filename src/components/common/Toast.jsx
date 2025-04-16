import React, { useEffect } from 'react';

/**
 * Toast Notification Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, info, warning)
 * @param {boolean} props.isVisible - Whether the toast is visible
 * @param {Function} props.onClose - Function to call when toast is closed
 * @param {number} props.duration - Duration to show toast in milliseconds
 */
const Toast = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);
  
  // If not visible, don't render
  if (!isVisible) return null;
  
  // Toast type styles
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case 'info':
        return {
          bg: 'bg-blue-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'success':
      default:
        return {
          bg: 'bg-green-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )
        };
    }
  };
  
  const styles = getTypeStyles();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className={`${styles.bg} rounded-lg shadow-lg flex items-center p-4 max-w-md`}>
        <div className="flex-shrink-0 mr-3">
          {styles.icon}
        </div>
        <div className="flex-1 text-white">
          {message}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="text-white focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;