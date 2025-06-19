import React, { useState } from 'react';

/**
 * CourseDescription Component
 * Displays the formatted course description with read more functionality
 * 
 * @param {string} description - Course description text
 * @param {number} initialParagraphs - Number of paragraphs to show initially
 */
const CourseDescription = ({ description, initialParagraphs = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Split description into paragraphs
  const paragraphs = description
    .split(/\r?\n/)
    .filter(paragraph => paragraph.trim().length > 0);
  
  // Determine if we need to show "Read More" button
  const shouldShowReadMore = paragraphs.length > initialParagraphs;
  
  // Get paragraphs to display based on expanded state
  const displayParagraphs = expanded 
    ? paragraphs 
    : paragraphs.slice(0, initialParagraphs);
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="course-description">
      <div className="prose prose-yellow max-w-none">
        {displayParagraphs.map((paragraph, index) => (
          <p key={index} className="text-gray-700 mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      
      {shouldShowReadMore && (
        <button
          onClick={toggleExpanded}
          className="mt-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors focus:outline-none"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default CourseDescription;