
import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';


/**
 * AboutPage Component
 * Displays about information in tabbed sections
 */
const BlankPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('about-us');
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' }
  ];




  return (
    <div className="min-h-screen bg-gray-50">
        
     
      

  

    </div>
  );
};

export default BlankPage;