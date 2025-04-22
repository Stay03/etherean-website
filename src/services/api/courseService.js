/**
 * Course Service
 * Centralizes all course-related API calls
 */

import apiClient from './client';
import endpoints from './endpoints';

/**
 * Get a list of courses with optional filtering
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.platform - Filter by platform (el, ch, el,ch)
 * @param {boolean} params.is_online - Filter by online status
 * @param {string} params.display_page - Type of display
 * @param {string} params.search - Search term
 * @param {string} params.sort_by - Sort order
 * @param {number} params.per_page - Number of results per page
 * @param {number} params.page - Page number
 * @param {number} params.price - Filter by price (0 for free courses)
 * @returns {Promise} - Promise resolving to course data
 */
const getCourses = (params = {}) => {
  return apiClient.get(endpoints.courses.list, params);
};

/**
 * Get a specific course by ID
 * 
 * @param {number} id - Course ID
 * @returns {Promise} - Promise resolving to course data
 */
const getCourseById = (id) => {
  return apiClient.get(endpoints.courses.get(id));
};

/**
 * Get a specific course by slug
 * 
 * @param {string} slug - Course slug
 * @param {boolean} detailed - Whether to include detailed course data
 * @returns {Promise} - Promise resolving to course data
 */
const getCourseBySlug = (slug, detailed = false) => {
  return apiClient.get(endpoints.courses.getBySlug(slug), { detailed });
};

/**
 * Get free courses (price = 0)
 * 
 * @param {Object} params - Additional filter parameters
 * @param {number} params.limit - Number of courses to fetch (default: 4)
 * @returns {Promise} - Promise resolving to free courses
 */
const getFreeCourses = (params = {}) => {
  const defaultParams = {
    price: 0,
    per_page: params.limit || 4,
    page: 1,
    is_online: true,
    visibility: 1,
    platform: 'el',
    sort_by: 'created_at'
  };
  
  return apiClient.get(endpoints.courses.list, { ...defaultParams, ...params });
};

/**
 * Create a new course (protected endpoint)
 * 
 * @param {Object} data - Course data
 * @returns {Promise} - Promise resolving to created course
 */
const createCourse = (data) => {
  return apiClient.post(endpoints.courses.list, data);
};

/**
 * Update an existing course (protected endpoint)
 * 
 * @param {number} id - Course ID
 * @param {Object} data - Updated course data
 * @returns {Promise} - Promise resolving to updated course
 */
const updateCourse = (id, data) => {
  return apiClient.put(endpoints.courses.get(id), data);
};

/**
 * Delete a course (protected endpoint)
 * 
 * @param {number} id - Course ID
 * @returns {Promise} - Promise resolving to success message
 */
const deleteCourse = (id) => {
  return apiClient.delete(endpoints.courses.get(id));
};

const courseService = {
  getCourses,
  getCourseById,
  getCourseBySlug,
  getFreeCourses, // New method for free courses
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseService;