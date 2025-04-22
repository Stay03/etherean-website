import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * CartItem Component
 * Displays a single item in the shopping cart
 * 
 * @param {Object} props - Component props
 * @param {Object} props.item - Cart item data
 * @param {Function} props.onUpdateQuantity - Function to update item quantity
 * @param {Function} props.onRemove - Function to remove item
 */
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Handle quantity change
  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, newQuantity);
      setIsUpdating(false);
    }
  };
  
  // Handle quantity increment
  const handleIncrement = async () => {
    setIsUpdating(true);
    await onUpdateQuantity(item.id, parseInt(item.quantity) + 1);
    setIsUpdating(false);
  };
  
  // Handle quantity decrement
  const handleDecrement = async () => {
    const currentQuantity = parseInt(item.quantity);
    if (currentQuantity > 1) {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, currentQuantity - 1);
      setIsUpdating(false);
    }
  };
  
  // Handle item removal
  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item.id);
    setIsRemoving(false);
  };
  
  // Get product link
  const getProductLink = () => {
    if (item.type === 'course') {
      return `/course/${item.product_id}`;
    }
    return `/product/${item.product_id}`;
  };
  
  return (
    <div className="flex gap-4 p-4 md:p-6">
      {/* Product Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
        <Link to={getProductLink()}>
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-grow min-w-0">
        {/* Title and Type */}
        <div className="flex justify-between">
          <div>
            <Link 
              to={getProductLink()}
              className="font-medium text-gray-900 hover:text-yellow-600 transition-colors"
            >
              {item.title}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500 capitalize">
                {item.type}
              </span>
              {item.is_digital && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Digital
                </span>
              )}
            </div>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
            disabled={isRemoving}
          >
            {isRemoving ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Price and Quantity */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
          {/* Price */}
          <div className="mb-3 md:mb-0">
            <span className="text-lg font-semibold text-gray-900">
              ${parseFloat(item.price).toFixed(2)}
            </span>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors ${
                isUpdating || item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isUpdating || item.quantity <= 1}
            >
              {isUpdating && item.quantity > 1 ? (
                <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              )}
            </button>
            
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className={`w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                isUpdating ? 'opacity-50' : ''
              }`}
              disabled={isUpdating}
            />
            
            <button
              onClick={handleIncrement}
              className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors ${
                isUpdating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Subtotal */}
        <div className="text-right mt-4 md:mt-0">
          <span className="text-sm text-gray-500">Subtotal:</span>
          <span className="ml-2 font-medium text-gray-900">
            ${parseFloat(item.subtotal).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;