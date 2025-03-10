import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import useScrollPosition from '../../../hooks/useScrollPosition';
import useMenuState from '../../../hooks/useMenuState';
import Logo from './components/Logo';
import DesktopMenu from './components/DesktopMenu';
import MobileMenu from './components/MobileMenu';

/**
 * Main Header component
 * Combines desktop and mobile navigation
 */
const Header = () => {
  // Track if user is logged in (replace with actual auth logic later)
  const isLoggedIn = false;
  
  // Use custom scroll position hook
  const isScrolled = useScrollPosition(50);
  
  // Use custom menu state hook
  const {
    mobileMenuOpen,
    expandedItems,
    toggleMobileMenu,
    closeMobileMenu,
    toggleExpand,
    handleMobileMenuItemClick
  } = useMenuState();

  // Dynamic classes for the header based on scroll state
  const headerClasses = `w-full z-10 transition-all duration-300 ${
    isScrolled 
      ? 'fixed top-0 bg-white shadow-md' 
      : 'absolute bg-transparent'
  }`;

  return (
    <header className={headerClasses}>
      {/* Desktop Header */}
      <DesktopMenu 
        isScrolled={isScrolled}
        isLoggedIn={isLoggedIn}
      />

      {/* Mobile/Tablet Header */}
      <div className={`lg:hidden flex justify-between items-center h-16 px-12 ${isScrolled ? 'bg-white' : 'bg-transparent'} ${!isScrolled ? 'pt-16' : ''}`}>
        <Logo className="z-10" size={isScrolled ? "default" : "small"} />
        
        <div className="flex items-center z-10">
          <button 
            className={`p-2 mr-2 ${isScrolled ? 'text-yellow-500' : 'text-yellow-500'}`}
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button 
            className={`p-2 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Drawer) */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        isScrolled={isScrolled}
        expandedItems={expandedItems}
        isLoggedIn={isLoggedIn}
        onClose={closeMobileMenu}
        onToggleExpand={toggleExpand}
        onMenuItemClick={handleMobileMenuItemClick}
      />
    </header>
  );
};

export default memo(Header);