import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useCourses from '../../hooks/useCourses';
import SearchResultCard from './SearchResultCard';
import { Link } from 'react-router-dom';

const SectionLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const CoursesResults = ({ searchQuery }) => {
  const filters = useMemo(() => ({
    search: searchQuery,
    visibility: '1',
    platform: 'el', // Adjust as needed, or make it a prop
    per_page: 3, // Show a few results initially
    page: 1,
    // No price filter for general search
  }), [searchQuery]);

  const { courses, isLoading, error, pagination } = useCourses(filters);

  if (isLoading) return <SectionLoader />;
  if (error) return <p className="text-red-500">Error loading courses: {error.message}</p>;
  if (!courses || courses.length === 0) {
    return <p className="text-gray-600">No courses found matching "{searchQuery}".</p>;
  }

  return (
    <div className="space-y-4">
      {courses.map(course => (
        <SearchResultCard key={`course-${course.id}`} item={course} type="course" />
      ))}
      {pagination && pagination.total > courses.length && (
         <Link 
            to={`/courses?search=${encodeURIComponent(searchQuery)}`}
            className="inline-block mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
        >
            View all {pagination.total} courses
        </Link>
      )}
    </div>
  );
};

CoursesResults.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};

export default CoursesResults;