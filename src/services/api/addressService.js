import apiClient from './client';
import endpoints from './endpoints';

/**
 * Address service for handling address-related API operations
 */
const addressService = {
  /**
   * Get all addresses for the current user
   * @returns {Promise} List of addresses
   */
  getAddresses: async () => {
    try {
      const response = await apiClient.get(endpoints.addresses.get);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new address
   * @param {Object} addressData - Address data to create
   * @returns {Promise} Created address data
   */
  createAddress: async (addressData) => {
    try {
      const response = await apiClient.post(endpoints.addresses.create, addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing address
   * @param {number} addressId - ID of the address to update
   * @param {Object} addressData - Updated address data
   * @returns {Promise} Updated address data
   */
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await apiClient.put(endpoints.addresses.update(addressId), addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete an address
   * @param {number} addressId - ID of the address to delete
   * @returns {Promise} Success response
   */
  deleteAddress: async (addressId) => {
    try {
      const response = await apiClient.delete(endpoints.addresses.delete(addressId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Set an address as default
   * @param {number} addressId - ID of the address to set as default
   * @returns {Promise} Updated address data
   */
  setDefaultAddress: async (addressId) => {
    try {
      const response = await apiClient.post(endpoints.addresses.setDefault(addressId));
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default addressService;