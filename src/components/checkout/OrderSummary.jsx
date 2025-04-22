import React from 'react';

const OrderSummary = ({ cart }) => {
  // Calculate if cart has physical items
  const hasPhysicalItems = cart.items.some(item => !item.is_digital);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="ml-4 flex-grow">
              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {item.is_digital ? 'Digital' : 'Physical'} • Qty: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              ${parseFloat(item.subtotal).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            ${parseFloat(cart.total).toFixed(2)}
          </span>
        </div>
        
        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {hasPhysicalItems ? 'Calculated at shipping step' : 'Free (Digital items)'}
          </span>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-gray-900">Calculated at payment</span>
        </div>
        
        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">
            ${parseFloat(cart.total).toFixed(2)} +
          </span>
        </div>
      </div>
      
      {/* Secure Checkout Notice */}
      <div className="mt-6 text-center">
        <div className="flex justify-center items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Checkout
        </div>
      </div>
      
      {/* Accepted Payment Methods */}
      <div className="mt-6">
        <p className="text-xs text-gray-500 text-center mb-3">Accepted Payment Methods</p>
        <div className="flex justify-center space-x-4">
          <img src="/images/cards/visa.svg" alt="Visa" className="h-6" />
          <img src="/images/cards/mastercard.svg" alt="Mastercard" className="h-6" />
          <img src="/images/cards/paypal.svg" alt="PayPal" className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;