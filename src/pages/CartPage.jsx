import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';
import useCart from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

/**
 * CartPage Component
 * Displays the shopping cart with items, quantities, and total price
 */
const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Fetch cart data using custom hook
  const { 
    cart, 
    isLoading, 
    error, 
    updateQuantity, 
    removeItem, 
    clearCart,
    refetch 
  } = useCart();
  
  // Update page title and fetch cart data
  React.useEffect(() => {
    document.title = 'Shopping Cart | Etherean Shop';
    
    // Fetch cart when page loads
    if (isAuthenticated) {
      refetch();
    }
    
    return () => {
      document.title = 'Etherean Shop';
    };
  }, [isAuthenticated, refetch]);
  
  // Setup breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shopping Cart', path: '/cart' }
  ];
  
  // Handle quantity update
  const handleQuantityUpdate = async (itemId, newQuantity) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };
  
  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };
  
  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/checkout');
    }
  };
  
  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/checkout');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <Breadcrumb 
          items={breadcrumbItems} 
          onNavigate={(path) => navigate(path)} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Skeleton */}
            <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                {/* Skeleton Items */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4 p-4 md:p-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-grow">
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cart Summary Skeleton */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="mt-3 h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full">
        <Breadcrumb 
          items={breadcrumbItems} 
          onNavigate={(path) => navigate(path)} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Unable to load cart</h2>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="w-full">
        <Breadcrumb 
          items={breadcrumbItems} 
          onNavigate={(path) => navigate(path)} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyCart />
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={breadcrumbItems} 
        onNavigate={(path) => navigate(path)} 
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>
            
            {/* Cart Items List */}
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleQuantityUpdate}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>
          
          {/* Cart Summary Section */}
          <div className="lg:w-1/3">
            <CartSummary
              cart={cart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        redirectPath="/checkout"
        initialTab="login"
      />
    </div>
  );
};

export default CartPage;