import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * CourseCard Component
 * Displays information about a single course in a card format
 * 
 * @param {Object} course - Course object containing details
 */
const CourseCard = ({ course }) => {
  const [imageError, setImageError] = useState(false);

  // Format price display
  const formatPrice = (price) => {
    // Handle cases where price might be null, undefined, or not a number
    if (price === null || price === undefined) return 'Price unavailable';
    if (price === 0) return 'Free';
    
    // Convert to number if it's a string and check if it's a valid number
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price unavailable';
    
    return `${numPrice.toFixed(2)}`;
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Generate platform badge class based on platform
  const getPlatformBadgeClass = (platform) => {
    if (platform.toLowerCase().includes('el')) {
      return 'bg-blue-100 text-blue-800';
    } else if (platform.toLowerCase().includes('ch')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
      <Link to={`/course/${course.slug}`} className="block">
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          {!imageError ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Platform Badge */}
          {course.platform && (
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformBadgeClass(course.platform)}`}>
                {course.platform.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/course/${course.slug}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-yellow-600 transition-colors">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-yellow-600">
            {formatPrice(course.price)}
          </span>
          
          <Link
            to={`/course/${course.slug}`}
            className="inline-flex items-center px-3 py-1.5 bg-yellow-500 text-gray-900 text-sm font-medium rounded hover:bg-yellow-600 transition-colors"
          >
            View Course
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;