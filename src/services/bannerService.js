/**
 * Banner Service
 * Handles all banner-related API calls
 */

import apiClient from './api/client';
import endpoints from './api/endpoints';

/**
 * Default parameters for banner requests
 */
const DEFAULT_PARAMS = {
  platform: 'EL',
  status: 'active',
  orderBy: 'display_order',
  orderDir: 'asc',
};

/**
 * Fetch banners with optional filtering and pagination
 * @param {Object} params - Optional parameters for the request
 * @returns {Promise} - Promise that resolves with banner data
 */
const getBanners = async (params = {}) => {
  try {
    // Merge default params with provided params
    const queryParams = {
      ...DEFAULT_PARAMS,
      ...params,
      current: params.current !== undefined ? params.current : true,
    };
    
    const response = await apiClient.get(endpoints.banners.list, queryParams);
    
    // Return normalized data for easier consumption by components
    if (response.status === 'success' && response.data) {
      return {
        banners: response.data.data || [],
        pagination: {
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
          perPage: response.data.per_page,
        },
        success: true,
      };
    }
    
    throw new Error('Invalid response format from banner API');
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return {
      banners: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 15,
      },
      success: false,
      error: error.message || 'Failed to fetch banners',
    };
  }
};

/**
 * Fetch a single banner by ID
 * @param {number|string} id - Banner ID
 * @returns {Promise} - Promise that resolves with banner data
 */
const getBannerById = async (id) => {
  try {
    const response = await apiClient.get(endpoints.banners.get(id));
    
    if (response.status === 'success' && response.data) {
      return {
        banner: response.data,
        success: true,
      };
    }
    
    throw new Error('Invalid response format from banner API');
  } catch (error) {
    console.error(`Failed to fetch banner with ID ${id}:`, error);
    return {
      banner: null,
      success: false,
      error: error.message || `Failed to fetch banner with ID ${id}`,
    };
  }
};

const bannerService = {
  getBanners,
  getBannerById,
};

export default bannerService;