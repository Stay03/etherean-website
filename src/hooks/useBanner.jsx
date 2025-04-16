/**
 * Custom hook for fetching and managing banner data
 */

import { useState, useEffect, useCallback } from 'react';
import bannerService from '../services/bannerService';

/**
 * Hook for fetching banners with loading and error states
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} - Banner data, loading state, error state, and refresh function
 */
const useBanners = (initialParams = {}) => {
  const [banners, setBanners] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 15,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  /**
   * Fetches banners based on current parameters
   */
  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await bannerService.getBanners(params);
      
      if (result.success) {
        setBanners(result.banners);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch banners');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Error in useBanners hook:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  /**
   * Refetch banners with new parameters
   * @param {Object} newParams - New query parameters
   */
  const refetch = useCallback((newParams = {}) => {
    setParams(prevParams => ({
      ...prevParams,
      ...newParams,
    }));
  }, []);

  /**
   * Change page and refetch data
   * @param {number} page - Page number to fetch
   */
  const changePage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      refetch({ page });
    }
  }, [pagination.totalPages, refetch]);

  // Fetch banners when component mounts or params change
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    pagination,
    isLoading,
    error,
    refetch,
    changePage,
  };
};

export default useBanners;