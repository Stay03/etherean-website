/**
 * Product Service
 * Centralizes all product-related API calls
 */

import apiClient from './client';
import endpoints from './endpoints';

/**
 * Get a list of products with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.platform - Filter by platform (EL, CH, EL,CH)
 * @param {string} params.type - Filter by product type (physical, digital)
 * @param {boolean} params.is_online - Filter by online status
 * @param {string} params.visibility - Visibility status
 * @param {string} params.sort - Sort order (newest, price_asc, price_desc)
 * @param {number} params.min_price - Minimum price filter
 * @param {number} params.max_price - Maximum price filter
 * @param {string} params.search - Search term
 * @param {number} params.per_page - Number of results per page
 * @param {number} params.page - Page number
 * @returns {Promise} - Promise resolving to product data
 */
const getProducts = (params = {}) => {
  return apiClient.get(endpoints.products.list, params);
};

/**
 * Get a specific product by ID
 * 
 * @param {number} id - Product ID
 * @returns {Promise} - Promise resolving to product data
 */
const getProductById = (id) => {
  return apiClient.get(endpoints.products.get(id));
};

/**
 * Get a specific product by slug
 * 
 * @param {string} slug - Product slug
 * @returns {Promise} - Promise resolving to product data
 */
const getProductBySlug = (slug) => {
  return apiClient.get(endpoints.products.getBySlug(slug));
};

const productService = {
  getProducts,
  getProductById,
  getProductBySlug
};

export default productService;