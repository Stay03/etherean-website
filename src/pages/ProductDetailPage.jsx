import React, { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ProductDetail from '../components/products/ProductDetail';
import useProductDetail from '../hooks/useProductDetail';
import useProducts from '../hooks/useProducts';

/**
 * ProductDetailPage Component
 * Displays detailed information about a single product
 */
const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Fetch product details using custom hook
  const { 
    product, 
    isLoading, 
    error, 
    refetch 
  } = useProductDetail(slug);
  
  // State for cart updated notification
  const [cartUpdated, setCartUpdated] = useState(false);
  
  // Handle cart update
  const handleCartUpdate = (cartData) => {
    setCartUpdated(true);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setCartUpdated(false);
    }, 5000);
  };
  
  // Setup breadcrumb items
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Loading...', path: '' }
  ]);
  
  // Update breadcrumb when product loads
  useEffect(() => {
    if (product) {
      setBreadcrumbItems([
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '/shop' },
        { label: product.title, path: `/product/${slug}` }
      ]);
      
      // Update page title
      document.title = `${product.title} | Etherean Shop`;
    }
    
    // Cleanup when component unmounts
    return () => {
      document.title = 'Etherean Shop';
    };
  }, [product, slug]);
  
  // Fetch related products based on current product platform and type
  // Using useMemo to prevent recreation of the filter object on each render
  const relatedProductsFilter = React.useMemo(() => {
    if (!product) return {};
    
    return {
      platform: product.platform,
      type: product.type,
      per_page: 4,
      // Exclude current product
      exclude_id: product.id
    };
  }, [product?.id, product?.platform, product?.type]);
  
  const { products: relatedProducts } = useProducts(relatedProductsFilter);
  
  return (
    <div className="w-full">
      {/* Cart Updated Notification */}
      {cartUpdated && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">Product added to cart successfully!</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setCartUpdated(false)}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={breadcrumbItems} 
        onNavigate={(path) => navigate(path)} 
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Detail */}
        <ProductDetail 
          product={product}
          isLoading={isLoading}
          error={error}
          onCartUpdate={handleCartUpdate}
        />
        
        {/* Error Retry Button */}
        {error && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={refetch}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Related Products Section */}
        {!isLoading && !error && product && relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div 
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <img 
                      src={relatedProduct.thumbnail} 
                      alt={relatedProduct.title}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{relatedProduct.title}</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">${parseFloat(relatedProduct.price).toFixed(2)}</p>
                    <button
                      onClick={() => navigate(`/product/${relatedProduct.slug}`)}
                      className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProductDetailPage);