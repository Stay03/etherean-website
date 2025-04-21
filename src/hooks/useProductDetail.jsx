import { useState, useEffect, useCallback } from 'react';
import productService from '../services/api/productService';

/**
 * Custom hook to fetch and manage product detail data
 * 
 * @param {string} slug - Product slug to fetch
 * @returns {Object} - Object containing product data, loading state, error state, and refetch function
 */
const useProductDetail = (slug) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch product from API
  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getProductBySlug(slug);
      
      // Check if response has the expected structure
      if (response && response.data) {
        setProduct(response.data);
      } else {
        setProduct(null);
        setError({ message: 'Unexpected API response format' });
      }
    } catch (err) {
      setProduct(null);
      setError(err);
      console.error(`Failed to fetch product with slug ${slug}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  // Fetch product when slug changes
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct
  };
};

export default useProductDetail;