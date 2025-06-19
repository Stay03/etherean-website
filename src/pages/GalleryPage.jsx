import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Folder } from 'lucide-react';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Define folders available in the gallery
  const folders = [
    { id: 'gallery', name: 'Gallery' },
    { id: 'broIshmael', name: 'Bro Ishmael' }
  ];

  // Import images using webpack's require.context
  // Note: require.context must be called with string literals, not variables
  const galleryImagesContext = require.context('../assets/gallery', false, /\.(png|jpe?g|svg|webp)$/i);
  const galleryImages = galleryImagesContext.keys().map(path => ({
    src: galleryImagesContext(path),
    alt: path.replace(/\.\//g, '').replace(/\.(png|jpe?g|svg|webp)$/i, ''),
    folder: 'gallery'
  }));
  
  // For the BroIshmael folder
  const broIshmaelImagesContext = require.context('../assets/BroIshmael', false, /\.(png|jpe?g|svg|webp)$/i);
  const broIshmaelImages = broIshmaelImagesContext.keys().map(path => ({
    src: broIshmaelImagesContext(path),
    alt: path.replace(/\.\//g, '').replace(/\.(png|jpe?g|svg|webp)$/i, ''),
    folder: 'broIshmael'
  }));

  // Get the images for the currently selected folder
  const currentImages = selectedFolder === 'gallery' 
    ? galleryImages 
    : selectedFolder === 'broIshmael' 
      ? broIshmaelImages 
      : [];

  // Animation for elements when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.animate-item');
    items.forEach((item) => observer.observe(item));

    return () => items.forEach((item) => observer.unobserve(item));
  }, [selectedFolder]); // Re-run when folder changes

  // Handle modal navigation
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setSelectedImage(currentImages[index]);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  // Handle folder selection
  const selectFolder = (folderId) => {
    setSelectedFolder(folderId);
    setVisibleItems({}); // Reset visibility for animation
  };

  // Go back to folder selection
  const goBackToFolders = () => {
    setSelectedFolder(null);
    setVisibleItems({}); // Reset visibility for animation
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImages]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="relative w-full h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-yellow-700 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Our Gallery
            </h1>
            <p className="text-xl text-white">
              A collection of memorable moments and experiences captured in time.
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {selectedFolder ? (
          // Show images from the selected folder
          <>
            {/* Back button */}
            <div className="mb-8">
              <button 
                onClick={goBackToFolders}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Folders
              </button>
              <h2 className="text-3xl font-bold mt-4 text-gray-800">
                {folders.find(f => f.id === selectedFolder)?.name}
              </h2>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentImages.length > 0 ? (
                currentImages.map((image, index) => (
                  <div
                    key={index}
                    id={`gallery-item-${index}`}
                    className={`animate-item cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform ${
                      visibleItems[`gallery-item-${index}`]
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: `${(index % 8) * 50}ms`,
                      aspectRatio: '1 / 1'
                    }}
                    onClick={() => openModal(index)}
                  >
                    <div className="relative h-full w-full group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <ZoomIn className="text-white w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No images found in this folder</p>
                </div>
              )}
            </div>
          </>
        ) : (
          // Show folder selection screen
          <>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Browse Folders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
              {folders.map((folder, index) => (
                <div
                  key={folder.id}
                  id={`folder-${index}`}
                  className={`animate-item cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform ${
                    visibleItems[`folder-${index}`]
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => selectFolder(folder.id)}
                >
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 text-center group">
                    <div className="bg-white/80 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Folder className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{folder.name}</h3>
                    <p className="text-gray-600 mt-2">Click to browse</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-300"
            aria-label="Close modal"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-h-full max-w-full">
            <img
              src={currentImages[currentIndex].src}
              alt={currentImages[currentIndex].alt}
              className="max-h-[80vh] max-w-full object-contain"
            />
            <div className="text-white text-center mt-4">
              <p className="text-lg capitalize">{currentImages[currentIndex].alt.replace(/-/g, ' ')}</p>
              <p className="text-sm text-gray-300">{currentIndex + 1} / {currentImages.length}</p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;