import { useCart as useCartContext } from '../contexts/CartContext';

/**
 * Custom hook to manage cart data and operations
 * Provides cart state, loading state, error state, and cart methods
 * This is a convenience hook that re-exports the CartContext
 */
const useCart = () => {
  return useCartContext();
};

export default useCart;