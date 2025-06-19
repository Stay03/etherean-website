import React from 'react';
import ProductGallery from './ProductGallery';
import ProductActions from './ProductActions';

/**
 * ProductDetail Component
 * Displays comprehensive information about a product
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {boolean} props.isLoading - Loading state
 * @param {Object} props.error - Error object if any
 * @param {Function} props.onCartUpdate - Callback function when cart is updated
 */
const ProductDetail = ({ product, isLoading, error, onCartUpdate }) => {
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error.message || 'Failed to load product details. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Product not found. It may have been removed or is no longer available.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Left Column - Product Gallery */}
        <div className="product-media">
          <ProductGallery 
            mainImage={product.thumbnail}
            additionalImages={product.additional_images || []}
          />
        </div>
        
        {/* Right Column - Product Info and Actions */}
        <div className="product-info">
          
          
          {/* Product Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          
          {/* Product Actions (Price, Quantity, Add to Cart) */}
          <ProductActions 
            product={product} 
            onCartUpdate={onCartUpdate}
          />
          
          {/* Product Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-yellow max-w-none">
              {/* Use whitespace-pre-line to preserve line breaks in the description */}
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          </div>
          
          {/* Additional Product Details (if any) */}
          {product.is_membership && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900">Membership Details</h3>
              <p className="text-gray-700">
                Duration: {product.membership_duration_days} days
              </p>
            </div>
          )}
          
          {/* Product Metadata */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">SKU</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.id}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{product.type}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.created_at).toLocaleDateString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for product detail
const ProductDetailSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Left Column - Gallery Skeleton */}
      <div className="product-media">
        <div className="main-image-container mb-4 rounded-lg overflow-hidden bg-gray-200 aspect-square"></div>
        <div className="thumbnails-container flex space-x-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-20 h-20 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
      
      {/* Right Column - Info Skeleton */}
      <div className="product-info">
        <div className="mb-4 w-24 h-6 bg-gray-200 rounded-full"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-full mb-8"></div>
        
        <div className="mt-8">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetail;