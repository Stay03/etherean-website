import { useMemo } from 'react';

/**
 * Custom hook to manage course progression logic
 * Determines which sections and lessons are available based on completion status
 * 
 * @param {Object} course - Course data object
 * @returns {Object} - Object containing progression status information
 */
const useProgressionStatus = (course) => {
  // Calculate available sections and lessons based on progression rules
  const { availableSections, availableLessons, nextLesson } = useMemo(() => {
    if (!course) {
      return { availableSections: [], availableLessons: [], nextLesson: null };
    }
    
    // Check if progression is enabled for this course
    const progressionEnabled = course.progression_enabled === "1" || course.progression_enabled === 1;
    
    // If progression is not enabled, all sections and lessons are available
    if (!progressionEnabled) {
      // All sections are available
      const allSections = course.sections || [];
      
      // All lessons are available
      const allLessons = allSections.flatMap(section => 
        (section.lessons || []).map(lesson => ({
          ...lesson,
          sectionId: section.id,
          sectionTitle: section.title
        }))
      );
      
      return { 
        availableSections: allSections, 
        availableLessons: allLessons,
        nextLesson: null // No "next lesson" concept if all are available
      };
    }
    
    // Helper function to check if all quizzes for a lesson are complete
    const areAllQuizzesComplete = (lesson) => {
      if (!lesson.quizzes || lesson.quizzes.length === 0) {
        // No quizzes to complete
        return true;
      }
      
      // Check if all quizzes are marked as complete
      return lesson.quizzes.every(quiz => quiz.complete === true);
    };
    
    // Helper function to check if a lesson is fully complete (both lesson and all quizzes)
    const isLessonFullyComplete = (lesson) => {
      return lesson.complete && areAllQuizzesComplete(lesson);
    };
    
    // Helper function to check if a section is truly complete
    // This handles the backend bug where section.complete might be false even when progression is 100%
    const isSectionTrulyComplete = (section) => {
      // If the section is explicitly marked complete, it's complete
      if (section.complete) return true;
      
      // Check if section progression indicates completion
      if (section.progression && section.progression.overall_percentage === 100) {
        return true;
      }
      
      // Fallback: check if all lessons in the section are complete
      if (section.lessons && section.lessons.length > 0) {
        return section.lessons.every(lesson => isLessonFullyComplete(lesson));
      }
      
      return false;
    };
    
    // Progression is enabled - implement progression logic
    const availableSections = [];
    const availableLessons = [];
    let nextLesson = null;
    let foundIncomplete = false;
    
    // Process sections in order
    (course.sections || []).forEach((section, sectionIndex) => {
      // First section is always available
      const isSectionAvailable = sectionIndex === 0 || isSectionTrulyComplete(section) || 
        // Previous section is complete?
        (sectionIndex > 0 && isSectionTrulyComplete(course.sections[sectionIndex - 1]));
      
      if (isSectionAvailable) {
        // Add section to available sections
        availableSections.push(section);
        
        // Process lessons in this section
        (section.lessons || []).forEach((lesson, lessonIndex) => {
          // Determine if lesson is available
          const isLessonAvailable = 
            // First lesson in first section is always available
            (sectionIndex === 0 && lessonIndex === 0) || 
            // Lesson is already complete
            lesson.complete ||
            // Previous lesson in same section is fully complete (lesson + quizzes)
            (lessonIndex > 0 && isLessonFullyComplete(section.lessons[lessonIndex - 1])) ||
            // First lesson in section and previous section is complete
            (lessonIndex === 0 && sectionIndex > 0 && isSectionTrulyComplete(course.sections[sectionIndex - 1]));
          
          if (isLessonAvailable) {
            availableLessons.push({
              ...lesson,
              sectionId: section.id,
              sectionTitle: section.title
            });
            
            // If this lesson is not fully complete and we haven't found an incomplete lesson yet,
            // this is the next lesson the user should take
            if (!isLessonFullyComplete(lesson) && !foundIncomplete) {
              nextLesson = {
                ...lesson,
                sectionId: section.id,
                sectionTitle: section.title,
                section: section
              };
              foundIncomplete = true;
            }
          }
        });
      }
    });
    
    // Prioritize next_item from API if available, as it's more accurate
    if (course.next_item) {
      const { next_item } = course;
      
      if (next_item.type === 'lesson') {
        // Find the section that contains this lesson
        const section = course.sections.find(s => s.id === next_item.section_id);
        
        if (section) {
          // Find the lesson within the section
          const lesson = section.lessons.find(l => l.id === next_item.id);
          
          if (lesson) {
            // Override the locally computed nextLesson with API's recommendation
            nextLesson = {
              ...lesson,
              sectionId: section.id,
              sectionTitle: section.title,
              section: section
            };
            
            // Ensure this lesson is marked as available if the API says it's next
            const lessonAlreadyAvailable = availableLessons.some(l => l.id === lesson.id);
            if (!lessonAlreadyAvailable) {
              availableLessons.push({
                ...lesson,
                sectionId: section.id,
                sectionTitle: section.title
              });
            }
            
            // Also ensure the section containing this lesson is available
            const sectionAlreadyAvailable = availableSections.some(s => s.id === section.id);
            if (!sectionAlreadyAvailable) {
              availableSections.push(section);
            }
          }
        }
      } else if (next_item.type === 'section_quiz' || next_item.type === 'quiz') {
        // Find the section that contains this quiz
        const section = course.sections.find(s => s.id === next_item.section_id);
        
        if (section) {
          // Find the quiz within the section
          const quiz = section.quizzes && section.quizzes.find(q => q.id === next_item.id);
          
          if (quiz) {
            // Override the locally computed nextLesson with API's recommendation for quiz
            nextLesson = {
              ...next_item, // This includes the quiz details
              sectionId: section.id,
              sectionTitle: section.title,
              section: section,
              isQuiz: true // Flag to indicate this is a quiz
            };
            
            // Also ensure the section containing this quiz is available
            const sectionAlreadyAvailable = availableSections.some(s => s.id === section.id);
            if (!sectionAlreadyAvailable) {
              availableSections.push(section);
            }
          }
        }
      }
    }
    
    return { availableSections, availableLessons, nextLesson };
  }, [course]);
  
  // Helper function to check if a specific lesson is available
  const isLessonAvailable = (lessonId) => {
    return availableLessons.some(lesson => lesson.id === lessonId);
  };
  
  // Helper function to check if a specific section is available
  const isSectionAvailable = (sectionId) => {
    return availableSections.some(section => section.id === sectionId);
  };
  
  // Get the overall progression data if available
  const courseProgress = course?.progression || {
    total_sections: 0,
    completed_sections: 0,
    sections_percentage: 0,
    total_lessons: 0,
    completed_lessons: 0, 
    lessons_percentage: 0,
    total_quizzes: 0,
    completed_quizzes: 0,
    quizzes_percentage: 0,
    overall_percentage: 0
  };
  
  // Return progression status information
  return {
    availableSections,
    availableLessons,
    nextLesson,
    isLessonAvailable,
    isSectionAvailable,
    progressionEnabled: course ? (course.progression_enabled === "1" || course.progression_enabled === 1) : false,
    courseProgress
  };
};

export default useProgressionStatus;