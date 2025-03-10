// src/components/layout/Header/components/MobileMenu.jsx

import React, { memo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import SocialIcons from './SocialIcons';
import ContactInfo from './ContactInfo';
import { menuItems, authLinks } from '../data/menuData';

/**
 * Mobile menu component with slide-in drawer and backdrop
 */
const MobileMenu = ({ 
  isOpen, 
  isScrolled,
  expandedItems,
  isLoggedIn = false,
  onClose,
  onToggleExpand,
  onMenuItemClick 
}) => {
  // Reference to the menu for focus trapping
  const menuRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  // Determine which auth link to show based on login state
  const authLink = isLoggedIn ? authLinks.loggedIn : authLinks.loggedOut;

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      
      // Trap focus within the modal when open
      if (e.key === 'Tab' && isOpen) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            e.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            e.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus first element when menu opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Drawer */}
      <div 
        ref={menuRef}
        id="mobile-menu"
        className={`lg:hidden fixed right-0 top-0 h-screen w-64 bg-gray-900 text-white z-50 overflow-y-auto transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)' }}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button 
            ref={firstFocusableRef}
            onClick={onClose}
            aria-label="Close Menu"
            className="text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Menu title (for accessibility) */}
        <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation Menu</h2>
        
        {/* Logo */}
        <div className="px-6 py-4 flex items-center">
          <Logo size="small" />
        </div>
        
        {/* Menu Items */}
        <nav className="px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name} className="border-b border-gray-700">
                <div className="flex items-center justify-between py-3">
                  <Link
                    to={item.path}
                    className="text-white hover:text-yellow-500 transition-colors font-medium text-base"
                    onClick={() => onMenuItemClick(item.hasDropdown)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && (
                    <button 
                      onClick={() => onToggleExpand(item.name)}
                      className="text-yellow-500 p-1"
                      aria-expanded={expandedItems[item.name] ? 'true' : 'false'}
                      aria-controls={`submenu-${item.name}`}
                    >
                      <div className="w-6 h-6 flex items-center justify-center border border-yellow-500 rounded-sm">
                        {expandedItems[item.name] ? 
                          <span className="text-lg leading-none mb-1">-</span> : 
                          <span className="text-lg leading-none">+</span>
                        }
                      </div>
                    </button>
                  )}
                </div>
                
                {/* Dropdown content */}
                {item.hasDropdown && (
                  <div 
                    id={`submenu-${item.name}`}
                    className={`pl-4 pb-2 overflow-hidden transition-all duration-300`}
                    style={{ 
                      maxHeight: expandedItems[item.name] ? '200px' : '0',
                      transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
                    }}
                  >
                    <ul className="space-y-2">
                      {item.submenu && item.submenu.map((subItem, index) => (
                        <li key={index}>
                          <Link 
                            to={subItem.path}
                            className="text-gray-300 hover:text-yellow-500 block py-1"
                            onClick={onClose}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
            
            {/* Login/Account Link */}
            <li className="border-b border-gray-700 py-3">
              <Link
                to={authLink.path}
                className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium block"
                onClick={onClose}
              >
                {authLink.name}
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Contact Info Section */}
        <ContactInfo />
        
        {/* Social Media Icons */}
        <div className="mt-6 px-4">
          <SocialIcons />
        </div>

        {/* Last focusable element (for focus trapping) */}
        <button 
          ref={lastFocusableRef} 
          className="sr-only"
          tabIndex={isOpen ? 0 : -1}
        >
          End of menu
        </button>
      </div>
      
      {/* Dark overlay when mobile menu is open */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        style={{ 
          transition: 'opacity 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86)'
        }}
      ></div>
    </>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  expandedItems: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired
};

export default memo(MobileMenu);