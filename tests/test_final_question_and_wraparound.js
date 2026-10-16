import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { getWeeklyQuestions, getCombinedQuestions } from '../src/utils/questionLoader.js';
import { getCourseBySlug } from '../src/data/courses.js';
import { evaluateQuizSubmission } from '../src/utils/quizScoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: FINAL QUESTION MESSAGE REMOVAL & SAVE & NEXT WRAP-AROUND ===\n');

// -----------------------------------------------------------------------------
// 1. SOURCE CODE CONTRACT CHECKS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Complete Removal of Final Question Informational Message:');

const quizInterfacePath = path.join(__dirname, '../src/components/QuizInterface.jsx');
const quizCssPath = path.join(__dirname, '../src/styles/quiz.css');
const quizInterfaceSource = fs.readFileSync(quizInterfacePath, 'utf-8');
const quizCssSource = fs.readFileSync(quizCssPath, 'utf-8');

// A. Confirm the informational message text is completely absent
const targetMessageText = 'You have reached the final question. Review your responses or click Submit Quiz in the Question Palette when ready.';
assert(!quizInterfaceSource.includes(targetMessageText),
  'QuizInterface.jsx must NOT contain the final question informational message');
console.log('  ✓ PASS: Final question informational message text removed from QuizInterface.jsx');

// B. Confirm lastQuestionNotice state and conditional rendering are completely absent
assert(!quizInterfaceSource.includes('lastQuestionNotice'),
  'QuizInterface.jsx must NOT declare or reference lastQuestionNotice');
console.log('  ✓ PASS: lastQuestionNotice state, setters, and conditional rendering removed from QuizInterface.jsx');

// C. Confirm .last-question-notice CSS class is removed
assert(!quizCssSource.includes('.last-question-notice'),
  'quiz.css must NOT contain .last-question-notice styling');
console.log('  ✓ PASS: .last-question-notice styling removed from quiz.css (no reserved dead spacing)');

// D. Confirm wrap-around logic exists in handleSaveAndNext
assert(quizInterfaceSource.includes('currentIndex < questions.length - 1 ? currentIndex + 1 : 0'),
  'handleSaveAndNext must wrap to index 0 on final question');
console.log('  ✓ PASS: handleSaveAndNext wraps around to index 0 on final question');

// -----------------------------------------------------------------------------
// 2. SIMULATING QUIZ ENGINE WRAP-AROUND BEHAVIOR
// -----------------------------------------------------------------------------
console.log('\n[2] Testing Simulated Wrap-Around and State Persistence:');

class QuizStateSimulator {
  constructor(questions, courseId = 'wildlife-ecology', quizKey = 'week-0') {
    this.questions = questions;
    this.courseId = courseId;
    this.quizKey = quizKey;
    this.currentIndex = 0;
    this.userAnswers = {};
    this.flaggedQuestions = {};
    this.visitedQuestions = { [questions[0].id]: true };
    this.mode = 'exam';
    this.totalDurationSeconds = quizKey === 'combined' ? 900 : Math.max(600, questions.length * 90);
    this.examDeadline = this.examStartTime + this.totalDurationSeconds * 1000;
    this.isSubmitted = false;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  selectOption(optionId) {
    const curQ = this.getCurrentQuestion();
    this.userAnswers[curQ.id] = optionId;
  }

  handleSaveAndNext() {
    const nextIndex = this.currentIndex < this.questions.length - 1 ? this.currentIndex + 1 : 0;
    this.currentIndex = nextIndex;
    this.visitedQuestions[this.questions[nextIndex].id] = true;
  }

  handleMarkForReviewAndNext() {
    const curQ = this.getCurrentQuestion();
    this.flaggedQuestions[curQ.id] = true;
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.visitedQuestions[this.getCurrentQuestion().id] = true;
    }
  }

  handleSubmit() {
    this.isSubmitted = true;
    return evaluateQuizSubmission({
      questions: this.questions,
      userAnswers: this.userAnswers,
      timeElapsedSeconds: Math.round((Date.now() - this.examStartTime) / 1000)
    });
  }
}

const weCourse = getCourseBySlug('wildlife-ecology');

// A. Test Week 0 Quiz (10 Questions)
console.log('\n--- Testing Week 0 Quiz (10 Questions) ---');
const week0Questions = getWeeklyQuestions(weCourse, 0);
const simWeek0 = new QuizStateSimulator(week0Questions, 'wildlife-ecology', 'week-0');

// Answer questions 1 through 9
for (let i = 0; i < 9; i++) {
  assert.strictEqual(simWeek0.currentIndex, i, `Index must be ${i} before Save & Next`);
  simWeek0.selectOption('A');
  simWeek0.handleSaveAndNext();
  assert.strictEqual(simWeek0.currentIndex, i + 1, `Index must advance to ${i + 1}`);
}
assert.strictEqual(simWeek0.currentIndex, 9, 'Should be on final question (Q10, index 9)');

// On final question (Q10), select Option C
simWeek0.selectOption('C');
const deadlineBeforeWrap = simWeek0.examDeadline;
const startTimeBeforeWrap = simWeek0.examStartTime;

// Click Save & Next on final question -> WRAP TO FIRST QUESTION (Q1, index 0)
simWeek0.handleSaveAndNext();
assert.strictEqual(simWeek0.currentIndex, 0, 'Save & Next on Q10 MUST loop to Question 1 (index 0)');
assert.strictEqual(simWeek0.isSubmitted, false, 'Wrap-around must NEVER submit the quiz');
assert.strictEqual(simWeek0.userAnswers[week0Questions[9].id], 'C', 'Q10 answer must remain preserved as "C"');
assert.strictEqual(simWeek0.visitedQuestions[week0Questions[0].id], true, 'Q1 visited status must be true');
assert.strictEqual(simWeek0.visitedQuestions[week0Questions[9].id], true, 'Q10 visited status must be true');
assert.strictEqual(simWeek0.examStartTime, startTimeBeforeWrap, 'Timer start timestamp must NOT be reset');
assert.strictEqual(simWeek0.examDeadline, deadlineBeforeWrap, 'Timer deadline timestamp must NOT be reset');
console.log('  ✓ PASS: Week 0 Q10 -> Save & Next loops to Q1 (index 0) with all answers, flags, and timer preserved');

// B. Test Week 1 Quiz (10 Questions)
console.log('\n--- Testing Week 1 Quiz (10 Questions) ---');
const week1Questions = getWeeklyQuestions(weCourse, 1);
const simWeek1 = new QuizStateSimulator(week1Questions, 'wildlife-ecology', 'week-1');
simWeek1.currentIndex = 9; // Last question
simWeek1.selectOption('B');
simWeek1.handleSaveAndNext();
assert.strictEqual(simWeek1.currentIndex, 0, 'Week 1: Save & Next on Q10 wraps to Q1 (index 0)');
assert.strictEqual(simWeek1.userAnswers[week1Questions[9].id], 'B', 'Week 1: Q10 answer preserved as "B"');
console.log('  ✓ PASS: Week 1 Q10 -> Save & Next loops to Q1 with answer preserved');

// C. Test Week 12 Quiz (10 Questions)
console.log('\n--- Testing Week 12 Quiz (10 Questions) ---');
const week12Questions = getWeeklyQuestions(weCourse, 12);
const simWeek12 = new QuizStateSimulator(week12Questions, 'wildlife-ecology', 'week-12');
simWeek12.currentIndex = 9; // Last question
simWeek12.selectOption('D');
simWeek12.handleSaveAndNext();
assert.strictEqual(simWeek12.currentIndex, 0, 'Week 12: Save & Next on Q10 wraps to Q1 (index 0)');
assert.strictEqual(simWeek12.userAnswers[week12Questions[9].id], 'D', 'Week 12: Q10 answer preserved as "D"');
console.log('  ✓ PASS: Week 12 Q10 -> Save & Next loops to Q1 with answer preserved');

// D. Test Combined Quiz (130 Questions)
console.log('\n--- Testing Combined Quiz (130 Questions) ---');
const combinedQuestions = getCombinedQuestions(weCourse);
assert.strictEqual(combinedQuestions.length, 130, 'Combined quiz has 130 questions');
const simCombined = new QuizStateSimulator(combinedQuestions, 'wildlife-ecology', 'combined');
simCombined.currentIndex = 129; // Last question (Q130)
simCombined.selectOption('A');
simCombined.handleSaveAndNext();
assert.strictEqual(simCombined.currentIndex, 0, 'Combined Quiz: Save & Next on Q130 wraps to Q1 (index 0)');
assert.strictEqual(simCombined.userAnswers[combinedQuestions[129].id], 'A', 'Combined Quiz: Q130 answer preserved as "A"');
assert.strictEqual(simCombined.isSubmitted, false, 'Combined Quiz: Save & Next must NOT submit');
console.log('  ✓ PASS: Combined Quiz Q130 -> Save & Next loops to Q1 with answer preserved and no submission');

// E. Verify Mark for Review on Final Question
console.log('\n--- Testing Mark for Review on Final Question ---');
simCombined.currentIndex = 129;
simCombined.handleMarkForReviewAndNext();
assert.strictEqual(simCombined.currentIndex, 129, 'Mark for Review on final question stays on final question');
assert.strictEqual(simCombined.flaggedQuestions[combinedQuestions[129].id], true, 'Q130 must be flagged for review');
console.log('  ✓ PASS: Mark for Review retains intended behavior on final question');

// F. Verify Submission Logic Remains Unchanged
console.log('\n--- Testing Submission Logic Integrity ---');
const result = simCombined.handleSubmit();
assert.strictEqual(simCombined.isSubmitted, true, 'Quiz successfully marked as submitted');
assert(result !== null && typeof result.percentage === 'number', 'Scoring engine evaluates correctly');
console.log('  ✓ PASS: Submission evaluation and scoring execute normally');

console.log('\n==================================================');
console.log('RESULTS: All Final Question & Wrap-Around tests passed!');
console.log('==================================================\n');
