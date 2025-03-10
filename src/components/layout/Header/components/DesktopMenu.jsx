import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { menuItems, authLinks } from '../data/menuData';
import Logo from './Logo';

/**
 * Desktop menu component
 * Renders the navigation menu for desktop view with dropdown functionality
 */
const DesktopMenu = ({ isScrolled = false, isLoggedIn = false }) => {
  // State to track which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Determine which auth link to show based on login state
  const authLink = isLoggedIn ? authLinks.loggedIn : authLinks.loggedOut;
  
  // Handle mouse enter for dropdown
  const handleMouseEnter = (itemName) => {
    setOpenDropdown(itemName);
  };
  
  // Handle mouse leave for dropdown
  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };
  // No longer need click outside handler with hover-based dropdowns
  
  return (
    <div className={`hidden lg:flex ${!isScrolled ? 'py-6' : ''}`}>
      {/* Logo Area - Left side */}
      <div className={`flex items-center h-20 pl-16 pr-12 ${isScrolled ? 'bg-white' : 'bg-transparent'}`}>
        <Logo size="large" />
      </div>
      
      {/* Slanted divider SVG - only visible when not scrolled */}
      {!isScrolled && (
        <div className="relative h-20" style={{ marginRight: "-15px" }}>
          <svg width="93" height="80" viewBox="0 0 93 116" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full">
            <path fillRule="evenodd" clipRule="evenodd" d="M93 116V0H0C11.604 0.00830078 22.1631 6.70752 27.1128 17.2046L65.5889 98.7954C70.5415 109.299 81.1108 116 92.7231 116H93Z" fill="white"></path>
          </svg>
        </div>
      )}
      
      {/* Navigation Menu - Right side with white background */}
      <div className="flex-1 bg-white h-20">
        <nav className="h-full flex justify-end">
          <ul className="flex items-center pr-8">
            {menuItems.map((item) => (
              <li 
                key={item.name} 
                className="mx-3 relative"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.hasDropdown ? (
                  <div
                    className="text-gray-800 hover:text-blue-400 transition-colors duration-200 font-medium flex items-center py-2 px-1 text-lg cursor-pointer"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.name}
                  >
                    {item.name}
                    <svg 
                      className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-800 hover:text-blue-400 transition-colors duration-200 font-medium flex items-center py-2 px-1 text-lg"
                  >
                    {item.name}
                  </Link>
                )}
                
                {/* Dropdown Menu - With hover effect for menu items */}
                {item.hasDropdown && (
                  <div 
                    className={`absolute top-full left-0 bg-white shadow-lg rounded-xl py-4 px-6 min-w-max z-10 transform origin-top ${
                      openDropdown === item.name 
                        ? 'opacity-100 scale-y-100' 
                        : 'opacity-0 scale-y-0 pointer-events-none'
                    }`}
                    style={{ 
                      borderTop: '3px solid #60A5FA',
                      transition: 'opacity 400ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                  >
                    {item.submenu && item.submenu.map((subItem, index) => {
                      // Create a separate component for menu items to properly use hooks
                      const SubmenuItem = () => {
                        const [isHovered, setIsHovered] = useState(false);
                        
                        return (
                          <div className="relative block py-2 my-2">
                            <div 
                              className="absolute inset-0 transition-all duration-500"
                              style={{ 
                                backgroundColor: isHovered ? '#60A5FA' : 'transparent',
                                borderRadius: isHovered ? '9999px' : '0',
                                opacity: isHovered ? 1 : 0
                              }}
                            />
                            <Link 
                              to={subItem.path}
                              className="block px-4 whitespace-nowrap relative z-10"
                              style={{ 
                                color: isHovered ? 'white' : '#374151',
                                display: 'block',
                                position: 'relative',
                                transitionProperty: 'color, transform',
                                transitionDuration: '500ms',
                                transitionTimingFunction: 'ease',
                                transform: isHovered ? 'translateX(10px)' : 'translateX(0)'
                              }}
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subItem.name}
                            </Link>
                          </div>
                        );
                      };
                      
                      return <SubmenuItem key={index} />;
                    })}
                  </div>
                )}
              </li>
            ))}
            <li className="mx-3 ml-6">
              <Link
                to={authLink.path}
                className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200 font-medium text-lg"
              >
                {authLink.name}
              </Link>
            </li>
            <li className="ml-6">
              <button 
                className="bg-yellow-500 rounded-full p-3 text-white hover:bg-yellow-600 transition-colors duration-200"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {/* No longer need overlay for click detection */}
    </div>
  );
};

DesktopMenu.propTypes = {
  isScrolled: PropTypes.bool,
  isLoggedIn: PropTypes.bool
};

export default memo(DesktopMenu);