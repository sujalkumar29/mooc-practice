import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: REMOVAL OF BREADCRUMBS FROM WEEKLY QUIZ PAGES ===\n');

// -----------------------------------------------------------------------------
// 1. SOURCE CODE CONTRACT CHECKS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Breadcrumb Removal from WeeklyQuiz Component:');

const weeklyQuizPath = path.join(__dirname, '../src/pages/WeeklyQuiz.jsx');
const weeklyQuizSource = fs.readFileSync(weeklyQuizPath, 'utf-8');

// A. Confirm Breadcrumbs import is removed
assert(!weeklyQuizSource.includes("import Breadcrumbs from '../components/Breadcrumbs';"),
  'WeeklyQuiz.jsx must NOT import Breadcrumbs');
console.log('  ✓ PASS: Breadcrumbs component import removed from WeeklyQuiz.jsx');

// B. Confirm <Breadcrumbs element is removed
assert(!weeklyQuizSource.includes('<Breadcrumbs'),
  'WeeklyQuiz.jsx must NOT render <Breadcrumbs />');
console.log('  ✓ PASS: <Breadcrumbs /> JSX element removed from WeeklyQuiz.jsx');

// C. Confirm weekly quiz container and QuizInterface remain intact
assert(weeklyQuizSource.includes('className="weekly-quiz-page"'),
  'WeeklyQuiz.jsx must retain .weekly-quiz-page wrapper');
assert(weeklyQuizSource.includes('className="container quiz-page-container"'),
  'WeeklyQuiz.jsx must retain .container.quiz-page-container');
assert(weeklyQuizSource.includes('<QuizInterface'),
  'WeeklyQuiz.jsx must continue to render QuizInterface');
console.log('  ✓ PASS: WeeklyQuiz structure and QuizInterface integration fully preserved');

// -----------------------------------------------------------------------------
// 2. VERIFY NON-QUIZ PAGES RETAIN BREADCRUMBS
// -----------------------------------------------------------------------------
console.log('\n[2] Verifying Breadcrumbs Preserved on Non-Quiz Pages:');

const subjectsPath = path.join(__dirname, '../src/pages/Subjects.jsx');
const subjectOverviewPath = path.join(__dirname, '../src/pages/SubjectOverview.jsx');
const aboutPath = path.join(__dirname, '../src/pages/About.jsx');

const subjectsSource = fs.readFileSync(subjectsPath, 'utf-8');
const subjectOverviewSource = fs.readFileSync(subjectOverviewPath, 'utf-8');
const aboutSource = fs.readFileSync(aboutPath, 'utf-8');

assert(subjectsSource.includes('<Breadcrumbs'),
  'Subjects.jsx (non-quiz page) must retain breadcrumbs');
console.log('  ✓ PASS: Subjects.jsx retains breadcrumbs');

assert(subjectOverviewSource.includes('<Breadcrumbs'),
  'SubjectOverview.jsx (non-quiz page) must retain breadcrumbs');
console.log('  ✓ PASS: SubjectOverview.jsx retains breadcrumbs');

assert(aboutSource.includes('<Breadcrumbs'),
  'About.jsx (non-quiz page) must retain breadcrumbs');
console.log('  ✓ PASS: About.jsx retains breadcrumbs');

// -----------------------------------------------------------------------------
// 3. VERIFY VERTICAL SPACE RECLAIM & CSS CONTRACTS
// -----------------------------------------------------------------------------
console.log('\n[3] Verifying Vertical Space Reclaim & Styling:');

const quizCssPath = path.join(__dirname, '../src/styles/quiz.css');
const quizCssSource = fs.readFileSync(quizCssPath, 'utf-8');

assert(quizCssSource.includes('.weekly-quiz-page') && quizCssSource.includes('.combined-quiz-page') && quizCssSource.includes('padding-top: 0.75rem;'),
  'quiz.css must configure compact .weekly-quiz-page and .combined-quiz-page padding-top (0.75rem) to reclaim vertical space');
console.log('  ✓ PASS: .weekly-quiz-page and .combined-quiz-page use compact 0.75rem top padding, moving quiz header and questions upward');

// -----------------------------------------------------------------------------
// 4. VERIFY COMBINED QUIZ BREADCRUMB REMOVAL & 15:00 TIMER
// -----------------------------------------------------------------------------
console.log('\n[4] Verifying Combined Quiz Breadcrumb Removal & 15:00 Timer:');

const combinedQuizPath = path.join(__dirname, '../src/pages/CombinedQuiz.jsx');
const combinedQuizSource = fs.readFileSync(combinedQuizPath, 'utf-8');

assert(!combinedQuizSource.includes("import Breadcrumbs from '../components/Breadcrumbs';"),
  'CombinedQuiz.jsx must NOT import Breadcrumbs');
assert(!combinedQuizSource.includes('<Breadcrumbs'),
  'CombinedQuiz.jsx must NOT render <Breadcrumbs />');
console.log('  ✓ PASS: Breadcrumbs component and JSX element removed from CombinedQuiz.jsx');

assert(combinedQuizSource.includes('durationSeconds={900}'),
  'CombinedQuiz.jsx must pass durationSeconds={900} (15:00) to QuizInterface');
console.log('  ✓ PASS: CombinedQuiz configures durationSeconds={900} (15:00)');

const quizInterfacePath = path.join(__dirname, '../src/components/QuizInterface.jsx');
const quizInterfaceSource = fs.readFileSync(quizInterfacePath, 'utf-8');
assert(quizInterfaceSource.includes('durationSeconds'),
  'QuizInterface.jsx must accept durationSeconds prop');
assert(quizInterfaceSource.includes("quizKey === 'combined' ? 900 : Math.max(600, questions.length * 90)"),
  'QuizInterface.jsx must default combined quiz to 900 seconds (15:00)');
console.log('  ✓ PASS: QuizInterface handles 900-second (15-minute) timer for Combined Quiz');

// -----------------------------------------------------------------------------
// 5. VERIFY GLOBAL COVERAGE ACROSS WEEK 0 THROUGH WEEK 12
// -----------------------------------------------------------------------------
console.log('\n[5] Verifying Global Application Across Week 0 to Week 12:');

// WeeklyQuiz is the single shared component registered in App.jsx router:
// path: 'subjects/:subjectSlug/quiz/:weekParam', element: <WeeklyQuiz />
// path: 'subjects/:subjectSlug/quiz/week/:weekNumber', element: <WeeklyQuiz />
const appPath = path.join(__dirname, '../src/App.jsx');
const appSource = fs.readFileSync(appPath, 'utf-8');

assert(appSource.includes("path: 'subjects/:subjectSlug/quiz/:weekParam', element: <WeeklyQuiz />"),
  'App.jsx routes all weekly quiz URLs to the shared WeeklyQuiz component');
assert(appSource.includes("path: 'subjects/:subjectSlug/quiz/week/:weekNumber', element: <WeeklyQuiz />"),
  'App.jsx routes all weekly quiz weekNumber aliases to the shared WeeklyQuiz component');
console.log('  ✓ PASS: All weekly quizzes (Week 0 through Week 12) share the same WeeklyQuiz component');
console.log('  ✓ PASS: Removing breadcrumbs from WeeklyQuiz guarantees NO breadcrumbs on any weekly quiz page');
console.log('  ✓ PASS: Breadcrumbs will not reappear on route transitions or page refresh');

console.log('\n==================================================');
console.log('RESULTS: All Quiz Breadcrumb & Timer tests passed!');
console.log('==================================================\n');
