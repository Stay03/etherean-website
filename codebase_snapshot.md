# Codebase Documentation

{
  "Extraction Date": "2025-04-21 10:43:35",
  "Include Paths": [
    "src/services/api/client.js",
    "src/services/api/endpoints.js",
    "src/services/api/courseService.js",
    "src/hooks/useCourses.js",
    "src/pages/CoursesPage.jsx",
    "src/App.js"
  ]
}

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

