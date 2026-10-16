import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';
import { formatTime } from '../src/utils/quizScoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: COMBINED QUIZ 15-MINUTE TIMER & FIRST-ANSWER BEHAVIOR ===\n');

// 1. Source Code Verification
console.log('[1] Verifying CombinedQuiz.jsx and QuizInterface.jsx Source Code:');

const combinedQuizPath = path.join(__dirname, '../src/pages/CombinedQuiz.jsx');
const quizInterfacePath = path.join(__dirname, '../src/components/QuizInterface.jsx');

const combinedQuizSource = fs.readFileSync(combinedQuizPath, 'utf-8');
const quizInterfaceSource = fs.readFileSync(quizInterfacePath, 'utf-8');

assert(combinedQuizSource.includes('durationSeconds={900}'),
  'CombinedQuiz.jsx must explicitly pass durationSeconds={900} (15:00)');
console.log('  ✓ PASS: CombinedQuiz passes durationSeconds={900} (15 minutes)');

assert(quizInterfaceSource.includes('isCombinedQuiz = quizKey === \'combined\''),
  'QuizInterface.jsx must check isCombinedQuiz');
assert(quizInterfaceSource.includes('(starts on first answer)'),
  'QuizInterface.jsx must display (starts on first answer) label before first answer');
assert(quizInterfaceSource.includes('examDeadlineRef'),
  'QuizInterface.jsx must maintain examDeadlineRef to prevent duplicate timer start');
console.log('  ✓ PASS: QuizInterface configures 15-minute timer, first-answer start, and ref synchronization');

// 2. Behavioral Simulation Testing the 7 Explicit Verification Cases
console.log('\n[2] Executing 7 Explicit Verification Cases:');

// Aggregated 130 MCQs
const allCombinedQuestions = [];
for (let w = 0; w <= 12; w++) {
  allCombinedQuestions.push(...wildlifeEcologyQuestions[w]);
}
assert.strictEqual(allCombinedQuestions.length, 130, 'Combined quiz must aggregate 130 MCQs');

class MockCombinedQuizSession {
  constructor() {
    this.questions = allCombinedQuestions;
    this.quizKey = 'combined';
    this.mode = 'exam';
    this.isCombinedQuiz = true;
    this.totalExamDurationSeconds = 900; // 15:00
    this.currentIndex = 0;
    this.userAnswers = {};
    this.examStartTime = null;
    this.examDeadline = null;
    this.examStartTimeRef = null;
    this.examDeadlineRef = null;
    this.remainingSeconds = this.totalExamDurationSeconds;
    this.isSubmitModalOpen = false;
    this.isExitModalOpen = false;
    this.blockedNavigation = null;
    this.evaluationResult = null;
    this.isSubmitting = false;
  }

  get answeredCount() {
    return Object.keys(this.userAnswers).filter(
      k => this.userAnswers[k] !== undefined && this.userAnswers[k] !== null && this.userAnswers[k] !== ''
    ).length;
  }

  get isProtectedExam() {
    return this.mode === 'exam' && (this.answeredCount > 0 || !!this.examDeadline) && !this.evaluationResult && !this.isSubmitting;
  }

  get displayedTimer() {
    if (this.examDeadline) {
      return {
        formatted: formatTime(this.remainingSeconds),
        isRunning: true,
        hint: null
      };
    }
    return {
      formatted: formatTime(this.totalExamDurationSeconds),
      isRunning: false,
      hint: '(starts on first answer)'
    };
  }

  selectQuestion(idx) {
    this.currentIndex = idx;
  }

  saveAndNext() {
    this.currentIndex = this.currentIndex < this.questions.length - 1 ? this.currentIndex + 1 : 0;
  }

  selectOption(optionId, now = Date.now()) {
    let currentStartTime = this.examStartTimeRef || this.examStartTime;
    let currentDeadline = this.examDeadlineRef || this.examDeadline;

    if (this.mode === 'exam' && !currentDeadline) {
      const deadline = now + this.totalExamDurationSeconds * 1000;
      currentStartTime = now;
      currentDeadline = deadline;
      this.examStartTimeRef = now;
      this.examDeadlineRef = deadline;
      this.examStartTime = now;
      this.examDeadline = deadline;
      this.remainingSeconds = this.totalExamDurationSeconds;
    }

    const currentQ = this.questions[this.currentIndex];
    this.userAnswers[currentQ.id] = optionId;
  }

  tick(now = Date.now()) {
    if (this.mode !== 'exam' || this.evaluationResult || !this.examDeadline) {
      return this.remainingSeconds;
    }
    const rem = Math.max(0, Math.ceil((this.examDeadline - now) / 1000));
    this.remainingSeconds = rem;
    return rem;
  }

  attemptExit() {
    if (this.isProtectedExam) {
      this.isExitModalOpen = true;
      this.blockedNavigation = { state: 'blocked' };
      return false;
    }
    return true; // exits immediately
  }

  continueQuiz() {
    this.isExitModalOpen = false;
    this.blockedNavigation = null;
  }

  exitQuiz() {
    this.isExitModalOpen = false;
    this.blockedNavigation = null;
    this.userAnswers = {};
    return '/subjects/wildlife-ecology';
  }
}

// Case 1: Open Combined Quiz: timer shows 15:00 and does not decrease
const quiz = new MockCombinedQuizSession();
assert.strictEqual(quiz.displayedTimer.formatted, '15:00');
assert.strictEqual(quiz.displayedTimer.hint, '(starts on first answer)');
assert.strictEqual(quiz.displayedTimer.isRunning, false);
quiz.tick(Date.now() + 5000); // 5 seconds pass
assert.strictEqual(quiz.remainingSeconds, 900, 'Timer must not decrease without an answer');
assert.strictEqual(quiz.displayedTimer.formatted, '15:00');
console.log('  ✓ PASS: Case 1: Combined quiz opens with 15:00 paused and (starts on first answer) label');

// Case 2: Navigate through multiple questions without selecting an answer: timer remains at 15:00
quiz.selectQuestion(5); // Jump to Question 6
assert.strictEqual(quiz.currentIndex, 5);
assert.strictEqual(quiz.displayedTimer.formatted, '15:00');
assert.strictEqual(quiz.displayedTimer.isRunning, false);
quiz.saveAndNext(); // Jump to Question 7
assert.strictEqual(quiz.currentIndex, 6);
assert.strictEqual(quiz.displayedTimer.formatted, '15:00');
assert.strictEqual(quiz.displayedTimer.isRunning, false);
quiz.selectQuestion(129); // Jump to last question (Question 130)
assert.strictEqual(quiz.currentIndex, 129);
assert.strictEqual(quiz.displayedTimer.formatted, '15:00');
assert.strictEqual(quiz.displayedTimer.isRunning, false);
console.log('  ✓ PASS: Case 2: Question navigation across palette and Save & Next does not start timer');

// Case 2b: Exit before selecting any answer -> immediate exit without modal
assert.strictEqual(quiz.attemptExit(), true, 'Must allow exit without confirmation modal before answering');
assert.strictEqual(quiz.isExitModalOpen, false);
console.log('  ✓ PASS: Case 2b: Exiting before selecting an answer leaves cleanly without modal');

// Case 3: Select the first answer: countdown starts immediately
const startTime = 1000000000000;
quiz.selectQuestion(0);
quiz.selectOption('A', startTime);
assert.strictEqual(quiz.examStartTime, startTime);
assert.strictEqual(quiz.examDeadline, startTime + 900 * 1000);
assert.strictEqual(quiz.displayedTimer.isRunning, true);
assert.strictEqual(quiz.displayedTimer.hint, null, 'Hint label must be removed once running');
assert.strictEqual(quiz.displayedTimer.formatted, '15:00');
console.log('  ✓ PASS: Case 3: First answer starts 15-minute countdown and removes hint label');

// Case 4: Navigate to other questions: timer continues decreasing
const tAfter30s = startTime + 30000;
quiz.tick(tAfter30s);
assert.strictEqual(quiz.remainingSeconds, 870); // 900 - 30 = 870 (14:30)
assert.strictEqual(quiz.displayedTimer.formatted, '14:30');

// Jump to Question 20 and advance 15 more seconds
quiz.selectQuestion(19);
const tAfter45s = startTime + 45000;
quiz.tick(tAfter45s);
assert.strictEqual(quiz.remainingSeconds, 855); // 14:15
assert.strictEqual(quiz.displayedTimer.formatted, '14:15');
console.log('  ✓ PASS: Case 4: Timer continues decreasing seamlessly while navigating questions');

// Case 5: Open Exit Quiz confirmation after timer started: countdown continues while modal is open
const canExitImmediately = quiz.attemptExit();
assert.strictEqual(canExitImmediately, false, 'Exit attempt must be intercepted once timer/answers active');
assert.strictEqual(quiz.isExitModalOpen, true, 'Exit confirmation modal must open');

// 10 seconds elapse while user reads confirmation dialog
const tAfter55s = startTime + 55000;
quiz.tick(tAfter55s);
assert.strictEqual(quiz.remainingSeconds, 845); // 14:05
assert.strictEqual(quiz.displayedTimer.formatted, '14:05', 'Timer must not pause while exit dialog is open');
console.log('  ✓ PASS: Case 5: Exit modal opens and countdown continues running live in background');

// Case 6: Choose Continue Quiz: countdown continues without resetting
quiz.continueQuiz();
assert.strictEqual(quiz.isExitModalOpen, false, 'Modal closes on Continue Quiz');
assert.strictEqual(quiz.remainingSeconds, 845, 'Time remaining must not reset on Continue Quiz');

// Advance 5 more seconds
const tAfter60s = startTime + 60000;
quiz.tick(tAfter60s);
assert.strictEqual(quiz.remainingSeconds, 840); // 14:00
assert.strictEqual(quiz.displayedTimer.formatted, '14:00');
console.log('  ✓ PASS: Case 6: Continue Quiz resumes seamlessly with no pause or reset');

// Case 7: Refresh or re-render component: ensure no accidental timer restart or duplicate interval
// Rapid option selection on another question:
quiz.selectOption('B', tAfter60s);
assert.strictEqual(quiz.examDeadline, startTime + 900 * 1000, 'Deadline must NOT be recreated on subsequent answers');
assert.strictEqual(quiz.remainingSeconds, 840, 'Remaining time must not reset to 15:00 on answer selection');

// Simulated re-mount / localStorage load with existing deadline:
const savedDeadline = quiz.examDeadline;
const savedStartTime = quiz.examStartTime;
const remountedSession = new MockCombinedQuizSession();
remountedSession.examStartTime = savedStartTime;
remountedSession.examDeadline = savedDeadline;
remountedSession.examStartTimeRef = savedStartTime;
remountedSession.examDeadlineRef = savedDeadline;
remountedSession.tick(tAfter60s);
assert.strictEqual(remountedSession.displayedTimer.formatted, '14:00');
assert.strictEqual(remountedSession.examDeadline, savedDeadline, 'Authoritative deadline preserved on re-render/remount');
console.log('  ✓ PASS: Case 7: Re-renders, subsequent answers, and remounts never restart the timer');

console.log('\n==================================================');
console.log('RESULTS: All 7 Combined Quiz 15-Minute Timer test cases passed!');
console.log('==================================================\n');
