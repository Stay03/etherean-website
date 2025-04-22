import { useState, useCallback } from 'react';
import addressService from '../services/api/addressService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing user addresses
 */
const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all addresses
   */
  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await addressService.getAddresses();
      if (response.success && response.addresses) {
        setAddresses(response.addresses);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      setError(err);
      setAddresses([]);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new address
   */
  const createAddress = async (addressData) => {
    try {
      setIsLoading(true);
      const response = await addressService.createAddress(addressData);
      if (response.success) {
        setAddresses(prev => [...prev, response.address]);
        toast.success('Address added successfully');
        return response.address;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing address
   */
  const updateAddress = async (addressId, addressData) => {
    try {
      setIsLoading(true);
      const response = await addressService.updateAddress(addressId, addressData);
      if (response.success) {
        setAddresses(prev => 
          prev.map(addr => addr.id === addressId ? response.address : addr)
        );
        toast.success('Address updated successfully');
        return response.address;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an address
   */
  const deleteAddress = async (addressId) => {
    try {
      setIsLoading(true);
      const response = await addressService.deleteAddress(addressId);
      if (response.success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast.success('Address deleted successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set an address as default
   */
  const setDefaultAddress = async (addressId) => {
    try {
      setIsLoading(true);
      const response = await addressService.setDefaultAddress(addressId);
      if (response.success) {
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            is_default: addr.id === addressId
          }))
        );
        toast.success('Default address updated');
        return response.address;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to set default address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  };
};

export default useAddresses;