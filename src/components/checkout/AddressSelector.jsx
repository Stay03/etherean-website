import React, { useState, useEffect } from 'react';
import AddressForm from './AddressForm';
import { useCheckoutContext } from '../../contexts/CheckoutContext';
import { motion, AnimatePresence } from 'framer-motion';

const AddressSelector = ({ type, selectedAddress, onSelectAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    addresses,
    addressesLoading,
    fetchAddresses,
    createAddress,
    setDefaultAddress
  } = useCheckoutContext();
  
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  
  const handleAddressAdded = async (newAddress) => {
    await createAddress(newAddress);
    setShowAddForm(false);
  };
  
  if (addressesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((item) => (
          <div key={item} className="animate-pulse">
            <div className="h-32 bg-gray-100 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      {addresses.length === 0 && !showAddForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-500 mb-6">Add your first address to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-6 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Address
          </button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {!showAddForm ? (
            <motion.div
              key="addresses-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 relative overflow-hidden group
                    ${selectedAddress?.id === address.id 
                      ? 'border-yellow-500 bg-yellow-50 shadow-md' 
                      : 'border-gray-200 hover:border-yellow-400 hover:shadow-md'
                    }`}
                  onClick={() => onSelectAddress(address)}
                >
                  {/* Selected indicator */}
                  {selectedAddress?.id === address.id && (
                    <div className="absolute top-0 right-0 w-20 h-20">
                      <div className="absolute transform rotate-45 bg-yellow-500 text-center text-white font-bold py-1 right-[-35px] top-[32px] w-[170px]">
                        Selected
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {address.name}
                        </h3>
                        {address.is_default && (
                          <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {address.address_line_1}
                        {address.address_line_2 && <>, {address.address_line_2}</>}
                      </p>
                      <p className="text-gray-600">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                      <div className="mt-3 flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {address.phone}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${selectedAddress?.id === address.id 
                          ? 'border-yellow-500 bg-yellow-500' 
                          : 'border-gray-300 group-hover:border-yellow-400'
                        }`}
                      >
                        {selectedAddress?.id === address.id && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {!address.is_default && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDefaultAddress(address.id);
                          }}
                          className="text-sm text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: addresses.length * 0.1 }}
                onClick={() => setShowAddForm(true)}
                className="w-full py-5 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-yellow-500 hover:text-yellow-600 transition-all duration-200 flex items-center justify-center group"
              >
                <svg className="w-6 h-6 mr-2 text-gray-400 group-hover:text-yellow-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Address
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="address-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Address</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddressForm
                onSubmit={handleAddressAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AddressSelector;