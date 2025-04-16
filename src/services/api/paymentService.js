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
 * Verify a payment transaction
 * 
 * @param {string} reference - The transaction reference
 * @returns {Promise} - Promise resolving to payment verification data
 */
const verifyPayment = async (reference) => {
  try {
    const endpoint = `/paystack/verify/?reference=${reference}`;
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

const paymentService = {
  initializePayment,
  verifyPayment
};

export default paymentService;