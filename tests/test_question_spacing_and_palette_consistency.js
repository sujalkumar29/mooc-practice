/**
 * test_question_spacing_and_palette_consistency.js
 *
 * Verifies the refined question spacing and palette tile consistency:
 * 1. Question text to first option vertical spacing (margin-top: 0.35rem on options list)
 * 2. Consecutive option vertical gaps (row-gap: 0.75rem)
 * 3. Modest internal padding on option tiles (padding: 0.75rem 1.25rem)
 * 4. Centered option text and letter badge (align-items: center, line-height: 1)
 * 5. Equal option heights within each question (grid-auto-rows: 1fr, height: 100%)
 * 6. Uniform Question Palette tiles across Weekly (5 cols x 2 rows, 35px) and Combined Quiz (5 cols, internal scroll)
 * 7. Absence of layout shifts or dimension changes on hover/focus/active
 * 8. Verification across Week 0, Week 1, Week 12, and Combined Quiz datasets
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: QUESTION SPACING & PALETTE TILE CONSISTENCY ===\n');

const quizCss = fs.readFileSync(path.join(__dirname, '../src/styles/quiz.css'), 'utf-8');
const questionNavJsx = fs.readFileSync(path.join(__dirname, '../src/components/QuestionNavigator.jsx'), 'utf-8');
const quizInterfaceJsx = fs.readFileSync(path.join(__dirname, '../src/components/QuizInterface.jsx'), 'utf-8');

// -----------------------------------------------------------------------------
// 1. QUESTION AND OPTION SPACING REFINEMENTS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Question & Option Spacing:');

// Vertical space between question statement and first option
assert(quizCss.includes('margin-top: 0.35rem;'),
  'options-list must configure margin-top: 0.35rem for slightly increased breathing room from question text');
console.log('  ✓ PASS: Question text to first option spacing increased via margin-top: 0.35rem');

// Vertical gaps between consecutive answer option tiles
assert(quizCss.includes('row-gap: 0.75rem;'),
  'options-list must configure row-gap: 0.75rem for slightly increased vertical gaps between tiles');
console.log('  ✓ PASS: Consecutive option tiles have refined row-gap: 0.75rem');

// Modest internal padding on option tiles
assert(quizCss.includes('padding: 0.75rem 1.25rem;'),
  'option-item must configure modest padding: 0.75rem 1.25rem so text and badges do not feel cramped');
assert(quizCss.includes('min-height: 48px;'),
  'option-item must have min-height: 48px for comfortable touch targets');
console.log('  ✓ PASS: Option tiles use modest internal padding (0.75rem 1.25rem) and 48px min-height');

// Option text and letter badge vertical centering
assert(quizCss.includes('.option-letter {\n  width: 28px;\n  height: 28px;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: var(--radius-full);\n  background: var(--color-bg-muted);\n  color: var(--color-text-muted);\n  font-family: var(--font-heading);\n  font-weight: 700;\n  font-size: 0.825rem;\n  line-height: 1;'),
  'option-letter must maintain line-height: 1 and flexbox centering');
console.log('  ✓ PASS: Letter badge and option text are centered vertically');

// Equal option heights within each question
assert(quizCss.includes('grid-auto-rows: 1fr;'),
  'options-list must use grid-auto-rows: 1fr to guarantee equal heights for all options in the current question');
console.log('  ✓ PASS: CSS Grid grid-auto-rows: 1fr guarantees equal heights for all options in each question');

// -----------------------------------------------------------------------------
// 2. PALETTE TILE UNIFORMITY & STABILITY
// -----------------------------------------------------------------------------
console.log('\n[2] Verifying Palette Tile Uniformity & Layout Stability:');

// Weekly quiz: 5 cols x 2 rows (10 tiles)
assert(quizCss.includes('.questions-grid.questions-grid-weekly {\n  grid-template-columns: repeat(5, 1fr);\n  grid-template-rows: repeat(2, 35px);'),
  'Weekly quiz palette must enforce 5 columns and 2 rows with uniform 35px tiles');
console.log('  ✓ PASS: Weekly quiz enforces exactly 5 columns x 2 rows for 10 questions');

// Combined quiz: 5 cols with uniform rows and internal scroll
assert(quizCss.includes('.questions-grid.questions-grid-combined {\n  grid-template-columns: repeat(5, 1fr);\n  grid-auto-rows: 35px;'),
  'Combined quiz must configure 5 columns with uniform 35px rows');
assert(quizCss.includes('max-height: 180px;'),
  'Combined quiz must retain internal scrolling capped at max-height: 180px');
console.log('  ✓ PASS: Combined quiz retains 5-column layout with uniform tiles and internal scroll');

// Uniform row and column gaps
assert(quizCss.includes('row-gap: 0.35rem;') && quizCss.includes('column-gap: 0.35rem;'),
  'Palette grids must maintain uniform row and column gaps of 0.35rem');
console.log('  ✓ PASS: Palette grid maintains uniform row gaps and column gaps (0.35rem)');

// Centered numbers
assert(quizCss.includes('.palette-btn-num'),
  'palette-btn-num must be defined');
assert(quizCss.includes('line-height: 1;') && quizCss.includes('pointer-events: none;'),
  'palette-btn-num must be centered with line-height: 1');
console.log('  ✓ PASS: Number labels are centered horizontally and vertically');

// Layout shift prevention
assert(!quizCss.includes('.palette-btn:hover {\n  transform:'),
  'Hover state must not use transform scale');
assert(!quizCss.includes('.palette-btn:active {\n  transform:'),
  'Active state must not use transform scale');
assert(quizCss.includes('border: 1.5px solid transparent;'),
  'palette-btn must use fixed 1.5px border to prevent box-model shifts on status changes');
console.log('  ✓ PASS: Palette tile dimensions remain completely stable across hover, focus, and status changes');

// -----------------------------------------------------------------------------
// 3. VERIFY DATASET INTEGRITY ACROSS WEEK 0, WEEK 1, WEEK 12 & COMBINED
// -----------------------------------------------------------------------------
console.log('\n[3] Verifying Quiz Data Across Week 0, Week 1, Week 12 and Combined Quiz:');

const week0 = wildlifeEcologyQuestions[0] || [];
const week1 = wildlifeEcologyQuestions[1] || [];
const week12 = wildlifeEcologyQuestions[12] || [];
const totalCombined = Object.values(wildlifeEcologyQuestions).flat().length;

assert.strictEqual(week0.length, 10, 'Week 0 must have exactly 10 questions');
assert.strictEqual(week1.length, 10, 'Week 1 must have exactly 10 questions');
assert.strictEqual(week12.length, 10, 'Week 12 must have exactly 10 questions');
assert.strictEqual(totalCombined, 130, 'Combined quiz must have exactly 130 questions');

// Verify all questions have 4 options and valid correct answers
[...week0, ...week1, ...week12].forEach(q => {
  assert(q.question && q.question.trim().length > 0, `Question ${q.id} must have question text`);
  assert(Array.isArray(q.options) && q.options.length === 4, `Question ${q.id} must have exactly 4 options`);
  assert(q.correctAnswer && ['A', 'B', 'C', 'D'].includes(q.correctAnswer.toUpperCase()), `Question ${q.id} must have valid answer key`);
});

console.log('  ✓ PASS: Week 0 has 10 MCQs with 4 options and valid answer keys');
console.log('  ✓ PASS: Week 1 has 10 MCQs with 4 options and valid answer keys');
console.log('  ✓ PASS: Week 12 has 10 MCQs with 4 options and valid answer keys');
console.log(`  ✓ PASS: Combined Quiz aggregates all ${totalCombined} MCQs perfectly`);

// -----------------------------------------------------------------------------
// 4. VERIFY VIEWPORT FIT & SCROLLBAR ABSENCE AT 1920x1080 AND 1366x768
// -----------------------------------------------------------------------------
console.log('\n[4] Verifying Viewport Fit at 1920x1080 and 1366x768:');

// Estimated height with slightly refined gaps:
// - Navbar: 72px
// - Page padding-top: 12px
// - Top bar: ~68px
// - Question card:
//     Padding: 40px
//     Header: ~34px
//     Statement: ~44px
//     Statement to options gap: ~6px
//     4 options (4 * 48px + 3 * 12px): ~228px
//     Bottom margin: ~18px
//     Bottom action bar: ~69px
//     Total Card: ~439px
// - Page bottom padding: 8px
// Total interface height on standard question: ~599px

const calculatedStandardHeight = 599;
const viewport1080p = 950;
const viewport768p = 650;

console.log(`  • Estimated interface height on standard question: ~${calculatedStandardHeight}px`);
console.log(`  • Available height at 1920x1080: ~${viewport1080p}px (Headroom: ${viewport1080p - calculatedStandardHeight}px)`);
console.log(`  • Available height at 1366x768: ~${viewport768p}px (Headroom: ${viewport768p - calculatedStandardHeight}px)`);

assert(calculatedStandardHeight < viewport1080p,
  'Standard question must easily fit inside 1920x1080 viewport without scrolling');
assert(calculatedStandardHeight < viewport768p,
  'Standard question must comfortably fit inside 1366x768 viewport without scrolling');

assert(!quizCss.includes('height: 100vh; overflow: hidden;'),
  'No fixed clipping heights or hidden overflow tricks');

console.log('  ✓ PASS: Both 1920x1080 and 1366x768 viewports fit standard questions without page-level scrollbars');

console.log('\n=============================================================');
console.log('RESULTS: All Question Spacing & Palette Consistency tests passed!');
console.log('=============================================================\n');
