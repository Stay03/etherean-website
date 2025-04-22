import React, { useState, useMemo } from 'react';
import useEvents from '../hooks/useEvents';
import EventsGrid from '../components/events/EventsGrid';
// import EventsFilters from '../components/events/EventsFilters';
import EventsSorting from '../components/events/EventsSorting';
import EventsPagination from '../components/events/EventsPagination';
import Breadcrumb from '../components/Breadcrumb';

/**
 * EventsPage Component
 * Displays all events with filtering, sorting, and pagination
 */
const EventsPage = () => {
  // State for filters and sorting
  const [filters, setFilters] = useState({
    eventType: 'all', // all, online, in-person
    dateRange: 'all', // all, upcoming, past
    status: 'all', // all, upcoming, past, ongoing
  });
  
  const [sortBy, setSortBy] = useState({
    field: 'start_date',
    direction: 'desc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      platform: 'EL',
      page: currentPage,
      perPage: 12,
      orderBy: sortBy.field,
      orderDir: sortBy.direction,
    };
    
    // Apply filters
    if (filters.eventType === 'online') {
      params.is_online = 1;
    } else if (filters.eventType === 'in-person') {
      params.is_online = 0;
    }
    
    if (filters.status !== 'all') {
      params.status = filters.status;
    }
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    return params;
  }, [filters, sortBy, currentPage, searchQuery]);
  
  // Fetch events using custom hook
  const { events, pagination, isLoading, error } = useEvents(queryParams);

    // Breadcrumb items
    const breadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: 'Events', path: '/events' }
    ];
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle sort changes
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sort changes
  };
  
  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

      {/* Hero section */}
        {/* <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Events & Workshops
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Join our community events to learn, grow, and connect with like-minded individuals. 
              From online workshops to in-person retreats, we have something for everyone.
            </p>
          </div>
        </div> */}
        
        {/* Search bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-2.5 md:right-[52%]">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            {/* <aside className="w-full lg:w-64 flex-shrink-0">
              <EventsFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </aside> */}
            
            {/* Events grid and sorting */}
            <main className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {!isLoading && (
                    <span>
                      Showing {(currentPage - 1) * pagination.perPage + 1} - {Math.min(currentPage * pagination.perPage, pagination.totalItems)} of {pagination.totalItems} events
                    </span>
                  )}
                </div>
                
                <EventsSorting 
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              </div>
              
              {/* Events grid */}
              <EventsGrid 
                events={events}
                isLoading={isLoading}
                error={error}
              />
              
              {/* Pagination */}
              {!isLoading && events.length > 0 && (
                <EventsPagination 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          </div>
        </div>
      </div>
 
  );
};

export default EventsPage;