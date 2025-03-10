// src/hooks/useMenuState.js

import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage menu state
 * Handles mobile menu open/close, expanded items, and mobile menu closing on route change
 */
const useMenuState = () => {
  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Expanded dropdown items for mobile menu
  const [expandedItems, setExpandedItems] = useState({});
  
  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prevState => !prevState);
  }, []);
  
  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);
  
  // Toggle expanded state for mobile menu items
  const toggleExpand = useCallback((itemName) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [itemName]: !prevState[itemName]
    }));
  }, []);
  
  // Handle mobile menu item click
  // Closes menu if an item without dropdown is clicked
  const handleMobileMenuItemClick = useCallback((hasDropdown) => {
    if (!hasDropdown) {
      setMobileMenuOpen(false);
    }
  }, []);

  // Effect to prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent body scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling when menu is closed
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return {
    mobileMenuOpen,
    expandedItems,
    toggleMobileMenu,
    closeMobileMenu,
    toggleExpand,
    handleMobileMenuItemClick
  };
};

export default useMenuState;