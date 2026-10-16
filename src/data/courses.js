import { wildlifeEcologyCourse } from './wildlifeEcology/course.js';
import { wildlifeEcologyQuestions } from './wildlifeEcology/questions.js';

/**
 * Central Course Registry
 * 
 * To add a new subject (e.g. DBMS, Operating Systems, Computer Networks, Mathematics):
 * 1. Create a subject folder under `src/data/<subjectFolder>/`
 * 2. Define course metadata in `course.js` (weeks count, planned questions, title, description, slug)
 * 3. Define questions in `questions.js`
 * 4. Register the course in this `COURSES_REGISTRY` array.
 * 
 * The entire platform (Home, All Subjects, Subject Overview, Weekly Quizzes, Combined Quiz, Results)
 * adapts dynamically to any registered course without rewriting any UI components!
 */

export const COURSES_REGISTRY = [
  {
    ...wildlifeEcologyCourse,
    // Provide reference to its question data source
    getQuestionsForWeek: (weekNum) => wildlifeEcologyQuestions[weekNum] || [],
    getAllQuestionsMap: () => wildlifeEcologyQuestions
  }
];

export function getAllCourses() {
  return COURSES_REGISTRY;
}

export function getCourseBySlug(slug) {
  if (!slug) return null;
  return COURSES_REGISTRY.find(c => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function getCourseById(id) {
  if (!id) return null;
  return COURSES_REGISTRY.find(c => c.id === id) || null;
}
