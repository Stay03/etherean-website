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
      name: 'Ministries', 
      path: '/ministries', 
      hasDropdown: true,
      submenu: [
        { name: 'Church Services', path: '/ministries/church' },
        { name: 'Community Outreach', path: '/ministries/outreach' },
        { name: 'Prayer Groups', path: '/ministries/prayer' }
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
      hasDropdown: true,
      submenu: [
        { name: 'Join Us', path: '/membership/join' },
        { name: 'Member Benefits', path: '/membership/benefits' },
        { name: 'Member Directory', path: '/membership/directory' }
      ] 
    },
    { 
      name: 'Store', 
      path: '/store', 
      hasDropdown: false 
    },
  ];
  
  // Auth states can be expanded later with actual authentication
  export const authLinks = {
    loggedOut: { name: 'Login', path: '/login' },
    loggedIn: { name: 'My Account', path: '/account' }
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