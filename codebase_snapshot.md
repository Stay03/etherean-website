# Codebase Documentation

{
  "Extraction Date": "2025-04-21 17:30:10",
  "Include Paths": [
    "src/components/auth/AuthModal.jsx",
    "src/contexts/AuthContext.jsx",
    "src/services/api/client.js",
    "src/services/api/endpoints.js",
    "src/services/api/courseService.js",
    "src/hooks/useCourses.js",
    "src/pages/CoursesPage.jsx",
    "src/App.js"
  ]
}

### src/components/auth/AuthModal.jsx
```
import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Authentication Modal Component
 * Provides login and registration tabs in a modal
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Function} props.onAuthSuccess - Function to call when authentication is successful
 * @param {string} props.redirectPath - Path to redirect to after successful authentication
 * @param {string} props.initialTab - Initial tab to show ('login' or 'register')
 */
const AuthModal = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess,
  redirectPath = '/',
  initialTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    platform: 'EL' // Default platform set to 'EL'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { login, register } = useAuth();
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'register') {
      // Validate name
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      // Validate password confirmation
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError('');
    
    try {
      let result;
      
      if (activeTab === 'login') {
        // Login
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        result = await register(formData);
      }
      
      if (result.success) {
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          platform: 'EL'
        });
        
        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(result.user);
        }
        
        // Close modal
        onClose();
      } else {
        setApiError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setApiError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Switch tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setApiError('');
    setErrors({});
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Authentication Required"
      size="md"
    >
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'login'
              ? 'text-yellow-600 border-b-2 border-yellow-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => switchTab('login')}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'register'
              ? 'text-yellow-600 border-b-2 border-yellow-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => switchTab('register')}
        >
          Register
        </button>
      </div>
      
      {/* API Error */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {apiError}
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Name field - Only for register */}
        {activeTab === 'register' && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        )}
        
        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Password field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={activeTab === 'register' ? 'Create a password' : 'Enter your password'}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        {/* Password Confirmation - Only for register */}
        {activeTab === 'register' && (
          <div className="mb-4">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
            )}
          </div>
        )}
        
        {/* Platform selection has been removed */}
        
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {activeTab === 'login' ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              activeTab === 'login' ? 'Log In' : 'Create Account'
            )}
          </button>
        </div>
        
        {/* Form Footer */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {activeTab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('register')}
                className="text-yellow-600 hover:text-yellow-700 font-medium focus:outline-none"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="text-yellow-600 hover:text-yellow-700 font-medium focus:outline-none"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
```

### src/contexts/AuthContext.jsx
```
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/api/authService';

// Create context with default values
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  checkAuthStatus: () => {}
});

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Check if user is logged in
  const checkAuthStatus = async () => {
    try {
      // First check if we have a token in localStorage
      const storedToken = localStorage.getItem('auth_token');
      
      if (!storedToken) {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return false;
      }
      
      // Verify token with backend
      const response = await authService.checkLogin();
      
      if (response.logged_in && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        setToken(storedToken);
        return true;
      } else {
        // Token is invalid or expired
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return false;
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      return false;
    }
  };
  
  // Login user
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
        setToken(response.token);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Invalid login response' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials and try again.' 
      };
    }
  };
  
  // Register user
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.access_token && response.user) {
        localStorage.setItem('auth_token', response.access_token);
        setIsAuthenticated(true);
        setUser(response.user);
        setToken(response.access_token);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Invalid registration response' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    return { success: true };
  };
  
  // Context value
  const contextValue = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    checkAuthStatus,
    isLoading
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
```

### src/services/api/client.js
```
/**
 * Base API client for making HTTP requests
 * Centralizes request configuration and error handling
 */

const API_BASE_URL = 'http://localhost:8000/api';
// const API_BASE_URL = 'https://apimagic.xyz/ethereanAPI/api';

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
```

### src/services/api/endpoints.js
```
/**
 * API endpoints definitions
 * Centralized location for all API endpoints used in the application
 */

const endpoints = {
  // Banner endpoints
  banners: {
    list: '/banners',
    get: (id) => `/banners/${id}`,
  },
  
  // Course endpoints
  courses: {
    list: '/courses',
    get: (id) => `/courses/${id}`,
    getBySlug: (slug) => `/courses/slug/${slug}`,
  },
  
  // Product endpoints
  products: {
    list: '/products',
    get: (id) => `/products/${id}`,
    getBySlug: (slug) => `/products/${slug}`,
  },
  
  // Cart endpoints
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: (itemId) => `/cart/item/${itemId}`,
    remove: (itemId) => `/cart/item/${itemId}`,
    clear: '/cart',
  },
  
  // Progress tracking endpoints
  progress: {
    startLesson: '/progress/start-lesson',
    completeLesson: '/progress/complete-lesson',
    getCourseProgress: (courseId) => `/progress/course/${courseId}`,
  },
  
  // Quiz endpoints
  quiz: {
    startAttempt: '/quiz-attempts',
    submitAnswer: '/quiz-answers',
    getProgress: (quizId) => `/quizzes/${quizId}/progress`,
  },
  
  // Add more endpoint categories as needed
  events: {
    list: '/events',
    get: (id) => `/events/${id}`,
  },
  
  // Authentication endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // User endpoints
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
  },
};

export default endpoints;
```

### src/services/api/courseService.js
```
/**
 * Course Service
 * Centralizes all course-related API calls
 */

import apiClient from './client';
import endpoints from './endpoints';

/**
 * Get a list of courses with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.platform - Filter by platform (el, ch, el,ch)
 * @param {boolean} params.is_online - Filter by online status
 * @param {string} params.display_page - Type of display
 * @param {string} params.search - Search term
 * @param {string} params.sort_by - Sort order
 * @param {number} params.per_page - Number of results per page
 * @param {number} params.page - Page number
 * @returns {Promise} - Promise resolving to course data
 */
const getCourses = (params = {}) => {
  return apiClient.get(endpoints.courses.list, params);
};

/**
 * Get a specific course by ID
 * 
 * @param {number} id - Course ID
 * @returns {Promise} - Promise resolving to course data
 */
const getCourseById = (id) => {
  return apiClient.get(endpoints.courses.get(id));
};

/**
 * Get a specific course by slug
 * 
 * @param {string} slug - Course slug
 * @param {boolean} detailed - Whether to include detailed course data
 * @returns {Promise} - Promise resolving to course data
 */
const getCourseBySlug = (slug, detailed = false) => {
  return apiClient.get(endpoints.courses.getBySlug(slug), { detailed });
};

/**
 * Create a new course (protected endpoint)
 * 
 * @param {Object} data - Course data
 * @returns {Promise} - Promise resolving to created course
 */
const createCourse = (data) => {
  return apiClient.post(endpoints.courses.list, data);
};

/**
 * Update an existing course (protected endpoint)
 * 
 * @param {number} id - Course ID
 * @param {Object} data - Updated course data
 * @returns {Promise} - Promise resolving to updated course
 */
const updateCourse = (id, data) => {
  return apiClient.put(endpoints.courses.get(id), data);
};

/**
 * Delete a course (protected endpoint)
 * 
 * @param {number} id - Course ID
 * @returns {Promise} - Promise resolving to success message
 */
const deleteCourse = (id) => {
  return apiClient.delete(endpoints.courses.get(id));
};

const courseService = {
  getCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseService;
```

### src/hooks/useCourses.js
```
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/client';
import endpoints from '../services/api/endpoints';

/**
 * Custom hook to fetch and manage courses data
 * 
 * @param {Object} filters - Object containing filter parameters
 * @returns {Object} - Object containing courses data, loading state, error state, and refetch function
 */
const useCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch courses from API
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoints.courses.list, filters);
      
      // Check if response has the expected structure
      if (response && response.courses) {
        setCourses(response.courses.data || []);
        
        // Extract pagination data
        const { 
          current_page, 
          first_page_url, 
          last_page, 
          last_page_url,
          next_page_url, 
          prev_page_url, 
          total, 
          per_page 
        } = response.courses;
        
        setPagination({
          current_page,
          first_page_url,
          last_page,
          last_page_url,
          next_page_url,
          prev_page_url,
          total,
          per_page
        });
      } else {
        setCourses([]);
        setPagination(null);
        setError({ message: 'Unexpected API response format' });
      }
    } catch (err) {
      setCourses([]);
      setPagination(null);
      setError(err);
      console.error('Failed to fetch courses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    pagination,
    isLoading,
    error,
    refetch: fetchCourses
  };
};

export default useCourses;
```

### src/pages/CoursesPage.jsx
```
import React, { useState, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CourseList from '../components/courses/CourseList';
import CourseFilters from '../components/courses/CourseFilters';
import CourseSearch from '../components/courses/CourseSearch';
import Breadcrumb from '../components/Breadcrumb';
import useCourses from '../hooks/useCourses';

/**
 * CoursesPage Component
 * Main page that displays courses with filtering and search capabilities
 */
const CoursesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Extract filter values from URL or use defaults
  const initialFilters = {
    platform: queryParams.get('platform') || 'el',
    is_online: queryParams.get('is_online') !== 'false',
    visibility : queryParams.get('visibility') || '1',
    sort_by: queryParams.get('sort_by') || 'newest',
    search: queryParams.get('search') || '',
    page: parseInt(queryParams.get('page') || '1', 10),
    per_page: parseInt(queryParams.get('per_page') || '12', 10),
    display_page: 'home'
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' }
  ];

  // State for filters
  const [filters, setFilters] = useState(initialFilters);

  // Use custom hook to fetch courses data
  const { 
    courses, 
    pagination, 
    isLoading, 
    error, 
    refetch 
  } = useCourses(filters);

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && key !== 'display_page') {
        params.set(key, value);
      }
    });
    
    navigate({ search: params.toString() });
  };

  // Handle search submission
  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    
    // Update URL with new page
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate({ search: params.toString() });
  };

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
  items={breadcrumbItems} 
  onNavigate={(path) => navigate(path)} 
/>
      {/* Page Header
      <div className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-lg text-gray-600">
            Discover our wide range of courses designed to help you grow and develop
          </p>
        </div>
      </div> */}
      
      {/* Filters and Search Section */}
      <div className="w-full bg-gray-50 py-6 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CourseSearch 
              initialValue={filters.search} 
              onSearch={handleSearch} 
            />
            {/* <CourseFilters 
              filters={filters} 
              onChange={updateFilters} 
            /> */}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseList 
          courses={courses} 
          isLoading={isLoading} 
          error={error} 
          pagination={pagination}
          onPageChange={handlePageChange}
          onRetry={refetch}
        />
      </div>
    </div>
  );
};

export default memo(CoursesPage);
```

### src/App.js
```
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CourseLearnPage = lazy(() => import('./pages/CourseLearnPage'));
const MyItemsPage = lazy(() => import('./pages/MyItemsPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
// Add new ProductDetailPage import
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Create a wrapper component that will conditionally render the footer
const AppContent = () => {
  const location = useLocation();
  
  // Check if the current path is the learning page
  const isLearningPage = location.pathname.includes('/course/') && location.pathname.includes('/learn');
  
  return (
    <>
      {/* Header comes first at full width, outside any containers with padding */}
      <Header />
      
      {/* Main content div with padding */}
      <div className="bg-white p-4 sm:p-6 lg:p-6 min-h-screen">
        {/* White border container with rounded corners */}
        <div className="relative bg-gray-50 min-h-[calc(100vh-32px)] overflow-hidden rounded-[30px] ">
          <div className="relative font-questrial">
            {/* SVG for top-right corner rounded effect - laptop and desktop only */}
            <div className="absolute top-20 right-0 z-10 hidden lg:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M35 0V35C35 15.67 19.33 0 -1.53184e-05 0H35Z" fill="white"></path>
              </svg>
            </div>

            {/* Routes content with Suspense fallback */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:slug" element={<CourseDetailPage />} />
                <Route path="/course/:slug/learn" element={<CourseLearnPage />} />
                <Route path="/my-items" element={<MyItemsPage />} />
                <Route path="/shop" element={<ShopPage />} />
                {/* Add new route for product detail page */}
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
      
      {/* Conditionally render footer only when NOT on learning page */}
      {!isLearningPage && <Footer />}
      
      {/* Add ToastContainer for react-toastify */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
    <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
    <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
    <a 
      href="/"
      className="px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-300"
    >
      Return Home
    </a>
  </div>
);

export default App;
```

