import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/api/client';
import endpoints from '../services/api/endpoints';

/**
 * Custom hook to fetch and manage collections data
 * 
 * @param {Object} params - Object containing pagination parameters
 * @returns {Object} - Object containing collections data, loading state, error state, and refetch function
 */
const useCollections = (params = {}) => {
  const [collections, setCollections] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use a ref to store the current params
  const paramsRef = useRef(params);
  
  // Update the ref when params change
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // Function to fetch collections from API
  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the current params from the ref
      const response = await apiClient.get(endpoints.collections.list, paramsRef.current);
      
      // Check if response has the expected structure
      if (response && response.collections) {
        setCollections(response.collections.data || []);
        
        // Extract pagination data
        const { 
          current_page, 
          first_page_url, 
          last_page, 
          last_page_url,
          next_page_url, 
          prev_page_url, 
          total, 
          per_page 
        } = response.collections;
        
        setPagination({
          current_page,
          first_page_url,
          last_page,
          last_page_url,
          next_page_url,
          prev_page_url,
          total,
          per_page
        });
      } else {
        setCollections([]);
        setPagination(null);
        setError({ message: 'Unexpected API response format' });
      }
    } catch (err) {
      setCollections([]);
      setPagination(null);
      setError(err);
      console.error('Failed to fetch collections:', err);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies here

  // Function to acquire a collection
  const acquireCollection = async (collectionId) => {
    try {
      const response = await apiClient.post(endpoints.collections.acquire(collectionId));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Failed to acquire collection:', err);
      return { success: false, error: err.message || 'Failed to acquire collection' };
    }
  };

  // Fetch collections only once on mount
  useEffect(() => {
    fetchCollections();
  }, []); // Empty dependency array means this runs once on mount

  return {
    collections,
    pagination,
    isLoading,
    error,
    refetch: fetchCollections,
    acquireCollection
  };
};

export default useCollections;