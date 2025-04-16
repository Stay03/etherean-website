import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrollButton from './EnrollButton';

/**
 * CourseHeader Component
 * Displays the course title, thumbnail, and key information
 * 
 * @param {Object} course - Course object containing details
 * @param {boolean} hasAccess - Whether the user has access to the course
 */
const CourseHeader = ({ course, hasAccess = false }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Format price display
  const formatPrice = (price) => {
    // Handle cases where price might be null, undefined, or not a number
    if (price === null || price === undefined) return 'Price unavailable';
    
    // Convert to number if it's a string and check if it's a valid number
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'Price unavailable';
    
    // Check for free courses
    if (numPrice === 0) return 'Free';
    
    return `${numPrice.toFixed(2)}`;
  };
  
  // Generate platform badge classes
  const getPlatformBadges = (platform) => {
    if (!platform) return [];
    
    const platforms = platform.split(',').map(p => p.trim().toUpperCase());
    
    return platforms.map(p => {
      let bgColor = 'bg-gray-100';
      let textColor = 'text-gray-800';
      
      if (p === 'EL') {
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
      } else if (p === 'CH') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
      }
      
      return {
        name: p,
        className: `${bgColor} ${textColor}`
      };
    });
  };
  
  const platformBadges = getPlatformBadges(course.product_info.platform);

  // Handle direct navigation to course content
  const goToCourse = () => {
    navigate(`/course/${course.product_info.slug}/learn`);
  };

  return (
    <div className="bg-gray-50 py-8 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Course Thumbnail */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {!imageError ? (
                <img
                  src={course.product_info.thumbnail}
                  alt={course.product_info.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Access Badge */}
              {hasAccess && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    You have access
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Course Info */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            {/* Platform Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {platformBadges.map((badge, index) => (
                <span 
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
                >
                  {badge.name}
                </span>
              ))}
            </div>
            
            {/* Course Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {course.product_info.title}
            </h1>
            
            {/* Price */}
            <div className="mb-6">
              {!hasAccess ? (
                <span className="text-2xl font-bold text-yellow-600">
                  {formatPrice(course.product_info.price)}
                </span>
              ) : (
                <span className="text-lg font-medium text-green-600">
                  Enrolled
                </span>
              )}
            </div>
            
            {/* Short Description - first paragraph only */}
            <div className="prose prose-sm mb-6 text-gray-700">
              {course.product_info.description.split('\r\n')[0]}
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <EnrollButton 
                  course={course}
                  hasAccess={hasAccess}
                  onBuyNow={(course) => console.log('Buy now:', course)}
                />
              </div>
              
              {!hasAccess && parseFloat(course.product_info.price) > 0 && (
                <div className="w-full sm:w-auto">
                  <EnrollButton 
                    course={course}
                    hasAccess={hasAccess}
                    isAddToCart={true}
                    onAddToCart={(course) => console.log('Add to cart:', course)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;