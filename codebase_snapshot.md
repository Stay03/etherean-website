# Codebase Documentation

{
  "Extraction Date": "2025-05-15 21:57:46",
  "Include Paths": [
    "src/App.js",
    "src/services/api/courseService.js",
    "src/services/api/productService.js",
    "src/pages/CoursesPage.jsx",
    "src/pages/EventsPage.jsx",
    "src/pages/ShopPage.jsx",
    "src/hooks/useEvents.js",
    "src/hooks/useCourses.js",
    "src/hooks/useProducts.js",
    "src/components/layout/Header/components/DesktopMenu.jsx",
    "src/components/layout/Header/components/MobileMenu.jsx",
    "src/components/layout/Header/index.jsx"
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
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const EthereanMissionProjectsPage = lazy(() => import('./pages/EthereanMissionProjects'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const FreeCoursesPage = lazy(() => import('./pages/FreeCoursesPage'));
const BlankPage = lazy(() => import('./pages/BlankPage'));
const WhyJesusPage = lazy(() => import('./pages/WhyJesusCameOnEarth'));
const SearchPage = lazy(() => import('./pages/SearchPage'));


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
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/:orderId" element={<PaymentPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:slug" element={<EventDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about/projects" element={<EthereanMissionProjectsPage />} />
                <Route path="/about/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/about/branches" element={<BranchesPage />} />
                <Route path="/about/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/free-courses" element={<FreeCoursesPage />} />
                <Route path="/why-jesus" element={<WhyJesusPage />} />
                <Route path="/ministries/youth" element={<BlankPage />} />
                <Route path="/ministries/healthy" element={<BlankPage />} />
                <Route path="/ministries/inner-circle" element={<BlankPage />} />
                <Route path="/ministries/flower-light" element={<BlankPage />} />

                
                
                
                {/* Catch-all route for 404 page */}
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
 * @param {number} params.price - Filter by price (0 for free courses)
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
 * Get free courses (price = 0)
 * 
 * @param {Object} params - Additional filter parameters
 * @param {number} params.limit - Number of courses to fetch (default: 4)
 * @returns {Promise} - Promise resolving to free courses
 */
const getFreeCourses = (params = {}) => {
  const defaultParams = {
    price: 0,
    per_page: params.limit || 4,
    page: 1,
    is_online: true,
    visibility: 1,
    platform: 'el',
    sort_by: 'oldest'
  };
  
  return apiClient.get(endpoints.courses.list, { ...defaultParams, ...params });
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
  getFreeCourses, // New method for free courses
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseService;
```

### src/services/api/productService.js
```
/**
 * Product Service
 * Centralizes all product-related API calls
 */

import apiClient from './client';
import endpoints from './endpoints';

/**
 * Get a list of products with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.platform - Filter by platform (EL, CH, EL,CH)
 * @param {string} params.type - Filter by product type (physical, digital)
 * @param {boolean} params.is_online - Filter by online status
 * @param {string} params.visibility - Visibility status
 * @param {string} params.sort - Sort order (newest, price_asc, price_desc)
 * @param {number} params.min_price - Minimum price filter
 * @param {number} params.max_price - Maximum price filter
 * @param {string} params.search - Search term
 * @param {number} params.per_page - Number of results per page
 * @param {number} params.page - Page number
 * @returns {Promise} - Promise resolving to product data
 */
const getProducts = (params = {}) => {
  return apiClient.get(endpoints.products.list, params);
};

/**
 * Get a specific product by ID
 * 
 * @param {number} id - Product ID
 * @returns {Promise} - Promise resolving to product data
 */
const getProductById = (id) => {
  return apiClient.get(endpoints.products.get(id));
};

/**
 * Get a specific product by slug
 * 
 * @param {string} slug - Product slug
 * @returns {Promise} - Promise resolving to product data
 */
const getProductBySlug = (slug) => {
  return apiClient.get(endpoints.products.getBySlug(slug));
};

const productService = {
  getProducts,
  getProductById,
  getProductBySlug
};

export default productService;
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
    sort_by: queryParams.get('sort_by') || 'price-desc',
    search: queryParams.get('search') || '',
    page: parseInt(queryParams.get('page') || '1', 10),
    per_page: parseInt(queryParams.get('per_page') || '12', 10),
    price : "> 1",
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
      <div className="max-w-[90rem] mx-auto  py-8">
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

### src/pages/EventsPage.jsx
```
import React, { useState, useMemo } from 'react';
import useEvents from '../hooks/useEvents';
import EventsGrid from '../components/events/EventsGrid';
// import EventsFilters from '../components/events/EventsFilters';
import EventsSorting from '../components/events/EventsSorting';
import EventsPagination from '../components/events/EventsPagination';
import Breadcrumb from '../components/Breadcrumb';

/**
 * EventsPage Component
 * Displays all events with filtering, sorting, and pagination
 */
const EventsPage = () => {
  // State for filters and sorting
  const [filters, setFilters] = useState({
    eventType: 'all', // all, online, in-person
    dateRange: 'all', // all, upcoming, past
    status: 'all', // all, upcoming, past, ongoing
  });
  
  const [sortBy, setSortBy] = useState({
    field: 'start_date',
    direction: 'desc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      platform: 'EL',
      page: currentPage,
      perPage: 12,
      orderBy: sortBy.field,
      orderDir: sortBy.direction,
    };
    
    // Apply filters
    if (filters.eventType === 'online') {
      params.is_online = 1;
    } else if (filters.eventType === 'in-person') {
      params.is_online = 0;
    }
    
    if (filters.status !== 'all') {
      params.status = filters.status;
    }
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    return params;
  }, [filters, sortBy, currentPage, searchQuery]);
  
  // Fetch events using custom hook
  const { events, pagination, isLoading, error } = useEvents(queryParams);

    // Breadcrumb items
    const breadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: 'Events', path: '/events' }
    ];
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle sort changes
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sort changes
  };
  
  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

      {/* Hero section */}
        {/* <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Events & Workshops
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Join our community events to learn, grow, and connect with like-minded individuals. 
              From online workshops to in-person retreats, we have something for everyone.
            </p>
          </div>
        </div> */}
        
        {/* Search bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5 md:right-[52%]">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            {/* <aside className="w-full lg:w-64 flex-shrink-0">
              <EventsFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </aside> */}
            
            {/* Events grid and sorting */}
            <main className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {!isLoading && (
                    <span>
                      Showing {(currentPage - 1) * pagination.perPage + 1} - {Math.min(currentPage * pagination.perPage, pagination.totalItems)} of {pagination.totalItems} events
                    </span>
                  )}
                </div>
                
                <EventsSorting 
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              </div>
              
              {/* Events grid */}
              <EventsGrid 
                events={events}
                isLoading={isLoading}
                error={error}
              />
              
              {/* Pagination */}
              {!isLoading && events.length > 0 && (
                <EventsPagination 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          </div>
        </div>
      </div>
 
  );
};

export default EventsPage;
```

### src/pages/ShopPage.jsx
```
import React, { useState, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import ProductSearch from '../components/products/ProductSearch';
import Breadcrumb from '../components/Breadcrumb';
import useProducts from '../hooks/useProducts';

/**
 * ShopPage Component
 * Main page that displays products with filtering and search capabilities
 */
const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Extract filter values from URL or use defaults
  const initialFilters = {
    platform: 'EL', // Default platform
    type: 'physical', // Default type
    is_online: true, // Default availability
    visibility: '1', // Default visibility
    sort: queryParams.get('sort') || 'newest',
    search: queryParams.get('search') || '',
    min_price: queryParams.get('min_price') ? Number(queryParams.get('min_price')) : '',
    max_price: queryParams.get('max_price') ? Number(queryParams.get('max_price')) : '',
    page: parseInt(queryParams.get('page') || '1', 10),
    per_page: parseInt(queryParams.get('per_page') || '12', 10)
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' }
  ];

  // State for filters
  const [filters, setFilters] = useState(initialFilters);

  // Use custom hook to fetch products data
  const { 
    products, 
    pagination, 
    isLoading, 
    error, 
    refetch 
  } = useProducts(filters);

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
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

  // Toggle filter panel on mobile
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={breadcrumbItems} 
        onNavigate={(path) => navigate(path)} 
      />
      
      
      {/* Filters and Search Section */}
      <div className="w-full bg-gray-50 py-6 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4">
            {/* Search and Filter Toggle for Mobile */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <ProductSearch 
                initialValue={filters.search} 
                onSearch={handleSearch} 
              />
              
              {/* Mobile Filter Toggle */}
              <button 
                className="md:hidden px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            
            {/* Filters - Always visible on desktop, toggle on mobile */}
            <div className={`${showFilters || 'hidden md:block'}`}>
              <ProductFilters 
                filters={filters} 
                onChange={updateFilters} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Count and Active Filters Summary */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <p className="text-gray-600">
              {isLoading ? 'Loading products...' : 
                `Showing ${products.length} of ${pagination?.total || 0} products`
              }
            </p>
            
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  Search: {filters.search}
                  <button
                    onClick={() => updateFilters({ search: '' })}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.min_price && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  Min Price: ${filters.min_price}
                  <button
                    onClick={() => updateFilters({ min_price: '' })}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.max_price && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                  Max Price: ${filters.max_price}
                  <button
                    onClick={() => updateFilters({ max_price: '' })}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              
              {/* Clear All Filters Button - Only show if at least one filter is active */}
              {(filters.search || filters.min_price || filters.max_price) && (
                <button
                  onClick={() => updateFilters({ 
                    search: '', 
                    min_price: '', 
                    max_price: '' 
                  })}
                  className="px-3 py-1 text-sm font-medium text-yellow-700 hover:text-yellow-900"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
        
        <ProductList 
          products={products} 
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

export default memo(ShopPage);
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

### src/hooks/useProducts.js
```
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/client';
import endpoints from '../services/api/endpoints';

/**
 * Custom hook to fetch and manage products data
 * 
 * @param {Object} filters - Object containing filter parameters
 * @returns {Object} - Object containing products data, loading state, error state, and refetch function
 */
const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoints.products.list, filters);
      
      // Check if response has the expected structure
      if (response && response.products) {
        setProducts(response.products.data || []);
        
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
        } = response.products;
        
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
        setProducts([]);
        setPagination(null);
        setError({ message: 'Unexpected API response format' });
      }
    } catch (err) {
      setProducts([]);
      setPagination(null);
      setError(err);
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: fetchProducts
  };
};

export default useProducts;
```

### src/components/layout/Header/components/DesktopMenu.jsx
```
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { primaryMenuItems, secondaryMenuItems, utilityMenuItems, authLinks } from '../data/menuData';
import Logo from './Logo';

/**
 * Enhanced desktop menu component with primary and secondary navigation areas
 * Renders a more organized navigation structure with dropdown functionality
 */
const DesktopMenu = ({ isScrolled = false, isLoggedIn = false, onLoginClick }) => {
  // State to track which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState(null);
  // State to track whether secondary menu is expanded
  const [isSecondaryMenuOpen, setSecondaryMenuOpen] = useState(false);
  
  // Determine which auth link to show based on login state
  const authLink = isLoggedIn ? authLinks.loggedIn : authLinks.loggedOut;
  
  // Handle mouse enter for dropdown
  const handleMouseEnter = (itemName) => {
    setOpenDropdown(itemName);
  };
  
  // Handle mouse leave for dropdown
  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };
  
  // Handle auth link click
  const handleAuthLinkClick = (e) => {
    // If not logged in and login button is clicked, open modal instead
    if (!isLoggedIn && authLink.name === 'Login') {
      e.preventDefault();
      onLoginClick();
    }
  };

  // Toggle secondary menu
  const toggleSecondaryMenu = () => {
    setSecondaryMenuOpen(!isSecondaryMenuOpen);
  };
  
  return (
    <div className={`hidden lg:flex ${!isScrolled ? 'py-6' : ''}`}>
      {/* Logo Area - Left side */}
      <div className={`flex items-center h-20 pl-16 pr-12 ${isScrolled ? 'bg-white' : 'bg-transparent'}`}>
        <Logo size="large" />
      </div>
      
      {/* Slanted divider SVG - only visible when not scrolled */}
      {!isScrolled && (
        <div className="relative h-20" style={{ marginRight: "-15px" }}>
          <svg width="93" height="80" viewBox="0 0 93 116" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full">
            <path fillRule="evenodd" clipRule="evenodd" d="M93 116V0H0C11.604 0.00830078 22.1631 6.70752 27.1128 17.2046L65.5889 98.7954C70.5415 109.299 81.1108 116 92.7231 116H93Z" fill="white"></path>
          </svg>
        </div>
      )}
      
      {/* Navigation Menu - Right side with white background */}
      <div className="flex-1 bg-white h-20">
        <div className="h-full flex flex-col">
          {/* Secondary menu row */}
          <div className="bg-white px-8 flex justify-end items-center h-8 text-sm">
            <ul className="flex space-x-6">
              {secondaryMenuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-indigo-400 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary navigation row */}
          <nav className="flex-1 flex justify-end">
            <ul className="flex items-center pr-8">
              {primaryMenuItems.map((item) => (
                <li 
                  key={item.name} 
                  className="mx-3 relative"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.hasDropdown ? (
                    <div className="flex items-center">
                      <Link
                        to={item.path}
                        className="text-gray-800 hover:text-indigo-400 transition-colors duration-200 font-medium py-2 px-1 text-lg"
                      >
                        {item.name}
                      </Link>
                      <div 
                        className="ml-1 text-gray-800 hover:text-indigo-400 transition-colors duration-200 cursor-pointer"
                        aria-haspopup="true"
                        aria-expanded={openDropdown === item.name}
                      >
                        <svg 
                          className={`w-4 h-4 transform transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-800 hover:text-indigo-400 transition-colors duration-200 font-medium flex items-center py-2 px-1 text-lg"
                    >
                      {item.name}
                    </Link>
                  )}
                  
                  {/* Dropdown Menu - With hover effect for menu items */}
                  {item.hasDropdown && (
                    <div 
                      className={`absolute top-full left-0 bg-white shadow-lg rounded-xl py-4 px-6 min-w-max z-10 transform origin-top ${
                        openDropdown === item.name 
                          ? 'opacity-100 scale-y-100' 
                          : 'opacity-0 scale-y-0 pointer-events-none'
                      }`}
                      style={{ 
                        borderTop: '3px solid #60A5FA',
                        transition: 'opacity 400ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1)'
                      }}
                    >
                      {item.submenu && item.submenu.map((subItem, index) => {
                        // Create a separate component for menu items to properly use hooks
                        const SubmenuItem = () => {
                          const [isHovered, setIsHovered] = useState(false);
                          
                          return (
                            <div className="relative block py-2 my-2">
                              <div 
                                className="absolute inset-0 transition-all duration-500"
                                style={{ 
                                  backgroundColor: isHovered ? '#60A5FA' : 'transparent',
                                  borderRadius: isHovered ? '9999px' : '0',
                                  opacity: isHovered ? 1 : 0
                                }}
                              />
                              <Link 
                                to={subItem.path}
                                className="block px-4 whitespace-nowrap relative z-10"
                                style={{ 
                                  color: isHovered ? 'white' : '#374151',
                                  display: 'block',
                                  position: 'relative',
                                  transitionProperty: 'color, transform',
                                  transitionDuration: '500ms',
                                  transitionTimingFunction: 'ease',
                                  transform: isHovered ? 'translateX(10px)' : 'translateX(0)'
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => setOpenDropdown(null)}
                              >
                                {subItem.name}
                              </Link>
                            </div>
                          );
                        };
                        
                        return <SubmenuItem key={index} />;
                      })}
                    </div>
                  )}
                </li>
              ))}

              

              {/* Account/Login link */}
              <li className="mx-3 ml-6">
                {isLoggedIn ? (
                  <Link
                    to={authLink.path}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200 font-medium text-lg"
                  >
                    {authLink.name}
                  </Link>
                ) : (
                  <a
                    href="#"
                    onClick={handleAuthLinkClick}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200 font-medium text-lg"
                  >
                    {authLink.name}
                  </a>
                )}
              </li>
              {/* Utility items - Cart icon */}
              {utilityMenuItems.map((item) => (
                <li key={item.name} className="mx-3">
                  <Link
                    to={item.path}
                    className="text-yellow-500 hover:text-indigo-400 transition-colors duration-200 font-medium flex items-center"
                    aria-label={item.name}
                  >
                    {item.icon === 'cart' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ) : (
                      item.name
                    )}
                  </Link>
                </li>
              ))}
              {/* Search button */}
              <li className="ml-6">
                <button 
                  className="bg-yellow-500 rounded-full p-3 text-white hover:bg-yellow-600 transition-colors duration-200"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

DesktopMenu.propTypes = {
  isScrolled: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  onLoginClick: PropTypes.func
};

export default memo(DesktopMenu);
```

### src/components/layout/Header/components/MobileMenu.jsx
```
import React, { memo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import SocialIcons from './SocialIcons';
import ContactInfo from './ContactInfo';
import { primaryMenuItems, secondaryMenuItems, utilityMenuItems, authLinks } from '../data/menuData';

/**
 * Mobile menu component with reorganized structure
 */
const MobileMenu = ({ 
  isOpen, 
  isScrolled,
  expandedItems,
  isLoggedIn = false,
  onClose,
  onToggleExpand,
  onMenuItemClick,
  onLoginClick
}) => {
  // Reference to the menu for focus trapping
  const menuRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  // Determine which auth link to show based on login state
  const authLink = isLoggedIn ? authLinks.loggedIn : authLinks.loggedOut;

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      
      // Trap focus within the modal when open
      if (e.key === 'Tab' && isOpen) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            e.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            e.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus first element when menu opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle auth link click
  const handleAuthLinkClick = (e) => {
    // If not logged in and login button is clicked, open modal instead
    if (!isLoggedIn && authLink.name === 'Login') {
      e.preventDefault();
      onClose(); // Close mobile menu
      onLoginClick(); // Open auth modal
    } else {
      onClose(); // Just close the mobile menu
    }
  };

  // Create a combined menu for mobile display
  const allMenuItems = [
    ...primaryMenuItems,
    {
      name: 'More',
      path: '#',
      hasDropdown: true,
      submenu: secondaryMenuItems
    }
  ];

  return (
    <>
      {/* Mobile Menu Drawer */}
      <div 
        ref={menuRef}
        id="mobile-menu"
        className={`lg:hidden fixed right-0 top-0 h-screen w-64 bg-gray-900 text-white z-50 overflow-y-auto transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)' }}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button 
            ref={firstFocusableRef}
            onClick={onClose}
            aria-label="Close Menu"
            className="text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Menu title (for accessibility) */}
        <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation Menu</h2>
        
        {/* Logo */}
        <div className="px-6 py-4 flex items-center">
          <Logo size="small" />
        </div>
        
        {/* Main Menu Items */}
        <nav className="px-4">
          <ul className="space-y-1">
            {allMenuItems.map((item) => (
              <li key={item.name} className="border-b border-gray-700">
                <div className="flex items-center justify-between py-3">
                  <Link
                    to={item.path}
                    className="text-white hover:text-yellow-500 transition-colors font-medium text-base"
                    onClick={() => onMenuItemClick(item.hasDropdown)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && (
                    <button 
                      onClick={() => onToggleExpand(item.name)}
                      className="text-yellow-500 p-1"
                      aria-expanded={expandedItems[item.name] ? 'true' : 'false'}
                      aria-controls={`submenu-${item.name}`}
                    >
                      <div className="w-6 h-6 flex items-center justify-center border border-yellow-500 rounded-sm">
                        {expandedItems[item.name] ? 
                          <span className="text-lg leading-none mb-1">-</span> : 
                          <span className="text-lg leading-none">+</span>
                        }
                      </div>
                    </button>
                  )}
                </div>
                
                {/* Dropdown content */}
                {item.hasDropdown && (
                  <div 
                    id={`submenu-${item.name}`}
                    className={`pl-4 pb-2 overflow-hidden transition-all duration-300`}
                    style={{ 
                      maxHeight: expandedItems[item.name] ? '200px' : '0',
                      transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
                    }}
                  >
                    <ul className="space-y-2">
                      {item.submenu && item.submenu.map((subItem, index) => (
                        <li key={index}>
                          <Link 
                            to={subItem.path}
                            className="text-gray-300 hover:text-yellow-500 block py-1"
                            onClick={onClose}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
            
            {/* Utility Menu Items */}
            {utilityMenuItems.map((item) => (
              <li key={item.name} className="border-b border-gray-700 py-3">
                <Link
                  to={item.path}
                  className="text-white hover:text-yellow-500 transition-colors font-medium flex items-center"
                  onClick={onClose}
                >
                  {item.icon === 'cart' ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {item.name}
                    </>
                  ) : (
                    item.name
                  )}
                </Link>
              </li>
            ))}
            
            {/* Login/Account Link */}
            <li className="border-b border-gray-700 py-3">
              {isLoggedIn ? (
                <Link
                  to={authLink.path}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium block"
                  onClick={onClose}
                >
                  {authLink.name}
                </Link>
              ) : (
                <a
                  href="#"
                  className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium block"
                  onClick={handleAuthLinkClick}
                >
                  {authLink.name}
                </a>
              )}
            </li>
          </ul>
        </nav>
        
        {/* Contact Info Section */}
        <ContactInfo />
        
        {/* Social Media Icons */}
        <div className="mt-6 px-4">
          <SocialIcons />
        </div>

        {/* Last focusable element (for focus trapping) */}
        <button 
          ref={lastFocusableRef} 
          className="sr-only"
          tabIndex={isOpen ? 0 : -1}
        >
          End of menu
        </button>
      </div>
      
      {/* Dark overlay when mobile menu is open */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        style={{ 
          transition: 'opacity 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86)'
        }}
      ></div>
    </>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  expandedItems: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func
};

export default memo(MobileMenu);
```

### src/components/layout/Header/index.jsx
```
import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScrollPosition from '../../../hooks/useScrollPosition';
import useMenuState from '../../../hooks/useMenuState';
import { useAuth } from '../../../contexts/AuthContext';
import Logo from './components/Logo';
import DesktopMenu from './components/DesktopMenu';
import MobileMenu from './components/MobileMenu';
import AuthModal from '../../auth/AuthModal';

/**
 * Main Header component
 * Combines desktop and mobile navigation
 */
const Header = () => {
  // Use authentication context instead of hardcoded value
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State for auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState('login');
  
  // Use custom scroll position hook
  const isScrolled = useScrollPosition(50);
  
  // Use custom menu state hook
  const {
    mobileMenuOpen,
    expandedItems,
    toggleMobileMenu,
    closeMobileMenu,
    toggleExpand,
    handleMobileMenuItemClick
  } = useMenuState();

  // Handler for opening auth modal
  const handleOpenAuthModal = (tab = 'login') => {
    setInitialAuthTab(tab);
    setAuthModalOpen(true);
  };

  // Handler for successful authentication
  const handleAuthSuccess = () => {
    // Refresh page or update state as needed
    closeMobileMenu();
  };

  // Handler for search button click
  const handleSearchClick = () => {
    navigate('/search');
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  };

  // Dynamic classes for the header based on scroll state
  const headerClasses = `w-full z-20 transition-all duration-300 ${
    isScrolled 
      ? 'fixed top-0 bg-white shadow-md' 
      : 'absolute bg-transparent'
  }`;

  return (
    <header className={headerClasses}>
      {/* Desktop Header */}
      <DesktopMenu 
        isScrolled={isScrolled}
        isLoggedIn={isAuthenticated}
        onLoginClick={() => handleOpenAuthModal('login')}
        onSearchClick={handleSearchClick}
      />

      {/* Mobile/Tablet Header */}
      <div className={`lg:hidden flex justify-between items-center h-16 px-12 ${isScrolled ? 'bg-white' : 'bg-transparent'} ${!isScrolled ? 'pt-16' : ''}`}>
        <Logo className="z-10" size={isScrolled ? "default" : "small"} />
        
        <div className="flex items-center z-10">
          <button 
            className={`p-2 mr-2 ${isScrolled ? 'text-yellow-500' : 'text-yellow-500'}`}
            aria-label="Search"
            onClick={handleSearchClick}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button 
            className={`p-2 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Drawer) */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        isScrolled={isScrolled}
        expandedItems={expandedItems}
        isLoggedIn={isAuthenticated}
        onClose={closeMobileMenu}
        onToggleExpand={toggleExpand}
        onMenuItemClick={handleMobileMenuItemClick}
        onLoginClick={() => handleOpenAuthModal('login')}
        onSearchClick={handleSearchClick}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialTab={initialAuthTab}
      />
    </header>
  );
};

export default memo(Header);
```

