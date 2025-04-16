import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Authentication Modal Component
 * Provides login and registration tabs in a modal
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Function} props.onAuthSuccess - Function to call when authentication is successful
 * @param {string} props.redirectPath - Path to redirect to after successful authentication
 * @param {string} props.initialTab - Initial tab to show ('login' or 'register')
 */
const AuthModal = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess,
  redirectPath = '/',
  initialTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    platform: 'EL' // Default platform set to 'EL'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { login, register } = useAuth();
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'register') {
      // Validate name
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      // Validate password confirmation
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError('');
    
    try {
      let result;
      
      if (activeTab === 'login') {
        // Login
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        result = await register(formData);
      }
      
      if (result.success) {
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          platform: 'EL'
        });
        
        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(result.user);
        }
        
        // Close modal
        onClose();
      } else {
        setApiError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setApiError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Switch tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setApiError('');
    setErrors({});
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Authentication Required"
      size="md"
    >
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'login'
              ? 'text-yellow-600 border-b-2 border-yellow-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => switchTab('login')}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'register'
              ? 'text-yellow-600 border-b-2 border-yellow-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => switchTab('register')}
        >
          Register
        </button>
      </div>
      
      {/* API Error */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {apiError}
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Name field - Only for register */}
        {activeTab === 'register' && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        )}
        
        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Password field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={activeTab === 'register' ? 'Create a password' : 'Enter your password'}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        {/* Password Confirmation - Only for register */}
        {activeTab === 'register' && (
          <div className="mb-4">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
            )}
          </div>
        )}
        
        {/* Platform selection has been removed */}
        
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {activeTab === 'login' ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              activeTab === 'login' ? 'Log In' : 'Create Account'
            )}
          </button>
        </div>
        
        {/* Form Footer */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {activeTab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('register')}
                className="text-yellow-600 hover:text-yellow-700 font-medium focus:outline-none"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="text-yellow-600 hover:text-yellow-700 font-medium focus:outline-none"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;