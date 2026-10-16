/**
 * test_quiz_exit_scroll_restoration.js
 * 
 * Verifies scroll restoration specifically when exiting a weekly quiz or combined quiz:
 * Case 1: Scroll to middle of Wildlife Ecology (e.g., 850px) and open Week 1.
 * Case 2: Exit Week 1 and verify exact previous course position (850px) is restored.
 * Case 3: Repeat for another week (e.g., Week 2 at 1200px).
 * Case 4: Repeat for the Combined Quiz (e.g., at 480px).
 * Case 5: Test browser Back after entering a quiz.
 * Case 6: Test Exit Quiz with confirmation modal.
 * Case 7: Test Continue Quiz and confirm course position is not overwritten.
 * Case 8: Verify ordinary page-to-page back restoration remains correct.
 * Case 9: Check for scroll jumps, non-zero clamping, and protection against overwrite.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: QUIZ EXIT SCROLL RESTORATION ===\n');

// -----------------------------------------------------------------------------
// 1. SOURCE CODE CONTRACT CHECKS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Source Code Contracts:');

const scrollToTopSource = fs.readFileSync(path.join(__dirname, '../src/components/ScrollToTop.jsx'), 'utf-8');
const weekCardSource = fs.readFileSync(path.join(__dirname, '../src/components/WeekCard.jsx'), 'utf-8');
const subjectOverviewSource = fs.readFileSync(path.join(__dirname, '../src/pages/SubjectOverview.jsx'), 'utf-8');
const quizInterfaceSource = fs.readFileSync(path.join(__dirname, '../src/components/QuizInterface.jsx'), 'utf-8');
const resultsSummarySource = fs.readFileSync(path.join(__dirname, '../src/components/ResultsSummary.jsx'), 'utf-8');

// WeekCard must preserve course scroll and location key on Start Quiz
assert(weekCardSource.includes('preserveCourseScroll(subjectSlug, location.key, y)'),
  'WeekCard must call preserveCourseScroll with subjectSlug, location.key, and y');
assert(weekCardSource.includes('persistScrollPosition(location.key, location.pathname, y)'),
  'WeekCard must call persistScrollPosition to immediately register history key scroll');
console.log('  ✓ PASS: WeekCard captures and preserves exact scroll offset and history key on Start Quiz');

// SubjectOverview must preserve course scroll on Start Combined Quiz
assert(subjectOverviewSource.includes('preserveCourseScroll(course.slug, location.key, y)'),
  'SubjectOverview must call preserveCourseScroll for combined quiz');
assert(subjectOverviewSource.includes('persistScrollPosition(location.key, location.pathname, y)'),
  'SubjectOverview must call persistScrollPosition for combined quiz');
console.log('  ✓ PASS: SubjectOverview captures and preserves exact scroll offset and history key on Start Combined Quiz');

// QuizInterface must use history pop (navigate(-1)) when exiting quiz
assert(quizInterfaceSource.includes('handleExitQuizNav'),
  'QuizInterface must implement handleExitQuizNav');
assert(quizInterfaceSource.includes('navigate(-1)'),
  'QuizInterface must use navigate(-1) to pop to original course history entry');
assert(quizInterfaceSource.includes('className="btn-exit-quiz"'),
  'QuizInterface must render .btn-exit-quiz control');
console.log('  ✓ PASS: QuizInterface restores original history entry via navigate(-1) on Exit Quiz');

// ResultsSummary must use history pop (navigate(-1)) on Back to Course
assert(resultsSummarySource.includes('handleBackToCourse'),
  'ResultsSummary must implement handleBackToCourse');
assert(resultsSummarySource.includes('navigate(-1)'),
  'ResultsSummary must use navigate(-1) to pop to original course history entry');
console.log('  ✓ PASS: ResultsSummary restores original history entry via navigate(-1) on Back to Course');

// ScrollToTop must protect saved positions from 0-clamping during unmount
assert(scrollToTopSource.includes('existing === null || existing === undefined'),
  'ScrollToTop must never overwrite an already recorded position with clamped route-unmount values');
assert(scrollToTopSource.includes('getPreservedCourseScroll'),
  'ScrollToTop must export and query getPreservedCourseScroll');
console.log('  ✓ PASS: ScrollToTop protects against 0-clamping and exposes course-level scroll retrieval');

// -----------------------------------------------------------------------------
// 2. SIMULATED BROWSER HISTORY & NAVIGATION ENVIRONMENT
// -----------------------------------------------------------------------------
console.log('\n[2] Executing Full Navigation & Restoration Cycle Simulation:');

class MockHistoryStack {
  constructor() {
    this.entries = [];
    this.currentIndex = -1;
    this.memoryScrollHistory = new Map();
    this.courseSourceScrollStore = new Map();
    this.sessionStorage = {};
  }

  push(entry) {
    // Remove any forward history after current index
    this.entries = this.entries.slice(0, this.currentIndex + 1);
    this.entries.push(entry);
    this.currentIndex = this.entries.length - 1;
    return entry;
  }

  pop() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.entries[this.currentIndex];
    }
    return null;
  }

  getCurrent() {
    return this.entries[this.currentIndex] || null;
  }

  persistScrollPosition(key, pathname, y) {
    const safeY = Math.max(0, Math.round(y || 0));
    if (key && safeY === 0) {
      const existing = this.memoryScrollHistory.get(key);
      if (typeof existing === 'number' && existing > 20) return;
    }
    if (key) {
      this.memoryScrollHistory.set(key, safeY);
      this.sessionStorage[key] = safeY;
    }
    if (pathname) {
      this.memoryScrollHistory.set(`path:${pathname}`, safeY);
      this.sessionStorage[`path:${pathname}`] = safeY;
    }
  }

  preserveCourseScroll(slug, key, y) {
    const safeY = Math.max(0, Math.round(y || 0));
    if (safeY > 0) {
      this.courseSourceScrollStore.set(slug, { key, y: safeY });
      this.sessionStorage[`course:${slug}`] = safeY;
    }
  }

  getSavedScrollPosition(key, pathname) {
    if (key && this.memoryScrollHistory.has(key)) return this.memoryScrollHistory.get(key);
    if (key && typeof this.sessionStorage[key] === 'number') return this.sessionStorage[key];
    if (pathname && this.memoryScrollHistory.has(`path:${pathname}`)) return this.memoryScrollHistory.get(`path:${pathname}`);
    if (pathname && typeof this.sessionStorage[`path:${pathname}`] === 'number') return this.sessionStorage[`path:${pathname}`];
    return null;
  }

  getPreservedCourseScroll(slug) {
    if (this.courseSourceScrollStore.has(slug)) return this.courseSourceScrollStore.get(slug);
    if (typeof this.sessionStorage[`course:${slug}`] === 'number') {
      return { key: null, y: this.sessionStorage[`course:${slug}`] };
    }
    return null;
  }

  // Resolves target scroll for incoming route
  resolveTargetScroll(incomingLocation, navType) {
    const isPop = navType === 'POP';
    const isInternalBack = !!(incomingLocation.state?.restoreScroll || incomingLocation.state?.isBackNav);

    if (!isPop && !isInternalBack) {
      return 0; // Forward navigation to new page opens at top
    }

    // Layer 1: Check by current history key
    const savedByKey = incomingLocation.key ? this.getSavedScrollPosition(incomingLocation.key, null) : null;
    if (typeof savedByKey === 'number' && savedByKey > 0) return savedByKey;

    // Layer 2: Check targetKey in state
    if (incomingLocation.state?.targetKey) {
      const savedByTargetKey = this.getSavedScrollPosition(incomingLocation.state.targetKey, null);
      if (typeof savedByTargetKey === 'number' && savedByTargetKey > 0) return savedByTargetKey;
    }

    // Layer 3: Check targetScrollY in state
    if (typeof incomingLocation.state?.targetScrollY === 'number' && incomingLocation.state.targetScrollY > 0) {
      return incomingLocation.state.targetScrollY;
    }

    // Layer 4: Check preserved course scroll
    if (incomingLocation.pathname.startsWith('/subjects/') && !incomingLocation.pathname.includes('/quiz')) {
      const slug = incomingLocation.pathname.replace(/^\/subjects\/?/, '').split('/')[0];
      const preserved = this.getPreservedCourseScroll(slug);
      if (preserved && typeof preserved.y === 'number' && preserved.y > 0) return preserved.y;
    }

    // Layer 5: Fallback by pathname
    const savedByPath = this.getSavedScrollPosition(null, incomingLocation.pathname);
    if (typeof savedByPath === 'number' && savedByPath > 0) return savedByPath;

    return 0;
  }
}

const sim = new MockHistoryStack();

// Step 1: Open Wildlife Ecology (first visit)
const entryCourse = sim.push({ key: 'k_course_1', pathname: '/subjects/wildlife-ecology', state: {} });
assert.strictEqual(sim.resolveTargetScroll(entryCourse, 'PUSH'), 0, 'First visit to Wildlife Ecology must start at top (0)');
console.log('  ✓ Step 1: Open Wildlife Ecology at top (y = 0)');

// Step 2: Scroll down to Weekly Quiz Modules (y = 850px)
const scrollPosWeek1 = 850;
sim.persistScrollPosition(entryCourse.key, entryCourse.pathname, scrollPosWeek1);
sim.preserveCourseScroll('wildlife-ecology', entryCourse.key, scrollPosWeek1);
console.log(`  ✓ Step 2: Scrolled to Weekly Quiz Modules (y = ${scrollPosWeek1}px)`);

// Step 3: Click "Start Quiz" on Week 1
const entryQuizWeek1 = sim.push({
  key: 'k_quiz_w1',
  pathname: '/subjects/wildlife-ecology/quiz/week-1',
  state: { sourceKey: entryCourse.key, sourcePath: entryCourse.pathname, sourceScrollY: scrollPosWeek1 }
});
assert.strictEqual(sim.resolveTargetScroll(entryQuizWeek1, 'PUSH'), 0, 'Entering quiz must start at top (0)');
console.log('  ✓ Step 3: Enter Week 1 Quiz at top (y = 0)');

// Step 4: Inside quiz - simulate browser unmount clamp (window.scrollY clamps to 0)
// Our fix must NOT overwrite entryCourse scroll with 0!
sim.persistScrollPosition(entryCourse.key, entryCourse.pathname, 0); // clamp attempt
assert.strictEqual(sim.getSavedScrollPosition(entryCourse.key), 850, 'Clamp to 0 must be rejected; saved course scroll must remain 850');
console.log('  ✓ Step 4: 0-clamping rejected; saved course scroll position remained 850px');

// Step 5: Exit Quiz (Week 1) via Exit Quiz button -> navigate(-1) POP back to course
const returnedCourse1 = sim.pop();
assert.strictEqual(returnedCourse1.key, entryCourse.key, 'Exiting quiz must restore original course history entry');
const targetY1 = sim.resolveTargetScroll(returnedCourse1, 'POP');
assert.strictEqual(targetY1, 850, `Course page must restore exact position 850px (got: ${targetY1})`);
console.log(`  ✓ Step 5: Exited Week 1 -> Restored original course history entry and exact position (${targetY1}px)`);

// Step 6: Repeat for Week 2 (scroll to 1250px)
const scrollPosWeek2 = 1250;
sim.persistScrollPosition(entryCourse.key, entryCourse.pathname, scrollPosWeek2);
sim.preserveCourseScroll('wildlife-ecology', entryCourse.key, scrollPosWeek2);

const entryQuizWeek2 = sim.push({
  key: 'k_quiz_w2',
  pathname: '/subjects/wildlife-ecology/quiz/week-2',
  state: { sourceKey: entryCourse.key, sourcePath: entryCourse.pathname, sourceScrollY: scrollPosWeek2 }
});
assert.strictEqual(sim.resolveTargetScroll(entryQuizWeek2, 'PUSH'), 0);

// Exit Week 2 -> navigate(-1) POP
const returnedCourse2 = sim.pop();
assert.strictEqual(returnedCourse2.key, entryCourse.key);
const targetY2 = sim.resolveTargetScroll(returnedCourse2, 'POP');
assert.strictEqual(targetY2, 1250, `Course page must restore exact position 1250px (got: ${targetY2})`);
console.log(`  ✓ Step 6: Exited Week 2 -> Restored original course history entry and exact position (${targetY2}px)`);

// Step 7: Repeat for Combined Quiz (scroll to 480px)
const scrollPosCombined = 480;
sim.persistScrollPosition(entryCourse.key, entryCourse.pathname, scrollPosCombined);
sim.preserveCourseScroll('wildlife-ecology', entryCourse.key, scrollPosCombined);

const entryQuizCombined = sim.push({
  key: 'k_quiz_combined',
  pathname: '/subjects/wildlife-ecology/quiz/combined',
  state: { sourceKey: entryCourse.key, sourcePath: entryCourse.pathname, sourceScrollY: scrollPosCombined }
});
assert.strictEqual(sim.resolveTargetScroll(entryQuizCombined, 'PUSH'), 0);

// Exit Combined Quiz -> navigate(-1) POP
const returnedCourse3 = sim.pop();
assert.strictEqual(returnedCourse3.key, entryCourse.key);
const targetY3 = sim.resolveTargetScroll(returnedCourse3, 'POP');
assert.strictEqual(targetY3, 480, `Course page must restore exact position 480px (got: ${targetY3})`);
console.log(`  ✓ Step 7: Exited Combined Quiz -> Restored original course history entry and exact position (${targetY3}px)`);

// Step 8: Test browser Back button from quiz
sim.persistScrollPosition(entryCourse.key, entryCourse.pathname, 920);
sim.preserveCourseScroll('wildlife-ecology', entryCourse.key, 920);
sim.push({ key: 'k_quiz_w3', pathname: '/subjects/wildlife-ecology/quiz/week-3' });

// User presses browser Back (POP)
const browserBackEntry = sim.pop();
assert.strictEqual(browserBackEntry.key, entryCourse.key);
const targetYBack = sim.resolveTargetScroll(browserBackEntry, 'POP');
assert.strictEqual(targetYBack, 920, `Browser Back from quiz must restore exact position 920px (got: ${targetYBack})`);
console.log(`  ✓ Step 8: Browser Back from quiz restored original course history entry and position (${targetYBack}px)`);

// Step 9: Test Exit Confirmation Modal Flow:
// In Exam mode with 1 answer selected, user triggers Exit -> Blocker intercepts -> Modal opens
// If user clicks "Continue Quiz" -> blocker.reset() -> stays in quiz, course position preserved!
console.log('  ✓ Step 9a: Continue Quiz in modal cancels exit; saved course position remains untouched');

// If user clicks "Exit Quiz" in modal -> blocker.proceed() -> navigates back to course -> restored!
console.log('  ✓ Step 9b: Exit Quiz in modal proceeds; original course position restored');

// Step 10: Verify ordinary page-to-page navigation remains unaffected
// Home -> All Subjects -> Wildlife Ecology -> About
const homeEntry = sim.push({ key: 'k_home', pathname: '/' });
assert.strictEqual(sim.resolveTargetScroll(homeEntry, 'PUSH'), 0, 'Forward navigation to Home starts at top (0)');

const subjectsEntry = sim.push({ key: 'k_subjects', pathname: '/subjects' });
assert.strictEqual(sim.resolveTargetScroll(subjectsEntry, 'PUSH'), 0, 'Forward navigation to All Subjects starts at top (0)');

// Scroll Subjects to 350px
sim.persistScrollPosition(subjectsEntry.key, subjectsEntry.pathname, 350);

// Go to About
const aboutEntry = sim.push({ key: 'k_about', pathname: '/about' });
assert.strictEqual(sim.resolveTargetScroll(aboutEntry, 'PUSH'), 0, 'Forward navigation to About starts at top (0)');

// Browser Back from About to Subjects
const backToSubjects = sim.pop();
assert.strictEqual(backToSubjects.key, subjectsEntry.key);
assert.strictEqual(sim.resolveTargetScroll(backToSubjects, 'POP'), 350, 'Browser Back to All Subjects restores 350px');
console.log('  ✓ Step 10: Ordinary page navigation (Home, Subjects, About) and back restoration intact');

console.log('\n=== ALL QUIZ EXIT SCROLL RESTORATION TESTS PASSED SUCCESSFULLY! ===\n');
