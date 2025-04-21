import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/client';
import endpoints from '../services/api/endpoints';

/**
 * Custom hook to fetch and manage products data
 * 
 * @param {Object} filters - Object containing filter parameters
 * @returns {Object} - Object containing products data, loading state, error state, and refetch function
 */
const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoints.products.list, filters);
      
      // Check if response has the expected structure
      if (response && response.products) {
        setProducts(response.products.data || []);
        
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
        } = response.products;
        
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
        setProducts([]);
        setPagination(null);
        setError({ message: 'Unexpected API response format' });
      }
    } catch (err) {
      setProducts([]);
      setPagination(null);
      setError(err);
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: fetchProducts
  };
};

export default useProducts;