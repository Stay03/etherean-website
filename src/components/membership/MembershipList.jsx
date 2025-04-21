import React from 'react';
import MembershipCard from './MembershipCard';

/**
 * MembershipList Component
 * Displays a grid of available membership options
 * 
 * @param {Object} props - Component props
 * @param {Array} props.collections - Array of collection objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Object} props.error - Error object if any
 * @param {Function} props.onSelect - Function to call when a membership is selected
 * @param {Function} props.onAuthRequired - Function to open auth modal if needed
 */
const MembershipList = ({ 
  collections, 
  isLoading, 
  error, 
  onSelect,
  onAuthRequired 
}) => {
  // Map collection IDs to custom images
  const membershipImages = {
    // Youth membership (ID 1)
    1: 'https://images.pexels.com/photos/8199164/pexels-photo-8199164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Adult membership (ID 2)
    2: 'https://images.pexels.com/photos/7148441/pexels-photo-7148441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Inner Circle membership (ID 3)
    3: 'https://images.pexels.com/photos/8761529/pexels-photo-8761529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-800 mb-4">
          {error.message || 'Failed to load membership options'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!collections || collections.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <p className="text-gray-600">
          No membership options are currently available.
        </p>
      </div>
    );
  }

  // Render membership grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <MembershipCard
          key={collection.id}
          collection={collection}
          imageUrl={membershipImages[collection.id]}
          onSelect={onSelect}
          onAuthRequired={onAuthRequired}
        />
      ))}
    </div>
  );
};

export default MembershipList;