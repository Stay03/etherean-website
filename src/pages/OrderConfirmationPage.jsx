import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/api/orderService';
import Breadcrumb from '../components/Breadcrumb';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrder(orderId);
      if (response.success) {
        setOrder(response.order);
      } else {
        throw new Error(response.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/my-items');
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'My Items', path: '/my-items' },
    { label: 'Order Confirmation', path: '#' }
  ];

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded-xl w-2/3 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600">Your order has been confirmed and is being processed</p>
        </motion.div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-8 border-b">
            <div>
              <h2 className="text-2xl font-bold mb-1">Order #{order.order_number}</h2>
              <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-6 mb-8">
            <h3 className="font-semibold text-lg">Order Items</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-0">
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900">{item.product.title}</h4>
                  <p className="text-sm text-gray-500">
                    {item.product.type === 'physical' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                        Physical
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        Digital
                      </span>
                    )}
                    Qty: {item.quantity}
                  </p>
                  <p className="text-sm mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${parseFloat(item.total).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${(parseFloat(order.total) - parseFloat(order.shipping_cost || 0)).toFixed(2)}</span>
            </div>
            {order.shipping_cost && order.shipping_cost > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Shipping ({order.shipping_method})</span>
                <span className="font-medium">${parseFloat(order.shipping_cost).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
              <span>Total</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
              <p>{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && (
                <p>{order.shipping_address.address_line_2}</p>
              )}
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
              <p>{order.shipping_address.country}</p>
              {order.shipping_address.phone && (
                <p className="mt-2">Phone: {order.shipping_address.phone}</p>
              )}
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="font-semibold text-lg mb-4">Billing Address</h3>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.billing_address.name}</p>
              <p>{order.billing_address.address_line_1}</p>
              {order.billing_address.address_line_2 && (
                <p>{order.billing_address.address_line_2}</p>
              )}
              <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}</p>
              <p>{order.billing_address.country}</p>
              {order.billing_address.phone && (
                <p className="mt-2">Phone: {order.billing_address.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">{order.payment_method}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Payment Status</p>
              <p className={`font-medium ${
                order.payment_status === 'paid' ? 'text-green-600' :
                order.payment_status === 'pending' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/my-items')}
            className="px-8 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Go to My Items
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;