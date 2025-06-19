import React from 'react';
import { motion } from 'framer-motion';

const ShippingMethod = ({ selectedMethod, onSelectMethod }) => {
  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      price: 9.99,
      estimatedDelivery: '5-7 business days',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      price: 19.99,
      estimatedDelivery: '2-3 business days',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      price: 29.99,
      estimatedDelivery: 'Next business day',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
        id: 'pickup',
        name: 'In-Store Pickup',
        description: 'Pick up from our store',
        price: 0,
        estimatedDelivery: 'Same day',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
    }
  ];
  
  return (
    <div className="space-y-4">
      {shippingMethods.map((method, index) => (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 
            ${selectedMethod === method.id 
              ? 'border-yellow-500 bg-yellow-50 shadow-md' 
              : 'border-gray-200 hover:border-yellow-400 hover:shadow-sm'
            }`}
          onClick={() => onSelectMethod(method.id)}
        >
          <div className="flex items-start">
            <div className={`p-3 rounded-lg mr-4 transition-colors duration-200
              ${selectedMethod === method.id 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-600'
              }`}
            >
              {method.icon}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    ${method.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {method.estimatedDelivery}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${selectedMethod === method.id 
                    ? 'border-yellow-500 bg-yellow-500' 
                    : 'border-gray-300'
                  }`}
                >
                  {selectedMethod === method.id && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Shipping Information */}
      <motion.div 
        className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-blue-900">Shipping Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>Shipping times are estimated and may vary based on location</li>
                <li>Orders are processed within 1-2 business days</li>
                <li>You will receive tracking information once your order ships</li>
                <li>Weekend deliveries may be available in some areas</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Delivery Address Preview */}
      <motion.div 
        className="mt-6 bg-gray-50 rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Delivery Address Preview</h4>
        <div className="text-sm text-gray-600">
          <p>Your order will be delivered to the shipping address selected in the previous step.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ShippingMethod;