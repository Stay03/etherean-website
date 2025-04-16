/**
 * Error handling utilities for consistent error management across the application
 */

/**
 * Standard error types
 */
export const ErrorTypes = {
    NETWORK: 'NETWORK_ERROR',
    API: 'API_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    AUTHENTICATION: 'AUTHENTICATION_ERROR',
    AUTHORIZATION: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    TIMEOUT: 'TIMEOUT_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR',
  };
  
  /**
   * Creates a standardized error object
   * @param {string} type - Error type from ErrorTypes
   * @param {string} message - Human-readable error message
   * @param {Object} details - Additional error details
   * @returns {Object} - Standardized error object
   */
  export const createError = (type, message, details = {}) => ({
    type,
    message,
    timestamp: new Date().toISOString(),
    details,
  });
  
  /**
   * Handles network errors
   * @param {Error} error - Original error object
   * @returns {Object} - Standardized error object
   */
  export const handleNetworkError = (error) => {
    console.error('Network error:', error);
    
    return createError(
      ErrorTypes.NETWORK,
      'Unable to connect to the server. Please check your internet connection and try again.',
      { originalError: error.message }
    );
  };
  
  /**
   * Handles API errors
   * @param {Object} error - API error response
   * @returns {Object} - Standardized error object
   */
  export const handleApiError = (error) => {
    console.error('API error:', error);
    
    // Handle different HTTP status codes
    switch (error.status) {
      case 400:
        return createError(
          ErrorTypes.VALIDATION,
          error.message || 'The request was invalid. Please check your input and try again.',
          { errors: error.errors }
        );
      case 401:
        return createError(
          ErrorTypes.AUTHENTICATION,
          'You need to log in to access this resource.',
          { redirectTo: '/login' }
        );
      case 403:
        return createError(
          ErrorTypes.AUTHORIZATION,
          'You do not have permission to access this resource.',
          {}
        );
      case 404:
        return createError(
          ErrorTypes.NOT_FOUND,
          'The requested resource was not found.',
          {}
        );
      case 408:
      case 504:
        return createError(
          ErrorTypes.TIMEOUT,
          'The request timed out. Please try again later.',
          {}
        );
      case 500:
      case 502:
      case 503:
        return createError(
          ErrorTypes.API,
          'Something went wrong on our end. Please try again later.',
          {}
        );
      default:
        return createError(
          ErrorTypes.UNKNOWN,
          error.message || 'An unexpected error occurred. Please try again later.',
          { originalError: error }
        );
    }
  };
  
  /**
   * Logs errors to a monitoring service (placeholder)
   * In a real app, this would send errors to a service like Sentry
   * @param {Object} error - Error object
   */
  export const logError = (error) => {
    console.error('Error logged:', error);
    
    // In production, you would send this to a monitoring service
    // Example: Sentry.captureException(error);
  };
  
  /**
   * Gets a user-friendly error message
   * @param {Object} error - Error object
   * @returns {string} - User-friendly error message
   */
  export const getFriendlyErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';
    
    // If a friendly message is already provided, use it
    if (error.message) return error.message;
    
    // Generic fallback messages based on error type
    switch (error.type) {
      case ErrorTypes.NETWORK:
        return 'Unable to connect to the server. Please check your internet connection.';
      case ErrorTypes.AUTHENTICATION:
        return 'You need to log in to continue.';
      case ErrorTypes.AUTHORIZATION:
        return 'You do not have permission to access this resource.';
      case ErrorTypes.VALIDATION:
        return 'There was a problem with the information provided.';
      case ErrorTypes.NOT_FOUND:
        return 'The requested resource could not be found.';
      case ErrorTypes.TIMEOUT:
        return 'The request took too long to complete. Please try again.';
      case ErrorTypes.API:
        return 'There was a problem with our servers. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  };
  
  export default {
    ErrorTypes,
    createError,
    handleNetworkError,
    handleApiError,
    logError,
    getFriendlyErrorMessage,
  };