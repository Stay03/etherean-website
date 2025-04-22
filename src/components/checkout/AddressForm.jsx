import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

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
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.address_line_1) newErrors.address_line_1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.postal_code) newErrors.postal_code = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    // Phone number validation
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const inputVariants = {
    focus: { scale: 1.01 },
    blur: { scale: 1 }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <motion.input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
              'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
            } transition-colors duration-200`}
            variants={inputVariants}
            whileFocus="focus"
            whileBlur="blur"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <motion.input
            type="text"
            name="address_line_1"
            value={formData.address_line_1}
            onChange={handleChange}
            placeholder="Street address, P.O. box, etc."
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.address_line_1 ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
              'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
            } transition-colors duration-200`}
            variants={inputVariants}
            whileFocus="focus"
            whileBlur="blur"
          />
          {errors.address_line_1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address_line_1}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2 <span className="text-gray-400">(Optional)</span>
          </label>
          <motion.input
            type="text"
            name="address_line_2"
            value={formData.address_line_2}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, building, floor, etc."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
            variants={inputVariants}
            whileFocus="focus"
            whileBlur="blur"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.city ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
              } transition-colors duration-200`}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State/Province <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.state ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
              } transition-colors duration-200`}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.postal_code ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
              } transition-colors duration-200`}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            />
            {errors.postal_code && (
              <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.country ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
              } transition-colors duration-200`}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <motion.input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (123) 456-7890"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
              'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500'
            } transition-colors duration-200`}
            variants={inputVariants}
            whileFocus="focus"
            whileBlur="blur"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Set as default address
            </span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <motion.button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
          whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Address'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default AddressForm;