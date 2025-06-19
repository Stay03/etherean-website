import React, { useState } from 'react';

/**
 * ProductGallery Component
 * Displays the main product image with thumbnails for additional images
 * 
 * @param {Object} props
 * @param {string} props.mainImage - URL of the main product image
 * @param {Array} props.additionalImages - Array of additional image URLs (optional)
 */
const ProductGallery = ({ mainImage, additionalImages = [] }) => {
  const [currentImage, setCurrentImage] = useState(mainImage);
  
  // Combine main image with additional images for the gallery
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  
  return (
    <div className="product-gallery">
      {/* Main Image Display */}
      <div className="main-image-container mb-4 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        <img 
          src={currentImage} 
          alt="Product" 
          className="w-full h-auto object-contain aspect-square"
        />
      </div>
      
      {/* Thumbnails - Only show if there are multiple images */}
      {allImages.length > 1 && (
        <div className="thumbnails-container flex space-x-4 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => setCurrentImage(image)}
              className={`thumbnail-item flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                currentImage === image ? 'border-yellow-500 shadow-md' : 'border-gray-200'
              }`}
            >
              <img 
                src={image} 
                alt={`Product thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;