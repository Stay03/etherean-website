import React, { useState } from 'react';

/**
 * CourseSections Component
 * Displays course sections and lessons in an accordion format
 * 
 * @param {Array} sections - Array of course section objects
 */
const CourseSections = ({ sections = [] }) => {
  const [expandedSections, setExpandedSections] = useState(new Set([0])); // First section expanded by default
  
  // Toggle section expanded state
  const toggleSection = (sectionIndex) => {
    setExpandedSections(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(sectionIndex)) {
        newSet.delete(sectionIndex);
      } else {
        newSet.add(sectionIndex);
      }
      return newSet;
    });
  };
  
  // Calculate total lessons
  const totalLessons = sections.reduce((total, section) => {
    return total + (section.lessons?.length || 0);
  }, 0);

  // Handle empty sections
  if (!sections || sections.length === 0) {
    return (
      <div className="py-4 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">No curriculum sections available for this course yet.</p>
      </div>
    );
  }

  return (
    <div className="course-sections">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
        <div className="text-sm text-gray-600">
          {sections.length} {sections.length === 1 ? 'Section' : 'Sections'} • 
          {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
        </div>
      </div>
      
      <div className="border rounded-lg divide-y">
        {sections.map((section, index) => (
          <div key={section.id || index} className="course-section">
            {/* Section Header - Clickable */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(index)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${expandedSections.has(index) ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                  {expandedSections.has(index) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h3 className="font-medium text-gray-900">{section.title}</h3>
              </div>
              <div className="text-sm text-gray-600">
                {section.lessons?.length || 0} {(section.lessons?.length || 0) === 1 ? 'Lesson' : 'Lessons'}
              </div>
            </div>
            
            {/* Section Lessons - Collapsible */}
            {expandedSections.has(index) && section.lessons && section.lessons.length > 0 && (
              <div className="bg-gray-50 px-4 py-2">
                <ul className="divide-y divide-gray-200">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <li key={lesson.id || lessonIndex} className="py-3 px-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">{lesson.title}</span>
                        </div>
                        <button 
                          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Empty lessons message */}
            {expandedSections.has(index) && (!section.lessons || section.lessons.length === 0) && (
              <div className="bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">No lessons available in this section yet.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSections;