import { getAllCourses, getCourseBySlug } from '../src/data/courses.js';
import { wildlifeEcologyCourse } from '../src/data/wildlifeEcology/course.js';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';
import { normalizeQuestion, validateQuestion, isAnswerKeyAvailable } from '../src/utils/questionValidation.js';
import { getWeeklyQuestions, getCombinedQuestions, getCourseStatistics } from '../src/utils/questionLoader.js';
import { evaluateQuizSubmission } from '../src/utils/quizScoring.js';

console.log('--- MOOC PRACTICE PLATFORM VERIFICATION TEST SUITE ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Course Registry Verification
console.log('\n[1] Verifying Course Registry & Multi-Subject Architecture');
const allCourses = getAllCourses();
assert(Array.isArray(allCourses) && allCourses.length >= 1, 'Courses registry returns non-empty array');
const weCourse = getCourseBySlug('wildlife-ecology');
assert(weCourse !== null, 'getCourseBySlug("wildlife-ecology") returns Wildlife Ecology course');
assert(weCourse.title === 'Wildlife Ecology', 'Course title is "Wildlife Ecology"');
assert(weCourse.totalWeeks === 13, 'Course configures exactly 13 weeks');
assert(weCourse.weeks.length === 13, 'weeks array contains 13 week objects (Week 0 to Week 12)');
assert(weCourse.weeks[0].weekNumber === 0, 'First week is Week 0');
assert(weCourse.weeks[12].weekNumber === 12, 'Last week is Week 12');

// 2. Question Bank Population Check (Weeks 0 to 12)
console.log('\n[2] Verifying Weeks 0–12 Complete Question Bank (10 MCQs each)');
let totalQuestionsCount = 0;
for (let w = 0; w <= 12; w++) {
  const weekQuestions = wildlifeEcologyQuestions[w];
  assert(Array.isArray(weekQuestions) && weekQuestions.length === 10, `Week ${w} contains exactly 10 questions`);
  totalQuestionsCount += weekQuestions.length;

  // Validate each question structure & answer keys
  weekQuestions.forEach((q, idx) => {
    const valid = validateQuestion(q);
    assert(valid.isValid, `Week ${w} Q${idx + 1} (${q.id}) passes schema validation`);
    assert(q.week === w, `Week ${w} Q${idx + 1} has correct week attribute (${q.week})`);
    assert(q.subjectId === 'wildlife-ecology', `Week ${w} Q${idx + 1} has subjectId 'wildlife-ecology'`);
    assert(Array.isArray(q.options) && q.options.length >= 2, `Week ${w} Q${idx + 1} has valid options array`);
  });
}
assert(totalQuestionsCount === 130, 'Total available questions across Weeks 0–12 is exactly 130 (13 x 10)');

// 3. Question Loader & Dynamic Combined Quiz Aggregation
console.log('\n[3] Verifying Dynamic Combined Quiz Aggregation');
const week0Questions = getWeeklyQuestions(weCourse, 0);
assert(Array.isArray(week0Questions) && week0Questions.length === 10, 'getWeeklyQuestions(course, 0) returns 10 questions');

const week1Questions = getWeeklyQuestions(weCourse, 1);
assert(Array.isArray(week1Questions) && week1Questions.length === 10, 'getWeeklyQuestions(course, 1) returns 10 questions');

const combinedQuestions = getCombinedQuestions(weCourse);
assert(Array.isArray(combinedQuestions) && combinedQuestions.length === 130, 'Combined quiz dynamically aggregates all 130 questions from Weeks 0–12 without duplicates');

const stats = getCourseStatistics(weCourse);
assert(stats.availableQuestions === 130, 'Course statistics reports 130 available questions');
assert(stats.totalPlannedQuestions === 130, 'Course statistics reports 130 planned questions');
assert(stats.isFullyPopulated === true, 'Course is marked as fully populated (130/130)');
assert(stats.weekDetails.length === 13, 'Course statistics provides details for all 13 weeks');
assert(stats.weekDetails[0].availableQuestions === 10, 'Week 0 details report 10 available questions');
assert(stats.weekDetails[0].status === 'Ready for Practice', 'Week 0 status is Ready for Practice');

// 4. Scoring Engine Evaluation on Real Wildlife Questions (Week 0)
console.log('\n[4] Verifying Scoring Engine with Week 0 Questions');
// Test Week 0 questions:
// Q1: A, Q2: B, Q3: B, Q4: C, Q5: D, Q6: B, Q7: C, Q8: D, Q9: C, Q10: C
const mockUserAnswersWeek0 = {
  'wildlife-week0-q1': 'A', // Correct
  'wildlife-week0-q2': 'B', // Correct
  'wildlife-week0-q3': 'B', // Correct
  'wildlife-week0-q4': 'C', // Correct
  'wildlife-week0-q5': 'D', // Correct
  'wildlife-week0-q6': 'B', // Correct
  'wildlife-week0-q7': 'C', // Correct
  'wildlife-week0-q8': 'D', // Correct
  'wildlife-week0-q9': 'C', // Correct
  'wildlife-week0-q10': 'A' // Incorrect (Answer is C)
};

const week0Evaluation = evaluateQuizSubmission({
  questions: week0Questions,
  userAnswers: mockUserAnswersWeek0,
  timeElapsedSeconds: 180
});

assert(week0Evaluation.totalQuestions === 10, 'Week 0 evaluation total questions is 10');
assert(week0Evaluation.correctCount === 9, 'Week 0 evaluation correct count is 9');
assert(week0Evaluation.incorrectCount === 1, 'Week 0 evaluation incorrect count is 1');
assert(week0Evaluation.unansweredCount === 0, 'Week 0 evaluation unanswered count is 0');
assert(week0Evaluation.totalScore === 9, 'Week 0 total score is 9');
assert(week0Evaluation.percentage === 90, 'Week 0 percentage is 90% (9/10)');
assert(week0Evaluation.isCompleteEvaluation === true, 'Week 0 evaluation is complete');

console.log(`\n==================================================`);
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed successfully.`);
console.log(`==================================================\n`);
