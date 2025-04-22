import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CartSummary Component
 * Displays cart totals and checkout button
 * 
 * @param {Object} props - Component props
 * @param {Object} props.cart - Cart data
 * @param {Function} props.onCheckout - Function to handle checkout
 */
const CartSummary = ({ cart, onCheckout }) => {
  const navigate = useNavigate();
  
  // Calculate if any items require shipping
  const hasPhysicalItems = cart.items.some(item => !item.is_digital);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Summary Details */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cart.items_count} {cart.items_count === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-gray-900">${parseFloat(cart.total).toFixed(2)}</span>
        </div>
        
        {/* Shipping */}
        {/* <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {hasPhysicalItems ? 'Calculated at checkout' : 'Free (Digital items)'}
          </span>
        </div> */}
        
        {/* Tax */}
        {/* <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-gray-900">Calculated at checkout</span>
        </div> */}
        
        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">${parseFloat(cart.total).toFixed(2)}</span>
        </div>
      </div>
      
      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full mt-6 py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        Proceed to Checkout
      </button>
      
      {/* Continue Shopping */}
      <button
        onClick={() => navigate('/shop')}
        className="w-full mt-3 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Continue Shopping
      </button>
      
      {/* Security Notice */}
      <div className="mt-6 text-center">
        <div className="flex justify-center items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Checkout
        </div>
      </div>
      
    
    </div>
  );
};

export default CartSummary;