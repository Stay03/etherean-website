/**
 * API Retry Utilities
 * Provides functions for handling API request retries with limits
 */

// Default configuration for API retries
export const DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,         // Maximum number of retry attempts
    initialDelay: 1000,    // Initial delay in milliseconds (1 second)
    backoffFactor: 2,      // Exponential backoff factor
    shouldRetry: (error) => {
      // By default, retry on network errors and 5xx server errors
      if (!error.status) return true; // Network error (no status)
      return error.status >= 500 && error.status < 600;
    }
  };
  
  /**
   * Executes a function with retry logic
   * @param {Function} fn - Async function to execute
   * @param {Object} retryConfig - Retry configuration (optional)
   * @returns {Promise} - Result of the function or throws after max retries
   */
  export const withRetry = async (fn, retryConfig = {}) => {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    
    let lastError;
    let attempt = 0;
    
    while (attempt <= config.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        attempt++;
        
        // If we've reached max retries or shouldn't retry this type of error
        if (attempt > config.maxRetries || !config.shouldRetry(error)) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = config.initialDelay * Math.pow(config.backoffFactor, attempt - 1);
        
        // Log retry attempt (in development only)
        if (process.env.NODE_ENV === 'development') {
          console.warn(`API request failed, retrying (${attempt}/${config.maxRetries}) after ${delay}ms`, error);
        }
        
        // Wait before next retry attempt
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Add retry information to the error
    if (lastError) {
      lastError.retryAttempts = attempt;
      lastError.maxRetries = config.maxRetries;
    }
    
    throw lastError;
  };
  
  /**
   * Creates a retry-enabled version of any API request function
   * @param {Function} requestFn - Original API request function
   * @param {Object} retryConfig - Retry configuration (optional)
   * @returns {Function} - Wrapped function with retry logic
   */
  export const createRetryableRequest = (requestFn, retryConfig = {}) => {
    return async (...args) => {
      return withRetry(() => requestFn(...args), retryConfig);
    };
  };
  
  // Also export as default for compatibility
  const retryUtils = {
    withRetry,
    createRetryableRequest,
    DEFAULT_RETRY_CONFIG
  };
  
  export default retryUtils;