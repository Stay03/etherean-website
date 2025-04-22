import React, { useEffect, useState } from 'react';
import useAddresses from '../../hooks/useAddresses';
import { motion, AnimatePresence } from 'framer-motion';

const AddressSelector = ({ type, selectedAddress, onSelectAddress }) => {
  const { addresses = [], isLoading, fetchAddresses } = useAddresses();
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-500 mb-6">Add a new address to proceed with checkout</p>
          <button
            onClick={() => setShowAddressForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Existing Addresses */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <motion.div
            key={address.id}
            whileHover={{ scale: 1.01 }}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
              selectedAddress?.id === address.id
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-300'
            }`}
            onClick={() => onSelectAddress(address)}
          >
            {address.is_default && (
              <span className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Default
              </span>
            )}
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedAddress?.id === address.id
                    ? 'border-yellow-500 bg-yellow-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAddress?.id === address.id && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">{address.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {address.address_line_1}
                  {address.address_line_2 && <>, {address.address_line_2}</>}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p className="text-sm text-gray-600">{address.country}</p>
                {address.phone && (
                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {address.phone}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add New Address Button */}
      <button
        onClick={() => setShowAddressForm(true)}
        className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-yellow-400 hover:text-yellow-600 focus:outline-none transition-all duration-200 flex items-center justify-center group"
      >
        <svg className="w-5 h-5 mr-2 transition-colors group-hover:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Address
      </button>

      {/* Address Form Modal (placeholder - you'll need to implement this) */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Address</h3>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* TODO: Implement address form */}
            <p className="text-gray-600">Address form will be implemented here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;