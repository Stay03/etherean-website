import apiClient from './client';
import endpoints from './endpoints';

/**
 * Order service for handling order-related API operations
 */
const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data including addresses, shipping method, etc.
   * @returns {Promise} Created order data
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post(endpoints.orders.create, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get order details by ID
   * @param {number} orderId - ID of the order
   * @returns {Promise} Order details
   */
  getOrder: async (orderId) => {
    try {
      const response = await apiClient.get(endpoints.orders.get(orderId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get list of orders for the current user
   * @returns {Promise} List of orders
   */
  getOrders: async () => {
    try {
      const response = await apiClient.get(endpoints.orders.list);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {number} orderId - ID of the order to cancel
   * @returns {Promise} Success response
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.post(endpoints.orders.cancel(orderId));
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService;