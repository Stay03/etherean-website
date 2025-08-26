import React, { useState, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FreeCourseList from '../components/courses/FreeCourseList';
import CourseFilters from '../components/courses/CourseFilters';
import CourseSearch from '../components/courses/CourseSearch';
import Breadcrumb from '../components/Breadcrumb';
import useCourses from '../hooks/useCourses';
import { progress } from 'framer-motion';

/**
 * CoursesPage Component
 * Main page that displays courses with filtering and search capabilities
 */
const CoursesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Extract filter values from URL or use defaults
  const initialFilters = {
    platform: queryParams.get('platform') || 'el',
    is_online: queryParams.get('is_online') !== 'false',
    visibility : queryParams.get('visibility') || '1',
    sort_by: queryParams.get('sort_by') || 'newest',
    search: queryParams.get('search') || '',
    page: 1,
    per_page: 999, // Load all free courses
    price: 0,
    display_page: 'home'
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Free Courses', path: '/free-courses' }
  ];

  // State for filters
  const [filters, setFilters] = useState(initialFilters);

  // Use custom hook to fetch courses data
  const { 
    courses, 
    pagination, 
    isLoading, 
    error, 
    refetch 
  } = useCourses(filters);

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && key !== 'display_page') {
        params.set(key, value);
      }
    });
    
    navigate({ search: params.toString() });
  };

  // Handle search submission
  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };


  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
  items={breadcrumbItems} 
  onNavigate={(path) => navigate(path)} 
/>
      {/* Page Header
      <div className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-lg text-gray-600">
            Discover our wide range of courses designed to help you grow and develop
          </p>
        </div>
      </div> */}
      
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FreeCourseList 
          courses={courses} 
          isLoading={isLoading} 
          error={error} 
          onRetry={refetch}
        />
      </div>
    </div>
  );
};

export default memo(CoursesPage);