import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Modern ProductCard Component
 * Displays information about a single product in a modern, immersive card format
 * Title is now positioned at the bottom with the price
 */
const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    id,
    title,
    slug,
    thumbnail,
    price,
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
      await onAddToCart({ product_id: id, quantity: 1 });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle product click - navigate to product detail page
  const handleProductClick = () => {
    navigate(`/product/${slug}`);
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 h-[30rem] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full-covering product image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        
        {/* Gradient overlay that's always present but stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-100" />
      </div>
      
      {/* Content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        {/* Now both title and price are at the bottom */}
        <div className="w-full mt-auto">
          {/* Title - now moved to bottom */}
          <div 
            onClick={handleProductClick} 
            className="cursor-pointer mb-2"
          >
            <h3 className="text-lg font-bold text-white drop-shadow-md line-clamp-2 transition-colors">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-md font-bold text-white drop-shadow-md">
              {formatPrice(price)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCartClick}
            disabled={isAddingToCart}
            className={`w-full py-3 rounded-lg font-medium text-center transition-all duration-300 ${
              isAddingToCart 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
            }`}
          >
            {isAddingToCart ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding to Cart...
              </div>
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
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default ProductCard;