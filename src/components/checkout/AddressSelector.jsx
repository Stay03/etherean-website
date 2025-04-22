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