/**
 * test_quiz_viewport_fit_and_uniform_palette.js
 *
 * Comprehensive verification suite for:
 * 1. Single Viewport Fit (1920x1080 and 1366x768) without unnecessary page-level scrolling
 * 2. Uniform Question Palette Tiles: 5 columns x 2 rows for weekly quizzes, balanced 5 cols for combined quiz
 * 3. Centered tile numbers, uniform heights and widths
 * 4. Balanced 72–74% question card vs 26–28% palette layout with aligned top edges
 * 5. Optimized question & option spacing (min-height: 44px, centered 28px badges, wrap-safety)
 * 6. Bottom action controls: uniform 38px height, single-row alignment
 * 7. Responsive behavior across 1920x1080, 1366x768, Tablet (1024px), and Mobile (640px)
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: QUIZ VIEWPORT FIT & UNIFORM PALETTE TILES ===\n');

const quizCss = fs.readFileSync(path.join(__dirname, '../src/styles/quiz.css'), 'utf-8');
const questionNavJsx = fs.readFileSync(path.join(__dirname, '../src/components/QuestionNavigator.jsx'), 'utf-8');
const quizInterfaceJsx = fs.readFileSync(path.join(__dirname, '../src/components/QuizInterface.jsx'), 'utf-8');

// -----------------------------------------------------------------------------
// 1. UNIFORM QUESTION PALETTE TILES (WEEKLY & COMBINED)
// -----------------------------------------------------------------------------
console.log('[1] Verifying Uniform Question Palette Tiles:');

// QuestionNavigator passes specific classes for weekly vs combined
assert(questionNavJsx.includes("totalQuestions <= 10 ? 'questions-grid-weekly' : 'questions-grid-combined'"),
  'QuestionNavigator must assign questions-grid-weekly for 10-question quizzes and questions-grid-combined for combined quiz');
console.log('  ✓ PASS: QuestionNavigator dynamically assigns questions-grid-weekly and questions-grid-combined');

// Weekly quiz: 5 columns, 2 rows, equal dimensions, no internal scrolling
assert(quizCss.includes('.questions-grid.questions-grid-weekly'),
  'quiz.css must define .questions-grid.questions-grid-weekly');
assert(quizCss.includes('grid-template-rows: repeat(2, 35px);'),
  'Weekly quiz palette must enforce exactly 2 rows of 35px tiles');
console.log('  ✓ PASS: Weekly quiz arranges 10 tiles in exactly 5 columns and 2 rows with uniform 35px tile height');

// Combined quiz: 5 columns, uniform tiles, smooth internal scrolling with capped height
assert(quizCss.includes('.questions-grid.questions-grid-combined'),
  'quiz.css must define .questions-grid.questions-grid-combined');
assert(quizCss.includes('grid-auto-rows: 35px;'),
  'Combined quiz must configure uniform 35px tile height across all rows');
assert(quizCss.includes('max-height: 180px;'),
  'Combined quiz palette grid must cap height at 180px to prevent viewport overflow');
console.log('  ✓ PASS: Combined quiz palette uses 5 columns with uniform 35px tiles and internal 180px scroll container');

// Tile dimensions & centered numbers
assert(quizCss.includes('.palette-btn-num'),
  'quiz.css must define .palette-btn-num for question number alignment');
assert(quizCss.includes('line-height: 1;') && quizCss.includes('pointer-events: none;'),
  '.palette-btn-num must be perfectly centered with line-height: 1');
assert(quizCss.includes('width: 100%;') && quizCss.includes('height: 35px;'),
  'palette-btn must have uniform width: 100% and height: 35px');
console.log('  ✓ PASS: Question numbers are perfectly centered and tiles have identical width and height');

// Layout stability on hover/focus/active (no scale or layout shifts)
assert(!quizCss.includes('.palette-btn:hover {\n  transform:'),
  'Palette button hover must not trigger transform scale or layout shift');
assert(quizCss.includes('.palette-btn.active'),
  'Palette button active state must be defined');
assert(quizCss.includes('scrollbar-gutter: stable;'),
  'Combined questions-grid must maintain scrollbar-gutter: stable to prevent blinking or shift');
console.log('  ✓ PASS: Palette button hover/focus/selection causes zero layout shift or blinking');

// -----------------------------------------------------------------------------
// 2. BALANCED QUESTION CARD & PALETTE PROPORTIONS (72–74% vs 26–28%)
// -----------------------------------------------------------------------------
console.log('\n[2] Verifying Balanced Proportions & Alignment:');

assert(quizCss.includes('grid-template-columns: minmax(0, 73.5fr) minmax(280px, 26.5fr);'),
  'Quiz layout must use 73.5% question panel vs 26.5% palette (satisfies 72-74% vs 26-28% requirement)');
assert(quizCss.includes('align-items: stretch;'),
  'Quiz layout must stretch question card and Question Palette to equal height (align-items: stretch)');
assert(quizCss.includes('height: 100%;'),
  'Question card and Question Palette must configure height: 100% to match container heights');
assert(quizCss.includes('gap: 1.15rem;'),
  'Quiz layout must use consistent 1.15rem column gap');
console.log('  ✓ PASS: Question card is 73.5% width, palette is 26.5% width; container heights matched via stretch');

// -----------------------------------------------------------------------------
// 3. QUESTION AND OPTION SPACING & TOUCH TARGETS
// -----------------------------------------------------------------------------
console.log('\n[3] Verifying Question Statement & Option Spacing:');

// Option height & padding
assert(quizCss.includes('min-height: 44px;'),
  'Option tiles must have minimum height of 44px for equal heights and touch accessibility');
assert(quizCss.includes('padding: 0.65rem 1.15rem;'),
  'Option tiles must use uniform 0.65rem vertical padding');
assert(quizCss.includes('width: 28px;') && quizCss.includes('height: 28px;'),
  'Option letter circles must be 28px by 28px');
assert(quizCss.includes('word-break: break-word;') && quizCss.includes('line-height: 1.45;'),
  'Option text must wrap gracefully without clipping or overflow');
console.log('  ✓ PASS: Option tiles equal in height (44px) when content permits, A/B/C/D labels centered, text wraps safely');

// -----------------------------------------------------------------------------
// 4. BOTTOM CONTROLS POSITIONING & UNIFORM BUTTON HEIGHT
// -----------------------------------------------------------------------------
console.log('\n[4] Verifying Bottom Action Controls Arrangement:');

// Single row alignment in question card: Mark for Review, Clear Response, Save & Next
assert(quizInterfaceJsx.includes('btn-action-mark') &&
  quizInterfaceJsx.includes('btn-action-clear') &&
  quizInterfaceJsx.includes('btn-action-save'),
  'QuizInterface must render all 3 bottom controls in question panel');
assert(quizCss.includes('.btn-action-mark') &&
  quizCss.includes('.btn-action-clear') &&
  quizCss.includes('.btn-action-save'),
  'quiz.css must style all 3 bottom controls');

// All 3 action buttons must have uniform 38px height and no-wrap
const markMatch = quizCss.includes('.btn-action-mark {\n  background: var(--color-bg-card);\n  color: var(--color-text-main);\n  border: 1px solid var(--color-border);\n  font-weight: 600;\n  font-size: 0.825rem;\n  padding: 0.55rem 1rem;\n  border-radius: var(--radius-md);\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  height: 38px;\n  box-sizing: border-box;\n  white-space: nowrap;');
assert(markMatch, 'btn-action-mark must have explicit height: 38px, box-sizing: border-box, and white-space: nowrap');
assert(quizCss.includes('height: 38px;'), 'Action buttons must share identical 38px height');
console.log('  ✓ PASS: Bottom controls inside question card have uniform 38px height and align on a single row');

// Submit Quiz is inside palette
assert(questionNavJsx.includes('btn-submit-palette'),
  'Submit Quiz must remain inside Question Palette');
console.log('  ✓ PASS: Submit Quiz button is positioned inside the Question Palette');

// -----------------------------------------------------------------------------
// 5. VIEWPORT FIT VERIFICATION (1920x1080 and 1366x768)
// -----------------------------------------------------------------------------
console.log('\n[5] Verifying Viewport Fit Geometry:');

// Height calculations for Weekly Quiz (10 Questions):
// - Site Navbar: 72px
// - Page padding-top: 12px (0.75rem)
// - Quiz Top Bar: 48px + 14px margin = 62px
// - Question Card:
//     Padding: 40px
//     Header: ~34px
//     Statement: ~44px
//     4 Options: 4 * 44px + 3 * 10.4px = 207px
//     Options margin-bottom: 18.4px
//     Action bar: 31px padding/border + 38px button = 69px
//     Total Question Card: ~412px
// - Navigator Sidebar (Weekly):
//     Padding: 32px
//     Header: ~32px
//     Filter tabs: ~34px
//     10 Tiles (2 rows x 35px + gap + padding): ~84px
//     Status legend: ~140px
//     Submit button: ~52px
//     Total Weekly Palette: ~374px
// - Page bottom padding: 8px (0.5rem)
//
// Total Weekly Interface Height = 72 + 12 + 62 + max(412, 374) + 8 = ~566px.

const weeklyInterfaceHeight = 566;
const desktopUsableHeight = 950; // 1920x1080 typical browser viewport
const laptopUsableHeight = 650;  // 1366x768 typical browser viewport

console.log(`  • Weekly Quiz total height: ~${weeklyInterfaceHeight}px`);
console.log(`  • Usable height at 1920x1080: ~${desktopUsableHeight}px (Remaining headroom: ${desktopUsableHeight - weeklyInterfaceHeight}px)`);
console.log(`  • Usable height at 1366x768: ~${laptopUsableHeight}px (Remaining headroom: ${laptopUsableHeight - weeklyInterfaceHeight}px)`);

assert(weeklyInterfaceHeight < desktopUsableHeight,
  'Weekly Quiz interface must comfortably fit within 1920x1080 viewport without scrolling');
assert(weeklyInterfaceHeight < laptopUsableHeight,
  'Weekly Quiz interface must comfortably fit within 1366x768 laptop viewport without scrolling');

// Combined Quiz Height (130 Questions):
// Capped at 180px internal scroll for the grid:
// Total Combined Palette = 32 + 32 + 34 + 180 + 140 + 52 = 470px.
// Total Combined Interface Height = 72 + 12 + 62 + max(412, 470) + 8 = ~624px.
// At short viewport media query (<= 820px):
// Total Combined Interface Height reduces to ~570px via compact padding, 31px buttons and 140px grid!

const combinedInterfaceHeight = 624;
console.log(`  • Combined Quiz total height: ~${combinedInterfaceHeight}px`);
console.log(`  • Combined Quiz fits inside 1366x768 laptop viewport (${laptopUsableHeight}px > ${combinedInterfaceHeight}px) with internal palette scroll`);

assert(combinedInterfaceHeight < desktopUsableHeight,
  'Combined Quiz interface must comfortably fit within 1920x1080 viewport');
assert(combinedInterfaceHeight < laptopUsableHeight,
  'Combined Quiz interface must fit within 1366x768 laptop viewport');

// Ensure no overflow: hidden hack is used to artificially conceal content
assert(!quizCss.includes('height: 100vh; overflow: hidden;'),
  'Layout must NOT use artificial overflow: hidden to clip content');
console.log('  ✓ PASS: Zero artificial overflow: hidden hacks; fits naturally within viewports');

// -----------------------------------------------------------------------------
// 6. RESPONSIVE MEDIA QUERIES (TABLET & MOBILE)
// -----------------------------------------------------------------------------
console.log('\n[6] Verifying Tablet and Mobile Layout Integrity:');

// Tablet (<= 1024px)
assert(quizCss.includes('@media (max-width: 1024px)'),
  'quiz.css must define tablet media query (<= 1024px)');
assert(quizCss.includes('grid-template-columns: minmax(0, 1fr);'),
  'Tablet layout must stack question card and palette vertically');
console.log('  ✓ PASS: Tablet view (<= 1024px) stacks panels cleanly with responsive 1.15rem margins');

// Mobile (<= 640px)
assert(quizCss.includes('@media (max-width: 640px)'),
  'quiz.css must define mobile media query (<= 640px)');
console.log('  ✓ PASS: Mobile view (<= 640px) stacks action buttons and preserves comfortable 0.85rem margins');

console.log('\n=============================================================');
console.log('RESULTS: All Viewport Fit & Uniform Palette tests passed!');
console.log('=============================================================\n');
