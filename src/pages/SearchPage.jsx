import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import CoursesResults from '../components/search/CoursesResults';
import ProductsResults from '../components/search/ProductsResults';
import EventsResults from '../components/search/EventsResults';
import Breadcrumb from '../components/Breadcrumb';

// Loading fallback component (can be shared or defined locally if specific style needed)
const SectionLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // The submitted search query

  // Effect to parse URL query 'q' on load and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setInputValue(q);
      setSearchQuery(q);
    } else {
      // If no 'q' param, clear previous search query
      setInputValue('');
      setSearchQuery('');
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };



  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    } else {
      // If search is cleared, navigate to base search page, which clears results
      navigate('/search');
    }
  };
  
  const handleGoBack = () => {
    navigate(-1); // Go to the previous page
  };

    // Memoized breadcrumb items
    const breadcrumbItems = useMemo(() => [
        { label: 'Home', path: '/' },
        { label: 'Search', path: '/search' },
    ], []);

    

  return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} onNavigate={(path) => navigate(path)} />
      <div className="max-w-4xl mx-auto">
       

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center my-8 bg-white p-2 rounded-lg shadow">
          <input
            type="search"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for courses, products, events..."
            className="w-full px-4 py-3 border-0 focus:ring-2 focus:ring-yellow-500 rounded-md text-gray-700"
            aria-label="Search query"
          />
          <button
            type="submit"
            className="ml-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Results Area */}
        {!searchQuery && (
          <div className="text-center text-gray-600 py-10">
            <p className="text-lg">Please enter a term to search.</p>
          </div>
        )}

        {searchQuery && (
          <div className="space-y-12">
            {/* Courses Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Courses</h2>
                <Link to="/courses" className="text-sm text-yellow-600 hover:underline">View all courses</Link>
              </div>
              <CoursesResults searchQuery={searchQuery} />
            </section>

            {/* Products Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Products</h2>
                <Link to="/shop" className="text-sm text-yellow-600 hover:underline">View all products</Link>
              </div>
              <ProductsResults searchQuery={searchQuery} />
            </section>
            
            {/* Events Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">Events</h2>
                <Link to="/events" className="text-sm text-yellow-600 hover:underline">View all events</Link>
              </div>
              <EventsResults searchQuery={searchQuery} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;