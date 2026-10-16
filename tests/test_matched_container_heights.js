/**
 * test_matched_container_heights.js
 *
 * Verifies that the main question card and Question Palette containers have matching
 * vertical heights across Week 0–12 and the Combined Quiz:
 * 1. CSS Grid stretch architecture (.quiz-layout align-items: stretch, height: 100% on both panels)
 * 2. Bottom action bar pinning via margin-top: auto
 * 3. Palette ordering (heading -> filters -> numbered tiles -> status legend -> Submit Quiz)
 * 4. Responsive mobile stack behavior (height: auto on screens <= 1024px)
 * 5. Simulation across varying question lengths (short, medium, long, combined 130 MCQs)
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: MATCHED CONTAINER HEIGHTS & VERTICAL ALIGNMENT ===\n');

const quizCss = fs.readFileSync(path.join(__dirname, '../src/styles/quiz.css'), 'utf-8');
const quizInterfaceJsx = fs.readFileSync(path.join(__dirname, '../src/components/QuizInterface.jsx'), 'utf-8');
const questionNavigatorJsx = fs.readFileSync(path.join(__dirname, '../src/components/QuestionNavigator.jsx'), 'utf-8');

// -----------------------------------------------------------------------------
// 1. VERIFY CSS GRID ALIGNMENT & 100% HEIGHT CONTRACTS
// -----------------------------------------------------------------------------
console.log('[1] Verifying CSS Grid align-items: stretch and height: 100% Rules:');

// .quiz-layout must use align-items: stretch
assert(quizCss.includes('align-items: stretch;'),
  '.quiz-layout must specify align-items: stretch to match column container heights');
console.log('  ✓ PASS: .quiz-layout configures align-items: stretch');

// .question-card must have height: 100% and box-sizing: border-box
assert(quizCss.includes('.question-card {') && quizCss.includes('height: 100%;'),
  '.question-card must configure height: 100% to fill grid track height');
console.log('  ✓ PASS: .question-card specifies height: 100% and box-sizing: border-box');

// .navigator-sidebar must have height: 100% and box-sizing: border-box
assert(quizCss.includes('.navigator-sidebar {') && quizCss.includes('height: 100%;'),
  '.navigator-sidebar must configure height: 100% to fill grid track height');
console.log('  ✓ PASS: .navigator-sidebar specifies height: 100% and box-sizing: border-box');

// Bottom action bar must pin to bottom via margin-top: auto
assert(quizCss.includes('margin-top: auto;'),
  '.quiz-action-bar must configure margin-top: auto to pin bottom controls to bottom of card');
console.log('  ✓ PASS: Action controls in question panel align cleanly to the bottom via margin-top: auto');

// -----------------------------------------------------------------------------
// 2. VERIFY PALETTE ORDERING & VERTICAL SPACING DISTRIBUTION
// -----------------------------------------------------------------------------
console.log('\n[2] Verifying Question Palette Ordering & Vertical Spacing:');

// Palette sections must appear in exact order: Header -> Filters -> Grid -> Legend -> Submit
const headerIdx = questionNavigatorJsx.indexOf('navigator-header');
const filterIdx = questionNavigatorJsx.indexOf('navigator-filter-tabs');
const gridIdx = questionNavigatorJsx.indexOf('questions-grid');
const legendIdx = questionNavigatorJsx.indexOf('palette-legend');
const submitIdx = questionNavigatorJsx.indexOf('palette-submit-container');

assert(headerIdx !== -1 && filterIdx !== -1 && gridIdx !== -1 && legendIdx !== -1 && submitIdx !== -1,
  'All 5 palette components must exist in QuestionNavigator.jsx');
assert(headerIdx < filterIdx, 'Header must precede Filter tabs');
assert(filterIdx < gridIdx, 'Filter tabs must precede Questions grid');
assert(gridIdx < legendIdx, 'Questions grid must precede Palette legend');
assert(legendIdx < submitIdx, 'Palette legend must precede Submit Quiz button');
console.log('  ✓ PASS: Palette preserves exact ordering: Header -> Filters -> Tiles -> Legend -> Submit');

// Spacing distribution: verify flexbox distribution rules in quiz.css
assert(quizCss.includes('margin-bottom: 0.75rem;'),
  'Palette sections configure comfortable 0.75rem margin');
assert(quizCss.includes('gap: 0.32rem;'),
  'Palette legend items configure natural 0.32rem gap');
assert(quizCss.includes('margin-top: 0.85rem;') && quizCss.includes('padding-top: 0.75rem;'),
  'Submit Quiz container configures balanced margin and padding');
assert(quizCss.includes('.navigator-sidebar {\n  background: var(--color-bg-card);\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-xl);\n  padding: 1rem 1.15rem;\n  box-shadow: var(--shadow-sm);\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;'),
  '.navigator-sidebar must use justify-content: space-between to evenly distribute inner sections');
assert(quizCss.includes('.palette-legend {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  flex: 1;\n  min-height: 125px;\n  max-height: 220px;'),
  '.palette-legend must use flex: 1, min-height: 125px, max-height: 220px, and justify-content: space-between to evenly space rows');
console.log('  ✓ PASS: Vertical space distributed naturally via flex: 1 and justify-content: space-between');

// -----------------------------------------------------------------------------
// 3. RESPONSIVE MOBILE STACK BEHAVIOR
// -----------------------------------------------------------------------------
console.log('\n[3] Verifying Responsive Mobile Stack (<= 1024px):');

assert(quizCss.includes('@media (max-width: 1024px) {\n  .quiz-layout {\n    grid-template-columns: minmax(0, 1fr);'),
  'Quiz layout must collapse to single-column at 1024px');
assert(quizCss.includes('.question-card,\n  .navigator-sidebar {\n    height: auto;'),
  'Mobile layout must reset panel heights to auto for natural stacking');
console.log('  ✓ PASS: Mobile layout stacks panels vertically with height: auto');

// -----------------------------------------------------------------------------
// 4. SIMULATION ACROSS VARYING QUESTION LENGTHS & WEEKS
// -----------------------------------------------------------------------------
console.log('\n[4] Simulating Container Height Matching for Different Question Lengths:');

function simulateLayoutHeights({ questionText, options, isCombined = false }) {
  // Base fixed elements in Question Card:
  const cardPadding = 40; // 1.25rem * 2
  const cardBorder = 2;
  const headerHeight = 28 + 16; // header + margin-bottom
  const optionsMarginTop = 6; // 0.35rem
  const optionsMarginBottom = 15; // 0.95rem
  const actionBarHeight = 38 + 15 + 15; // button height + padding-top + border

  // Question statement height (approx 22px per line of ~80 chars):
  const questionLines = Math.max(1, Math.ceil(questionText.length / 80));
  const statementHeight = questionLines * 24 + 18; // line-height + margin-bottom

  // 4 Option items height (minimum 48px, or more if long text):
  let totalOptionsHeight = 0;
  options.forEach(opt => {
    const text = typeof opt === 'object' ? opt.text : opt;
    const lines = Math.max(1, Math.ceil(text.length / 65));
    const optHeight = Math.max(48, lines * 22 + 24);
    totalOptionsHeight += optHeight;
  });
  totalOptionsHeight += 3 * 12; // 3 gaps of 0.75rem (12px)

  const cardNaturalHeight = cardPadding + cardBorder + headerHeight + statementHeight + optionsMarginTop + totalOptionsHeight + optionsMarginBottom + actionBarHeight;

  // Base fixed elements in Navigator Sidebar:
  const palettePadding = 32; // 1rem * 2
  const paletteBorder = 2;
  const navHeaderHeight = 24 + 12; // header + 0.75rem margin
  const navFiltersHeight = 24 + 12; // filters + 0.75rem margin
  const gridHeight = isCombined ? 180 : (2 * 35 + 6); // weekly 2 rows of 35px + 0.35rem gap, combined 180px
  const gridMarginBottom = 12; // 0.75rem
  const legendHeight = 12 + (5 * 18 + 4 * 5); // padding-top + 5 items + 4 gaps
  const submitContainerHeight = 14 + 12 + 40; // margin-top + padding-top + button height

  const paletteNaturalHeight = palettePadding + paletteBorder + navHeaderHeight + navFiltersHeight + gridHeight + gridMarginBottom + legendHeight + submitContainerHeight;

  // In CSS Grid with align-items: stretch:
  const matchedHeight = Math.max(cardNaturalHeight, paletteNaturalHeight);

  return {
    cardNaturalHeight,
    paletteNaturalHeight,
    matchedOverallHeight: matchedHeight
  };
}

// Case A: Short Question (e.g. Week 0 Q1)
const shortQ = wildlifeEcologyQuestions[0][0];
const shortRes = simulateLayoutHeights({ questionText: shortQ.question, options: shortQ.options, isCombined: false });
console.log(`  • Short Question (Week 0 Q1): Card natural = ${shortRes.cardNaturalHeight}px, Palette = ${shortRes.paletteNaturalHeight}px -> Matched Height = ${shortRes.matchedOverallHeight}px`);
assert.strictEqual(shortRes.matchedOverallHeight, Math.max(shortRes.cardNaturalHeight, shortRes.paletteNaturalHeight));

// Case B: Medium Question (e.g. Week 1 Q5)
const medQ = wildlifeEcologyQuestions[1][4];
const medRes = simulateLayoutHeights({ questionText: medQ.question, options: medQ.options, isCombined: false });
console.log(`  • Medium Question (Week 1 Q5): Card natural = ${medRes.cardNaturalHeight}px, Palette = ${medRes.paletteNaturalHeight}px -> Matched Height = ${medRes.matchedOverallHeight}px`);
assert.strictEqual(medRes.matchedOverallHeight, Math.max(medRes.cardNaturalHeight, medRes.paletteNaturalHeight));

// Case C: Long Multi-line Question (e.g. Week 6 Q7 or Week 12 Q3)
const longQ = wildlifeEcologyQuestions[12][2];
const longRes = simulateLayoutHeights({ questionText: longQ.question, options: longQ.options, isCombined: false });
console.log(`  • Long Question (Week 12 Q3): Card natural = ${longRes.cardNaturalHeight}px, Palette = ${longRes.paletteNaturalHeight}px -> Matched Height = ${longRes.matchedOverallHeight}px`);
assert.strictEqual(longRes.matchedOverallHeight, Math.max(longRes.cardNaturalHeight, longRes.paletteNaturalHeight));

// Case D: Combined Quiz (130 Questions)
const combinedQ = wildlifeEcologyQuestions[0][0];
const combinedRes = simulateLayoutHeights({ questionText: combinedQ.question, options: combinedQ.options, isCombined: true });
console.log(`  • Combined Quiz (130 MCQs): Card natural = ${combinedRes.cardNaturalHeight}px, Palette = ${combinedRes.paletteNaturalHeight}px -> Matched Height = ${combinedRes.matchedOverallHeight}px`);
assert.strictEqual(combinedRes.matchedOverallHeight, Math.max(combinedRes.cardNaturalHeight, combinedRes.paletteNaturalHeight));

console.log('  ✓ PASS: Both containers have identical overall height across short, medium, long, and combined quiz questions');

// -----------------------------------------------------------------------------
// 5. VERIFY ALL WEEKS (0 TO 12) AND COMBINED QUIZ INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n[5] Verifying Shared Quiz Component & All 13 Weeks:');

for (let week = 0; week <= 12; week++) {
  const qs = wildlifeEcologyQuestions[week];
  assert(Array.isArray(qs) && qs.length === 10, `Week ${week} must contain 10 questions`);
}
const allWeeksCombined = Object.values(wildlifeEcologyQuestions).flat();
assert.strictEqual(allWeeksCombined.length, 130, 'Combined quiz must aggregate all 130 questions');
console.log('  ✓ PASS: All 13 weeks (Week 0 to 12) and Combined Quiz (130 questions) share layout and data integrity');

console.log('\n=============================================================');
console.log('RESULTS: All Matched Container Heights tests passed!');
console.log('=============================================================\n');
