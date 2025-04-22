import React, { createContext, useState, useContext, useCallback } from 'react';
import useCart from '../hooks/useCart';

const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
  const { cart } = useCart();
  
  // Checkout state
  const [step, setStep] = useState(1);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Check if cart has physical items
  const hasPhysicalItems = cart?.items?.some(item => !item.is_digital) || false;
  
  // Navigate between steps
  const nextStep = useCallback(() => {
    if (step === 1) {
      if (!selectedShippingAddress) {
        return false;
      }
      if (!sameAsShipping && !selectedBillingAddress) {
        return false;
      }
    }
    setStep(prev => Math.min(hasPhysicalItems ? 3 : 2, prev + 1));
    return true;
  }, [step, selectedShippingAddress, selectedBillingAddress, sameAsShipping, hasPhysicalItems]);
  
  const previousStep = useCallback(() => {
    setStep(prev => Math.max(1, prev - 1));
  }, []);
  
  // Reset checkout state
  const resetCheckoutState = useCallback(() => {
    setStep(1);
    setSelectedShippingAddress(null);
    setSelectedBillingAddress(null);
    setSameAsShipping(true);
    setShippingMethod('standard');
    setOrderNotes('');
  }, []);
  
  return (
    <CheckoutContext.Provider
      value={{
        // State
        step,
        selectedShippingAddress,
        selectedBillingAddress,
        sameAsShipping,
        shippingMethod,
        orderNotes,
        hasPhysicalItems,
        
        // Actions
        setSelectedShippingAddress,
        setSelectedBillingAddress,
        setSameAsShipping,
        setShippingMethod,
        setOrderNotes,
        nextStep,
        previousStep,
        resetCheckoutState
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook for using checkout context
export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  }
  return context;
};

export default CheckoutContext;