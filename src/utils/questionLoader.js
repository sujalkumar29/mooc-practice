import { normalizeQuestion, validateQuestion } from './questionValidation.js';

/**
 * Question loader utility for MOOC Practice
 * Dynamically aggregates weekly and combined quiz data without redundancy.
 */

export function getWeeklyQuestions(course, weekNumber) {
  if (!course || typeof course.getQuestionsForWeek !== 'function') {
    return [];
  }

  const rawQuestions = course.getQuestionsForWeek(Number(weekNumber)) || [];
  return rawQuestions
    .filter(q => validateQuestion(q).isValid)
    .map(q => normalizeQuestion(q, course.id, Number(weekNumber)));
}

/**
 * Generates the combined quiz questions dynamically from all weekly questions of the course.
 * Guarantees no duplicate question bank is stored.
 */
export function getCombinedQuestions(course) {
  if (!course || typeof course.getAllQuestionsMap !== 'function') {
    return [];
  }

  const questionsMap = course.getAllQuestionsMap();
  const aggregated = [];

  // Sort weeks numerically
  const weekKeys = Object.keys(questionsMap)
    .map(k => Number(k))
    .sort((a, b) => a - b);

  for (const weekNum of weekKeys) {
    const weekQuestions = questionsMap[weekNum] || [];
    for (const raw of weekQuestions) {
      if (validateQuestion(raw).isValid) {
        aggregated.push(normalizeQuestion(raw, course.id, weekNum));
      }
    }
  }

  return aggregated;
}

/**
 * Computes live statistics for a course
 */
export function getCourseStatistics(course) {
  if (!course) {
    return {
      availableQuestions: 0,
      totalPlannedQuestions: 0,
      completedWeeks: 0,
      totalWeeks: 0,
      isFullyPopulated: false,
      weekDetails: []
    };
  }

  const totalWeeks = course.weeks?.length || course.totalWeeks || 0;
  let totalAvailable = 0;
  let plannedTotal = 0;
  let completeWeeksCount = 0;

  const weekDetails = (course.weeks || []).map(week => {
    const rawQuestions = course.getQuestionsForWeek ? course.getQuestionsForWeek(week.weekNumber) : [];
    const validQuestions = rawQuestions.filter(q => validateQuestion(q).isValid);
    const availableCount = validQuestions.length;
    const plannedCount = week.plannedQuestions || course.plannedQuestionsPerWeek || 10;

    totalAvailable += availableCount;
    plannedTotal += plannedCount;

    const isReady = availableCount > 0;
    const isComplete = availableCount >= plannedCount;
    if (isComplete) completeWeeksCount++;

    return {
      weekNumber: week.weekNumber,
      title: week.title,
      topics: week.topics || [],
      plannedQuestions: plannedCount,
      availableQuestions: availableCount,
      isReady,
      isComplete,
      status: availableCount === 0 
        ? 'Pending Questions' 
        : (availableCount < plannedCount ? 'Partially Populated' : 'Ready for Practice')
    };
  });

  const totalPlannedQuestions = course.totalPlannedQuestions || plannedTotal;
  const isFullyPopulated = totalAvailable > 0 && totalAvailable >= totalPlannedQuestions;

  return {
    availableQuestions: totalAvailable,
    totalPlannedQuestions,
    completedWeeks: completeWeeksCount,
    totalWeeks,
    isFullyPopulated,
    weekDetails
  };
}

export function getWeekMetadata(course, weekNumber) {
  if (!course || !course.weeks) return null;
  const num = Number(weekNumber);
  return course.weeks.find(w => w.weekNumber === num) || null;
}
