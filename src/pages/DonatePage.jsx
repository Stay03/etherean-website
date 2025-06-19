import React, { useState } from 'react';
import { Check, Heart, ArrowRight } from 'lucide-react';

/**
 * DonatePage Component
 * A modern, interactive donation page that collects donor information
 * and provides payment options
 */
const DonatePage = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: 50,
    customAmount: '',
    message: '',
    project: ''
  });

  // UI states
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCustomAmount, setShowCustomAmount] = useState(false);

  // Predefined donation amounts
  const donationAmounts = [50, 100, 250, 500];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle donation amount selection
  const handleAmountSelect = (amount) => {
    setFormData({ ...formData, amount, customAmount: '' });
    setShowCustomAmount(false);
  };

  // Toggle to custom amount mode
  const toggleCustomAmount = () => {
    setShowCustomAmount(true);
    setFormData({ ...formData, customAmount: '' });
  };

  // Handle custom amount
  const handleCustomAmount = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setFormData({ ...formData, customAmount: value });
    }
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (!formData.fullName || !formData.email) return;
    if (showCustomAmount && !formData.customAmount) return;

    setFormStep(2);
    window.scrollTo(0, 0);
  };

  // Submit donation
  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      window.scrollTo(0, 0);
    }, 1500);
  };

  // Get final donation amount
  const getDonationAmount = () => {
    return showCustomAmount ? parseFloat(formData.customAmount) : formData.amount;
  };

  // Get page title based on project
  const getPageTitle = () => {
    return formData.project ? `Donate for ${formData.project}` : 'Support Our Mission';
  };

  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your donation helps us create world peace in our lifetime by supporting programs that foster inner peace and consciousness.
          </p>
        </div>

        {isComplete ? (
          // Thank you screen
          <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You for Your Donation!</h2>
            <p className="text-gray-600 mb-6">
              Your contribution of ${getDonationAmount()}
              {formData.project && ` to ${formData.project}`} will help us bring peace to individuals and communities worldwide.
              A confirmation has been sent to your email.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        ) : (
          // Donation form
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 md:p-8">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'}`}>
                  {formStep > 1 ? <Check size={16} /> : 1}
                </div>
                <div className="h-1 w-12 bg-gray-200 mx-2">
                  <div className={`h-full ${formStep > 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Step {formStep} of 2
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {formStep === 1 ? (
                // Step 1: Donor Information
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Information</h2>

                  {/* Project Display (if provided) */}
                  {formData.project && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Heart size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            You're donating to:
                          </p>
                          <p className="text-green-700 font-semibold">
                            {formData.project}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="mb-6">
                    <label htmlFor="fullName" className="block text-gray-700 mb-2 font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Donation Amount Section */}
                  <div className="mb-8">
                    <label className="block text-gray-700 mb-3 font-medium">
                      Donation Amount <span className="text-red-500">*</span>
                    </label>

                    {!showCustomAmount ? (
                      // Predefined amount buttons
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {donationAmounts.map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => handleAmountSelect(amount)}
                              className={`px-4 py-3 border rounded-lg transition-all ${
                                formData.amount === amount
                                  ? 'bg-green-100 border-green-500 text-green-700 font-medium'
                                  : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                              }`}
                            >
                              ${amount}
                            </button>
                          ))}
                        </div>

                        {/* Option to switch to custom amount */}
                        <button
                          type="button"
                          onClick={toggleCustomAmount}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Enter a custom amount
                        </button>
                      </>
                    ) : (
                      // Custom amount input
                      <>
                        <div className="relative mb-4">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="text"
                            id="customAmount"
                            name="customAmount"
                            value={formData.customAmount}
                            onChange={handleCustomAmount}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="Enter donation amount"
                            autoFocus
                          />
                        </div>

                        {/* Option to switch back to predefined amounts */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomAmount(false);
                            handleAmountSelect(50); // Default back to a predefined amount
                          }}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Choose from preset amounts
                        </button>
                      </>
                    )}
                  </div>

                  {/* Optional Message */}
                  <div className="mb-8">
                    <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Share why you're donating (optional)"
                    ></textarea>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={!formData.fullName || !formData.email || (showCustomAmount && !formData.customAmount)}
                    className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="ml-2" size={18} />
                  </button>
                </>
              ) : (
                // Step 2: Payment
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Details</h2>

                  {/* Order Summary */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Donation Summary</h3>

                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Donor</span>
                      <span className="font-medium">{formData.fullName}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>

                    {formData.project && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Project</span>
                        <span className="font-medium">{formData.project}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-2 mt-2">
                      <span className="text-gray-600">Donation Amount</span>
                      <span className="text-xl font-semibold">${getDonationAmount()}</span>
                    </div>
                  </div>

                  {/* Credit Card Details - In a real implementation, this would use a payment processor */}
                  <div className="mb-8">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                      <p className="text-yellow-700 text-sm">
                        This is a demo interface. In a production environment, this would integrate with a secure payment processor like Stripe or PayPal.
                      </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart size={18} className="mr-2" />
                            Complete Donation
                          </>
                        )}
                      </button>

                      {/* Back button */}
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="text-gray-600 hover:text-gray-800 text-center py-2"
                      >
                        &larr; Back to donation details
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span className="text-gray-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
