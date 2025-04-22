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