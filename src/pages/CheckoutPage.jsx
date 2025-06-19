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

  const handleProceedToPayment = async () => {
    // Don't create order yet, just navigate to payment page with checkout data
    if (!selectedShippingAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    if (!sameAsShipping && !selectedBillingAddress) {
      toast.error('Please select a billing address');
      return;
    }
    
    // Store checkout data in session storage to pass to payment page
    const checkoutData = {
      shipping_address_id: selectedShippingAddress.id,
      billing_address_id: sameAsShipping ? selectedShippingAddress.id : selectedBillingAddress.id,
      shipping_method: hasPhysicalItems ? shippingMethod : null,
      notes: orderNotes
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    navigate('/payment');
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
                  onClick={handleProceedToPayment}
                  className="inline-flex items-center px-8 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg transform transition-all duration-200 hover:bg-yellow-600 hover:-translate-y-0.5"
                >
                  Continue to Payment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
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