import apiClient from './client';

/**
 * Login user with email and password
 * 
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} - Promise resolving to user data and token
 */
const login = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.password_confirmation - Password confirmation
 * @param {string} userData.platform - User platform
 * @returns {Promise} - Promise resolving to user data and token
 */
const register = async (userData) => {
  try {
    const response = await apiClient.post('/register', userData);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * Check if user is logged in
 * 
 * @returns {Promise} - Promise resolving to login status and user data
 */
const checkLogin = async () => {
  try {
    const response = await apiClient.post('/checkLogin');
    return response;
  } catch (error) {
    console.error('Check login error:', error);
    throw error;
  }
};

/**
 * Forgot password
 * 
 * @param {Object} data - Email information
 * @param {string} data.email - User email
 * @returns {Promise} - Promise resolving to success message
 */
const forgotPassword = async (data) => {
  try {
    const response = await apiClient.post('/forgot-password', data);
    return response;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password
 * 
 * @param {Object} data - Reset password data
 * @param {string} data.token - Reset token
 * @param {string} data.email - User email
 * @param {string} data.password - New password
 * @param {string} data.password_confirmation - Password confirmation
 * @returns {Promise} - Promise resolving to success message
 */
const resetPassword = async (data) => {
  try {
    const response = await apiClient.post('/reset-password', data);
    return response;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

const authService = {
  login,
  register,
  checkLogin,
  forgotPassword,
  resetPassword
};

export default authService;