import React, { useState } from 'react';
import LessonCard from './LessonCard';
import SectionQuizCard from './SectionQuizCard';

/**
 * LessonGrid Component
 * Displays all course lessons in a grid layout
 * Now with progression support and section grouping
 */
const LessonGrid = ({ 
  sections, 
  onLessonSelect,
  onSectionQuizSelect,
  availableLessons = [],
  progressionEnabled = false 
}) => {
  const [filterSection, setFilterSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get filtered and searched lessons and section quizzes grouped by section
  const getGroupedItems = () => {
    // Start with all sections
    let filteredSections = sections;
    
    // Filter by section if needed
    if (filterSection !== 'all') {
      filteredSections = sections.filter(section => section.id.toString() === filterSection);
    }
    
    // Build grouped items by section
    const groupedItems = filteredSections.map(section => {
      // Filter lessons by search term if provided
      let sectionLessons = section.lessons || [];
      let sectionQuizzes = section.quizzes || [];
      
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        sectionLessons = sectionLessons.filter(lesson => 
          lesson.title.toLowerCase().includes(term) || 
          lesson.description?.toLowerCase().includes(term)
        );
        sectionQuizzes = sectionQuizzes.filter(quiz => 
          quiz.title.toLowerCase().includes(term) || 
          quiz.description?.toLowerCase().includes(term)
        );
      }
      
      // Build lessons with section info and availability status
      const lessonsWithSections = sectionLessons.map(lesson => ({
        ...lesson,
        sectionTitle: section.title,
        sectionId: section.id,
        section: section,
        itemType: 'lesson',
        // Check if lesson is available based on progression
        isAvailable: !progressionEnabled || availableLessons.some(l => l.id === lesson.id)
      }));
      
      // Build section quizzes with section info
      const sectionQuizzesWithSections = sectionQuizzes.map(quiz => ({
        ...quiz,
        sectionTitle: section.title,
        sectionId: section.id,
        section: section,
        itemType: 'section_quiz',
        // Section quizzes are always available (no progression restrictions for now)
        isAvailable: true
      }));
      
      return {
        section,
        lessons: lessonsWithSections,
        quizzes: sectionQuizzesWithSections,
        items: [...lessonsWithSections, ...sectionQuizzesWithSections]
      };
    });
    
    return groupedItems;
  };
  
  const groupedItems = getGroupedItems();
  
  // Flatten items for summary count when not grouping by section
  const allItems = groupedItems.flatMap(group => group.items);
  
  return (
    <div>
      
    
      {/* Filters and search */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="section-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Section
          </label>
          <select
            id="section-filter"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
          >
            <option value="all">All Sections</option>
            {sections.map(section => (
              <option key={section.id} value={section.id.toString()}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label htmlFor="lesson-search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Lessons
          </label>
          <div className="relative">
            <input
              id="lesson-search"
              type="text"
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {allItems.length} items 
        ({allItems.filter(item => item.itemType === 'lesson').length} lessons, {allItems.filter(item => item.itemType === 'section_quiz').length} section quizzes)
        {filterSection !== 'all' && ' in this section'}
        {searchTerm && ` matching "${searchTerm}"`}
        {progressionEnabled && ` (${allItems.filter(item => item.isAvailable).length} available, ${allItems.filter(item => !item.isAvailable).length} locked)`}
      </div>
      
      {/* Grouped layout by section */}
      {groupedItems.length > 0 ? (
        <div className="space-y-12">
          {groupedItems.map((group, groupIndex) => {
            // Skip empty sections
            if (group.items.length === 0) return null;
            
            return (
              <div key={`section-${group.section.id}`} className="space-y-6">
                {/* Section header */}
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-sm font-medium mr-3">
                      {groupIndex + 1}
                    </span>
                    {group.section.title}
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      {group.items.length} items
                    </span>
                  </h2>
                  {group.section.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {group.section.description}
                    </p>
                  )}
                </div>
                
                {/* Section items grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map(item => {
                    if (item.itemType === 'lesson') {
                      return (
                        <LessonCard
                          key={`lesson-${item.id}`}
                          lesson={item}
                          sectionTitle={item.sectionTitle}
                          onClick={() => onLessonSelect(item, item.section)}
                          isComplete={item.complete}
                          isAvailable={item.isAvailable}
                        />
                      );
                    } else if (item.itemType === 'section_quiz') {
                      return (
                        <SectionQuizCard
                          key={`quiz-${item.id}`}
                          quiz={item}
                          sectionTitle={item.sectionTitle}
                          onClick={() => onSectionQuizSelect && onSectionQuizSelect(item, item.section)}
                          isComplete={item.complete}
                          isAvailable={item.isAvailable}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No lessons or section quizzes match your current filters. Try changing your search or filter to find what you're looking for.
          </p>
          {(filterSection !== 'all' || searchTerm) && (
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={() => {
                  setFilterSection('all');
                  setSearchTerm('');
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonGrid;