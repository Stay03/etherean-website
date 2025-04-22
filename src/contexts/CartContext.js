import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import cartService from '../services/api/cartService';
import { useAuth } from './AuthContext';

// Create cart context
const CartContext = createContext({
  cart: null,
  isLoading: false,
  error: null,
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getTotal: () => 0,
  refetch: () => {}
});

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await cartService.getCart();
      
      if (response.success && response.cart) {
        setCart(response.cart);
      } else {
        setCart(null);
      }
    } catch (err) {
      setCart(null);
      setError(err);
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await cartService.addToCart(productId, quantity);
      
      if (response.success && response.cart) {
        setCart(response.cart);
        return { success: true, cart: response.cart };
      } else {
        throw new Error(response.message || 'Failed to add item to cart');
      }
    } catch (err) {
      setError(err);
      console.error('Error adding to cart:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      setError(null);
      const response = await cartService.updateCartItem(itemId, quantity);
      
      if (response.success && response.cart) {
        setCart(response.cart);
        return { success: true, cart: response.cart };
      } else {
        throw new Error(response.message || 'Failed to update quantity');
      }
    } catch (err) {
      setError(err);
      console.error('Error updating quantity:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      setError(null);
      const response = await cartService.removeFromCart(itemId);
      
      if (response.success && response.cart) {
        setCart(response.cart);
        return { success: true, cart: response.cart };
      } else {
        throw new Error(response.message || 'Failed to remove item');
      }
    } catch (err) {
      setError(err);
      console.error('Error removing item:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const response = await cartService.clearCart();
      
      if (response.success && response.cart) {
        setCart(response.cart);
        return { success: true, cart: response.cart };
      } else {
        throw new Error(response.message || 'Failed to clear cart');
      }
    } catch (err) {
      setError(err);
      console.error('Error clearing cart:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Get item count
  const getItemCount = useCallback(() => {
    if (!cart || !cart.items) return 0;
    return cart.items_count || cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Get cart total
  const getTotal = useCallback(() => {
    if (!cart || !cart.items) return 0;
    return cart.total || cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cart]);

  // Fetch cart when authentication status changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Context value
  const value = {
    cart,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    getTotal,
    refetch: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;