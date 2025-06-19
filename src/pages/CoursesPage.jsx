import React, { useState, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CourseList from '../components/courses/CourseList';
import CourseFilters from '../components/courses/CourseFilters';
import CourseSearch from '../components/courses/CourseSearch';
import Breadcrumb from '../components/Breadcrumb';
import useCourses from '../hooks/useCourses';

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
    sort_by: queryParams.get('sort_by') || 'price-desc',
    search: queryParams.get('search') || '',
    page: parseInt(queryParams.get('page') || '1', 10),
    per_page: parseInt(queryParams.get('per_page') || '12', 10),
    price : "> 1",
    display_page: 'home'
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' }
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
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
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

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    
    // Update URL with new page
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate({ search: params.toString() });
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
      
      {/* Filters and Search Section */}
      <div className="w-full bg-gray-50 py-6 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CourseSearch 
              initialValue={filters.search} 
              onSearch={handleSearch} 
            />
            {/* <CourseFilters 
              filters={filters} 
              onChange={updateFilters} 
            /> */}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-[90rem] mx-auto  py-8">
        <CourseList 
          courses={courses} 
          isLoading={isLoading} 
          error={error} 
          pagination={pagination}
          onPageChange={handlePageChange}
          onRetry={refetch}
        />
      </div>
    </div>
  );
};

export default memo(CoursesPage);