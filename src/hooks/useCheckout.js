import { useState, useCallback } from 'react';
import orderService from '../services/api/orderService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing the checkout process
 */
const useCheckout = () => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  /**
   * Create a new order with the provided checkout data
   */
  const createOrder = useCallback(async (orderData) => {
    try {
      setIsCreatingOrder(true);
      setOrderError(null);
      
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        setCurrentOrder(response.order);
        toast.success('Order created successfully');
        return response.order;
      }
    } catch (err) {
      setOrderError(err);
      toast.error(err.message || 'Failed to create order');
      throw err;
    } finally {
      setIsCreatingOrder(false);
    }
  }, []);

  /**
   * Get order details by ID
   */
  const getOrderDetails = useCallback(async (orderId) => {
    try {
      const response = await orderService.getOrder(orderId);
      if (response.success) {
        setCurrentOrder(response.order);
        return response.order;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch order details');
      throw err;
    }
  }, []);

  /**
   * Reset the checkout state
   */
  const resetCheckout = useCallback(() => {
    setCurrentOrder(null);
    setOrderError(null);
  }, []);

  return {
    isCreatingOrder,
    orderError,
    currentOrder,
    createOrder,
    getOrderDetails,
    resetCheckout
  };
};

export default useCheckout;