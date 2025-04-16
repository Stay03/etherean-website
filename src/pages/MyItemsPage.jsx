import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../services/api/client';

/**
 * MyItemsPage Component
 * Displays a user's purchased courses, ebooks, and physical products
 */
const MyItemsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (authLoading) return;

      // Redirect if not authenticated
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { 
            from: '/my-items',
            message: 'Please log in to view your items' 
          } 
        });
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiClient.get('/my-products');
        
        if (response && response.products && response.products.data) {
          setProducts(response.products.data);
          setFilteredProducts(response.products.data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user products:', err);
        setError('Failed to load your items. Please try again later.');
        showToast('Error loading your items', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, authLoading, navigate, showToast]);

  // Filter products by type
  const filterProducts = (filterType) => {
    setActiveFilter(filterType);
    
    if (filterType === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.product_type === filterType));
    }
  };

  // Get product badge color based on product type
  const getProductBadge = (productType) => {
    switch (productType) {
      case 'course':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          label: 'Course'
        };
      case 'ebook':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          label: 'eBook'
        };
      case 'book':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          label: 'Book'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          label: productType.charAt(0).toUpperCase() + productType.slice(1)
        };
    }
  };

  // Get product action button based on product type
  const getActionButton = (product) => {
    // Digital products (course, ebook)
    if (['course', 'ebook'].includes(product.product_type)) {
      const path = product.product_type === 'course' 
        ? `/course/${product.product.slug}/learn`
        : `/ebook/${product.product.slug}/read`;
        
      return (
        <button
          onClick={() => navigate(path)}
          className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          {product.product_type === 'course' ? 'Go to Course' : 'Read Now'}
        </button>
      );
    }
    
    // Physical products (book, etc.)
    return (
      <button
        onClick={() => navigate(`/my-items/${product.id}`)}
        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
      >
        View Details
      </button>
    );
  };

  // Format expiration date or show unlimited
  const formatExpiration = (product) => {
    if (!product.expires_at) {
      return 'Unlimited Access';
    }
    
    return product.days_remaining > 0 
      ? `${product.days_remaining} days remaining` 
      : 'Expired';
  };

  // Handle loading state
  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
            <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Your Items</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7x mt-20 mb-20 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Items</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap mb-8 border-b border-gray-200">
        {['all', 'course', 'ebook', 'book'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeFilter === filter
                ? 'text-yellow-600 border-b-2 border-yellow-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => filterProducts(filter)}
          >
            {filter === 'all' ? 'All Items' : filter === 'course' ? 'Courses' : filter === 'ebook' ? 'eBooks' : 'Physical Books'}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-3xl mx-auto text-center">
          <svg className="h-12 w-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Items Yet</h3>
          <p className="text-yellow-700 mb-6">
            You haven't purchased or acquired any items yet. Browse our catalog to find products that interest you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-2 bg-yellow-500 text-gray-900 font-medium rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Browse Courses
            </button>
            <button
              onClick={() => navigate('/ebooks')}
              className="px-6 py-2 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Browse eBooks
            </button>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-3xl mx-auto text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No {activeFilter === 'all' ? 'items' : activeFilter + 's'} found</h3>
          <p className="text-gray-600 mb-4">
            You don't have any {activeFilter === 'all' ? 'items' : activeFilter + 's'} in your collection yet.
          </p>
          <button
            onClick={() => filterProducts('all')}
            className="px-6 py-2 bg-gray-200 text-gray-900 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            View All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const badge = getProductBadge(product.product_type);
            const isDigital = ['course', 'ebook'].includes(product.product_type);
            
            return (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Product Thumbnail */}
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  {product.product?.thumbnail ? (
                    <img
                      src={product.product.thumbnail}
                      alt={product.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Product type badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                  
                  {/* Digital/Physical badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDigital ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {isDigital ? 'Digital' : 'Physical'}
                    </span>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.product?.title || 'Untitled Product'}
                  </h3>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>
                      Purchased: {new Date(product.purchased_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Digital product expiry */}
                  {isDigital && (
                    <div className="text-sm text-gray-600 mb-4">
                      <span className={`${product.days_remaining < 7 && product.days_remaining > 0 ? 'text-yellow-600' : product.days_remaining <= 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {formatExpiration(product)}
                      </span>
                    </div>
                  )}
                  
                  {/* Physical product status */}
                  {!isDigital && (
                    <div className="text-sm text-gray-600 mb-4">
                      <span className={`font-medium ${
                        product.status === 'delivered' ? 'text-green-600' : 
                        product.status === 'processing' ? 'text-blue-600' :
                        product.status === 'shipped' ? 'text-purple-600' :
                        'text-yellow-600'
                      }`}>
                        Status: {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>
                  )}
                  
                  {/* Product price paid */}
                  <div className="text-sm text-gray-600 mb-4">
                    <span>
                      {parseFloat(product.purchase_price) === 0 
                        ? 'Acquired for free' 
                        : `Purchased for $${parseFloat(product.purchase_price).toFixed(2)}`}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  {getActionButton(product)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyItemsPage;