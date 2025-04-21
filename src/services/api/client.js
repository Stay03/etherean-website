/**
 * Base API client for making HTTP requests
 * Centralizes request configuration and error handling
 */

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'https://apimagic.xyz/ethereanAPI/api';

/**
 * Creates and returns API request options with proper headers
 * @param {Object} options - Request options
 * @returns {Object} - Configured request options
 */
const createRequestOptions = (options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  // Add authentication token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  return defaultOptions;
};

/**
 * Builds a URL with query parameters
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} - Full URL with query string
 */
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Add query parameters
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

/**
 * Handles API response
 * @param {Response} response - Fetch API response
 * @returns {Promise} - Resolved with data or rejected with error
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Create standardized error object
    const error = {
      status: response.status,
      statusText: response.statusText,
      message: data.message || 'An error occurred',
      errors: data.errors || {},
      data: data.data || null,
    };
    
    throw error;
  }
  
  return data;
};

/**
 * Makes a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const get = async (endpoint, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({ method: 'GET' });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const post = async (endpoint, data = {}, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const put = async (endpoint, data = {}, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`PUT request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise that resolves with the response data
 */
const del = async (endpoint, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    const options = createRequestOptions({ method: 'DELETE' });
    
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.error(`DELETE request failed for ${endpoint}:`, error);
    throw error;
  }
};

const apiClient = {
  get,
  post,
  put,
  delete: del,
};

export default apiClient;