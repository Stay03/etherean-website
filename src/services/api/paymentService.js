import apiClient from './client';

/**
 * Initialize a payment transaction
 * 
 * @param {number|string} productId - The ID of the product to purchase
 * @returns {Promise} - Promise resolving to payment initialization data
 */
const initializePayment = async (productId) => {
  try {
    const endpoint = `/paystack/initialize`;
    const response = await apiClient.post(endpoint, { product_id: productId });
    return response;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

/**
 * Initialize payment for an order
 * Note: Using the same endpoint as product payment with order_id instead
 * You should verify with your backend team if this is the correct approach
 * 
 * @param {number|string} orderId - The ID of the order to pay for
 * @returns {Promise} - Promise resolving to payment initialization data
 */
const initializeOrderPayment = async (orderId) => {
  try {
    // TODO: Verify the correct endpoint and payload with backend team
    const endpoint = `/paystack/initialize-order`;
    const response = await apiClient.post(endpoint, { order_id: orderId });
    return response;
  } catch (error) {
    console.error('Error initializing order payment:', error);
    throw error;
  }
};

/**
 * Verify a payment transaction
 * 
 * @param {string} reference - The transaction reference
 * @returns {Promise} - Promise resolving to payment verification data
 */
const verifyPayment = async (reference) => {
  try {
    const endpoint = `/paystack/verify?reference=${reference}`;
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

const paymentService = {
  initializePayment,
  initializeOrderPayment,
  verifyPayment
};

export default paymentService;