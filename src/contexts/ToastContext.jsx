import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/common/Toast';

// Create context
const ToastContext = createContext({
  showToast: () => {},
});

/**
 * Toast Provider Component
 * Manages toast notifications across the application
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false,
  });

  // Show toast with message and type
  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({
      message,
      type,
      isVisible: true,
      duration,
    });
  };

  // Hide toast
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToast = () => useContext(ToastContext);

export default ToastContext;