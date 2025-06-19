import React, { useState } from 'react';
import apiClient from '../../services/api/client';
import endpoints from '../../services/api/endpoints';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

/**
 * ProductActions Component
 * Handles product quantity selection and add to cart functionality
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {Function} props.onCartUpdate - Callback function when cart is updated (optional)
 */
const ProductActions = ({ product, onCartUpdate }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Get authentication context
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check if product is available
  const isAvailable = product && product.is_online;
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  
  // Decrement quantity, but not below 1
  const decrementQuantity = () => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
  };
  
  // Handler for Auth Modal close
  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };
  
  // Handler for successful authentication
  const handleAuthSuccess = () => {
    // Close the modal
    setShowAuthModal(false);
    
    // Attempt to add to cart again
    addToCart();
  };
  
  // Add product to cart
  const addToCart = async () => {
    if (!product || !product.id) return;
    
    // Check if user is authenticated
    if (!isLoading && !isAuthenticated) {
      // Show auth modal if not authenticated
      setShowAuthModal(true);
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      const response = await apiClient.post(endpoints.cart.add, {
        product_id: product.id,
        quantity: quantity
      });
      
      // Check for successful response
      if (response && response.success) {
        toast.success(response.message || 'Product added to cart!');
        
        // Call callback if provided
        if (onCartUpdate && typeof onCartUpdate === 'function') {
          onCartUpdate(response.cart);
        }
        
        // Reset quantity to 1 after adding to cart
        setQuantity(1);
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  return (
    <div className="product-actions">
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onAuthSuccess={handleAuthSuccess}
        redirectPath=""
        initialTab="login"
      />
      
      {/* Price */}
      <div className="price-container mb-6">
        <span className="text-3xl font-bold text-gray-900">
          ${parseFloat(product?.price || 0).toFixed(2)}
        </span>
      </div>
      
     
      
      {/* Quantity Selector */}
      <div className="quantity-selector flex items-center mb-6">
        <span className="text-gray-700 mr-4">Quantity:</span>
        <div className="custom-number-input flex">
          <button 
            onClick={decrementQuantity}
            className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-10 w-10 rounded-l cursor-pointer outline-none flex items-center justify-center"
          >
            <span className="m-auto text-2xl font-thin">−</span>
          </button>
          <input 
            type="number" 
            className="outline-none focus:outline-none text-center w-14 bg-gray-100 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700" 
            name="quantity" 
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
          />
          <button 
            onClick={incrementQuantity}
            className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-10 w-10 rounded-r cursor-pointer flex items-center justify-center"
          >
            <span className="m-auto text-2xl font-thin">+</span>
          </button>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button 
        onClick={addToCart}
        disabled={!isAvailable || isAddingToCart}
        className={`w-full py-3 px-8 rounded-full font-semibold text-lg transition-colors ${
          isAvailable 
            ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAddingToCart ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : isAvailable ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductActions;