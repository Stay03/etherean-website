// src/components/layout/Header/components/ContactInfo.jsx

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { contactInfo } from '../data/menuData';

/**
 * Component to render contact information with icons
 * Used in the mobile menu
 */
const ContactInfo = ({ className = '' }) => {
  // Icon components mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'location':
        return (
          <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`mt-8 px-4 ${className}`}>
      <h3 className="font-medium text-white mb-4">Contact Info</h3>
      <ul className="space-y-3">
        {contactInfo.map((info, index) => (
          <li key={index} className="flex items-start">
            {getIcon(info.icon)}
            {info.href ? (
              <a href={info.href} className="text-gray-300 text-sm hover:text-yellow-500 transition-colors">
                {info.text}
              </a>
            ) : (
              <span className="text-gray-300 text-sm">{info.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

ContactInfo.propTypes = {
  className: PropTypes.string
};

export default memo(ContactInfo);