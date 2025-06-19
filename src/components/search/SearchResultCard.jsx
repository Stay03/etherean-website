import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SearchResultCard = ({ item, type }) => {
  const { slug, title, thumbnail, price, description, start_date } = item;

  let linkTo = '';
  if (type === 'course') linkTo = `/course/${slug}`;
  else if (type === 'product') linkTo = `/product/${slug}`;
  else if (type === 'event') linkTo = `/events/${slug}`;

  const itemDescription = description && description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;
  
  const formattedDate = start_date 
    ? new Date(start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : null;

  return (
    <Link to={linkTo} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {thumbnail && (
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full sm:w-32 h-32 sm:h-auto object-cover flex-shrink-0" 
            onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'} // Fallback image
          />
        )}
        <div className="p-4 flex flex-col justify-between leading-normal">
          <div>
            <div className="text-gray-500 text-xs uppercase font-semibold mb-1">{type}</div>
            <h3 className="text-gray-900 font-bold text-lg mb-2 hover:text-yellow-600 transition-colors">{title}</h3>
            {itemDescription && <p className="text-gray-700 text-sm mb-2">{itemDescription}</p>}
          </div>
          <div className="flex items-center justify-between mt-2">
            {price && type !== 'event' && (
              <p className="text-yellow-600 font-semibold text-md">
                {parseFloat(price) === 0 ? 'Free' : `$${parseFloat(price).toFixed(2)}`}
              </p>
            )}
            {formattedDate && type === 'event' && (
              <p className="text-sm text-gray-600">{formattedDate}</p>
            )}
             <span className="text-xs text-white bg-yellow-500 px-2 py-1 rounded-full">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

SearchResultCard.propTypes = {
  item: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    start_date: PropTypes.string, // For events
  }).isRequired,
  type: PropTypes.oneOf(['course', 'product', 'event']).isRequired,
};

export default SearchResultCard;