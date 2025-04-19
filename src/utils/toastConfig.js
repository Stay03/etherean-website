// src/utils/toastConfig.js
// This file provides a centralized way to customize toast notifications

import { toast } from 'react-toastify';

// Custom CSS for white progress bar
// You can add this to your global CSS file or include it here
const whiteProgressBarStyles = `
  .Toastify__progress-bar {
    background-color: rgba(255, 255, 255, 0.7) !important;
  }
`;

// Add the styles to the document head
const injectStyles = () => {
  if (!document.getElementById('toast-progress-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'toast-progress-styles';
    styleElement.textContent = whiteProgressBarStyles;
    document.head.appendChild(styleElement);
  }
};

// Call this immediately to inject the styles when this file is imported
injectStyles();

// Default toast configuration to match your application's style
const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Custom toast with yellow styling to match your application's theme
const customToast = {
  // Basic toast types with application styling
  success: (message, options = {}) => {
    return toast.success(message, {
      ...defaultOptions,
      style: { backgroundColor: '#16a34a', color: '#fff' },  // Green background
      ...options
    });
  },
  
  error: (message, options = {}) => {
    return toast.error(message, {
      ...defaultOptions,
      style: { backgroundColor: '#ef4444' },  // Red background
      ...options
    });
  },
  
  warning: (message, options = {}) => {
    return toast.warning(message, {
      ...defaultOptions,
      style: { 
        backgroundColor: '#EAB308',  // Yellow background (matching your app's yellow-500)
        color: '#171717',  // Text color (dark gray)
      },
      ...options
    });
  },
  
  info: (message, options = {}) => {
    return toast.info(message, {
      ...defaultOptions,
      style: { backgroundColor: '#3B82F6' },  // Blue background
      ...options
    });
  },
  
  // Default toast with application styling
  default: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options
    });
  },
  
  // Method to update an existing toast
  update: (toastId, options = {}) => {
    return toast.update(toastId, options);
  },
  
  // Custom method to dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
  
  // Method to dismiss a specific toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};

export default customToast;