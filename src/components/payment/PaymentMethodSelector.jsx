import React from 'react';
import { motion } from 'framer-motion';

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  const paymentMethods = [
    {
      id: 'paystack',
      name: 'Paystack',
      description: 'Pay with card, bank transfer, or mobile money',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.5c-5.238 0-9.5-4.262-9.5-9.5S6.762 2.5 12 2.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5z"/>
          <path d="M15 8h-6c-.825 0-1.5.675-1.5 1.5v5c0 .825.675 1.5 1.5 1.5h6c.825 0 1.5-.675 1.5-1.5v-5c0-.825-.675-1.5-1.5-1.5z"/>
        </svg>
      ),
      available: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Credit & debit cards, Apple Pay, Google Pay',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
        </svg>
      ),
      available: false,
      comingSoon: true
    }
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Select Payment Method</h2>
      <div className="grid grid-cols-1 gap-4">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={method.available ? { scale: 1.02 } : {}}
            whileTap={method.available ? { scale: 0.98 } : {}}
            className={`relative ${method.available ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={() => method.available && onSelectMethod(method.id)}
          >
            <div
              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : method.available
                  ? 'border-gray-200 hover:border-yellow-300 bg-white'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Radio Button */}
                  <div className="relative">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      disabled={!method.available}
                      onChange={() => method.available && onSelectMethod(method.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedMethod === method.id
                          ? 'border-yellow-500 bg-yellow-500'
                          : method.available
                          ? 'border-gray-300'
                          : 'border-gray-300 bg-gray-100'
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Icon and Details */}
                  <div className="flex items-center space-x-4">
                    <div className={`${method.available ? 'text-gray-900' : 'text-gray-400'}`}>
                      {method.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${method.available ? 'text-gray-900' : 'text-gray-500'}`}>
                        {method.name}
                      </h3>
                      <p className={`text-sm ${method.available ? 'text-gray-600' : 'text-gray-400'}`}>
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Coming Soon Badge */}
                {method.comingSoon && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Secure Payment</h4>
            <p className="text-sm text-blue-600 mt-1">
              All transactions are encrypted and processed securely through our payment partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;