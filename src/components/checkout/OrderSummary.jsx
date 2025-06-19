import React from 'react';
import { motion } from 'framer-motion';

const OrderSummary = ({ cart }) => {
  // Calculate if cart has physical items
  const hasPhysicalItems = cart.items.some(item => !item.is_digital);
  
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="flex items-center group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                {item.quantity}
              </div>
            </div>
            <div className="ml-4 flex-grow">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
              <div className="mt-1 flex items-center space-x-2">
                {item.is_digital ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Digital
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Physical
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              ${parseFloat(item.subtotal).toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            ${parseFloat(cart.total).toFixed(2)}
          </span>
        </div>
        
        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {hasPhysicalItems ? (
              <span className="text-sm">Calculated at shipping step</span>
            ) : (
              <span className="text-green-600">Free</span>
            )}
          </span>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900 text-sm">Calculated at payment</span>
        </div>
        
        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">
              ${parseFloat(cart.total).toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 block">+ tax & shipping</span>
          </div>
        </div>
      </div>
      
      {/* Secure Checkout Notice */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-center items-center space-x-2 text-sm text-gray-600 bg-gray-50 py-3 px-4 rounded-lg">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secure Checkout</span>
        </div>
      </motion.div>
      
      {/* Accepted Payment Methods */}
      {/* <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-gray-500 text-center mb-3">Accepted Payment Methods</p>
        <div className="flex justify-center items-center space-x-3">
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <img src="/images/cards/visa.svg" alt="Visa" className="h-4" />
          </div>
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <img src="/images/cards/mastercard.svg" alt="Mastercard" className="h-4" />
          </div>
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <img src="/images/cards/amex.svg" alt="American Express" className="h-4" />
          </div>
          <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
            <img src="/images/cards/paypal.svg" alt="PayPal" className="h-4" />
          </div>
        </div>
      </motion.div> */}
      
      {/* Need Help Section */}
      <motion.div 
        className="mt-8 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button className="w-full text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200 flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Need help? Contact support
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;