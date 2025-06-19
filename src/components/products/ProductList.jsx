import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';
import apiClient from '../../services/api/client';
import endpoints from '../../services/api/endpoints';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProductList Component
 * Displays a grid of product cards with pagination
 */
const ProductList = ({ 
  products, 
  isLoading, 
  error, 
  pagination,
  onPageChange,
  onRetry
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);
  const { isAuthenticated } = useAuth();
  
  // Handle adding products to cart
  const handleAddToCart = async (cartItem) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the pending cart item for later
      setPendingCartItem(cartItem);
      // Show auth modal
      setIsAuthModalOpen(true);
      // Return a resolved promise to stop the loading state in ProductCard
      // without causing an uncaught error
      return Promise.resolve({ auth_required: true });
    }
    
    // User is authenticated, proceed with adding to cart
    try {
      const response = await apiClient.post(endpoints.cart.add, cartItem);
      toast.success(`Added ${cartItem.quantity} item(s) to cart`);
      return response;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
      throw error; // Re-throw to allow the component to handle the error state
    }
  };

  // Handle successful authentication
  const handleAuthSuccess = async (user) => {
    // Close the auth modal
    setIsAuthModalOpen(false);
    
    // Process the pending cart item if it exists
    if (pendingCartItem) {
      try {
        const response = await apiClient.post(endpoints.cart.add, pendingCartItem);
        toast.success(`Added ${pendingCartItem.quantity} item(s) to cart`);
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        toast.error(error.message || 'Failed to add item to cart');
      } finally {
        // Clear the pending cart item
        setPendingCartItem(null);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-10 text-center">
        <div className="text-red-500 mb-4">
          {error.message || 'Failed to load products'}
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-600">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  // Pagination controls
  const renderPagination = () => {
    if (!pagination || pagination.last_page <= 1) return null;

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          {/* Previous page button */}
          <button
            onClick={() => onPageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className={`px-3 py-1 rounded ${
              pagination.current_page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            &laquo; Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: pagination.last_page }).map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`px-3 py-1 rounded ${
                pagination.current_page === index + 1
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next page button */}
          <button
            onClick={() => onPageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
            className={`px-3 py-1 rounded ${
              pagination.current_page === pagination.last_page
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next &raquo;
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="py-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingCartItem(null);
        }}
        onAuthSuccess={handleAuthSuccess}
        initialTab="login"
      />
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  pagination: PropTypes.shape({
    current_page: PropTypes.number.isRequired,
    last_page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }),
  onPageChange: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired
};

export default ProductList;