import apiClient from './client';

/**
 * Acquire a free product for the authenticated user
 * 
 * @param {number|string} productId - The ID of the free product to acquire
 * @returns {Promise} - Promise resolving to acquisition details
 */
const acquireFreeProduct = async (productId) => {
  try {
    const endpoint = `/free-products/${productId}/acquire`;
    const response = await apiClient.post(endpoint);
    return response;
  } catch (error) {
    console.error('Error acquiring free product:', error);
    throw error;
  }
};

/**
 * Get user's acquired products/courses
 * 
 * @param {Object} params - Optional query parameters
 * @returns {Promise} - Promise resolving to list of user's products
 */
const getUserProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/user/products', params);
    return response;
  } catch (error) {
    console.error('Error getting user products:', error);
    throw error;
  }
};

const freeProductService = {
  acquireFreeProduct,
  getUserProducts
};

export default freeProductService;