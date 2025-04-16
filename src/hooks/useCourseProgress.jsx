import { useState, useEffect, useCallback } from 'react';
import progressService from '../services/api/progressService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to manage course progress
 * 
 * @param {number} courseId - ID of the course
 * @returns {Object} - Methods and data for tracking course progress
 */
const useCourseProgress = (courseId) => {
  const [progressData, setProgressData] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load progress data
  const loadProgressData = useCallback(async () => {
    if (!courseId || !isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await progressService.getCourseProgress(courseId);
      
      setProgressData(response.progress);
      
      // Extract completed lesson IDs
      if (response.progress && response.progress.completed_lessons) {
        setCompletedLessons(response.progress.completed_lessons.map(lesson => lesson.lesson_id));
      }
      
      // Determine current lesson
      if (response.progress && response.progress.current_lesson) {
        setCurrentLessonId(response.progress.current_lesson.lesson_id);
      }
      
    } catch (err) {
      console.error('Failed to load progress data:', err);
      setError({
        message: err.message || 'Failed to load progress data',
        status: err.status
      });
    } finally {
      setIsLoading(false);
    }
  }, [courseId, isAuthenticated]);

  // Start tracking a lesson
  const startLesson = async (lessonId) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await progressService.startLesson(lessonId);
      setCurrentLessonId(lessonId);
      
      // Update progress data
      await loadProgressData();
      
      return response;
    } catch (err) {
      console.error('Failed to start lesson:', err);
      setError({
        message: err.message || 'Failed to start lesson',
        status: err.status
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a lesson as completed
  const completeLesson = async (lessonId) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await progressService.completeLesson(lessonId);
      
      // Update completed lessons
      setCompletedLessons(prev => [...prev, lessonId]);
      
      // Reload progress data
      await loadProgressData();
      
      return response;
    } catch (err) {
      console.error('Failed to complete lesson:', err);
      setError({
        message: err.message || 'Failed to complete lesson',
        status: err.status
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a lesson is completed
  const isLessonCompleted = useCallback((lessonId) => {
    return completedLessons.includes(lessonId);
  }, [completedLessons]);

  // Check if a lesson is accessible (based on progression rules)
  const isLessonAccessible = useCallback((lessonId, progressionEnabled, course) => {
    // If progression is not enabled, all lessons are accessible
    if (!progressionEnabled) return true;
    
    // If the lesson is already completed, it's accessible
    if (isLessonCompleted(lessonId)) return true;
    
    // If there's no progress data yet, only the first lesson is accessible
    if (!progressData) {
      // Find the first lesson in the course
      const firstSection = course.sections[0];
      const firstLesson = firstSection && firstSection.lessons && firstSection.lessons[0];
      
      return firstLesson && firstLesson.id === lessonId;
    }
    
    // If this is the current lesson being worked on, it's accessible
    if (currentLessonId === lessonId) return true;
    
    // For progression-enabled courses, we need to check if previous lessons are completed
    // Find the position of this lesson in the course
    let lessonPosition = -1;
    let currentPosition = -1;
    
    let flatLessons = [];
    
    // Flatten the course structure to get an ordered list of lessons
    course.sections.forEach(section => {
      if (section.lessons && Array.isArray(section.lessons)) {
        flatLessons = [...flatLessons, ...section.lessons];
      }
    });
    
    // Find the positions
    flatLessons.forEach((lesson, index) => {
      if (lesson.id === lessonId) {
        lessonPosition = index;
      }
      if (lesson.id === currentLessonId) {
        currentPosition = index;
      }
    });
    
    // If we couldn't find the positions, deny access
    if (lessonPosition === -1 || currentPosition === -1) return false;
    
    // The user can only access the current lesson or the next one (if current is completed)
    return lessonPosition <= currentPosition + 1;
  }, [progressData, completedLessons, currentLessonId, isLessonCompleted]);

  // Load progress data when courseId changes
  useEffect(() => {
    if (courseId) {
      loadProgressData();
    }
  }, [courseId]); // Only depend on courseId, not the function itself

  return {
    progressData,
    completedLessons,
    currentLessonId,
    isLoading,
    error,
    startLesson,
    completeLesson,
    isLessonCompleted,
    isLessonAccessible,
    loadProgressData
  };
};

export default useCourseProgress;