// src/components/layout/Header/data/menuData.js

/**
 * Reorganized menu data structure with primary and secondary navigation
 * This separates core navigation from supplementary links
 */

// Primary navigation - main site sections that most users need
export const primaryMenuItems = [
  { 
    name: 'About Us', 
    path: '/about', 
    hasDropdown: true,
    submenu: [
      { name: 'Branches', path: '/about/branches' },
      { name: 'Gallery', path: '/about/gallery' },
      { name: 'Projects', path: '/about/projects' },
      { name: 'Privacy Policy', path: '/about/privacy-policy' },
    ] 
  },
  {
    name: 'Ministries',
    path: '#',
    hasDropdown: true,
    submenu: [
      { name: 'Youth Ministry', path: '/ministries/youth' },
      { name: 'Healthy Wealthy', path: '/ministries/healthy' },
      { name: 'Inner Circle', path: '/ministries/inner-circle' },
      { name: 'Flower Light', path: '/ministries/flower-light' },
    ]
  },
  { 
    name: 'Courses', 
    path: '/courses', 
    hasDropdown: false 
  },
  {
    name: 'Events',
    path: '/events',
    hasDropdown: true,
    submenu: [
      { name: '50th Anniversary', path: '/events/50th-anniversary-OjDMS' },
      { name: 'Planetary Liberation Day', path: '#' },
      { name: 'Cultural Day', path: '#' },
      { name: 'Beach Party', path: '/about/gallery' },
    ]
  },
  { 
    name: 'Shop', 
    path: '/shop', 
    hasDropdown: false 
  },
];

// Secondary navigation - less frequently used links
export const secondaryMenuItems = [
  { 
    name: 'Free Lessons',
    path: '/free-courses',
    hasDropdown: false
  },
  { 
    name: 'Membership', 
    path: '/membership', 
    hasDropdown: false
  },
  {
    name: 'Donate',
    path: '/donate',
    hasDropdown: false
  },
  { 
    name: 'Contact', 
    path: '/contact', 
    hasDropdown: false 
  },
];

// Utility navigation - user-specific actions
export const utilityMenuItems = [
  { 
    name: 'Cart', 
    path: '/cart', 
    hasDropdown: false,
    icon: 'cart'
  },
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