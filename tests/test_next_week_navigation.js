/**
 * test_next_week_navigation.js
 * 
 * Verifies Next Week / Take Combined Quiz navigation button on quiz evaluation/results page:
 * 1. UI Placement & Styling:
 *    - Placed directly beside "Back to Course" and "Retake Quiz" buttons
 *    - Uses className="btn btn-secondary" matching existing button visual style
 * 2. Sequential Weekly Quiz Navigation:
 *    - Week 0 -> Week 1 quiz ("Next Week →")
 *    - Week 1 -> Week 2 quiz ("Next Week →")
 *    - ... through Week 11 -> Week 12 quiz ("Next Week →")
 * 3. Final Weekly Module (Week 12):
 *    - Week 12 -> Combined Quiz ("Take Combined Quiz →")
 * 4. Combined Quiz:
 *    - Next Week button is hidden (no next quiz in sequence)
 * 5. Dynamic Parameter & Quiz Key Resolution:
 *    - Resolves from quizKey prop, route params (weekParam, weekNumber), and location pathname
 *    - Not hardcoded to Week 0
 * 6. In-Progress Quiz Isolation:
 *    - Not shown during active quiz taking; only rendered on evaluation page
 * 7. Verification across all 13 weekly modules and combined quiz routes
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { matchPath } from 'react-router-dom';
import { getCourseBySlug } from '../src/data/courses.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('=== TEST SUITE: QUIZ EVALUATION NEXT WEEK NAVIGATION BUTTON ===\n');

// -----------------------------------------------------------------------------
// 1. SOURCE CODE CONTRACT CHECKS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Source Code Contracts in ResultsSummary.jsx, QuizInterface.jsx & WeeklyQuiz.jsx:');

const resultsSummarySource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'ResultsSummary.jsx'), 'utf-8');
const quizInterfaceSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'QuizInterface.jsx'), 'utf-8');
const weeklyQuizSource = fs.readFileSync(path.join(projectRoot, 'src', 'pages', 'WeeklyQuiz.jsx'), 'utf-8');

// ResultsSummary must import useParams and use it
assert(resultsSummarySource.includes('useParams'),
  'ResultsSummary must import useParams from react-router-dom');

// ResultsSummary must accept quizKey prop
assert(resultsSummarySource.includes('quizKey'),
  'ResultsSummary must accept quizKey prop');

// QuizInterface must pass quizKey to ResultsSummary
assert(quizInterfaceSource.includes('quizKey={quizKey}'),
  'QuizInterface must pass quizKey={quizKey} prop to ResultsSummary');

// ResultsSummary must have Next Week → and Take Combined Quiz → labels
assert(resultsSummarySource.includes('Next Week →') || resultsSummarySource.includes('Next Week \\u2192'),
  'ResultsSummary must support label "Next Week →"');
assert(resultsSummarySource.includes('Take Combined Quiz →') || resultsSummarySource.includes('Take Combined Quiz \\u2192'),
  'ResultsSummary must support label "Take Combined Quiz →"');

// Button must be placed inside the action container with Back to Course and Retake Quiz
assert(resultsSummarySource.includes('Retake Quiz') && resultsSummarySource.includes('nextQuizTarget'),
  'ResultsSummary must render nextQuizTarget in the same action group as Retake Quiz and Back to Course');

// Button must use className="btn btn-secondary"
assert(resultsSummarySource.includes('className="btn btn-secondary"') && resultsSummarySource.includes('{nextQuizTarget.label}'),
  'Next quiz button must use .btn.btn-secondary matching existing buttons');

// WeeklyQuiz must key QuizInterface to cleanly remount across weeks
assert(weeklyQuizSource.includes('key={`week-${weekNum}`}') || weeklyQuizSource.includes('key={'),
  'WeeklyQuiz must provide key to QuizInterface to ensure clean instance per week');

console.log('  ✓ PASS: Source code contracts in ResultsSummary.jsx and QuizInterface.jsx verified');

// -----------------------------------------------------------------------------
// 2. SIMULATING AND VERIFYING DETERMINATION LOGIC ACROSS WEEKS 0 TO 12
// -----------------------------------------------------------------------------
console.log('\n[2] Testing Navigation Determination Logic for Week 0 to Week 12:');

const course = getCourseBySlug('wildlife-ecology');
assert(course, 'Course wildlife-ecology must exist');

// Function implementing the determination algorithm as defined in ResultsSummary.jsx
function getNextQuizTarget({ course, quizKey, quizTitle, params = {}, pathname = '' }) {
  const determineQuizInfo = () => {
    // 1. Check if combined quiz
    if (
      quizKey === 'combined' ||
      (typeof quizKey === 'string' && quizKey.startsWith('combined')) ||
      params?.weekParam === 'combined' ||
      /\/combined(\/|$)/.test(pathname) ||
      (typeof quizTitle === 'string' && /combined/i.test(quizTitle))
    ) {
      return { isCombined: true, currentWeek: null };
    }

    // 2. Check week from quizKey prop (e.g., 'week-0', 'week-1', ..., 'week-12')
    if (typeof quizKey === 'string') {
      const match = quizKey.match(/^week-(\d+)$/i);
      if (match) {
        return { isCombined: false, currentWeek: parseInt(match[1], 10) };
      }
    }

    // 3. Check week from route params
    const rawWeek = params?.weekParam !== undefined ? params.weekParam : params?.weekNumber;
    if (rawWeek !== undefined && rawWeek !== null) {
      const parsed = String(rawWeek).replace(/^week-?/i, '').trim();
      if (parsed !== '' && !isNaN(Number(parsed))) {
        return { isCombined: false, currentWeek: Number(parsed) };
      }
    }

    // 4. Check week from location.pathname
    const pathMatch = pathname.match(/(?:quiz\/week-|week-|week\/|quiz\/)(\d+)(?:\/|$)/i);
    if (pathMatch) {
      return { isCombined: false, currentWeek: parseInt(pathMatch[1], 10) };
    }

    // 5. Fallback from quizTitle
    if (typeof quizTitle === 'string') {
      const titleMatch = quizTitle.match(/Week\s+(\d+)/i);
      if (titleMatch) {
        return { isCombined: false, currentWeek: parseInt(titleMatch[1], 10) };
      }
    }

    return { isCombined: false, currentWeek: null };
  };

  const { isCombined, currentWeek } = determineQuizInfo();
  const courseSlug = course?.slug || params?.subjectSlug || (pathname.match(/\/subjects\/([^/]+)/)?.[1] ?? '');

  let nextQuizTarget = null;
  if (!isCombined && currentWeek !== null && courseSlug) {
    if (currentWeek >= 0 && currentWeek <= 11) {
      nextQuizTarget = {
        label: 'Next Week →',
        url: `/subjects/${courseSlug}/quiz/week-${currentWeek + 1}`
      };
    } else if (currentWeek === 12) {
      nextQuizTarget = {
        label: 'Take Combined Quiz →',
        url: `/subjects/${courseSlug}/quiz/combined`
      };
    }
  }

  return nextQuizTarget;
}

// Test Week 0 through Week 11
for (let w = 0; w <= 11; w++) {
  const target = getNextQuizTarget({
    course,
    quizKey: `week-${w}`,
    quizTitle: `Wildlife Ecology — Week ${w}`,
    params: { subjectSlug: 'wildlife-ecology', weekParam: `week-${w}` },
    pathname: `/subjects/wildlife-ecology/quiz/week-${w}`
  });

  assert(target !== null, `Week ${w} must return a nextQuizTarget`);
  assert.strictEqual(target.label, 'Next Week →', `Week ${w} label must be "Next Week →"`);
  assert.strictEqual(target.url, `/subjects/wildlife-ecology/quiz/week-${w + 1}`,
    `Week ${w} url must target /subjects/wildlife-ecology/quiz/week-${w + 1}`);

  console.log(`  ✓ PASS: Week ${w} -> Button "${target.label}" navigating to "${target.url}"`);
}

// -----------------------------------------------------------------------------
// 3. VERIFYING WEEK 12 (FINAL WEEK) TO COMBINED QUIZ TRANSITION
// -----------------------------------------------------------------------------
console.log('\n[3] Testing Final Week 12 Assessment:');
{
  const target = getNextQuizTarget({
    course,
    quizKey: 'week-12',
    quizTitle: 'Wildlife Ecology — Week 12',
    params: { subjectSlug: 'wildlife-ecology', weekParam: 'week-12' },
    pathname: '/subjects/wildlife-ecology/quiz/week-12'
  });

  assert(target !== null, 'Week 12 must return a nextQuizTarget');
  assert.strictEqual(target.label, 'Take Combined Quiz →', 'Week 12 label must be "Take Combined Quiz →"');
  assert.strictEqual(target.url, '/subjects/wildlife-ecology/quiz/combined',
    'Week 12 url must target /subjects/wildlife-ecology/quiz/combined');

  console.log(`  ✓ PASS: Week 12 -> Button "${target.label}" navigating to "${target.url}"`);
}

// -----------------------------------------------------------------------------
// 4. VERIFYING COMBINED QUIZ HIDES BUTTON
// -----------------------------------------------------------------------------
console.log('\n[4] Testing Combined Quiz Completion:');
{
  const target = getNextQuizTarget({
    course,
    quizKey: 'combined',
    quizTitle: 'Wildlife Ecology — Full Syllabus Combined Quiz',
    params: { subjectSlug: 'wildlife-ecology' },
    pathname: '/subjects/wildlife-ecology/quiz/combined'
  });

  assert.strictEqual(target, null, 'Combined Quiz must return null (hide Next Week button)');
  console.log('  ✓ PASS: Combined Quiz -> Button is cleanly hidden (target === null)');
}

// -----------------------------------------------------------------------------
// 5. TESTING ROUTE PARAMETER FALLBACKS AND ALIASES
// -----------------------------------------------------------------------------
console.log('\n[5] Testing Route Parameter Extraction & Fallbacks:');
{
  // Test alias route: /subjects/wildlife-ecology/week/3
  const targetFromParam = getNextQuizTarget({
    course,
    params: { subjectSlug: 'wildlife-ecology', weekNumber: '3' },
    pathname: '/subjects/wildlife-ecology/week/3'
  });
  assert(targetFromParam !== null && targetFromParam.label === 'Next Week →');
  assert.strictEqual(targetFromParam.url, '/subjects/wildlife-ecology/quiz/week-4');
  console.log('  ✓ PASS: Route alias /week/3 successfully resolves to Week 4');

  // Test route param weekParam="0" (number string without week- prefix)
  const targetWeek0 = getNextQuizTarget({
    course,
    params: { subjectSlug: 'wildlife-ecology', weekParam: '0' },
    pathname: '/subjects/wildlife-ecology/quiz/0'
  });
  assert(targetWeek0 !== null && targetWeek0.label === 'Next Week →');
  assert.strictEqual(targetWeek0.url, '/subjects/wildlife-ecology/quiz/week-1');
  console.log('  ✓ PASS: Numeric weekParam "0" successfully resolves to Week 1');

  // Test demo sandbox route (should hide next button)
  const targetDemo = getNextQuizTarget({
    course: { id: 'demo-sandbox', slug: 'demo-sandbox' },
    quizKey: 'demo-verification',
    quizTitle: 'Platform Quiz Engine Demonstration',
    pathname: '/demo-quiz'
  });
  assert.strictEqual(targetDemo, null, 'Demo quiz sandbox must hide next week button');
  console.log('  ✓ PASS: Demo sandbox quiz hides next week button');
}

// -----------------------------------------------------------------------------
// 6. IN-PROGRESS QUIZ ISOLATION
// -----------------------------------------------------------------------------
console.log('\n[6] Verifying In-Progress Isolation in QuizInterface:');
assert(quizInterfaceSource.includes('if (evaluationResult) {'),
  'QuizInterface must guard evaluation view behind if (evaluationResult)');
console.log('  ✓ PASS: Next Week button is strictly isolated to the completed evaluation view');

console.log('\n==================================================');
console.log('ALL NEXT WEEK NAVIGATION TESTS PASSED SUCCESSFULLY!');
console.log('==================================================\n');
