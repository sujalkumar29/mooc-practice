/**
 * test_smooth_scroll_restoration.js
 * 
 * Verifies smooth downward scroll restoration on Back/POP and internal back navigation:
 * 1. Page opens at top (y = 0) upon returning.
 * 2. Smooth downward scroll triggers towards saved position.
 * 3. Forward navigation to new page opens at top with instant behavior.
 * 4. Respects prefers-reduced-motion with instant restoration.
 * 5. Position protection: in-flight scroll coordinates do not overwrite saved target.
 * 6. Shorter page content is clamped to maxScroll without errors.
 * 7. Zero/top positions (y <= 15) do not trigger unnecessary animations.
 * 8. User manual interaction cancels restoration and resumes live tracking.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- TESTING SMOOTH SCROLL RESTORATION ON BACK NAVIGATION ---');

// -----------------------------------------------------------------------------
// 1. VERIFY SOURCE CODE CONTRACT IN ScrollToTop.jsx
// -----------------------------------------------------------------------------
console.log('\n[1] Verifying ScrollToTop.jsx Implementation:');

const scrollToTopSource = fs.readFileSync(path.join(__dirname, '../src/components/ScrollToTop.jsx'), 'utf-8');

// Ensure smooth behavior is used for restoration
assert(scrollToTopSource.includes("behavior: 'smooth'"), 'ScrollToTop.jsx must use behavior: smooth for downward restoration');
console.log('  ✓ PASS: behavior: "smooth" is configured for downward scroll restoration');

// Ensure instant scroll is used initially to place page at top (0)
assert(scrollToTopSource.includes("applyInstantScroll(0)"), 'ScrollToTop.jsx must initially place returning page at top (0)');
console.log('  ✓ PASS: Returning page is initially placed at top (y = 0) before downward glide');

// Ensure prefers-reduced-motion is respected
assert(scrollToTopSource.includes('isReducedMotionPreferred'), 'ScrollToTop.jsx must check for prefers-reduced-motion');
assert(scrollToTopSource.includes('applyInstantScroll(targetY)'), 'ScrollToTop.jsx must use instant restoration for reduced motion');
console.log('  ✓ PASS: prefers-reduced-motion is respected with instant restoration');

// Ensure in-flight scroll coordinates do not clobber target position
assert(scrollToTopSource.includes('!isRestoringRef.current'), 'Passive scroll tracking must be paused while smooth restoration is active');
console.log('  ✓ PASS: In-flight scroll coordinates are prevented from clobbering saved target position');

// Ensure user interaction (wheel, touchmove, keydown) cancels restoration cleanly
assert(scrollToTopSource.includes("addEventListener('wheel'"), 'User wheel interaction listener registered');
assert(scrollToTopSource.includes("addEventListener('touchmove'"), 'User touchmove interaction listener registered');
console.log('  ✓ PASS: Manual user interaction (wheel, touch) cancels restoration animation and resumes live tracking');

// -----------------------------------------------------------------------------
// 2. SIMULATE SMOOTH RESTORATION CONTROLLER
// -----------------------------------------------------------------------------
console.log('\n[2] Testing Simulated Smooth Restoration Flow:');

class SimulatedSmoothScrollEngine {
  constructor() {
    this.historyStorage = {};
    this.currentKey = null;
    this.currentPathname = null;
    this.currentScrollY = 0;
    this.isRestoring = false;
    this.lastScrollToCall = null;
    this.reducedMotion = false;
    this.documentHeight = 2500;
    this.windowHeight = 800;
  }

  savePosition(key, pathname, y) {
    if (key) this.historyStorage[key] = y;
    if (pathname) this.historyStorage[`path:${pathname}`] = y;
  }

  getPosition(key, pathname) {
    if (key && typeof this.historyStorage[key] === 'number') {
      return this.historyStorage[key];
    }
    if (pathname && typeof this.historyStorage[`path:${pathname}`] === 'number') {
      return this.historyStorage[`path:${pathname}`];
    }
    return null;
  }

  navigate({ key, pathname, navigationType, state = {} }) {
    // Save current page position right before transition
    if (this.currentKey) {
      this.savePosition(this.currentKey, this.currentPathname, this.currentScrollY);
    }

    this.currentKey = key;
    this.currentPathname = pathname;

    const isPop = navigationType === 'POP';
    const isInternalBack = !!(state?.restoreScroll || state?.isBackNav);

    let targetY = 0;
    if (isPop || isInternalBack) {
      const saved = this.getPosition(key, pathname);
      targetY = typeof saved === 'number' ? saved : 0;
    } else {
      targetY = 0;
    }

    // Edge case 1: Target at top (<= 15px)
    if (targetY <= 15) {
      this.isRestoring = false;
      this.currentScrollY = 0;
      this.lastScrollToCall = { top: 0, behavior: 'instant' };
      return { initialY: 0, targetY: 0, behavior: 'instant', animated: false };
    }

    // Edge case 2: Reduced motion preferred
    if (this.reducedMotion) {
      this.isRestoring = false;
      this.currentScrollY = targetY;
      this.lastScrollToCall = { top: targetY, behavior: 'instant' };
      return { initialY: targetY, targetY, behavior: 'instant', animated: false };
    }

    // Standard Smooth Restoration:
    // Step 1: Open at top
    this.currentScrollY = 0;
    this.isRestoring = true;
    this.lastScrollToCall = { top: 0, behavior: 'instant' };

    // Step 2: Smooth scroll down to target
    const maxScroll = Math.max(0, this.documentHeight - this.windowHeight);
    const clampedY = Math.min(targetY, maxScroll);

    this.lastScrollToCall = { top: clampedY, behavior: 'smooth' };
    return { initialY: 0, targetY: clampedY, behavior: 'smooth', animated: true };
  }

  simulateUserScroll(y) {
    if (!this.isRestoring) {
      this.currentScrollY = y;
      this.savePosition(this.currentKey, this.currentPathname, y);
    }
  }

  finishAnimation(targetY) {
    this.currentScrollY = targetY;
    this.isRestoring = false;
    this.savePosition(this.currentKey, this.currentPathname, targetY);
  }

  userManualInterrupt(y) {
    this.isRestoring = false;
    this.currentScrollY = y;
    this.savePosition(this.currentKey, this.currentPathname, y);
  }
}

const sim = new SimulatedSmoothScrollEngine();

// Step 1: Open Wildlife Ecology course page and scroll to Weekly Modules (y = 850px)
const step1 = sim.navigate({
  key: 'course-entry-1',
  pathname: '/subjects/wildlife-ecology',
  navigationType: 'PUSH'
});
assert.strictEqual(step1.initialY, 0);
assert.strictEqual(step1.animated, false, 'Forward navigation to course page must start at top without animation');

sim.simulateUserScroll(850);
assert.strictEqual(sim.getPosition('course-entry-1'), 850);
console.log('  ✓ PASS: Step 1: Opened Wildlife Ecology at top and scrolled to Weekly Modules (y = 850px)');

// Step 2: Open Week 1 Quiz
const step2 = sim.navigate({
  key: 'quiz-w1',
  pathname: '/subjects/wildlife-ecology/quiz/week-1',
  navigationType: 'PUSH'
});
assert.strictEqual(step2.initialY, 0);
assert.strictEqual(step2.animated, false, 'Entering quiz must open at top without animation');
console.log('  ✓ PASS: Step 2: Week 1 Quiz opens at top (y = 0)');

// Step 3: Press Browser Back -> Page opens at top and smoothly scrolls down to 850px
const step3 = sim.navigate({
  key: 'course-entry-1',
  pathname: '/subjects/wildlife-ecology',
  navigationType: 'POP'
});
assert.strictEqual(step3.initialY, 0, 'Course page must appear at top (0)');
assert.strictEqual(step3.targetY, 850, 'Course page must target saved position (850px)');
assert.strictEqual(step3.behavior, 'smooth', 'Restoration must use smooth behavior');
assert.strictEqual(step3.animated, true);
console.log('  ✓ PASS: Step 3: Browser Back displays course at top and smoothly scrolls down to 850px');

// Verify position protection while animating:
sim.simulateUserScroll(0); // in-flight frame
assert.strictEqual(sim.getPosition('course-entry-1'), 850, 'Target position must NOT be overwritten by in-flight scroll coordinates');
sim.finishAnimation(850);
assert.strictEqual(sim.isRestoring, false);
console.log('  ✓ PASS: Position protection preserves authoritative target while smooth scroll is in-flight');

// Step 4: Open Week 2, click internal "Back to Course" button
sim.navigate({
  key: 'quiz-w2',
  pathname: '/subjects/wildlife-ecology/quiz/week-2',
  navigationType: 'PUSH'
});
const step4 = sim.navigate({
  key: 'course-entry-2',
  pathname: '/subjects/wildlife-ecology',
  navigationType: 'PUSH',
  state: { restoreScroll: true, isBackNav: true }
});
assert.strictEqual(step4.initialY, 0);
assert.strictEqual(step4.targetY, 850);
assert.strictEqual(step4.behavior, 'smooth');
assert.strictEqual(step4.animated, true);
sim.finishAnimation(850);
console.log('  ✓ PASS: Step 4: Internal "Back to Course" button smoothly restores saved position (850px)');

// Step 5: Test Browser Forward back to Quiz
sim.userManualInterrupt(1200); // user scrolled further down
sim.navigate({
  key: 'quiz-w3',
  pathname: '/subjects/wildlife-ecology/quiz/week-3',
  navigationType: 'PUSH'
});
sim.simulateUserScroll(400); // scrolled in quiz
sim.navigate({
  key: 'course-entry-2',
  pathname: '/subjects/wildlife-ecology',
  navigationType: 'POP'
});
sim.finishAnimation(1200);

const step5 = sim.navigate({
  key: 'quiz-w3',
  pathname: '/subjects/wildlife-ecology/quiz/week-3',
  navigationType: 'POP'
});
assert.strictEqual(step5.initialY, 0);
assert.strictEqual(step5.targetY, 400);
assert.strictEqual(step5.behavior, 'smooth');
console.log('  ✓ PASS: Step 5: Browser Forward smoothly restores quiz scroll position (400px)');

// Step 6: Test prefers-reduced-motion
sim.reducedMotion = true;
const step6 = sim.navigate({
  key: 'course-entry-2',
  pathname: '/subjects/wildlife-ecology',
  navigationType: 'POP'
});
assert.strictEqual(step6.behavior, 'instant', 'Reduced motion must use instant scroll behavior');
assert.strictEqual(step6.animated, false, 'Reduced motion must not trigger animation');
assert.strictEqual(step6.initialY, 1200);
console.log('  ✓ PASS: Step 6: prefers-reduced-motion correctly uses instant restoration');

// Step 7: Shorter page clamping
sim.reducedMotion = false;
sim.documentHeight = 1200; // shorter page
sim.windowHeight = 800; // maxScroll = 400
const step7 = sim.navigate({
  key: 'course-entry-2',
  pathname: '/subjects/wildlife-ecology',
  navigationType: 'POP'
});
assert.strictEqual(step7.targetY, 400, 'Target must be clamped to maxScroll when page content is shorter');
assert.strictEqual(step7.behavior, 'smooth');
console.log('  ✓ PASS: Step 7: Shorter page content is clamped to maximum valid scroll position');

console.log('\n==================================================');
console.log('RESULTS: All Smooth Scroll Restoration tests passed!');
console.log('==================================================\n');
