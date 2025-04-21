import React from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

/**
 * MembershipCard Component
 * Displays a single membership option with image, title, and action button
 * 
 * @param {Object} props - Component props
 * @param {Object} props.collection - Collection data object
 * @param {string} props.imageUrl - URL for the membership image
 * @param {Function} props.onSelect - Function to call when membership is selected
 * @param {Function} props.onAuthRequired - Function to open auth modal if needed
 */
const MembershipCard = ({ 
  collection, 
  imageUrl,
  onSelect,
  onAuthRequired 
}) => {
  const { isAuthenticated } = useAuth();

  const handleSelect = () => {
    if (!isAuthenticated) {
      // If user is not authenticated, open auth modal
      onAuthRequired();
    } else {
      // If user is authenticated, proceed with selection
      onSelect(collection.id);
      toast.info(`Processing your ${collection.name} membership...`);
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      {/* Membership Image */}
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl || 'https://via.placeholder.com/400x200?text=Membership'} 
          alt={collection.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {collection.name}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {collection.description || 'Join our  membership program to access special content.'}
        </p>
        
        {/* Action Button */}
        <button
          onClick={handleSelect}
          className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Select {collection.name}
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;