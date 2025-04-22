import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import useAddresses from '../hooks/useAddresses';
import useCheckout from '../hooks/useCheckout';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

/**
 * CheckoutContext provides checkout-related state and methods
 */
const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  
  // Use custom hooks
  const {
    addresses = [],
    isLoading: addressesLoading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useAddresses();
  
  const {
    isCreatingOrder,
    orderError,
    currentOrder,
    createOrder,
    getOrderDetails,
    resetCheckout
  } = useCheckout();
  
  // Checkout state
  const [step, setStep] = useState(1);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Derived state
  const hasPhysicalItems = cart?.items?.some(item => !item.is_digital) || false;
  
  // Load addresses when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);
  
  // Auto-select default address
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedShippingAddress) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedShippingAddress(defaultAddress);
        if (sameAsShipping) {
          setSelectedBillingAddress(defaultAddress);
        }
      }
    }
  }, [addresses, selectedShippingAddress, sameAsShipping]);
  
  /**
   * Update billing address when same as shipping changes
   */
  useEffect(() => {
    if (sameAsShipping && selectedShippingAddress) {
      setSelectedBillingAddress(selectedShippingAddress);
    }
  }, [sameAsShipping, selectedShippingAddress]);
  
  /**
   * Move to next step in checkout
   */
  const nextStep = useCallback(() => {
    if (step === 1 && !selectedShippingAddress) {
      return false;
    }
    if (step === 1 && !sameAsShipping && !selectedBillingAddress) {
      return false;
    }
    setStep(prev => prev + 1);
    return true;
  }, [step, selectedShippingAddress, sameAsShipping, selectedBillingAddress]);
  
  /**
   * Move to previous step in checkout
   */
  const previousStep = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  }, [step]);
  
  /**
   * Submit order
   */
  const submitOrder = useCallback(async () => {
    const orderData = {
      shipping_address_id: selectedShippingAddress?.id,
      billing_address_id: sameAsShipping ? selectedShippingAddress?.id : selectedBillingAddress?.id,
      shipping_method: hasPhysicalItems ? shippingMethod : null,
      payment_method: 'pending', // Will be set on payment page
      notes: orderNotes
    };
    
    try {
      const order = await createOrder(orderData);
      return order;
    } catch (error) {
      throw error;
    }
  }, [
    selectedShippingAddress,
    selectedBillingAddress,
    sameAsShipping,
    shippingMethod,
    hasPhysicalItems,
    orderNotes,
    createOrder
  ]);
  
  /**
   * Reset checkout state
   */
  const resetCheckoutState = useCallback(() => {
    setStep(1);
    setSelectedShippingAddress(null);
    setSelectedBillingAddress(null);
    setSameAsShipping(true);
    setShippingMethod('standard');
    setOrderNotes('');
    resetCheckout();
  }, [resetCheckout]);
  
  const value = {
    // Address management
    addresses,
    addressesLoading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    
    // Checkout state
    step,
    setStep,
    selectedShippingAddress,
    setSelectedShippingAddress,
    selectedBillingAddress,
    setSelectedBillingAddress,
    sameAsShipping,
    setSameAsShipping,
    shippingMethod,
    setShippingMethod,
    orderNotes,
    setOrderNotes,
    hasPhysicalItems,
    
    // Order management
    isCreatingOrder,
    orderError,
    currentOrder,
    submitOrder,
    getOrderDetails,
    
    // Navigation
    nextStep,
    previousStep,
    resetCheckoutState
  };
  
  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

/**
 * Hook to use checkout context
 */
export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  
  if (!context) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  }
  
  return context;
};

export default CheckoutContext;