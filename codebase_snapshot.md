# Codebase Documentation

{
  "Extraction Date": "2025-04-22 14:35:50",
  "Include Paths": [
    "src/App.js",
    "src/services/api/endpoints.js",
    "src/services/api/client.js",
    "src/pages/HomePage.jsx",
    "src/hooks/useEvents.js",
    "src/hooks/useEventSlider.js",
    "src/components/home/EventsSlider.jsx",
    "src/components/home/EventsSlider/EventCard.jsx"
  ]
}

### src/App.js
```
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CheckoutProvider } from './contexts/CheckoutContext';
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
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
// Add new CartPage import
const CartPage = lazy(() => import('./pages/CartPage'));
// Add new CheckoutPage import
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
// Add new PaymentPage import
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));

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
  const isCheckoutPage = location.pathname.includes('/checkout');
  
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
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                {/* Add new route for cart page */}
                <Route path="/cart" element={<CartPage />} />
                {/* Add new route for checkout page */}
                <Route path="/checkout" element={<CheckoutPage />} />
                {/* Add new route for payment page */}
                <Route path="/payment/:orderId" element={<PaymentPage />} />
                {/* Add new route for payment page */}
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
      
      {/* Conditionally render footer only when NOT on learning page */}
      {!isLearningPage && !isCheckoutPage && <Footer />}
      
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
      <CartProvider>
        <CheckoutProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </CheckoutProvider>
      </CartProvider>
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
  
  // Collection endpoints
  collections: {
    list: '/collections',
    get: (id) => `/collections/${id}`,
    acquire: (id) => `/collections/${id}/acquire`,
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

    // Address endpoints (new)
    addresses: {
      get: '/addresses',
      create: '/addresses',
      update: (addressId) => `/addresses/${addressId}`,
      delete: (addressId) => `/addresses/${addressId}`,
      setDefault: (addressId) => `/addresses/${addressId}/default`
    },
  
    // Order endpoints (new)
    orders: {
      create: '/orders',
      get: (orderId) => `/orders/${orderId}`,
      list: '/orders',
      cancel: (orderId) => `/orders/${orderId}/cancel`
    },
};

export default endpoints;
```

### src/services/api/client.js
```
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
```

### src/pages/HomePage.jsx
```
import React, { memo } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import MarqueeSlider from '../components/home/MarqueeSlider';
import EventsSlider from '../components/home/EventsSlider';
import RecentStreams from '../components/home/RecentStreams';
import FeaturedSection from '../components/home/FeaturedSection';
import VisitUsSection from '../components/home/VisitUsSection';
import useBanners from '../hooks/useBanner';
import useFreeCourses from '../hooks/useFreeCourses';

/**
 * HomePage Component
 * Manages all sections of the home page, including data fetching
 */
const HomePage = () => {
  // Fetch banners for hero slider
  const { 
    banners, 
    isLoading: bannersLoading, 
    error: bannersError 
  } = useBanners({
    page: 1,
    platform: 'EL',
    status: 'active',
    current: true,
    orderBy: 'display_order',
    orderDir: 'asc'
  });

  // Fetch free courses for featured section using custom hook
  const {
    courses: freeCourses,
    isLoading: courseLoading,
    error: courseError
  } = useFreeCourses({ limit: 4 });

  return (
    <div className="w-full">
      {/* Hero section - Full width and full height */}
      <div className="w-full relative h-screen bg-white">
        <HeroSlider 
          banners={banners} 
          isLoading={bannersLoading} 
          error={bannersError} 
        />
      </div>
      
      {/* CTA Section - Full width white background */}
      <div className="w-full bg-white py-16 cta-area style-2">
        <div className="max-w-4xl mx-auto px-4">
          <div className="section-title">
            <div className="sec-content">
              <p className="title text-gray-800
                text-4xl leading-tight tracking-tighter
                sm:text-5xl sm:leading-snug
                md:text-5xl md:leading-relaxed
                lg:text-6xl lg:leading-tight lg:tracking-tight
                xl:text-center 2xl:text-center">
                Our Mission is to provide you with the Tools for the activation and free expression of your innate potentials for the realization of your inner peace. Simple, We are the restorers of PEACE.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other sections */}
      <MarqueeSlider />
      
      {/* Pass the free courses to FeaturedSection */}
      <FeaturedSection 
        featuredItems={freeCourses} 
        isLoading={courseLoading}
        error={courseError}
      />
      
      {/* EventsSlider now uses the API endpoint */}
      <EventsSlider />
      
      <RecentStreams />
      <VisitUsSection />
    </div>
  );
};

export default memo(HomePage);
```

### src/hooks/useEvents.js
```
import { useState, useEffect } from 'react';
import apiClient from '../services/api/client';
import endpoints from '../services/api/endpoints';

/**
 * Custom hook for fetching events
 * @param {Object} params - Query parameters for events API
 * @returns {Object} - Events data, loading state, and error state
 */
const useEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Default parameters for events
        const defaultParams = {
          platform: 'EL',
          is_online: 1,
          perPage: 10,
          status: 'published',
          orderBy: 'start_date',
          orderDir: 'asc',
        };
        
        // Merge with custom parameters
        const queryParams = {
          ...defaultParams,
          ...params,
        };
        
        const response = await apiClient.get(endpoints.events.list, queryParams);
        
        if (response.status === 'success' && response.data) {
          setEvents(response.data.data || []);
          setPagination({
            currentPage: response.data.current_page,
            totalPages: response.data.last_page,
            totalItems: response.data.total,
            perPage: response.data.per_page,
          });
          setError(null);
        } else {
          throw new Error('Invalid response format from events API');
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError(err.message || 'Failed to fetch events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [JSON.stringify(params)]); // Dependency on stringified params to prevent infinite loops

  return {
    events,
    pagination,
    isLoading,
    error
  };
};

export default useEvents;
```

### src/hooks/useEventSlider.js
```
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EventCard from './EventsSlider/EventCard';
import { getAllEvents } from '../../data/eventsData';

/**
 * EventsSlider component
 * Displays a draggable slider of event cards
 * Shows 2 cards on desktop/tablet and 1 card on mobile
 */
const EventsSlider = ({ events = getAllEvents() }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const maxSlides = Math.max(0, events.length - slidesPerView);

  // Update slider dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const isMobile = window.innerWidth < 768;
        const newSlidesPerView = isMobile ? 1 : 2;
        
        setSlidesPerView(newSlidesPerView);
        setSlideWidth(containerWidth / newSlidesPerView);
        
        // Reset current slide if needed when changing slides per view
        if (currentSlide > events.length - newSlidesPerView) {
          setCurrentSlide(Math.max(0, events.length - newSlidesPerView));
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [events.length, currentSlide]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    const clampedIndex = Math.max(0, Math.min(index, maxSlides));
    setCurrentSlide(clampedIndex);
    setIsAnimating(true);
    setDragOffset(0);
  }, [maxSlides]);

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, isAnimating, goToSlide]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, isAnimating, goToSlide]);

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
  }, [isAnimating]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = dragStartX - currentX;
    
    // Calculate drag percentage relative to slide width
    let offsetInPixels = diff;
    
    // Add resistance at edges
    if ((currentSlide === 0 && offsetInPixels < 0) || 
        (currentSlide >= maxSlides && offsetInPixels > 0)) {
      offsetInPixels *= 0.3;
    }
    
    setDragOffset(offsetInPixels);
  }, [isDragging, dragStartX, currentSlide, maxSlides]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 500ms ease-in-out';
    }
    
    const swipeThreshold = slideWidth * 0.2;
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset > 0 && currentSlide < maxSlides) {
        nextSlide();
      } else if (dragOffset < 0 && currentSlide > 0) {
        prevSlide();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    
    setIsDragging(false);
  }, [isDragging, dragOffset, slideWidth, nextSlide, prevSlide, currentSlide, maxSlides]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
    
    e.preventDefault();
  }, [isAnimating]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = dragStartX - currentX;
    
    let offsetInPixels = diff;
    
    if ((currentSlide === 0 && offsetInPixels < 0) || 
        (currentSlide >= maxSlides && offsetInPixels > 0)) {
      offsetInPixels *= 0.3;
    }
    
    setDragOffset(offsetInPixels);
    e.preventDefault();
  }, [isDragging, dragStartX, currentSlide, maxSlides]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging) return;
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 500ms ease-in-out';
    }
    
    const swipeThreshold = slideWidth * 0.2;
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset > 0 && currentSlide < maxSlides) {
        nextSlide();
      } else if (dragOffset < 0 && currentSlide > 0) {
        prevSlide();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    
    setIsDragging(false);
    e.preventDefault();
  }, [isDragging, dragOffset, slideWidth, nextSlide, prevSlide, currentSlide, maxSlides]);

  const handleMouseLeave = useCallback((e) => {
    if (isDragging) {
      handleMouseUp(e);
    }
  }, [isDragging, handleMouseUp]);

  // Calculate transform value for slider
  const transformValue = `translateX(${-currentSlide * slideWidth - dragOffset}px)`;
  
  // Check if navigation buttons should be disabled
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= maxSlides;

  return (
    <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-yellow-500 opacity-5 rounded-full -ml-48"></div>
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full -mr-32 -mb-32"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-10">
          <div className="h-px bg-gray-300 w-full my-4"></div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
            <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
              Upcoming &amp; Past Events
            </h2>
            
            <Link 
              to="/events" 
              className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-500 ease-in-out self-start"
            >
              All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Events slider */}
        <div className="relative">
          {/* Slider container with ref for measuring */}
          <div 
            ref={containerRef}
            className="w-full overflow-hidden rounded-2xl"
          >
            {/* Draggable slider */}
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out h-[480px] md:h-[520px]"
              style={{ 
                transform: transformValue,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onTransitionEnd={handleTransitionEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="flex-shrink-0 h-full p-2"
                  style={{ width: `${slideWidth}px` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            disabled={isFirstSlide || isAnimating}
            className={`
              absolute left-4 top-1/2 transform -translate-y-1/2 
              w-12 h-12 flex items-center justify-center
              bg-white rounded-full shadow-md z-10
              text-gray-800 hover:text-yellow-500 transition-colors
              ${isFirstSlide ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100 cursor-pointer'}
            `}
            aria-label="Previous events"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={isLastSlide || isAnimating}
            className={`
              absolute right-4 top-1/2 transform -translate-y-1/2 
              w-12 h-12 flex items-center justify-center
              bg-white rounded-full shadow-md z-10
              text-gray-800 hover:text-yellow-500 transition-colors
              ${isLastSlide ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100 cursor-pointer'}
            `}
            aria-label="Next events"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide indicators/dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxSlides + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

EventsSlider.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      fallbackImage: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['upcoming', 'past']).isRequired,
      link: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  )
};

export default memo(EventsSlider);
```

### src/components/home/EventsSlider.jsx
```
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EventCard from './EventsSlider/EventCard';
import useEvents from '../../hooks/useEvents';

/**
 * EventsSlider component
 * Displays a draggable slider of event cards
 * Shows 2 cards on desktop/tablet and 1 card on mobile
 */
const EventsSlider = () => {
  // Fetch events using the custom hook
  const { 
    events, 
    isLoading, 
    error 
  } = useEvents({
    platform: 'EL',
    is_online: 1,
    perPage: 10,
    status: 'published',
    orderBy: 'start_date',
    orderDir: 'desc'
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const maxSlides = Math.max(0, (events?.length || 0) - slidesPerView);

  // Update slider dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const isMobile = window.innerWidth < 768;
        const newSlidesPerView = isMobile ? 1 : 2;
        
        setSlidesPerView(newSlidesPerView);
        setSlideWidth(containerWidth / newSlidesPerView);
        
        // Reset current slide if needed when changing slides per view
        if (currentSlide > (events?.length || 0) - newSlidesPerView) {
          setCurrentSlide(Math.max(0, (events?.length || 0) - newSlidesPerView));
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [events?.length, currentSlide]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    const clampedIndex = Math.max(0, Math.min(index, maxSlides));
    setCurrentSlide(clampedIndex);
    setIsAnimating(true);
    setDragOffset(0);
  }, [maxSlides]);

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, isAnimating, goToSlide]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, isAnimating, goToSlide]);

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
  }, [isAnimating]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = dragStartX - currentX;
    
    // Calculate drag percentage relative to slide width
    let offsetInPixels = diff;
    
    // Add resistance at edges
    if ((currentSlide === 0 && offsetInPixels < 0) || 
        (currentSlide >= maxSlides && offsetInPixels > 0)) {
      offsetInPixels *= 0.3;
    }
    
    setDragOffset(offsetInPixels);
  }, [isDragging, dragStartX, currentSlide, maxSlides]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 500ms ease-in-out';
    }
    
    const swipeThreshold = slideWidth * 0.2;
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset > 0 && currentSlide < maxSlides) {
        nextSlide();
      } else if (dragOffset < 0 && currentSlide > 0) {
        prevSlide();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    
    setIsDragging(false);
  }, [isDragging, dragOffset, slideWidth, nextSlide, prevSlide, currentSlide, maxSlides]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
    
    e.preventDefault();
  }, [isAnimating]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = dragStartX - currentX;
    
    let offsetInPixels = diff;
    
    if ((currentSlide === 0 && offsetInPixels < 0) || 
        (currentSlide >= maxSlides && offsetInPixels > 0)) {
      offsetInPixels *= 0.3;
    }
    
    setDragOffset(offsetInPixels);
    e.preventDefault();
  }, [isDragging, dragStartX, currentSlide, maxSlides]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging) return;
    
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 500ms ease-in-out';
    }
    
    const swipeThreshold = slideWidth * 0.2;
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset > 0 && currentSlide < maxSlides) {
        nextSlide();
      } else if (dragOffset < 0 && currentSlide > 0) {
        prevSlide();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    
    setIsDragging(false);
    e.preventDefault();
  }, [isDragging, dragOffset, slideWidth, nextSlide, prevSlide, currentSlide, maxSlides]);

  const handleMouseLeave = useCallback((e) => {
    if (isDragging) {
      handleMouseUp(e);
    }
  }, [isDragging, handleMouseUp]);

  // Calculate transform value for slider
  const transformValue = `translateX(${-currentSlide * slideWidth - dragOffset}px)`;
  
  // Check if navigation buttons should be disabled
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= maxSlides;

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-px bg-gray-300 w-full my-4"></div>
            <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
              <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
                Upcoming &amp; Past Events
              </h2>
            </div>
          </div>
          
          <div className="h-[480px] md:h-[520px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-px bg-gray-300 w-full my-4"></div>
            <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
              <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
                Upcoming &amp; Past Events
              </h2>
            </div>
          </div>
          
          <div className="h-[480px] md:h-[520px] flex items-center justify-center text-center">
            <div>
              <p className="text-red-500 mb-4">Failed to load events</p>
              <p className="text-gray-600">Please try again later</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No events state
  if (!events || events.length === 0) {
    return (
      <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-px bg-gray-300 w-full my-4"></div>
            <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
              <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
                Upcoming &amp; Past Events
              </h2>
            </div>
          </div>
          
          <div className="h-[480px] md:h-[520px] flex items-center justify-center text-center">
            <div>
              <p className="text-gray-600 mb-4">No events available at this time</p>
              <Link 
                to="/events" 
                className="inline-flex items-center px-6 py-2 text-sm font-medium rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-300"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-16 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-yellow-500 opacity-5 rounded-full -ml-48"></div>
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full -mr-32 -mb-32"></div>
      
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-10">
          <div className="h-px bg-gray-300 w-full my-4"></div>
          
          <div className="flex pb-8 flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
            <h2 className="text-[24px] md:text-[34px] lg:text-[44px] font-semibold leading-[30px] md:leading-[40px] tracking-[-0.96px] text-[#292929] max-w-4xl">
              Upcoming &amp; Past Events
            </h2>
            
            <Link 
              to="/events" 
              className="inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-yellow-500 text-gray-800 hover:bg-[#292929] hover:text-white transition-all duration-500 ease-in-out self-start"
            >
              All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Events slider */}
        <div className="relative">
          {/* Slider container with ref for measuring */}
          <div 
            ref={containerRef}
            className="w-full overflow-hidden rounded-2xl"
          >
            {/* Draggable slider */}
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out h-[480px] md:h-[520px]"
              style={{ 
                transform: transformValue,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onTransitionEnd={handleTransitionEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="flex-shrink-0 h-full p-2"
                  style={{ width: `${slideWidth}px` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows - positioned at top right */}
          <div className="absolute top-[-60px] right-0 flex space-x-3 z-10">
            <button 
              onClick={prevSlide}
              disabled={isFirstSlide || isAnimating}
              className={`
                w-12 h-12 flex items-center justify-center
                bg-white rounded-full shadow-md
                text-gray-800 hover:text-yellow-500 transition-colors
                ${isFirstSlide ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100 cursor-pointer'}
              `}
              aria-label="Previous events"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              disabled={isLastSlide || isAnimating}
              className={`
                w-12 h-12 flex items-center justify-center
                bg-white rounded-full shadow-md
                text-gray-800 hover:text-yellow-500 transition-colors
                ${isLastSlide ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100 cursor-pointer'}
              `}
              aria-label="Next events"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slide indicators/dots */}
        {events.length > slidesPerView && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-yellow-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(EventsSlider);  
```

### src/components/home/EventsSlider/EventCard.jsx
```
import React, { useState, useCallback, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * EventCard component for displaying individual event information
 * Includes image loading state handling, error fallbacks, and countdown timer
 * Adapted to work with the API response format
 * Improved to handle multi-day events properly
 */
const EventCard = ({ event }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time from ISO string
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Check if event spans multiple days
  const isMultiDayEvent = () => {
    if (!event.start_date || !event.end_date) return false;
    
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    // Set time portions to 0 to compare only dates
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    return startDay.getTime() !== endDay.getTime();
  };

  // Format a date with the specified date format
  const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Calculate event duration in hours
  const calculateDurationHours = () => {
    if (!event.start_date || !event.end_date) return 0;
    
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    // Calculate difference in milliseconds and convert to hours
    const durationMs = endDate - startDate;
    const durationHours = Math.round(durationMs / (1000 * 60 * 60));
    
    return durationHours;
  };

  // Format date range for display based on whether it's a multi-day event
  const formatDateTimeRange = () => {
    if (!event.start_date || !event.end_date) return '';
    
    const durationHours = calculateDurationHours();
    const durationText = durationHours > 0 ? ` [${durationHours} hr${durationHours !== 1 ? 's' : ''}]` : '';
    
    if (isMultiDayEvent()) {
      // For multi-day events, show full date with specific start and end times
      return (
        <>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateOnly(event.start_date)} - {formatDateOnly(event.end_date)}
          </p>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDateOnly(event.start_date)}, {formatTime(event.start_date)} to {formatDateOnly(event.end_date)}, {formatTime(event.end_date)}{durationText}
          </p>
        </>
      );
    } else {
      // For same-day events, show date once and time range
      return (
        <>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.start_date)}
          </p>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(event.start_date)} - {formatTime(event.end_date)}{durationText}
          </p>
        </>
      );
    }
  };

  // Determine if event is upcoming or past
  const getEventStatus = () => {
    if (!event.start_date) return 'unknown';
    const now = new Date();
    const eventDate = new Date(event.start_date);
    
    if (eventDate > now) {
      return 'upcoming';
    } else if (event.end_date && new Date(event.end_date) > now) {
      return 'ongoing';
    } else {
      return 'past';
    }
  };

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      if (!event.start_date) return;
      
      const now = new Date();
      const eventStart = new Date(event.start_date);
      
      // Only show countdown for upcoming events within 30 days
      if (eventStart <= now || (eventStart - now) > 30 * 24 * 60 * 60 * 1000) {
        setIsCountdownActive(false);
        return;
      }
      
      setIsCountdownActive(true);
      
      const totalSeconds = Math.floor((eventStart - now) / 1000);
      
      if (totalSeconds <= 0) {
        setIsCountdownActive(false);
        return;
      }
      
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    // Initial update
    updateCountdown();
    
    // Set up interval for countdown
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(countdownInterval);
  }, [event.start_date]);

  // Handle successful image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle image error by using fallback
  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  // Image sources with fallback
  const imageSource = imageError ? 
    '/images/event-placeholder.jpg' : 
    (event.thumbnail || '/images/event-placeholder.jpg');
  
  // Generate event link
  const eventLink = `/events/${event.slug}`;

  // Get the event type label
  const eventType = event.event_type || 'Event';
  
  // Get status label and style
  const getStatusLabelAndStyle = () => {
    const status = getEventStatus();
    
    switch (status) {
      case 'upcoming':
        return {
          label: 'Upcoming',
          className: 'bg-green-100 text-green-800'
        };
      case 'ongoing':
        return {
          label: 'Happening Now',
          className: 'bg-blue-100 text-blue-800'
        };
      case 'past':
        return {
          label: 'Past',
          className: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };
  
  const { label: statusLabel, className: statusClassName } = getStatusLabelAndStyle();
  
  return (
    <div className="relative h-full flex flex-col group overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl">
      {/* Event image container with fixed aspect ratio */}
      <div className="relative w-full h-full overflow-hidden bg-gray-200">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Background image */}
        <img 
          src={imageSource}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>

        {/* Event type tag */}
        <div className="absolute top-4 left-4 z-10 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full font-semibold">
          {eventType}
        </div>
        
        {/* Event status tag (upcoming/past/happening now) */}
        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${statusClassName}`}>
          {statusLabel}
        </div>
        
        {/* Countdown timer - only show for upcoming events when hovered */}
        {isCountdownActive && (
          <div className="absolute top-16 right-4 z-10 mt-2 bg-black/70 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
            <p className="text-white text-xs mb-1 font-medium text-center">Starting in</p>
            <div className="flex space-x-2">
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.days}
                </div>
                <span className="text-white text-xs mt-1">Day{timeRemaining.days !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.hours}
                </div>
                <span className="text-white text-xs mt-1">Hr{timeRemaining.hours !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.minutes}
                </div>
                <span className="text-white text-xs mt-1">Min</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 text-gray-900 rounded-md w-10 h-10 flex items-center justify-center font-bold">
                  {timeRemaining.seconds}
                </div>
                <span className="text-white text-xs mt-1">Sec</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Event details container - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col">
          <h3 className="text-white text-2xl font-bold mb-2">{event.title}</h3>
          
          <div className="text-white/90 space-y-1 mb-4">
            {formatDateTimeRange()}
            
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location || 'Online'}
            </p>
          </div>
          
          <Link 
            to={eventLink} 
            className="inline-flex items-center self-start px-6 py-2 rounded-full bg-yellow-500 text-gray-900 font-semibold hover:bg-white transition-colors duration-300"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    description: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    location: PropTypes.string,
    location_url: PropTypes.string,
    is_online: PropTypes.bool,
    thumbnail: PropTypes.string,
    event_type: PropTypes.string
  }).isRequired
};

export default memo(EventCard);
```

