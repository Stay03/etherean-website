import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * ProductCard Component
 * Displays information about a single product in a card format
 */
const ProductCard = ({ product, onAddToCart }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const {
    id,
    title,
    slug,
    thumbnail,
    price,
    type,
    is_online
  } = product;

  // Helper to format price properly
  const formatPrice = (price) => {
    if (price === '0.00' || price === 0) {
      return 'Free';
    }
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const handleAddToCartClick = async () => {
    setIsAddingToCart(true);
    try {
      const response = await onAddToCart({ product_id: id, quantity: 1 });
      
      // Check if this is a special "auth_required" response
      // If so, reset the loading state immediately
      if (response && response.auth_required) {
        setIsAddingToCart(false);
      }
    } catch (error) {
      // Reset loading state on error
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Product Image */}
      <Link to={`/product/${slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Product Type Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              type === 'physical' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {type === 'physical' ? 'Physical' : 'Digital'}
            </span>
          </div>
          {/* Stock/Availability Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              is_online ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {is_online ? 'In Stock' : 'Pre-order'}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-yellow-600 transition-colors">{title}</h3>
        </Link>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          
          <button
            onClick={handleAddToCartClick}
            disabled={isAddingToCart}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center min-w-[100px] ${
              isAddingToCart 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-yellow-500 text-gray-900 hover:bg-gray-900 hover:text-white'
            }`}
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    is_online: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default ProductCard;