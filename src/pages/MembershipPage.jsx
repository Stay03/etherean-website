import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumb';
import MembershipList from '../components/membership/MembershipList';
import AuthModal from '../components/auth/AuthModal';
import useCollections from '../hooks/useCollections';

/**
 * MembershipPage Component
 * Main page that displays available membership options
 */
const MembershipPage = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  
  // Use custom hook to fetch collections data
  const { 
    collections, 
    isLoading, 
    error, 
    acquireCollection 
  } = useCollections({ per_page: 10 });

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Memberships', path: '/membership' }
  ];

  // Handle collection selection
  const handleSelectCollection = async (collectionId) => {
    setSelectedCollectionId(collectionId);
    const result = await acquireCollection(collectionId);
    
    if (result.success) {
      toast.success(result.data.message || 'Membership added successfully!');
      // Optionally redirect to my-items or other page
      // navigate('/my-items');
    } else {
      toast.error(result.error || 'Failed to acquire membership. Please try again.');
    }
  };

  // Handle authentication required
  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    // If a collection was selected before authentication, acquire it now
    if (selectedCollectionId) {
      handleSelectCollection(selectedCollectionId);
    }
  };

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={breadcrumbItems} 
        onNavigate={(path) => navigate(path)} 
      />
      
      {/* Page Header */}
      <div className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Memberships</h1>
          <p className="text-lg text-gray-600">
            Choose a membership plan that fits your needs and goals
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MembershipList 
          collections={collections} 
          isLoading={isLoading} 
          error={error}
          onSelect={handleSelectCollection}
          onAuthRequired={handleAuthRequired}
        />
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        redirectPath="/membership"
      />
    </div>
  );
};

export default MembershipPage;