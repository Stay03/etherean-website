import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScrollPosition from '../../../hooks/useScrollPosition';
import useMenuState from '../../../hooks/useMenuState';
import { useAuth } from '../../../contexts/AuthContext';
import Logo from './components/Logo';
import DesktopMenu from './components/DesktopMenu';
import MobileMenu from './components/MobileMenu';
import AuthModal from '../../auth/AuthModal';

/**
 * Main Header component
 * Combines desktop and mobile navigation
 */
const Header = () => {
  // Use authentication context instead of hardcoded value
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State for auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState('login');
  
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

  // Handler for opening auth modal
  const handleOpenAuthModal = (tab = 'login') => {
    setInitialAuthTab(tab);
    setAuthModalOpen(true);
  };

  // Handler for successful authentication
  const handleAuthSuccess = () => {
    // Refresh page or update state as needed
    closeMobileMenu();
  };

  // Handler for search button click
  const handleSearchClick = () => {
    navigate('/search');
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  };

  // Dynamic classes for the header based on scroll state
  const headerClasses = `w-full z-20 transition-all duration-300 ${
    isScrolled 
      ? 'fixed top-0 bg-white shadow-md' 
      : 'absolute bg-transparent'
  }`;

  return (
    <header className={headerClasses}>
      {/* Desktop Header */}
      <DesktopMenu 
        isScrolled={isScrolled}
        isLoggedIn={isAuthenticated}
        onLoginClick={() => handleOpenAuthModal('login')}
        onSearchClick={handleSearchClick}
      />

      {/* Mobile/Tablet Header */}
      <div className={`lg:hidden flex justify-between items-center h-16 px-12 ${isScrolled ? 'bg-white' : 'bg-transparent'} ${!isScrolled ? 'pt-16' : ''}`}>
        <Logo className="z-10" size={isScrolled ? "default" : "small"} />
        
        <div className="flex items-center z-10">
          <button 
            className={`p-2 mr-2 ${isScrolled || !mobileMenuOpen ? 'text-yellow-500' : 'text-white'}`} // Adjust color if menu is open and not scrolled
            aria-label="Search"
            onClick={handleSearchClick}
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
        isLoggedIn={isAuthenticated}
        onClose={closeMobileMenu}
        onToggleExpand={toggleExpand}
        onMenuItemClick={handleMobileMenuItemClick}
        onLoginClick={() => handleOpenAuthModal('login')}
        // onSearchClick prop is not used by MobileMenu component itself for a search icon inside it
        // The main mobile search icon is handled above.
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialTab={initialAuthTab}
      />
    </header>
  );
};

export default memo(Header);