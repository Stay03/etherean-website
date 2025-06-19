import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { utilityMenuItems, authLinks } from '../data/menuData';

/**
 * TopBar component for utility links and authentication
 * Visible only on desktop.
 */
const TopBar = ({ isLoggedIn, onLoginClick, isScrolled }) => {
  const currentAuthLink = isLoggedIn ? authLinks.loggedIn : authLinks.loggedOut;

  const handleAuthLinkClick = (e) => {
    if (!isLoggedIn && currentAuthLink.name === 'Login') {
      e.preventDefault();
      onLoginClick();
    }
    // If logged in, it's a regular Link navigation
  };

  // Define base and scrolled styles
  const baseBgColor = 'bg-gray-800'; // Example: Darker background for top bar
  const scrolledBgColor = 'bg-gray-900'; // Example: Slightly different or same on scroll
  const textColor = 'text-gray-300';
  const hoverTextColor = 'hover:text-white';

  return (
    <div
      className={`hidden lg:flex items-center justify-end h-10 px-8 ${isScrolled ? scrolledBgColor : baseBgColor} transition-colors duration-300`}
    >
      <nav>
        <ul className="flex items-center space-x-6">
          {utilityMenuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`text-sm font-medium ${textColor} ${hoverTextColor} transition-colors duration-200`}
              >
                {item.name}
              </Link>
            </li>
          ))}
          {/* Separator (optional) */}
          {utilityMenuItems.length > 0 && <li className="h-4 border-l border-gray-600"></li>}
          <li>
            {isLoggedIn ? (
              <Link
                to={currentAuthLink.path}
                className={`text-sm font-medium ${textColor} ${hoverTextColor} transition-colors duration-200`}
              >
                {currentAuthLink.name}
              </Link>
            ) : (
              <a
                href={currentAuthLink.path} // Provide href for semantics, though onClick is primary
                onClick={handleAuthLinkClick}
                className={`text-sm font-medium ${textColor} ${hoverTextColor} transition-colors duration-200 cursor-pointer`}
              >
                {currentAuthLink.name}
              </a>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

TopBar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  isScrolled: PropTypes.bool.isRequired,
};

export default memo(TopBar);