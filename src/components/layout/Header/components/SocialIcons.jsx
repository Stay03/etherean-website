// src/components/layout/Header/components/SocialIcons.jsx

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { socialIcons } from '../data/socialData';

/**
 * Social icons component for the header
 * Displays social media icons with links
 */
const SocialIcons = ({ className = '', iconClassName = '' }) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      {socialIcons.map((social) => (
        <a 
          key={social.name}
          href={social.url} 
          className={`w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center 
                    text-white hover:bg-yellow-500 transition-colors ${iconClassName}`}
          aria-label={`Follow us on ${social.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

SocialIcons.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string
};

// Memoize to prevent unnecessary re-renders
export default memo(SocialIcons);