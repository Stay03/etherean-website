# Codebase Documentation

{
  "Extraction Date": "2025-04-22 03:52:26",
  "Include Paths": [
    "src/App.js",
    "src/pages/CheckoutPage.jsx",
    "src/services/api/addressService.js",
    "src/services/api/orderService.js",
    "src/hooks/useAddresses.js",
    "src/hooks/useCheckout.js",
    "src/contexts/CheckoutContext.jsx",
    "src/contexts/CartContext.jsx",
    "src/services/api/endpoints.js",
    "src/components/courses/EnrollButton.jsx",
    "src/services/api/paymentService.js"
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

### src/pages/CheckoutPage.jsx
```
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCheckoutContext } from '../contexts/CheckoutContext';
import useCart from '../hooks/useCart';
import Breadcrumb from '../components/Breadcrumb';
import AddressSelector from '../components/checkout/AddressSelector';
import OrderSummary from '../components/checkout/OrderSummary';
import ShippingMethod from '../components/checkout/ShippingMethod';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();
  
  const {
    step,
    selectedShippingAddress,
    setSelectedShippingAddress,
    selectedBillingAddress,
    setSelectedBillingAddress,
    sameAsShipping,
    setSameAsShipping,
    shippingMethod,
    setShippingMethod,
    orderNotes,
    setOrderNotes,
    hasPhysicalItems,
    isCreatingOrder,
    submitOrder,
    nextStep,
    previousStep,
    resetCheckoutState
  } = useCheckoutContext();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/cart');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    return () => {
      resetCheckoutState();
    };
  }, [resetCheckoutState]);
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout', path: '/checkout' }
  ];
  
  const handleNextStep = () => {
    const canProceed = nextStep();
    if (!canProceed) {
      if (!selectedShippingAddress) {
        toast.error('Please select a shipping address');
      } else if (!sameAsShipping && !selectedBillingAddress) {
        toast.error('Please select a billing address');
      }
    }
  };
  
  const handleSubmitOrder = async () => {
    try {
      const order = await submitOrder();
      if (order) {
        navigate(`/payment/${order.id}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
    }
  };
  
  if (cartLoading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-xl w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-200 rounded-2xl"></div>
                <div className="h-40 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!cart?.items?.length) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white rounded-3xl shadow-lg p-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add items to your cart before checking out.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };
  
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500 ease-in-out"
                  style={{ 
                    width: `${((step - 1) / (hasPhysicalItems ? 2 : 1)) * 100}%` 
                  }}
                />
              </div>
              
              {/* Steps */}
              <div className="relative flex justify-between items-center">
                {[
                  { number: 1, title: 'Address', description: 'Delivery information' },
                  ...(hasPhysicalItems ? [{ number: 2, title: 'Shipping', description: 'Select method' }] : []),
                  { number: hasPhysicalItems ? 3 : 2, title: 'Review', description: 'Confirm details' }
                ].map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        step >= s.number 
                          ? 'bg-yellow-500 text-gray-900 shadow-lg transform scale-110' 
                          : 'bg-white text-gray-500 border-2 border-gray-200'
                      }`}
                    >
                      {step > s.number ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : s.number}
                    </div>
                    <div className="mt-4 text-center">
                      <p className={`font-semibold ${step >= s.number ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {s.title}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait" custom={step}>
              <motion.div
                key={step}
                custom={step}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                      <AddressSelector
                        type="shipping"
                        selectedAddress={selectedShippingAddress}
                        onSelectAddress={setSelectedShippingAddress}
                      />
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={sameAsShipping}
                            onChange={(e) => setSameAsShipping(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-200 ${
                            sameAsShipping 
                              ? 'bg-yellow-500 border-yellow-500' 
                              : 'border-gray-300 group-hover:border-yellow-400'
                          }`}>
                            {sameAsShipping && (
                              <svg className="w-4 h-4 text-gray-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-gray-700 font-medium">
                          Billing address same as shipping
                        </span>
                      </label>
                    </div>
                    
                    {!sameAsShipping && (
                      <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold mb-6">Billing Address</h2>
                        <AddressSelector
                          type="billing"
                          selectedAddress={selectedBillingAddress}
                          onSelectAddress={setSelectedBillingAddress}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {step === 2 && hasPhysicalItems && (
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
                    <ShippingMethod
                      selectedMethod={shippingMethod}
                      onSelectMethod={setShippingMethod}
                    />
                  </div>
                )}
                
                {((step === 3 && hasPhysicalItems) || (step === 2 && !hasPhysicalItems)) && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-8">Review Your Order</h2>
                    
                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <h3 className="text-lg font-semibold mb-6">Order Items</h3>
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center py-4 border-b last:border-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-xl"
                          />
                          <div className="ml-6 flex-grow">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.is_digital ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Digital
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Physical
                                </span>
                              )} • Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${parseFloat(item.subtotal).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Addresses Summary */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <h3 className="text-lg font-semibold mb-6">Delivery Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Shipping Address</h4>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="font-medium text-gray-900">
                              {selectedShippingAddress?.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedShippingAddress?.address_line_1}<br />
                              {selectedShippingAddress?.address_line_2 && 
                                <>{selectedShippingAddress.address_line_2}<br /></>
                              }
                              {selectedShippingAddress?.city}, {selectedShippingAddress?.state} {selectedShippingAddress?.postal_code}<br />
                              {selectedShippingAddress?.country}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Billing Address</h4>
                          <div className="bg-gray-50 rounded-xl p-4">
                            {sameAsShipping ? (
                              <p className="text-sm text-gray-600">Same as shipping address</p>
                            ) : (
                              <>
                                <p className="font-medium text-gray-900">
                                  {selectedBillingAddress?.name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {selectedBillingAddress?.address_line_1}<br />
                                  {selectedBillingAddress?.address_line_2 && 
                                    <>{selectedBillingAddress.address_line_2}<br /></>
                                  }
                                  {selectedBillingAddress?.city}, {selectedBillingAddress?.state} {selectedBillingAddress?.postal_code}<br />
                                  {selectedBillingAddress?.country}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Notes */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <h3 className="text-lg font-semibold mb-4">Order Notes (Optional)</h3>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Add any special instructions for your order..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 resize-none placeholder-gray-400"
                        rows="4"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center">
              {step > 1 ? (
                <button
                  onClick={previousStep}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <button
                  onClick={() => navigate('/cart')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Return to Cart
                </button>
              )}
              
              {((step === 3 && hasPhysicalItems) || (step === 2 && !hasPhysicalItems)) ? (
                <button
                  onClick={handleSubmitOrder}
                  disabled={isCreatingOrder}
                  className={`inline-flex items-center px-8 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg transform transition-all duration-200 
                    ${isCreatingOrder ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600 hover:-translate-y-0.5'}`}
                >
                  {isCreatingOrder ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center px-8 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-yellow-600 transition-all duration-200"
                >
                  Continue
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
```

### src/services/api/addressService.js
```
import apiClient from './client';
import endpoints from './endpoints';

/**
 * Address service for handling address-related API operations
 */
const addressService = {
  /**
   * Get all addresses for the current user
   * @returns {Promise} List of addresses
   */
  getAddresses: async () => {
    try {
      const response = await apiClient.get(endpoints.addresses.get);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new address
   * @param {Object} addressData - Address data to create
   * @returns {Promise} Created address data
   */
  createAddress: async (addressData) => {
    try {
      const response = await apiClient.post(endpoints.addresses.create, addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing address
   * @param {number} addressId - ID of the address to update
   * @param {Object} addressData - Updated address data
   * @returns {Promise} Updated address data
   */
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await apiClient.put(endpoints.addresses.update(addressId), addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete an address
   * @param {number} addressId - ID of the address to delete
   * @returns {Promise} Success response
   */
  deleteAddress: async (addressId) => {
    try {
      const response = await apiClient.delete(endpoints.addresses.delete(addressId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Set an address as default
   * @param {number} addressId - ID of the address to set as default
   * @returns {Promise} Updated address data
   */
  setDefaultAddress: async (addressId) => {
    try {
      const response = await apiClient.post(endpoints.addresses.setDefault(addressId));
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default addressService;
```

### src/services/api/orderService.js
```
import apiClient from './client';
import endpoints from './endpoints';

/**
 * Order service for handling order-related API operations
 */
const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data including addresses, shipping method, etc.
   * @returns {Promise} Created order data
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post(endpoints.orders.create, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get order details by ID
   * @param {number} orderId - ID of the order
   * @returns {Promise} Order details
   */
  getOrder: async (orderId) => {
    try {
      const response = await apiClient.get(endpoints.orders.get(orderId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get list of orders for the current user
   * @returns {Promise} List of orders
   */
  getOrders: async () => {
    try {
      const response = await apiClient.get(endpoints.orders.list);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {number} orderId - ID of the order to cancel
   * @returns {Promise} Success response
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.post(endpoints.orders.cancel(orderId));
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService;
```

### src/hooks/useAddresses.js
```
import { useState, useCallback } from 'react';
import addressService from '../services/api/addressService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing user addresses
 */
const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all addresses
   */
  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await addressService.getAddresses();
      if (response.success) {
        setAddresses(response.addresses);
      }
    } catch (err) {
      setError(err);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new address
   */
  const createAddress = async (addressData) => {
    try {
      setIsLoading(true);
      const response = await addressService.createAddress(addressData);
      if (response.success) {
        setAddresses(prev => [...prev, response.address]);
        toast.success('Address added successfully');
        return response.address;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing address
   */
  const updateAddress = async (addressId, addressData) => {
    try {
      setIsLoading(true);
      const response = await addressService.updateAddress(addressId, addressData);
      if (response.success) {
        setAddresses(prev => 
          prev.map(addr => addr.id === addressId ? response.address : addr)
        );
        toast.success('Address updated successfully');
        return response.address;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an address
   */
  const deleteAddress = async (addressId) => {
    try {
      setIsLoading(true);
      const response = await addressService.deleteAddress(addressId);
      if (response.success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast.success('Address deleted successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set an address as default
   */
  const setDefaultAddress = async (addressId) => {
    try {
      setIsLoading(true);
      const response = await addressService.setDefaultAddress(addressId);
      if (response.success) {
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            is_default: addr.id === addressId
          }))
        );
        toast.success('Default address updated');
        return response.address;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to set default address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  };
};

export default useAddresses;
```

### src/hooks/useCheckout.js
```
import { useState, useCallback } from 'react';
import orderService from '../services/api/orderService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing the checkout process
 */
const useCheckout = () => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  /**
   * Create a new order with the provided checkout data
   */
  const createOrder = useCallback(async (orderData) => {
    try {
      setIsCreatingOrder(true);
      setOrderError(null);
      
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        setCurrentOrder(response.order);
        toast.success('Order created successfully');
        return response.order;
      }
    } catch (err) {
      setOrderError(err);
      toast.error(err.message || 'Failed to create order');
      throw err;
    } finally {
      setIsCreatingOrder(false);
    }
  }, []);

  /**
   * Get order details by ID
   */
  const getOrderDetails = useCallback(async (orderId) => {
    try {
      const response = await orderService.getOrder(orderId);
      if (response.success) {
        setCurrentOrder(response.order);
        return response.order;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch order details');
      throw err;
    }
  }, []);

  /**
   * Reset the checkout state
   */
  const resetCheckout = useCallback(() => {
    setCurrentOrder(null);
    setOrderError(null);
  }, []);

  return {
    isCreatingOrder,
    orderError,
    currentOrder,
    createOrder,
    getOrderDetails,
    resetCheckout
  };
};

export default useCheckout;
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

### src/components/courses/EnrollButton.jsx
```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from '../../utils/toastConfig'; // Import the custom toast config
import AuthModal from '../auth/AuthModal';
import freeProductService from '../../services/api/freeProductService';
import paymentService from '../../services/api/paymentService';
import PaystackPop from '@paystack/inline-js';

/**
 * EnrollButton Component
 * Call-to-action button for course purchase with different states
 * Updated to use React Toastify
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
      toast.success('Course added to your account successfully!');
      
      // Redirect to "My Items" page
      navigate('/my-items');
      
      return true;
    } catch (error) {
      // Show error message
      toast.error(error.message || 'Failed to acquire course. Please try again.');
      
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
            toast.success('Payment completed successfully!');
            
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
            toast.info('Payment was cancelled.');
          },
          onError: (error) => {
            // Error during payment
            console.error('Paystack error:', error);
            toast.error(error.message || 'Payment processing failed. Please try again.');
          },
          onElementsMount: (elements) => {
            // Elements (like Apple Pay) mounted
            if (elements) {
              console.log('Paystack elements mounted:', elements);
            }
          }
        });
        
        // Show loading toast
        toast.info('Payment initialized. Complete the payment in the popup window.');
        
        return true;
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Payment initialization failed - invalid response format');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error.message || 'Payment initialization failed. Please try again.');
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
          toast.success('Course added to cart successfully!');
        } else {
          // Call buy now callback if provided
          if (onBuyNow) {
            await onBuyNow(course);
          }
          
          // Initialize Paystack payment instead of redirecting to checkout
          await initializePaystackPayment(course.product_id);
        }
      } catch (error) {
        toast.error(error.message || 'Action failed. Please try again.');
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
      toast.error('Authentication failed. Please try again.');
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
      toast.success('Course added to cart successfully!');
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

### src/services/api/paymentService.js
```
import apiClient from './client';

/**
 * Initialize a payment transaction
 * 
 * @param {number|string} productId - The ID of the product to purchase
 * @returns {Promise} - Promise resolving to payment initialization data
 */
const initializePayment = async (productId) => {
  try {
    const endpoint = `/paystack/initialize`;
    const response = await apiClient.post(endpoint, { product_id: productId });
    return response;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

/**
 * Verify a payment transaction
 * 
 * @param {string} reference - The transaction reference
 * @returns {Promise} - Promise resolving to payment verification data
 */
const verifyPayment = async (reference) => {
  try {
    const endpoint = `/paystack/verify/?reference=${reference}`;
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

const paymentService = {
  initializePayment,
  verifyPayment
};

export default paymentService;
```

