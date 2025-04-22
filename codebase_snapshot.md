# Codebase Documentation

{
  "Extraction Date": "2025-04-22 03:25:06",
  "Include Paths": [
    "src/pages/CheckoutPage.jsx",
    "src/components/checkout/AddressSelector.jsx",
    "src/components/checkout/AddressForm.jsx",
    "src/components/checkout/OrderSummary.jsx",
    "src/components/checkout/ShippingMethod.jsx"
  ]
}

### src/pages/CheckoutPage.jsx
```
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCheckoutContext } from '../contexts/CheckoutContext';
import useCart from '../hooks/useCart';
import Breadcrumb from '../components/Breadcrumb';
import AddressSelector from '../components/checkout/AddressSelector';
import OrderSummary from '../components/checkout/OrderSummary';
import ShippingMethod from '../components/checkout/ShippingMethod';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();
  
  // Use checkout context
  const {
    step,
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
    isCreatingOrder,
    submitOrder,
    nextStep,
    previousStep,
    resetCheckoutState
  } = useCheckoutContext();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/cart');
    }
  }, [isAuthenticated, navigate]);
  
  // Reset checkout state when component unmounts
  useEffect(() => {
    return () => {
      resetCheckoutState();
    };
  }, [resetCheckoutState]);
  
  // Setup breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout', path: '/checkout' }
  ];
  
  // Handle step navigation
  const handleNextStep = () => {
    const canProceed = nextStep();
    if (!canProceed) {
      if (!selectedShippingAddress) {
        toast.error('Please select a shipping address');
      } else if (!sameAsShipping && !selectedBillingAddress) {
        toast.error('Please select a billing address');
      }
    }
  };
  
  // Handle order submission
  const handleSubmitOrder = async () => {
    try {
      const order = await submitOrder();
      if (order) {
        // Navigate to payment page with order ID
        navigate(`/payment/${order.id}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
    }
  };
  
  // Render loading state
  if (cartLoading) {
    return (
      <div className="w-full">
        <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render empty cart state
  if (!cart?.items?.length) {
    return (
      <div className="w-full">
        <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to your cart before checking out.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-yellow-600' : 'text-gray-400'}`}>
              <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">
                1
              </span>
              <span className="ml-2 font-medium">Address</span>
            </div>
            
            {hasPhysicalItems && (
              <div className={`flex items-center ${step >= 2 ? 'text-yellow-600' : 'text-gray-400'}`}>
                <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">
                  2
                </span>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
            )}
            
            <div className={`flex items-center ${step >= 3 ? 'text-yellow-600' : 'text-gray-400'}`}>
              <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">
                {hasPhysicalItems ? '3' : '2'}
              </span>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <AddressSelector
                  type="shipping"
                  selectedAddress={selectedShippingAddress}
                  onSelectAddress={setSelectedShippingAddress}
                />
                
                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Billing address same as shipping
                    </span>
                  </label>
                </div>
                
                {!sameAsShipping && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                    <AddressSelector
                      type="billing"
                      selectedAddress={selectedBillingAddress}
                      onSelectAddress={setSelectedBillingAddress}
                    />
                  </div>
                )}
              </div>
            )}
            
            {step === 2 && hasPhysicalItems && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                <ShippingMethod
                  selectedMethod={shippingMethod}
                  onSelectMethod={setShippingMethod}
                />
              </div>
            )}
            
            {((step === 3 && hasPhysicalItems) || (step === 2 && !hasPhysicalItems)) && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                
                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-4">Order Items</h3>
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center py-4 border-b last:border-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-grow">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">
                          {item.is_digital ? 'Digital' : 'Physical'} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${parseFloat(item.subtotal).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Addresses Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-4">Delivery Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {selectedShippingAddress?.name}<br />
                        {selectedShippingAddress?.address_line_1}<br />
                        {selectedShippingAddress?.address_line_2 && 
                          <>{selectedShippingAddress.address_line_2}<br /></>
                        }
                        {selectedShippingAddress?.city}, {selectedShippingAddress?.state} {selectedShippingAddress?.postal_code}<br />
                        {selectedShippingAddress?.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h4>
                      {sameAsShipping ? (
                        <p className="text-sm text-gray-600">Same as shipping address</p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {selectedBillingAddress?.name}<br />
                          {selectedBillingAddress?.address_line_1}<br />
                          {selectedBillingAddress?.address_line_2 && 
                            <>{selectedBillingAddress.address_line_2}<br /></>
                          }
                          {selectedBillingAddress?.city}, {selectedBillingAddress?.state} {selectedBillingAddress?.postal_code}<br />
                          {selectedBillingAddress?.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Notes */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-medium mb-4">Order Notes (Optional)</h3>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add any special instructions for your order..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows="3"
                  />
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={previousStep}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => navigate('/cart')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Return to Cart
                </button>
              )}
              
              {((step === 3 && hasPhysicalItems) || (step === 2 && !hasPhysicalItems)) ? (
                <button
                  onClick={handleSubmitOrder}
                  disabled={isCreatingOrder}
                  className={`px-6 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold 
                    ${isCreatingOrder ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
                >
                  {isCreatingOrder ? 'Processing...' : 'Continue to Payment'}
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold hover:bg-yellow-600"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
```

### src/components/checkout/AddressSelector.jsx
```
import React, { useState, useEffect } from 'react';
import AddressForm from './AddressForm';
import { useCheckoutContext } from '../../contexts/CheckoutContext';

const AddressSelector = ({ type, selectedAddress, onSelectAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    addresses,
    addressesLoading,
    fetchAddresses,
    createAddress,
    setDefaultAddress
  } = useCheckoutContext();
  
  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  
  const handleAddressAdded = async (newAddress) => {
    await createAddress(newAddress);
    setShowAddForm(false);
  };
  
  if (addressesLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((item) => (
          <div key={item} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      {addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No addresses found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600"
          >
            Add New Address
          </button>
        </div>
      ) : (
        <>
          {!showAddForm ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors
                    ${selectedAddress?.id === address.id 
                      ? 'border-yellow-500 bg-yellow-50' 
                      : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  onClick={() => onSelectAddress(address)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {address.name}
                        {address.is_default && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.address_line_1}
                        {address.address_line_2 && <>, {address.address_line_2}</>}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-sm text-gray-600">{address.country}</p>
                      <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <input
                        type="radio"
                        checked={selectedAddress?.id === address.id}
                        onChange={() => {}}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                      />
                      {!address.is_default && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDefaultAddress(address.id);
                          }}
                          className="mt-2 text-xs text-yellow-600 hover:text-yellow-700"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-yellow-500 hover:text-yellow-600 transition-colors"
              >
                + Add New Address
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add New Address</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
              <AddressForm
                onSubmit={handleAddressAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressSelector;
```

### src/components/checkout/AddressForm.jsx
```
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddressForm = ({ address = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: address?.name || '',
    address_line_1: address?.address_line_1 || '',
    address_line_2: address?.address_line_2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postal_code: address?.postal_code || '',
    country: address?.country || '',
    phone: address?.phone || '',
    is_default: address?.is_default || false
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.address_line_1 || !formData.city || 
        !formData.state || !formData.postal_code || !formData.country || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address Line 1 *
        </label>
        <input
          type="text"
          name="address_line_1"
          value={formData.address_line_1}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address Line 2
        </label>
        <input
          type="text"
          name="address_line_2"
          value={formData.address_line_2}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State/Province *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Code *
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country *
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Set as default address
        </label>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
        >
          {loading ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
```

### src/components/checkout/OrderSummary.jsx
```
import React from 'react';

const OrderSummary = ({ cart }) => {
  // Calculate if cart has physical items
  const hasPhysicalItems = cart.items.some(item => !item.is_digital);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="ml-4 flex-grow">
              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {item.is_digital ? 'Digital' : 'Physical'} • Qty: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              ${parseFloat(item.subtotal).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            ${parseFloat(cart.total).toFixed(2)}
          </span>
        </div>
        
        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {hasPhysicalItems ? 'Calculated at shipping step' : 'Free (Digital items)'}
          </span>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-gray-900">Calculated at payment</span>
        </div>
        
        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">
            ${parseFloat(cart.total).toFixed(2)} +
          </span>
        </div>
      </div>
      
      {/* Secure Checkout Notice */}
      <div className="mt-6 text-center">
        <div className="flex justify-center items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Checkout
        </div>
      </div>
      
      {/* Accepted Payment Methods */}
      <div className="mt-6">
        <p className="text-xs text-gray-500 text-center mb-3">Accepted Payment Methods</p>
        <div className="flex justify-center space-x-4">
          <img src="/images/cards/visa.svg" alt="Visa" className="h-6" />
          <img src="/images/cards/mastercard.svg" alt="Mastercard" className="h-6" />
          <img src="/images/cards/paypal.svg" alt="PayPal" className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
```

### src/components/checkout/ShippingMethod.jsx
```
import React from 'react';

const ShippingMethod = ({ selectedMethod, onSelectMethod }) => {
  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      price: 9.99,
      estimatedDelivery: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      price: 19.99,
      estimatedDelivery: '2-3 business days'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      price: 29.99,
      estimatedDelivery: 'Next business day'
    }
  ];
  
  return (
    <div className="space-y-4">
      {shippingMethods.map((method) => (
        <div
          key={method.id}
          className={`border rounded-lg p-4 cursor-pointer transition-colors
            ${selectedMethod === method.id 
              ? 'border-yellow-500 bg-yellow-50' 
              : 'border-gray-200 hover:border-yellow-300'
            }`}
          onClick={() => onSelectMethod(method.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <input
                type="radio"
                checked={selectedMethod === method.id}
                onChange={() => onSelectMethod(method.id)}
                className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500"
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-500">{method.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Estimated delivery: {method.estimatedDelivery}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium text-gray-900">
                ${method.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {/* Shipping Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Shipping Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Shipping times are estimated and may vary based on location</li>
                <li>Orders are processed within 1-2 business days</li>
                <li>You will receive tracking information once your order ships</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
```

