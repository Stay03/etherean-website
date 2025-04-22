import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import cartService from '../services/api/cartService';
import { useAuth } from './AuthContext';

/**
 * CartContext provides cart-related state and methods throughout the app
 */
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch cart data
   */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.cart);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Add item to cart
   */
  const addToCart = async (productId, quantity = 1) => {
    try {
      setIsLoading(true);
      const response = await cartService.addToCart(productId, quantity);
      if (response.success) {
        setCart(response.cart);
        return true;
      }
      return false;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update item quantity
   */
  const updateQuantity = async (itemId, quantity) => {
    try {
      setIsLoading(true);
      const response = await cartService.updateCartItem(itemId, quantity);
      if (response.success) {
        setCart(response.cart);
        return true;
      }
      return false;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeItem = async (itemId) => {
    try {
      setIsLoading(true);
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        setCart(response.cart);
        return true;
      }
      return false;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear cart
   */
  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(response.cart);
        return true;
      }
      return false;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, fetchCart]);

  const value = {
    cart,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to use cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default CartContext;