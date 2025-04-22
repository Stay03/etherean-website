// src/components/layout/Header/data/menuData.js

/**
 * Shared menu data structure for both desktop and mobile menus
 * This centralizes our navigation structure in one place
 */

export const menuItems = [
    { 
      name: 'About Us', 
      path: '/about', 
      hasDropdown: true,
      submenu: [
        { name: 'Our Story', path: '/about/story' },
        { name: 'Our Team', path: '/about/team' },
        { name: 'Our Mission', path: '/about/mission' }
      ] 
    },
    
    { 
      name: 'Courses', 
      path: '/courses', 
      hasDropdown: false 
    },
    { 
      name: 'Membership', 
      path: '/membership', 
      hasDropdown: false,
      
    },
    { 
      name: 'Shop', 
      path: '/shop', 
      hasDropdown: false 
    },
    { 
      name: 'Cart', 
      path: '/cart', 
      hasDropdown: false 
    }
  ];
  
  // Auth states can be expanded later with actual authentication
  export const authLinks = {
    loggedOut: { name: 'Login', path: '/login' },
    loggedIn: { name: 'My Account', path: '/my-items' }
  };
  
  // Contact information for mobile menu
  export const contactInfo = [
    {
      icon: 'location',
      text: 'P.O. Box AN 8452, Accra-North',
      href: null // No link for this item
    },
    {
      icon: 'email',
      text: 'info@ethereanlife.com',
      href: 'mailto:info@ethereanlife.com'
    },
    {
      icon: 'phone',
      text: '(+233) 302 230702',
      href: 'tel:+233302230702'
    }
  ];