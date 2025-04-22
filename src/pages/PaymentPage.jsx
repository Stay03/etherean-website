import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import PaystackPaymentButton from '../components/payment/PaystackPaymentButton';
import orderService from '../services/api/orderService';
import useCart from '../hooks/useCart';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paystack');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Get checkout data from session storage
    const storedCheckoutData = sessionStorage.getItem('checkoutData');
    if (!storedCheckoutData) {
      toast.error('Checkout data not found. Please return to checkout.');
      navigate('/checkout');
      return;
    }
    
    setCheckoutData(JSON.parse(storedCheckoutData));
  }, [isAuthenticated, navigate]);
  
  const handlePayNow = async () => {
    try {
      setIsCreatingOrder(true);
      
      // Create order with payment method
      const orderData = {
        ...checkoutData,
        payment_method: selectedPaymentMethod
      };
      
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        setOrder(response.order);
        // Clear checkout data from session storage
        sessionStorage.removeItem('checkoutData');
        // Proceed to payment (Paystack button will handle this)
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Failed to create order');
    } finally {
      setIsCreatingOrder(false);
    }
  };
  
  const handlePaymentSuccess = (transaction) => {
    toast.success('Payment completed successfully!');
    // Redirect to order confirmation page
    navigate(`/order-confirmation/${order.id}`);
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error(error.message || 'Payment failed. Please try again.');
    // Reset order if payment fails
    setOrder(null);
  };
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout', path: '/checkout' },
    { label: 'Payment', path: '#' }
  ];
  
  if (!checkoutData || !cart) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-xl w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
              </div>
              <div>
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="mt-2 text-gray-600">Select your payment method to complete your order</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Method Selection */}
          <div className="space-y-6">
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={setSelectedPaymentMethod}
            />
            
            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <div className="text-sm text-gray-600 space-y-2">
                {selectedPaymentMethod === 'paystack' && (
                  <>
                    <p>• Secure payment processed by Paystack</p>
                    <p>• Supports Debit/Credit Cards, Bank Transfer, Mobile Money</p>
                    <p>• Your payment information is encrypted and secure</p>
                  </>
                )}
                {selectedPaymentMethod === 'stripe' && (
                  <p className="text-gray-500">Stripe payment coming soon...</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Order Total */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${parseFloat(cart.total).toFixed(2)}</span>
              </div>
              {checkoutData?.shipping_method && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping ({checkoutData.shipping_method})</span>
                  <span className="font-medium">$0.00</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${parseFloat(cart.total).toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment Button */}
            <div className="mt-8">
              {order ? (
                <PaystackPaymentButton
                  order={order}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              ) : (
                <button
                  onClick={handlePayNow}
                  disabled={isCreatingOrder || !selectedPaymentMethod || selectedPaymentMethod === 'stripe'}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 
                    ${isCreatingOrder || !selectedPaymentMethod || selectedPaymentMethod === 'stripe'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                  {isCreatingOrder ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Order...
                    </span>
                  ) : selectedPaymentMethod === 'stripe' ? (
                    'Stripe Coming Soon'
                  ) : (
                    'Create Order & Pay Now'
                  )}
                </button>
              )}
            </div>
            
            {/* Security Notice */}
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;