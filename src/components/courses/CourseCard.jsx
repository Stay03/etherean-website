import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ModernCourseCard Component
 * Displays information about a single course in a modern card format
 * with image covering the card and gradient overlay for text
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

    return numPrice.toFixed(2);
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get formatted price display
  const priceDisplay = formatPrice(course.price);

  // Check if course is free
  const isFree = priceDisplay === 'Free' || parseFloat(priceDisplay) === 0;

  return (
    // Increased height from h-64 to h-72
    <div className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-[20rem] ">
      {/* Full card image background */}
      <div className="absolute inset-0 bg-gray-200">
        {!imageError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover object-left" 
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
      </div>

      {/* Gradient overlay covering entire card */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
        {/* Content container, changed to justify-end to push content to bottom */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {/* Grouping all text content and button at the bottom */}
          <div className="space-y-2">
            {/* Course title and description */}
            <div>
              <h3 className="text-xl   font-semibold text-white mb-1">
                {course.title}
              </h3>
             
            </div>

            {/* Price */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">
                {isFree ? 'Free' : `$${priceDisplay}`}
              </span>
            </div>

            {/* View Course Button - added relative and z-20 */}
            <Link
              to={`/course/${course.slug}`}
              className="block w-full bg-yellow-500 hover:bg-yellow-600 text-center py-2 px-4 text-white font-medium rounded-md transition-colors duration-200 relative z-20"
            >
              View Course
            </Link>
          </div>
        </div>
      </div>

      {/* Full card clickable link that excludes the button (z-10) */}
      <Link
        to={`/course/${course.slug}`}
        className="absolute inset-0 z-10"
        aria-hidden="true"
      />
    </div>
  );
};

export default CourseCard;