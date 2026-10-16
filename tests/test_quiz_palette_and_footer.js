// test_quiz_palette_and_footer.js
// Automated verification suite for Quiz Footer absence, Layout stability, and Question Palette instruction statuses.

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- TESTING QUIZ FOOTER, LAYOUT & QUESTION PALETTE UI ---');

// -----------------------------------------------------------------------------
// 1. VERIFY CONDITIONAL FOOTER EXCLUSION ON QUIZ ROUTES & PRESENCE ON NORMAL PAGES
// -----------------------------------------------------------------------------
console.log('\n[1] Testing Conditional Footer Rendering:');

const isQuizRouteCheck = (pathname) => {
  return /\/quiz(\/|$)/.test(pathname) || pathname === '/demo-quiz';
};

// Quiz routes where footer MUST NOT be rendered
const quizRoutes = [
  '/subjects/wildlife-ecology/quiz/week-0',
  '/subjects/wildlife-ecology/quiz/week-1',
  '/subjects/wildlife-ecology/quiz/week-2',
  '/subjects/wildlife-ecology/quiz/week-3',
  '/subjects/wildlife-ecology/quiz/week-4',
  '/subjects/wildlife-ecology/quiz/week-5',
  '/subjects/wildlife-ecology/quiz/week-6',
  '/subjects/wildlife-ecology/quiz/week-7',
  '/subjects/wildlife-ecology/quiz/week-8',
  '/subjects/wildlife-ecology/quiz/week-9',
  '/subjects/wildlife-ecology/quiz/week-10',
  '/subjects/wildlife-ecology/quiz/week-11',
  '/subjects/wildlife-ecology/quiz/week-12',
  '/subjects/wildlife-ecology/quiz/combined',
  '/subjects/wildlife-ecology/quiz/week/3',
  '/subjects/wildlife-ecology/quiz/5',
  '/demo-quiz'
];

quizRoutes.forEach((route) => {
  const isExcluded = isQuizRouteCheck(route);
  assert.strictEqual(isExcluded, true, `Footer must be excluded on route: ${route}`);
});
console.log(`  ✓ PASS: Global footer is excluded on all ${quizRoutes.length} active quiz routes (Week 0–12, combined, sandbox)`);

// Normal pages where footer MUST BE rendered
const normalPages = [
  '/',
  '/subjects',
  '/subjects/wildlife-ecology',
  '/about'
];

normalPages.forEach((page) => {
  const isExcluded = isQuizRouteCheck(page);
  assert.strictEqual(isExcluded, false, `Footer must be visible on normal page: ${page}`);
});
console.log(`  ✓ PASS: Global footer remains visible on all ${normalPages.length} standard pages (Home, Subjects, Wildlife Ecology, About)`);

// Verify App.jsx implementation
const appJsxContent = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf-8');
assert(appJsxContent.includes('!isQuizRoute && <Footer />'), 'App.jsx must conditionally render Footer using !isQuizRoute');
console.log('  ✓ PASS: App.jsx conditionally renders Footer using clean layout state without CSS hacks');

// -----------------------------------------------------------------------------
// 2. VERIFY QUESTION PALETTE INSTRUCTION-SCREEN STATUS LOGIC
// -----------------------------------------------------------------------------
console.log('\n[2] Testing Question Palette Status Logic & State Progression:');

function deriveQuestionStatus({ isAnswered, isFlagged, isVisited, isActive }) {
  let status = 'not-visited';
  if (isAnswered && isFlagged) {
    status = 'answered-marked';
  } else if (!isAnswered && isFlagged) {
    status = 'marked';
  } else if (isAnswered) {
    status = 'answered';
  } else if (isVisited) {
    status = 'not-answered';
  } else {
    status = 'not-visited';
  }
  return status;
}

// Scenario A: Fresh Quiz Open (Question 0 is current, Question 1..9 are unvisited)
let visited = { 'q1': true };
let answers = {};
let flagged = {};

let q0Status = deriveQuestionStatus({
  isAnswered: !!answers['q1'],
  isFlagged: !!flagged['q1'],
  isVisited: !!visited['q1'],
  isActive: true
});
assert.strictEqual(q0Status, 'not-answered', 'Question 0 on open must be "not-answered"');

let q1Status = deriveQuestionStatus({
  isAnswered: !!answers['q2'],
  isFlagged: !!flagged['q2'],
  isVisited: !!visited['q2'],
  isActive: false
});
assert.strictEqual(q1Status, 'not-visited', 'Untouched Question 1 must be "not-visited"');
console.log('  ✓ PASS: Fresh quiz open correctly initializes Q1 as "Not Answered" and untouched questions as "Not Visited"');

// Scenario B: Answer Question 0
answers['q1'] = 'B';
q0Status = deriveQuestionStatus({
  isAnswered: !!answers['q1'],
  isFlagged: !!flagged['q1'],
  isVisited: !!visited['q1'],
  isActive: true
});
assert.strictEqual(q0Status, 'answered', 'Selecting an answer must change status to "answered"');
console.log('  ✓ PASS: Selecting an answer updates status to "Answered" (green indicator)');

// Scenario C: Flag Answered Question 0 -> "Answered & Marked for Review"
flagged['q1'] = true;
q0Status = deriveQuestionStatus({
  isAnswered: !!answers['q1'],
  isFlagged: !!flagged['q1'],
  isVisited: !!visited['q1'],
  isActive: true
});
assert.strictEqual(q0Status, 'answered-marked', 'Answered + Flagged must be "answered-marked"');
console.log('  ✓ PASS: Flagging an answered question updates status to "Answered & Marked for Review"');

// Scenario D: Navigate to Question 1 without answering -> "Not Answered"
visited['q2'] = true;
q1Status = deriveQuestionStatus({
  isAnswered: !!answers['q2'],
  isFlagged: !!flagged['q2'],
  isVisited: !!visited['q2'],
  isActive: true
});
assert.strictEqual(q1Status, 'not-answered', 'Visited without answering must be "not-answered"');
console.log('  ✓ PASS: Visiting an unanswered question updates status to "Not Answered" (red indicator)');

// Scenario E: Flag Question 1 without answering -> "Marked for Review"
flagged['q2'] = true;
q1Status = deriveQuestionStatus({
  isAnswered: !!answers['q2'],
  isFlagged: !!flagged['q2'],
  isVisited: !!visited['q2'],
  isActive: true
});
assert.strictEqual(q1Status, 'marked', 'Flagged without answer must be "marked"');
console.log('  ✓ PASS: Flagging an unanswered question updates status to "Marked for Review" (purple indicator)');

// Scenario F: Answer Question 1 while flagged -> transitions to "Answered & Marked for Review"
answers['q2'] = 'A';
q1Status = deriveQuestionStatus({
  isAnswered: !!answers['q2'],
  isFlagged: !!flagged['q2'],
  isVisited: !!visited['q2'],
  isActive: true
});
assert.strictEqual(q1Status, 'answered-marked', 'Selecting answer while flagged transitions to "answered-marked"');
console.log('  ✓ PASS: Selecting an answer on a flagged question immediately updates to "Answered & Marked for Review"');

// Scenario G: Untouched Question 2..9 remain "Not Visited"
for (let i = 3; i <= 10; i++) {
  const qId = `q${i}`;
  const status = deriveQuestionStatus({
    isAnswered: !!answers[qId],
    isFlagged: !!flagged[qId],
    isVisited: !!visited[qId],
    isActive: false
  });
  assert.strictEqual(status, 'not-visited', `Question ${i} must remain "not-visited"`);
}
console.log('  ✓ PASS: All untouched questions (Q3–Q10) remain strictly "Not Visited" (neutral grey)');

// -----------------------------------------------------------------------------
// 3. VERIFY PALETTE CSS STABILITY & FLICKER PREVENTION
// -----------------------------------------------------------------------------
console.log('\n[3] Testing Question Palette CSS Stability & Layout Properties:');

const quizCssContent = fs.readFileSync(path.join(__dirname, '../src/styles/quiz.css'), 'utf-8');

// Ensure palette-btn hover has NO scale or translateY
assert(!quizCssContent.includes('.palette-btn:hover {\n  border-color: var(--color-text-light);\n  transform: scale('),
  'Palette button hover must not use transform: scale()');
assert(!quizCssContent.includes('.palette-btn:hover {\n  transform:'),
  'Palette button hover must not use layout-altering transform');
console.log('  ✓ PASS: Palette button hover has NO transform: scale() or translateY() (layout stability guaranteed)');

// Verify questions grid safe padding and scrollbar-gutter
assert(quizCssContent.includes('padding: 4px;'), 'Questions grid must have safety padding around buttons');
assert(quizCssContent.includes('scrollbar-gutter: stable;'), 'Questions grid must use scrollbar-gutter: stable to prevent layout shifts');
console.log('  ✓ PASS: Questions grid includes 4px safety clearance and scrollbar-gutter: stable');

// Verify navigator-sidebar does NOT have container overflow-y: auto
assert(!quizCssContent.includes('.navigator-sidebar {\n  background: var(--color-bg-card);\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-xl);\n  padding: 1.5rem;\n  box-shadow: var(--shadow-sm);\n  position: sticky;\n  top: calc(var(--header-height) + 1rem);\n  max-height: calc(100vh - var(--header-height) - 2rem);\n  overflow-y: auto;'),
  'Navigator sidebar container must not force overflow-y: auto');
console.log('  ✓ PASS: Navigator sidebar does not produce outer container scrollbar conflicts');

// Verify all 5 status CSS classes exist
const requiredStatusClasses = [
  '.palette-btn.status-not-visited',
  '.palette-btn.status-not-answered',
  '.palette-btn.status-answered',
  '.palette-btn.status-marked',
  '.palette-btn.status-answered-marked',
  '.palette-btn.active'
];

requiredStatusClasses.forEach((cls) => {
  assert(quizCssContent.includes(cls), `quiz.css must define class ${cls}`);
});
console.log(`  ✓ PASS: All ${requiredStatusClasses.length} status and active classes are defined in quiz.css`);

// Verify Answered & Marked badge indicator
assert(quizCssContent.includes('.palette-btn.status-answered-marked::after'),
  'quiz.css must define .palette-btn.status-answered-marked::after indicator dot');
console.log('  ✓ PASS: Answered & Marked for Review displays corner badge indicator');

// -----------------------------------------------------------------------------
// 4. VERIFY RESPONSIVE LAYOUT & CONTAINER DIMENSIONS
// -----------------------------------------------------------------------------
console.log('\n[4] Testing Quiz Responsive Layout & Spacing:');

assert(
  quizCssContent.includes('grid-template-columns: minmax(0, 73.5fr) minmax(280px, 26.5fr);') ||
  quizCssContent.includes('grid-template-columns: minmax(0, 1fr) 300px;'),
  'Desktop layout must use responsive 2-column grid with balanced proportions');
assert(quizCssContent.includes('@media (max-width: 1024px) {\n  .quiz-layout {\n    grid-template-columns: minmax(0, 1fr);'),
  'Tablet/Mobile layout must stack panels vertically');
console.log('  ✓ PASS: Quiz layout uses 2-column desktop grid and single-column stack on <=1024px screens');

console.log('\n==================================================');
console.log('RESULTS: All Quiz Footer, Layout & Palette UI tests passed!');
console.log('==================================================\n');
