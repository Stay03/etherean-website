# Codebase Documentation

{
  "Extraction Date": "2025-04-15 02:06:03",
  "Include Paths": [
    "src/pages/CourseDetailPage.jsx",
    "src/services/api/client.js",
    "src/services/api/endpoints.js",
    "src/components/courses/EnrollButton.jsx",
    "src/components/courses/CourseHeader.jsx",
    "src/hooks/useCourseDetail.js",
    "src/services/api/courseService.js",
    "src/App.js"
  ]
}

### src/pages/CourseDetailPage.jsx
```
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseHeader from '../components/courses/CourseHeader';
import CourseDescription from '../components/courses/CourseDescription';
import CourseSections from '../components/courses/CourseSections';
import CourseInfoTabs from '../components/courses/CourseInfoTabs';
import EnrollButton from '../components/courses/EnrollButton';
import useCourseDetail from '../hooks/useCourseDetail';
import { useAuth } from '../contexts/AuthContext';

/**
 * CourseDetailPage Component
 * Displays detailed information about a specific course
 */
const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Fetch course details using custom hook
  const { 
    course, 
    hasAccess,
    isLoading, 
    error, 
    refetch 
  } = useCourseDetail(slug);

  // Redirect to courses page if slug is missing
  useEffect(() => {
    if (!slug) {
      navigate('/courses');
    }
  }, [slug, navigate]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 h-96 bg-gray-200 rounded-lg"></div>
            <div className="w-full md:w-1/3 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
          
          {/* Description skeleton */}
          <div className="mt-10 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Sections skeleton */}
          <div className="mt-10 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
            <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              {error.status === 404 ? 'Course not found' : 'Unable to load course'}
            </h3>
            <p className="text-red-700 mb-4">
              {error.message || 'An unexpected error occurred. Please try again later.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={refetch}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle course not found or invalid data
  if (!course || !course.product_info) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
            <svg className="h-12 w-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Course Not Found</h3>
            <p className="text-yellow-700 mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Course Header Section */}
      <CourseHeader course={course} hasAccess={hasAccess} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Information Tabs */}
            <CourseInfoTabs
              overview={<CourseDescription description={course.product_info.description} />}
              curriculum={<CourseSections sections={course.sections} />}
            />
          </div>
          
          {/* Sidebar - Can include related courses, instructor info, etc. */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Course Information</h3>
              
              {/* Course Details */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="text-gray-900 font-medium">{course.product_info.platform}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections</span>
                  <span className="text-gray-900 font-medium">{course.sections?.length || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="text-gray-900 font-medium">
                    {course.sections?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress Tracking</span>
                  <span className="text-gray-900 font-medium">
                    {course.progression_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                {hasAccess && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access Status</span>
                    <span className="text-green-600 font-medium">
                      Active
                    </span>
                  </div>
                )}
              </div>
              
              {/* Enrollment CTA */}
              <div className="mt-6 space-y-3">
                <EnrollButton 
                  course={course}
                  hasAccess={hasAccess}
                  onBuyNow={(course) => console.log('Buy now:', course)}
                />
                
                {!hasAccess && parseFloat(course.product_info.price) > 0 && (
                  <>
                    <EnrollButton 
                      course={course}
                      hasAccess={hasAccess}
                      isAddToCart={true}
                      onAddToCart={(course) => console.log('Add to cart:', course)}
                    />
                    
                    {/* Helper text to explain button differences */}
                    <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-xs text-blue-800 flex items-start">
                        <svg className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          <strong>Buy Now</strong> proceeds directly to checkout, while <strong>Add to Cart</strong> allows you to continue shopping and checkout later.
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
```

### src/services/api/client.js
```
/**
 * Base API client for making HTTP requests
 * Centralizes request configuration and error handling
 */

const API_BASE_URL = 'http://localhost:8000/api';

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

### src/components/courses/EnrollButton.jsx
```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import AuthModal from '../auth/AuthModal';
import freeProductService from '../../services/api/freeProductService';
import paymentService from '../../services/api/paymentService';
import PaystackPop from '@paystack/inline-js';

/**
 * EnrollButton Component
 * Call-to-action button for course purchase with different states
 * 
 * @param {Object} course - Course object
 * @param {boolean} hasAccess - Whether the user already has access to the course
 * @param {boolean} isAddToCart - Whether this is an "Add to Cart" button
 * @param {Function} onBuyNow - Function to call when buying now
 * @param {Function} onAddToCart - Function to call when adding to cart
 */
const EnrollButton = ({ 
  course, 
  hasAccess = false,
  isAddToCart = false,
  onBuyNow,
  onAddToCart
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const { showToast } = useToast();
  
  // Check if course is free
  const isFree = () => {
    if (!course.product_info.price) return false;
    return parseFloat(course.product_info.price) === 0;
  };
  
  // Handle free course acquisition
  const acquireFreeProduct = async () => {
    try {
      setIsLoading(true);
      
      // Call API to acquire free product
      const response = await freeProductService.acquireFreeProduct(course.product_id);
      
      // Show success message
      showToast(
        'Course added to your account successfully!', 
        'success'
      );
      
      // Redirect to "My Items" page
      navigate('/my-items');
      
      return true;
    } catch (error) {
      // Show error message
      showToast(
        error.message || 'Failed to acquire course. Please try again.', 
        'error'
      );
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Paystack payment initialization
  const initializePaystackPayment = async (productId) => {
    try {
      // Initialize payment with the API
      const response = await paymentService.initializePayment(productId);
      
      // Log the full response for debugging
      console.log('Payment initialization response:', response);
      
      // Check if the response is in the expected format
      if (response && response.status === 'success' && response.data) {
        const { access_code, reference } = response.data;
        
        // Initialize Paystack popup with callbacks
        const popup = new PaystackPop();
        popup.resumeTransaction(access_code, {
          onLoad: (response) => {
            // Transaction has loaded
            console.log('Paystack transaction loaded:', response);
          },
          onSuccess: (transaction) => {
            // Payment completed successfully
            console.log('Payment successful:', transaction);
            
            // Show success message
            showToast('Payment completed successfully!', 'success');
            
            // Verify payment with backend (optional)
            paymentService.verifyPayment(transaction.reference || reference)
              .then(verificationResponse => {
                console.log('Payment verification:', verificationResponse);
                // Redirect to "My Items" or course page
                navigate('/my-items');
              })
              .catch(error => {
                console.error('Payment verification failed:', error);
              });
          },
          onCancel: () => {
            // User cancelled the transaction
            console.log('Payment cancelled by user');
            showToast('Payment was cancelled.', 'info');
          },
          onError: (error) => {
            // Error during payment
            console.error('Paystack error:', error);
            showToast(
              error.message || 'Payment processing failed. Please try again.',
              'error'
            );
          },
          onElementsMount: (elements) => {
            // Elements (like Apple Pay) mounted
            if (elements) {
              console.log('Paystack elements mounted:', elements);
            }
          }
        });
        
        // Show loading toast
        showToast(
          'Payment initialized. Complete the payment in the popup window.',
          'info'
        );
        
        return true;
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Payment initialization failed - invalid response format');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      showToast(
        error.message || 'Payment initialization failed. Please try again.',
        'error'
      );
      return false;
    }
  };
  
  // Handle button click
  const handleClick = async () => {
    // If user already has access, navigate to the course content
    if (hasAccess) {
      navigate(`/course/${course.product_info.slug}/learn`);
      return;
    }
    
    // If course is not free, use original functionality
    if (!isFree()) {
      // If user is not authenticated, open auth modal
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
        return;
      }
      
      try {
        setIsLoading(true);
        
        if (isAddToCart) {
          // Call add to cart callback if provided
          if (onAddToCart) {
            await onAddToCart(course);
          }
          // Show success message
          showToast('Course added to cart successfully!', 'success');
        } else {
          // Call buy now callback if provided
          if (onBuyNow) {
            await onBuyNow(course);
          }
          
          // Initialize Paystack payment instead of redirecting to checkout
          await initializePaystackPayment(course.product_id);
        }
      } catch (error) {
        showToast(
          error.message || 'Action failed. Please try again.', 
          'error'
        );
      } finally {
        setIsLoading(false);
      }
      
      return;
    }
    
    // Free course handling
    if (!isAuthenticated) {
      // Open auth modal for login/signup
      setIsAuthModalOpen(true);
      return;
    }
    
    // User is authenticated, acquire free product
    await acquireFreeProduct();
  };
  
  // Handle successful authentication
  const handleAuthSuccess = async () => {
    // Verify authentication status
    const isAuthSuccess = await checkAuthStatus();
    
    if (!isAuthSuccess) {
      showToast('Authentication failed. Please try again.', 'error');
      return;
    }
    
    // If it's a free course, acquire it
    if (isFree()) {
      await acquireFreeProduct();
    } else if (isAddToCart) {
      // Add to cart
      if (onAddToCart) {
        await onAddToCart(course);
      }
      showToast('Course added to cart successfully!', 'success');
    } else {
      // Buy now with Paystack
      if (onBuyNow) {
        await onBuyNow(course);
      }
      
      // Initialize Paystack payment
      await initializePaystackPayment(course.product_id);
    }
  };
  
  // Button text and icon based on button type, course price, and access status
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      );
    }
    
    if (hasAccess) {
      return (
        <span className="flex items-center justify-center">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Go to Course
        </span>
      );
    }
    
    if (isAddToCart) {
      return (
        <span className="flex items-center justify-center">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
          <span className="text-xs ml-2 opacity-75">(Continue Shopping)</span>
        </span>
      );
    } else {
      if (isFree()) {
        return (
          <span className="flex items-center justify-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Get for Free
          </span>
        );
      } else {
        return (
          <span className="flex items-center justify-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Buy Now
            <span className="text-xs ml-2 opacity-75">(Instant Checkout)</span>
          </span>
        );
      }
    }
  };
  
  // Don't show "Add to Cart" button if user already has access
  if (isAddToCart && hasAccess) {
    return null;
  }
  
  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        title={isAddToCart ? "Add to cart and continue shopping" : hasAccess ? "Access your course" : "Proceed directly to checkout"}
        className={`
          w-full py-3 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
          ${hasAccess 
            ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
            : isAddToCart
              ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500'
              : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-500'
          }
          ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
        `}
      >
        {getButtonContent()}
      </button>
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        redirectPath="/my-items"
      />
    </>
  );
};

export default EnrollButton;
```

### src/components/courses/CourseHeader.jsx
```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrollButton from './EnrollButton';

/**
 * CourseHeader Component
 * Displays the course title, thumbnail, and key information
 * 
 * @param {Object} course - Course object containing details
 * @param {boolean} hasAccess - Whether the user has access to the course
 */
const CourseHeader = ({ course, hasAccess = false }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Format price display
  const formatPrice = (price) => {
    // Handle cases where price might be null, undefined, or not a number
    if (price === null || price === undefined) return 'Price unavailable';
    
    // Convert to number if it's a string and check if it's a valid number
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price unavailable';
    
    // Check for free courses
    if (numPrice === 0) return 'Free';
    
    return `${numPrice.toFixed(2)}`;
  };
  
  // Generate platform badge classes
  const getPlatformBadges = (platform) => {
    if (!platform) return [];
    
    const platforms = platform.split(',').map(p => p.trim().toUpperCase());
    
    return platforms.map(p => {
      let bgColor = 'bg-gray-100';
      let textColor = 'text-gray-800';
      
      if (p === 'EL') {
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
      } else if (p === 'CH') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
      }
      
      return {
        name: p,
        className: `${bgColor} ${textColor}`
      };
    });
  };
  
  const platformBadges = getPlatformBadges(course.product_info.platform);

  // Handle direct navigation to course content
  const goToCourse = () => {
    navigate(`/course/${course.product_info.slug}/learn`);
  };

  return (
    <div className="bg-gray-50 py-8 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Course Thumbnail */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {!imageError ? (
                <img
                  src={course.product_info.thumbnail}
                  alt={course.product_info.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Access Badge */}
              {hasAccess && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    You have access
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Course Info */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            {/* Platform Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {platformBadges.map((badge, index) => (
                <span 
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
                >
                  {badge.name}
                </span>
              ))}
            </div>
            
            {/* Course Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {course.product_info.title}
            </h1>
            
            {/* Price */}
            <div className="mb-6">
              {!hasAccess ? (
                <span className="text-2xl font-bold text-yellow-600">
                  {formatPrice(course.product_info.price)}
                </span>
              ) : (
                <span className="text-lg font-medium text-green-600">
                  Enrolled
                </span>
              )}
            </div>
            
            {/* Short Description - first paragraph only */}
            <div className="prose prose-sm mb-6 text-gray-700">
              {course.product_info.description.split('\r\n')[0]}
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <EnrollButton 
                  course={course}
                  hasAccess={hasAccess}
                  onBuyNow={(course) => console.log('Buy now:', course)}
                />
              </div>
              
              {!hasAccess && parseFloat(course.product_info.price) > 0 && (
                <div className="w-full sm:w-auto">
                  <EnrollButton 
                    course={course}
                    hasAccess={hasAccess}
                    isAddToCart={true}
                    onAddToCart={(course) => console.log('Add to cart:', course)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
```

### src/hooks/useCourseDetail.js
```
import { useState, useEffect, useCallback } from 'react';
import courseService from '../services/api/courseService';

/**
 * Custom hook to fetch and manage course detail data
 * 
 * @param {string} slug - Course slug
 * @param {boolean} detailed - Whether to fetch detailed course data
 * @returns {Object} - Object containing course data, loading state, error state, and refetch function
 */
const useCourseDetail = (slug, detailed = false) => {
  const [course, setCourse] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch course details from API
  const fetchCourseDetail = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await courseService.getCourseBySlug(slug, detailed);
      
      // Check if response has the expected structure
      if (response && response.course) {
        setCourse(response.course);
        // Set hasAccess from the API response
        setHasAccess(response.has_access === true);
      } else {
        setCourse(null);
        setHasAccess(false);
        setError({ 
          status: 400, 
          message: 'Unexpected API response format' 
        });
      }
    } catch (err) {
      setCourse(null);
      setHasAccess(false);
      setError({
        status: err.status || 500,
        message: err.message || 'An error occurred while fetching the course'
      });
      console.error('Failed to fetch course details:', err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, detailed]);

  // Fetch course when slug changes
  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  return {
    course,
    hasAccess,
    isLoading,
    error,
    refetch: fetchCourseDetail
  };
};

export default useCourseDetail;
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

### src/App.js
```
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const MyItemsPage = lazy(() => import('./pages/MyItemsPage'));
// const AboutPage = lazy(() => import('./pages/AboutPage'));
// const MembershipPage = lazy(() => import('./pages/MembershipPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
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
                    <Route path="/my-items" element={<MyItemsPage />} />
                    {/* <Route path="/about" element={<AboutPage />} /> */}
                    {/* <Route path="/membership" element={<MembershipPage />} /> */}
                    {/* Add more routes as needed */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </div>
          
          {/* Footer section */}
          <Footer />
        </Router>
      </ToastProvider>
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

