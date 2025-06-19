import React, { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import paymentService from '../../services/api/paymentService';
import { toast } from 'react-toastify';

const PaystackPaymentButton = ({ order, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Initialize payment for the order
      const response = await paymentService.initializeOrderPayment(order.id);
      
      console.log('Order payment initialization response:', response);
      
      if (response && response.status === 'success' && response.data) {
        const { access_code, reference } = response.data;
        
        // Initialize Paystack popup
        const popup = new PaystackPop();
        popup.resumeTransaction(access_code, {
          onLoad: (response) => {
            console.log('Paystack transaction loaded:', response);
          },
          onSuccess: (transaction) => {
            console.log('Payment successful:', transaction);
            toast.success('Payment completed successfully!');
            
            // Verify payment
            paymentService.verifyPayment(transaction.reference || reference)
              .then(verificationResponse => {
                console.log('Payment verification:', verificationResponse);
                if (onSuccess) {
                  onSuccess(transaction);
                }
              })
              .catch(error => {
                console.error('Payment verification failed:', error);
                toast.error('Payment verification failed. Please contact support.');
                if (onError) {
                  onError(error);
                }
              });
          },
          onCancel: () => {
            console.log('Payment cancelled by user');
            toast.info('Payment was cancelled.');
            setIsProcessing(false);
          },
          onError: (error) => {
            console.error('Paystack error:', error);
            toast.error(error.message || 'Payment processing failed. Please try again.');
            if (onError) {
              onError(error);
            }
            setIsProcessing(false);
          },
          onElementsMount: (elements) => {
            if (elements) {
              console.log('Paystack elements mounted:', elements);
            }
          }
        });
        
        toast.info('Payment initialized. Complete the payment in the popup window.');
      } else {
        throw new Error('Payment initialization failed - invalid response format');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error.message || 'Payment initialization failed. Please try again.');
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 
        ${isProcessing 
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
          : 'bg-yellow-500 text-gray-900 hover:bg-yellow-600 hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
    >
      {isProcessing ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Pay ${parseFloat(order.total).toFixed(2)} with Paystack
        </span>
      )}
    </button>
  );
};

export default PaystackPaymentButton;