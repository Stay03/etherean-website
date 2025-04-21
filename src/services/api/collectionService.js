/**
 * Collection Service
 * Centralizes all collection-related API calls
 */

import apiClient from './client';
import endpoints from './endpoints';

/**
 * Get a list of collections with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {number} params.per_page - Number of results per page
 * @param {number} params.page - Page number
 * @returns {Promise} - Promise resolving to collection data
 */
const getCollections = (params = {}) => {
  return apiClient.get(endpoints.collections.list, params);
};

/**
 * Get a specific collection by ID
 * 
 * @param {number} id - Collection ID
 * @returns {Promise} - Promise resolving to collection data
 */
const getCollectionById = (id) => {
  return apiClient.get(endpoints.collections.get(id));
};

/**
 * Acquire a collection for the authenticated user
 * 
 * @param {number} id - Collection ID to acquire
 * @returns {Promise} - Promise resolving to acquisition result
 */
const acquireCollection = (id) => {
  return apiClient.post(endpoints.collections.acquire(id));
};

const collectionService = {
  getCollections,
  getCollectionById,
  acquireCollection,
};

export default collectionService;