import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseHeader from '../components/courses/CourseHeader';
import CourseDescription from '../components/courses/CourseDescription';
import CourseSections from '../components/courses/CourseSections';
import CourseInfoTabs from '../components/courses/CourseInfoTabs';
import EnrollButton from '../components/courses/EnrollButton';
import useCourseDetail from '../hooks/useCourseDetail';
import { useAuth } from '../contexts/AuthContext';

/**
 * CourseDetailPage Component
 * Displays detailed information about a specific course
 */
const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Fetch course details using custom hook
  const { 
    course, 
    hasAccess,
    isLoading, 
    error, 
    refetch 
  } = useCourseDetail(slug);

  // Redirect to courses page if slug is missing
  useEffect(() => {
    if (!slug) {
      navigate('/courses');
    }
  }, [slug, navigate]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 h-96 bg-gray-200 rounded-lg"></div>
            <div className="w-full md:w-1/3 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
          
          {/* Description skeleton */}
          <div className="mt-10 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Sections skeleton */}
          <div className="mt-10 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
            <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              {error.status === 404 ? 'Course not found' : 'Unable to load course'}
            </h3>
            <p className="text-red-700 mb-4">
              {error.message || 'An unexpected error occurred. Please try again later.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={refetch}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle course not found or invalid data
  if (!course || !course.product_info) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
            <svg className="h-12 w-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Course Not Found</h3>
            <p className="text-yellow-700 mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-20 pb-20">
      
      {/* Course Header Section */}
      <CourseHeader course={course} hasAccess={hasAccess} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Information Tabs */}
            <CourseInfoTabs
              overview={<CourseDescription description={course.product_info.description} />}
              curriculum={<CourseSections sections={course.sections} />}
            />
          </div>
          
          {/* Sidebar - Can include related courses, instructor info, etc. */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Course Information</h3>
              
              {/* Course Details */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="text-gray-900 font-medium">{course.product_info.platform}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections</span>
                  <span className="text-gray-900 font-medium">{course.sections?.length || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="text-gray-900 font-medium">
                    {course.sections?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress Tracking</span>
                  <span className="text-gray-900 font-medium">
                    {course.progression_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                {hasAccess && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access Status</span>
                    <span className="text-green-600 font-medium">
                      Active
                    </span>
                  </div>
                )}
              </div>
              
              {/* Enrollment CTA */}
              <div className="mt-6 space-y-3">
                <EnrollButton 
                  course={course}
                  hasAccess={hasAccess}
                  onBuyNow={(course) => console.log('Buy now:', course)}
                />
                
                {!hasAccess && parseFloat(course.product_info.price) > 0 && (
                  <>
                    <EnrollButton 
                      course={course}
                      hasAccess={hasAccess}
                      isAddToCart={true}
                      onAddToCart={(course) => console.log('Add to cart:', course)}
                    />
                    
                    {/* Helper text to explain button differences */}
                    <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-xs text-blue-800 flex items-start">
                        <svg className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          <strong>Buy Now</strong> proceeds directly to checkout, while <strong>Add to Cart</strong> allows you to continue shopping and checkout later.
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;