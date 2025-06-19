import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumb';
import AuthModal from '../components/auth/AuthModal';
import useCollections from '../hooks/useCollections';
import Youth from '../assets/youth.png';

/**
 * Hero Component
 * Displays a hero section with the youth image and welcome text
 */
const Hero = () => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl mb-12  ">
      {/* Hero Image */}
      <img
        src={Youth}
        alt="Youth embracing potential"
        className="w-full h-full object-cover "
      />
      
     
    </div>
  );
};

/**
 * CategorySelector Component
 * Displays image-based category selectors that act like tabs
 */
const CategorySelector = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
            activeCategory === category.id ? 'ring-4 ring-yellow-500' : 'hover:shadow-xl'
          }`}
          whileHover={{ y: -5 }}
          onClick={() => onSelectCategory(category.id)}
        >
          <div className="h-36 relative">
            <img
              src={category.imageUrl}
              alt={category.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="p-4 w-full">
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
                <p className="text-sm text-gray-200">
                  {category.collections.length} membership options
                </p>
              </div>
            </div>
          </div>
          
          {activeCategory === category.id && (
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * CollectionGrid Component
 * Displays collections in a grid layout with animations
 */
const CollectionGrid = ({ collections, onSelect, loadingCollectionId }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
    >
      {collections.map((collection, index) => (
        <motion.div
          key={collection.id}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.03 }}
        >
          <div className="h-48 overflow-hidden">
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-5">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{collection.name}</h4>
            <p className="text-sm text-gray-600 mb-4">
              Unlock exclusive membership content for {collection.name} members. 
            </p>
            <button
              onClick={() => onSelect(collection.id)}
              disabled={loadingCollectionId === collection.id}
              className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              {loadingCollectionId === collection.id ? (
                <>
                  <span>Loading</span>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <>
                  <span>Select Membership</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * NoSelectionState Component
 * Displays when no category is selected
 */
const NoSelectionState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center"
  >
    <div className="flex flex-col items-center justify-center">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 17.25V16.75C11 16.3358 11.3358 16 11.75 16H12.25C12.6642 16 13 16.3358 13 16.75V17.25C13 17.6642 12.6642 18 12.25 18H11.75C11.3358 18 11 17.6642 11 17.25ZM12 6.5C9 6.5 8 9 8 10H10C10 9 10.5 8.5 12 8.5C13.5 8.5 14 9 14 10C14 11 13.5 11.25 12.5 12.25C11.5 13.25 11 14 11 15H13C13 14.5 13.5 13.5 14.5 12.5C15.5 11.5 16 10.8 16 10C16 8 14 6.5 12 6.5Z"
        />
      </svg>
      <h4 className="text-xl font-medium text-gray-700">Select a Membership Category</h4>
      <p className="text-gray-500 mt-2">
        Please choose a category above to view available membership options.
      </p>
    </div>
  </motion.div>
);

/**
 * EmptyState Component
 * Displays when no collections are available
 */
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center"
  >
    <div className="flex flex-col items-center justify-center">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h4 className="text-xl font-medium text-gray-700">No Memberships Available</h4>
      <p className="text-gray-500 mt-2">
        There are currently no membership options in this category.
      </p>
    </div>
  </motion.div>
);

/**
 * Loading Component
 * Displays a loading animation
 */
const Loading = () => (
  <div className="flex justify-center items-center py-16">
    <motion.div
      className="w-16 h-16"
      animate={{
        rotate: 360
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-full h-full border-4 border-yellow-500 border-t-transparent rounded-full"></div>
    </motion.div>
  </div>
);

/**
 * GroupedMembershipList Component
 * Displays memberships organized by categories with modern tab-like interface
 */
const GroupedMembershipList = ({
  collections,
  isLoading,
  error,
  onSelect,
  loadingCollectionId,
  onAuthRequired
}) => {
  const [activeCategory, setActiveCategory] = useState(null); // Changed from 'youth' to null

  // Category images
  const categoryImages = {
    youth: "https://images.pexels.com/photos/8199164/pexels-photo-8199164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    adult: "https://images.pexels.com/photos/7148441/pexels-photo-7148441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    innerCircle: "https://images.pexels.com/photos/8761529/pexels-photo-8761529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  };

  // Group collections by category
  const groupedCollections = {
    youth: collections.filter((c) =>
      ["Children", "Teen", "Upper Youth"].includes(c.name)
    ),
    adult: collections.filter((c) =>
      ["Foundation", "Intermediate", "Advanced"].includes(c.name)
    ),
    innerCircle: collections.filter((c) =>
      ["Probation", "Neophyte", "Mystic"].includes(c.name)
    )
  };

  // Define categories for the selector
  const categories = [
    {
      id: 'youth',
      title: 'Youth',
      imageUrl: categoryImages.youth,
      collections: groupedCollections.youth
    },
    {
      id: 'adult',
      title: 'Adult',
      imageUrl: categoryImages.adult,
      collections: groupedCollections.adult
    },
    {
      id: 'innerCircle',
      title: 'Inner Circle',
      imageUrl: categoryImages.innerCircle,
      collections: groupedCollections.innerCircle
    }
  ];

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
      >
        <p className="text-red-800 mb-4">
          {error.message || 'Failed to load membership options'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  // Empty state
  if (!collections || collections.length === 0) {
    return <EmptyState />;
  }

  // Render the modern tab-like interface
  return (
    <div>
      <div className="mb-10">
        <motion.h2 
          className="text-3xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Select Your Membership Path
        </motion.h2>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Choose a category below to explore our membership options. Each path offers unique benefits and experiences.
        </motion.p>
      </div>

      {/* Image-based Category Selector */}
      <CategorySelector
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Content Display Area */}
      <motion.div 
        className="bg-gray-50 rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        layout
      >
        <AnimatePresence mode="wait">
          {activeCategory ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {categories.find(c => c.id === activeCategory)?.title} Memberships
                </h3>
                <p className="text-gray-600">
                  Select from the available membership options below.
                </p>
              </div>

              {groupedCollections[activeCategory].length > 0 ? (
                <CollectionGrid
                  collections={groupedCollections[activeCategory]}
                  onSelect={onSelect}
                  loadingCollectionId={loadingCollectionId}
                />
              ) : (
                <EmptyState />
              )}
            </motion.div>
          ) : (
            <NoSelectionState />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/**
 * MembershipPage Component
 * Main page that displays available membership options with modern UI
 */
const MembershipPage = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [loadingCollectionId, setLoadingCollectionId] = useState(null);

  // Use custom hook to fetch collections data
  const { collections, isLoading, error, acquireCollection } = useCollections({
    per_page: 15
  });

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Memberships', path: '/membership' }
  ];

  // Check if user is authenticated
  const checkAndHandleAuth = (collectionId) => {
    // Assuming useCollections hook or another part of your app can tell if user is authenticated
    // This is a placeholder - replace with your actual auth check
    const isAuthenticated = localStorage.getItem('auth_token') || false;
    
    if (!isAuthenticated) {
      setSelectedCollectionId(collectionId);
      setIsAuthModalOpen(true);
      return false;
    }
    
    return true;
  };

  // Handle collection selection
  const handleSelectCollection = async (collectionId) => {
    setSelectedCollectionId(collectionId);
    setLoadingCollectionId(collectionId);
    
    // Check if user is authenticated first
    if (!checkAndHandleAuth(collectionId)) {
      setLoadingCollectionId(null);
      return;
    }
    
    try {
      const result = await acquireCollection(collectionId);

      if (result.success) {
        toast.success(result.data.message || 'Membership added successfully!');
        // Optionally redirect to my-items or other page
        navigate('/my-items');
      } else if (result.error === 'Unauthenticated') {
        // If the API returns unauthenticated error, show the auth modal
        setIsAuthModalOpen(true);
      } else {
        toast.error(result.error || 'Failed to acquire membership. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoadingCollectionId(null);
    }
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    
    // If a collection was selected before authentication, acquire it now
    if (selectedCollectionId) {
      handleSelectCollection(selectedCollectionId);
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Etherean Mission Membership</h1>
        <p className="text-gray-600 text-xl mb-8">
          We welcome you to activate your innate potentials to enable you be the highest and the best you can possibly be.
        </p>
        {/* Hero Section with Youth Image */}
        <Hero/>

        {/* Main Content */}
        <div className="mt-8">
          <GroupedMembershipList
            collections={collections}
            isLoading={isLoading}
            error={error}
            onSelect={handleSelectCollection}
            loadingCollectionId={loadingCollectionId}
          />
        </div>
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