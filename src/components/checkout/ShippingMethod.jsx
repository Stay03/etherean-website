import React from 'react';

const ShippingMethod = ({ selectedMethod, onSelectMethod }) => {
  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      price: 9.99,
      estimatedDelivery: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      price: 19.99,
      estimatedDelivery: '2-3 business days'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      price: 29.99,
      estimatedDelivery: 'Next business day'
    }
  ];
  
  return (
    <div className="space-y-4">
      {shippingMethods.map((method) => (
        <div
          key={method.id}
          className={`border rounded-lg p-4 cursor-pointer transition-colors
            ${selectedMethod === method.id 
              ? 'border-yellow-500 bg-yellow-50' 
              : 'border-gray-200 hover:border-yellow-300'
            }`}
          onClick={() => onSelectMethod(method.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <input
                type="radio"
                checked={selectedMethod === method.id}
                onChange={() => onSelectMethod(method.id)}
                className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500"
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-500">{method.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Estimated delivery: {method.estimatedDelivery}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium text-gray-900">
                ${method.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {/* Shipping Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Shipping Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Shipping times are estimated and may vary based on location</li>
                <li>Orders are processed within 1-2 business days</li>
                <li>You will receive tracking information once your order ships</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;