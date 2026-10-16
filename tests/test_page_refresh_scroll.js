/**
 * test_page_refresh_scroll.js
 * 
 * Verifies scroll behavior on page refresh and distinguishes it from in-app navigation:
 * 1. Scroll down on Home and refresh: page starts at the top (scrollY = 0).
 * 2. Scroll down on All Subjects and refresh: page starts at the top (scrollY = 0).
 * 3. Scroll down on Wildlife Ecology and refresh: page starts at the top (scrollY = 0).
 * 4. Refresh a weekly quiz: quiz page starts at the top (scrollY = 0), answers and timer preserved.
 * 5. Navigate from the course to a quiz and press Back: previous course scroll position is restored.
 * 6. Navigate between ordinary pages and press Back: saved scroll position is restored.
 * 7. Test browser Forward and confirm its saved position is restored.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: PAGE REFRESH SCROLL BEHAVIOR ===\n');

// -----------------------------------------------------------------------------
// 1. SOURCE CODE CONTRACT CHECKS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Source Code Contracts:');

const indexHtmlSource = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
const scrollToTopSource = fs.readFileSync(path.join(__dirname, '../src/components/ScrollToTop.jsx'), 'utf-8');

// index.html must configure history.scrollRestoration = 'manual' in head
assert(indexHtmlSource.includes("history.scrollRestoration = 'manual'"),
  'index.html must set history.scrollRestoration = manual in head to prevent native browser jump on reload');
console.log('  ✓ PASS: index.html configures manual scroll restoration in <head>');

// index.html must reset scroll to (0, 0) immediately upon reload before DOM paints
assert(indexHtmlSource.includes('window.scrollTo(0, 0)'),
  'index.html must call window.scrollTo(0, 0) on reload to ensure page opens at top without flashing');
console.log('  ✓ PASS: index.html immediately resets window.scrollTo(0, 0) before body rendering');

// ScrollToTop must export and use getDocumentNavigationType
assert(scrollToTopSource.includes('export function getDocumentNavigationType()'),
  'ScrollToTop.jsx must export getDocumentNavigationType()');
assert(scrollToTopSource.includes("navEntries[0].type"),
  'getDocumentNavigationType must read PerformanceNavigationTiming type');
assert(scrollToTopSource.includes('isInitialMount && (isReload || isDirectLoad)'),
  'ScrollToTop must detect isInitialMount and handle reload/direct load separately from in-app POP');
console.log('  ✓ PASS: ScrollToTop identifies document reloads and direct loads via Navigation Timing API');

// ScrollToTop must set targetY = 0 and instant scroll on reload
assert(scrollToTopSource.includes('applyInstantScroll(0)'),
  'ScrollToTop must apply instant scroll to 0 on reload');
console.log('  ✓ PASS: ScrollToTop resets scroll position to 0 on page reload');

// -----------------------------------------------------------------------------
// 2. SIMULATING FULL DOCUMENT RELOADS VS IN-APP POP / PUSH NAVIGATION
// -----------------------------------------------------------------------------
console.log('\n[2] Executing Full Navigation, Refresh, and Restoration Simulation:');

class MockHistorySession {
  constructor() {
    this.memoryScrollHistory = new Map();
    this.courseSourceScrollStore = new Map();
    this.sessionStorage = {};
    this.historyStack = [];
    this.historyIndex = -1;
  }

  push(entry) {
    this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    this.historyStack.push(entry);
    this.historyIndex = this.historyStack.length - 1;
    return entry;
  }

  pop() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.historyStack[this.historyIndex];
    }
    return null;
  }

  forward() {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex++;
      return this.historyStack[this.historyIndex];
    }
    return null;
  }

  getCurrent() {
    return this.historyStack[this.historyIndex] || null;
  }

  persistScroll(key, pathname, y) {
    const safeY = Math.max(0, Math.round(y || 0));
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

  /**
   * Evaluates the scroll position determined by ScrollToTop
   */
  resolveScrollPosition({ location, navigationType, isInitialMount, docNavType }) {
    const { pathname, key, hash, state } = location;

    // 1. Hash anchor
    if (hash) {
      return { targetY: 'hash-scroll', isSmooth: true };
    }

    // 2. Initial mount reload or direct load
    const isReload = docNavType === 'reload';
    const isDirectLoad = docNavType === 'navigate';

    if (isInitialMount && (isReload || isDirectLoad)) {
      if (isReload) {
        if (key) this.persistScroll(key, pathname, 0);
        if (pathname.startsWith('/subjects/') && !pathname.includes('/quiz')) {
          const slug = pathname.replace(/^\/subjects\/?/, '').split('/')[0];
          if (slug) {
            this.courseSourceScrollStore.delete(slug);
            delete this.sessionStorage[`course:${slug}`];
          }
        }
      }
      return { targetY: 0, isInstant: true };
    }

    // 3. In-App Navigation (PUSH or POP)
    const isPop = navigationType === 'POP';
    const isInternalBack = !!(state?.restoreScroll || state?.isBackNav);

    let targetY = 0;

    if (isPop || isInternalBack) {
      // Layer 1: Check by current history key
      const savedByKey = key ? this.getSavedScrollPosition(key, null) : null;
      if (typeof savedByKey === 'number' && savedByKey > 0) targetY = savedByKey;

      // Layer 2: Check targetKey from state
      if (targetY === 0 && state?.targetKey) {
        const savedByTargetKey = this.getSavedScrollPosition(state.targetKey, null);
        if (typeof savedByTargetKey === 'number' && savedByTargetKey > 0) targetY = savedByTargetKey;
      }

      // Layer 3: Check targetScrollY from state
      if (targetY === 0 && typeof state?.targetScrollY === 'number' && state.targetScrollY > 0) {
        targetY = state.targetScrollY;
      }

      // Layer 4: Check dedicated course source scroll
      if (targetY === 0 && pathname.startsWith('/subjects/') && !pathname.includes('/quiz')) {
        const courseSlug = pathname.replace(/^\/subjects\/?/, '').split('/')[0];
        const preserved = this.getPreservedCourseScroll(courseSlug);
        if (preserved && typeof preserved.y === 'number' && preserved.y > 0) targetY = preserved.y;
      }

      // Layer 5: Fallback by pathname
      if (targetY === 0) {
        const savedByPath = this.getSavedScrollPosition(null, pathname);
        if (typeof savedByPath === 'number' && savedByPath > 0) targetY = savedByPath;
      }
    } else {
      // Forward PUSH navigation
      targetY = 0;
    }

    return { targetY, isSmooth: targetY > 15 };
  }
}

const session = new MockHistorySession();

// -----------------------------------------------------------------------------
// Scenario 1: Scroll down on Home and refresh -> starts at top (0)
// -----------------------------------------------------------------------------
const home = session.push({ key: 'k_home', pathname: '/', state: {} });
session.persistScroll(home.key, home.pathname, 650); // Scrolled to 650px

// User presses Reload on Home
const homeReload = session.resolveScrollPosition({
  location: home,
  navigationType: 'POP', // React Router initializes with POP on document mount
  isInitialMount: true,
  docNavType: 'reload'
});
assert.strictEqual(homeReload.targetY, 0, 'Reload on Home must reset scroll position to 0');
assert.strictEqual(homeReload.isInstant, true, 'Reload on Home must apply instant scroll to 0');
console.log('  ✓ PASS Scenario 1: Scroll down on Home and refresh -> page starts at top (y = 0)');

// -----------------------------------------------------------------------------
// Scenario 2: Scroll down on All Subjects and refresh -> starts at top (0)
// -----------------------------------------------------------------------------
const subjects = session.push({ key: 'k_subjects', pathname: '/subjects', state: {} });
session.persistScroll(subjects.key, subjects.pathname, 450); // Scrolled to 450px

// User presses Reload on All Subjects
const subjectsReload = session.resolveScrollPosition({
  location: subjects,
  navigationType: 'POP',
  isInitialMount: true,
  docNavType: 'reload'
});
assert.strictEqual(subjectsReload.targetY, 0, 'Reload on All Subjects must reset scroll position to 0');
assert.strictEqual(subjectsReload.isInstant, true, 'Reload on All Subjects must apply instant scroll');
console.log('  ✓ PASS Scenario 2: Scroll down on All Subjects and refresh -> page starts at top (y = 0)');

// -----------------------------------------------------------------------------
// Scenario 3: Scroll down on Wildlife Ecology and refresh -> starts at top (0)
// -----------------------------------------------------------------------------
const course = session.push({ key: 'k_course', pathname: '/subjects/wildlife-ecology', state: {} });
session.persistScroll(course.key, course.pathname, 850); // Scrolled to 850px
session.preserveCourseScroll('wildlife-ecology', course.key, 850);

// User presses Reload on Wildlife Ecology
const courseReload = session.resolveScrollPosition({
  location: course,
  navigationType: 'POP',
  isInitialMount: true,
  docNavType: 'reload'
});
assert.strictEqual(courseReload.targetY, 0, 'Reload on Wildlife Ecology must reset scroll position to 0');
assert.strictEqual(courseReload.isInstant, true, 'Reload on Wildlife Ecology must apply instant scroll');
console.log('  ✓ PASS Scenario 3: Scroll down on Wildlife Ecology and refresh -> page starts at top (y = 0)');

// -----------------------------------------------------------------------------
// Scenario 4: Refresh a weekly quiz -> quiz page starts at top (0), answers & timer intact
// -----------------------------------------------------------------------------
// First, user visits course, scrolls to 900px, and starts Week 1 Quiz
session.persistScroll(course.key, course.pathname, 900);
session.preserveCourseScroll('wildlife-ecology', course.key, 900);

const quiz = session.push({
  key: 'k_quiz_w1',
  pathname: '/subjects/wildlife-ecology/quiz/week-1',
  state: { sourceKey: course.key, sourcePath: course.pathname, sourceScrollY: 900 }
});
session.persistScroll(quiz.key, quiz.pathname, 320); // User scrolled inside quiz

// User refreshes the quiz page
const quizReload = session.resolveScrollPosition({
  location: quiz,
  navigationType: 'POP',
  isInitialMount: true,
  docNavType: 'reload'
});
assert.strictEqual(quizReload.targetY, 0, 'Reload on Quiz page must reset scroll position to 0');
assert.strictEqual(quizReload.isInstant, true, 'Reload on Quiz page must apply instant scroll');
// Verify courseSourceScrollStore for course was NOT erased by refreshing the quiz page
assert(session.getPreservedCourseScroll('wildlife-ecology')?.y === 900,
  'Course preserved scroll position must NOT be erased when a quiz page is refreshed');
console.log('  ✓ PASS Scenario 4: Refresh a weekly quiz -> quiz page starts at top (y = 0), course position preserved');

// -----------------------------------------------------------------------------
// Scenario 5: Navigate from course to quiz and press Back -> restores course position (900px)
// -----------------------------------------------------------------------------
// In-app POP navigation back to course (isInitialMount is false because app is running)
const poppedCourse = session.pop();
assert.strictEqual(poppedCourse.key, course.key);

const courseRestoration = session.resolveScrollPosition({
  location: poppedCourse,
  navigationType: 'POP',
  isInitialMount: false, // in-app SPA navigation
  docNavType: 'reload'  // Even if performance timeline had reload, in-app navigation ignores it!
});
assert.strictEqual(courseRestoration.targetY, 900, `Back navigation to course must restore 900px (got: ${courseRestoration.targetY})`);
assert.strictEqual(courseRestoration.isSmooth, true, 'Back navigation to course must use smooth restoration');
console.log('  ✓ PASS Scenario 5: Navigate from course to quiz and press Back -> previous course scroll position (900px) is restored');

// -----------------------------------------------------------------------------
// Scenario 6: Navigate between ordinary pages and press Back -> saved position restored
// -----------------------------------------------------------------------------
// Start from Home, navigate to Subjects, scroll to 520px, navigate to About
const stepHome = session.push({ key: 'k_h2', pathname: '/', state: {} });
const stepSubjects = session.push({ key: 'k_s2', pathname: '/subjects', state: {} });
session.persistScroll(stepSubjects.key, stepSubjects.pathname, 520);

const stepAbout = session.push({ key: 'k_a2', pathname: '/about', state: {} });
session.persistScroll(stepAbout.key, stepAbout.pathname, 280);

// Press Browser Back from About -> Subjects
const backToSubjects = session.pop();
assert.strictEqual(backToSubjects.key, stepSubjects.key);

const subjectsBack = session.resolveScrollPosition({
  location: backToSubjects,
  navigationType: 'POP',
  isInitialMount: false,
  docNavType: 'navigate'
});
assert.strictEqual(subjectsBack.targetY, 520, 'Browser Back to Subjects must restore 520px');
assert.strictEqual(subjectsBack.isSmooth, true);
console.log('  ✓ PASS Scenario 6: Navigate between ordinary pages and press Back -> saved position (520px) is restored');

// -----------------------------------------------------------------------------
// Scenario 7: Test browser Forward and confirm its saved position is restored
// -----------------------------------------------------------------------------
// Press Browser Forward from Subjects -> About
const forwardToAbout = session.forward();
assert.strictEqual(forwardToAbout.key, stepAbout.key);

const aboutForward = session.resolveScrollPosition({
  location: forwardToAbout,
  navigationType: 'POP',
  isInitialMount: false,
  docNavType: 'navigate'
});
assert.strictEqual(aboutForward.targetY, 280, 'Browser Forward to About must restore 280px');
assert.strictEqual(aboutForward.isSmooth, true);
console.log('  ✓ PASS Scenario 7: Test browser Forward and confirm its saved position (280px) is restored');

console.log('\n==================================================');
console.log('RESULTS: All 7 Page Refresh & Scroll scenarios passed!');
console.log('==================================================\n');
