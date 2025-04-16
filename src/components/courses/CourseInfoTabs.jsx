import React, { useState } from 'react';

/**
 * CourseInfoTabs Component
 * Provides tabbed navigation between different course information sections
 * 
 * @param {React.ReactNode} overview - Course overview content
 * @param {React.ReactNode} curriculum - Course curriculum content
 * @param {React.ReactNode} instructor - Instructor information (optional)
 * @param {React.ReactNode} reviews - Course reviews (optional)
 */
const CourseInfoTabs = ({ overview, curriculum, instructor, reviews }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Define available tabs
  const tabs = [
    { id: 'overview', label: 'Overview', content: overview, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'curriculum', label: 'Curriculum', content: curriculum, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
  ];
  
  // Add optional tabs if content is provided
  if (instructor) {
    tabs.push({
      id: 'instructor',
      label: 'Instructor',
      content: instructor,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    });
  }
  
  if (reviews) {
    tabs.push({
      id: 'reviews',
      label: 'Reviews',
      content: reviews,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    });
  }
  
  // Set active tab
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Get active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="course-info-tabs mt-2">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="py-6">
        {activeTabContent}
      </div>
    </div>
  );
};

export default CourseInfoTabs;