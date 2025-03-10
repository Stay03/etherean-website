import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import ethLogo from '../../assets/eth.png';
import useScrollPosition from '../../hooks/useScrollPosition';

// Move static data outside component to prevent recreation on each render
const menuItems = [
  { name: 'About Us', path: '/about', hasDropdown: true },
  { name: 'Ministries', path: '/ministries', hasDropdown: true },
  { name: 'Courses', path: '/courses', hasDropdown: false },
  { name: 'Membership', path: '/membership', hasDropdown: true },
  { name: 'Store', path: '/store', hasDropdown: false },
];

// Social media icons data
const socialIcons = [
  { name: 'facebook', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4 fill-current"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg> },
  { name: 'twitter', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg> },
  { name: 'instagram', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 fill-current"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg> },
  { name: 'pinterest', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-4 h-4 fill-current"><path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z"/></svg> }
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  
  // Use our custom scroll position hook
  const isScrolled = useScrollPosition(50);

  // Memoized toggle for mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prevState => !prevState);
  }, []);

  // Memoized toggle for expanding menu items
  const toggleExpand = useCallback((itemName) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [itemName]: !prevState[itemName]
    }));
  }, []);

  // Memoized handler for mobile menu item click
  const handleMobileMenuItemClick = useCallback((hasDropdown) => {
    if (!hasDropdown) {
      setMobileMenuOpen(false);
    }
  }, []);

  // Dynamic classes for the header based on scroll state
  const headerClasses = `w-full z-10 transition-all duration-300 ${
    isScrolled 
      ? 'fixed top-0 bg-white ' 
      : 'absolute bg-transparent'
  }`;

  return (
    <header className={headerClasses}>
      {/* Desktop Header - only for laptop and up */}
      <div className="hidden lg:flex">
        {/* Logo Area - Left side */}
        <div className={`flex items-center h-20 pl-8 pr-12 ${isScrolled ? 'bg-white' : 'bg-transparent'}`}>
          <Link to="/" className="flex items-center">
            <img src={ethLogo} alt="Etherean Life" className="h-12 w-auto" />
          </Link>
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
                <li key={item.name} className="mx-3">
                  <Link
                    to={item.path}
                    className="text-gray-800 hover:text-gray-600 transition-colors duration-200 font-medium flex items-center py-2 px-1 text-lg font-medium"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
              <li className="mx-3 ml-6">
                <Link
                  to="/login"
                  className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200 font-medium text-lg"
                >
                  Login
                </Link>
              </li>
              <li className="ml-6">
                <button className="bg-yellow-500 rounded-full p-3 text-white hover:bg-yellow-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile/Tablet Header */}
      <div className={`lg:hidden flex justify-between items-center h-16 px-4 ${isScrolled ? 'bg-white' : 'bg-transparent'}`}>
        <Link to="/" className="flex items-center z-10">
          <img src={ethLogo} alt="Etherean Life" className="h-10 w-auto" />
        </Link>
        
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

      {/* Mobile/Tablet Menu */}
      <div 
        id="mobile-menu"
        className={`lg:hidden fixed right-0 top-0 h-screen w-64 bg-gray-900 text-white z-50 overflow-y-auto transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)' }}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button 
            onClick={toggleMobileMenu}
            aria-label="Close Menu"
            className="text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Logo */}
        <div className="px-6 py-4 flex items-center">
          <img src={ethLogo} alt="Etherean Life" className="h-8 w-auto" />
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
                    onClick={() => handleMobileMenuItemClick(item.hasDropdown)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && (
                    <button 
                      onClick={() => toggleExpand(item.name)}
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
                
                {/* Dropdown content - would need to be populated with actual submenu items */}
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
                      <li>
                        <Link 
                          to={`${item.path}/sub-1`} 
                          className="text-gray-300 hover:text-yellow-500 block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Submenu Item 1
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to={`${item.path}/sub-2`} 
                          className="text-gray-300 hover:text-yellow-500 block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Submenu Item 2
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ))}
            
            {/* Login Link */}
            <li className="border-b border-gray-700 py-3">
              <Link
                to="/login"
                className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Contact Info Section */}
        <div className="mt-8 px-4">
          <h3 className="font-medium text-white mb-4">Contact Info</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-300 text-sm">P.O. Box AN 8452, Accra-North</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-300 text-sm">info@ethereanlife.com</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-300 text-sm">(+233) 302 230702</span>
            </li>
          </ul>
        </div>
        
        {/* Social Media Icons */}
        <div className="mt-6 px-4 flex space-x-4">
          {socialIcons.map((social) => (
            <a 
              key={social.name}
              href={`#${social.name}`} 
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-yellow-500 transition-colors"
              aria-label={`Follow us on ${social.name}`}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
      
      {/* Dark overlay when mobile menu is open */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black z-40 ${mobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMobileMenu}
        style={{ 
          transition: 'opacity 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86)'
        }}
      ></div>
    </header>
  );
};

// Apply memoization to prevent unnecessary re-renders
export default memo(Header);