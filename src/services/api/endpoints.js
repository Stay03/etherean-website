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