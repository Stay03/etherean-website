import apiClient from './client';
import endpoints from './endpoints';

/**
 * Cart service for handling cart-related API operations
 */
const cartService = {
  /**
   * Get the current user's cart
   * @returns {Promise} Cart data
   */
  getCart: async () => {
    try {
      const response = await apiClient.get(endpoints.cart.get);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add a product to the cart
   * @param {number} productId - ID of the product to add
   * @param {number} quantity - Quantity to add
   * @returns {Promise} Updated cart data
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await apiClient.post(endpoints.cart.add, {
        product_id: productId,
        quantity
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update quantity of a cart item
   * @param {number} itemId - ID of the cart item
   * @param {number} quantity - New quantity
   * @returns {Promise} Updated cart data
   */
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await apiClient.put(endpoints.cart.update(itemId), {
        quantity
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove an item from the cart
   * @param {number} itemId - ID of the cart item to remove
   * @returns {Promise} Updated cart data
   */
  removeFromCart: async (itemId) => {
    try {
      const response = await apiClient.delete(endpoints.cart.remove(itemId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Clear all items from the cart
   * @returns {Promise} Empty cart data
   */
  clearCart: async () => {
    try {
      const response = await apiClient.delete(endpoints.cart.clear);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default cartService;