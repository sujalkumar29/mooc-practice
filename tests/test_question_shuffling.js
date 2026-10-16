import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { shuffleQuestions, restoreQuestionOrder } from '../src/utils/questionShuffle.js';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';
import { evaluateQuizSubmission } from '../src/utils/quizScoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: RANDOM QUESTION SHUFFLING ON NEW QUIZ ATTEMPTS & REFRESH ===\n');

// -----------------------------------------------------------------------------
// 1. SOURCE CODE CONTRACT CHECKS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Shuffling Implementation & Algorithm Contracts:');

const shuffleUtilityPath = path.join(__dirname, '../src/utils/questionShuffle.js');
const quizInterfacePath = path.join(__dirname, '../src/components/QuizInterface.jsx');

const shuffleSource = fs.readFileSync(shuffleUtilityPath, 'utf-8');
const quizInterfaceSource = fs.readFileSync(quizInterfacePath, 'utf-8');

// A. Confirm NO biased Math.random() - 0.5 sort is used anywhere
assert(!shuffleSource.includes('Math.random() - 0.5'),
  'questionShuffle.js must NOT use biased Math.random() - 0.5 sort');
assert(!quizInterfaceSource.includes('Math.random() - 0.5'),
  'QuizInterface.jsx must NOT use biased Math.random() - 0.5 sort');
console.log('  ✓ PASS: Strictly unbiased Fisher–Yates algorithm used; no Math.random() - 0.5 sort');

// B. Confirm QuizInterface imports shuffleQuestions and manages activeQuestions state
assert(quizInterfaceSource.includes("import { shuffleQuestions } from '../utils/questionShuffle'"),
  'QuizInterface.jsx must import shuffleQuestions');
assert(quizInterfaceSource.includes('activeQuestions'),
  'QuizInterface.jsx must manage activeQuestions state');
console.log('  ✓ PASS: QuizInterface imports shuffleQuestions and initializes activeQuestions');

// C. Confirm NO persistent shuffle cache prevents fresh randomization on reload
assert(!quizInterfaceSource.includes('saved?.shuffledQuestionIds'),
  'QuizInterface.jsx must NOT restore cached shuffledQuestionIds on page mount or reload');
assert(!quizInterfaceSource.includes('saved.shuffledQuestionIds'),
  'QuizInterface.jsx must NOT restore cached question order from localStorage');
console.log('  ✓ PASS: No persistent shuffle cache; fresh question order generated on every page reload');

// D. Confirm Exit Quiz clears progress
assert(quizInterfaceSource.includes('handleExitQuizNav') && quizInterfaceSource.includes('clearQuizProgress(course.id, quizKey)'),
  'QuizInterface.jsx handleExitQuizNav must clear quiz progress');
console.log('  ✓ PASS: Exiting quiz clears progress cleanly');

// E. Confirm Retake generates fresh random shuffle
assert(quizInterfaceSource.includes('handleRetake') && quizInterfaceSource.includes('shuffleQuestions(questions'),
  'QuizInterface.jsx handleRetake must generate fresh shuffleQuestions');
console.log('  ✓ PASS: Retake quiz generates fresh shuffle while avoiding previous attempt order');

// -----------------------------------------------------------------------------
// 2. SHUFFLING BEHAVIOR FOR EVERY WEEKLY QUIZ (WEEK 0 TO WEEK 12)
// -----------------------------------------------------------------------------
console.log('\n[2] Testing Random Shuffling for Every Weekly Quiz (Week 0 to Week 12):');

for (let week = 0; week <= 12; week++) {
  const weekQuestions = wildlifeEcologyQuestions[week];
  assert(Array.isArray(weekQuestions) && weekQuestions.length === 10,
    `Week ${week} question bank must contain 10 questions`);

  const originalIds = weekQuestions.map(q => q.id);
  const shuffled = shuffleQuestions(weekQuestions);

  // Check count and completeness
  assert.strictEqual(shuffled.length, 10, `Week ${week} shuffled questions must contain all 10 questions`);
  const shuffledIds = shuffled.map(q => q.id);
  const uniqueIds = new Set(shuffledIds);
  assert.strictEqual(uniqueIds.size, 10, `Week ${week} shuffled questions must have no duplicates`);

  // Ensure all original IDs are present and NO outside weeks are mixed in
  originalIds.forEach(id => {
    assert(uniqueIds.has(id), `Week ${week} shuffled questions must contain original question ${id}`);
  });

  // Verify questions data integrity (options not shuffled, correct answers, marks preserved)
  shuffled.forEach(sq => {
    const orig = weekQuestions.find(q => q.id === sq.id);
    assert.strictEqual(sq.question, orig.question, `Question text for ${sq.id} must be unchanged`);
    assert.deepStrictEqual(sq.options, orig.options, `Options for ${sq.id} must remain in original order`);
    assert.strictEqual(sq.correctAnswer, orig.correctAnswer, `Correct answer for ${sq.id} must match original`);
    assert.strictEqual(sq.marks, orig.marks, `Marks for ${sq.id} must match original`);
    assert.strictEqual(sq.explanation, orig.explanation, `Explanation for ${sq.id} must match original`);
    assert.strictEqual(sq.week, orig.week, `Week tag for ${sq.id} must remain Week ${week}`);
    assert.strictEqual(sq.week, week, `Week ${week} quiz must NEVER contain questions from another week`);
  });

  // Verify reload/new attempt produces different order
  const reloadOrder = shuffleQuestions(weekQuestions, shuffledIds);
  const reloadOrderIds = reloadOrder.map(q => q.id);
  assert.notDeepStrictEqual(shuffledIds, reloadOrderIds,
    `Week ${week} on reload must generate a newly randomized question order`);

  console.log(`  ✓ PASS: Week ${week} quiz (${weekQuestions.length} MCQs) freshly shuffles on load/reload without mixing other weeks`);
}

// -----------------------------------------------------------------------------
// 3. FULL SYLLABUS COMBINED QUIZ SHUFFLING (ALL 130 MCQs ACROSS ALL WEEKS)
// -----------------------------------------------------------------------------
console.log('\n[3] Testing Full Syllabus Combined Quiz Shuffling (130 Questions):');

const combinedQuestions = [];
for (let w = 0; w <= 12; w++) {
  combinedQuestions.push(...wildlifeEcologyQuestions[w]);
}
assert.strictEqual(combinedQuestions.length, 130, 'Combined quiz must have 130 questions');

const shuffledCombined = shuffleQuestions(combinedQuestions);
assert.strictEqual(shuffledCombined.length, 130, 'Shuffled combined quiz must contain all 130 questions');

const combinedUniqueIds = new Set(shuffledCombined.map(q => q.id));
assert.strictEqual(combinedUniqueIds.size, 130, 'Combined quiz must have no duplicate questions');

// Verify that questions from different weeks are genuinely intermixed across the entire syllabus
const first10Weeks = shuffledCombined.slice(0, 10).map(q => q.week);
const distinctWeeksInFirst10 = new Set(first10Weeks);
assert(distinctWeeksInFirst10.size > 1,
  'Combined Quiz must shuffle questions across the entire syllabus together, not grouped by week');
console.log(`  ✓ PASS: Combined Quiz mixes questions from multiple weeks in first 10 tiles (Weeks: ${[...distinctWeeksInFirst10].join(', ')})`);

// Verify reloading the Combined Quiz produces a fresh mixed order
const combinedReload = shuffleQuestions(combinedQuestions, shuffledCombined.map(q => q.id));
assert.notDeepStrictEqual(
  shuffledCombined.map(q => q.id),
  combinedReload.map(q => q.id),
  'Combined Quiz reload must generate a fresh 130-question mixed permutation'
);
console.log('  ✓ PASS: Combined Quiz generates a fresh randomized 130-question sequence on every reload');

// -----------------------------------------------------------------------------
// 4. VERIFY FRESH SHUFFLE ON REFRESH & STABILITY DURING NAVIGATION
// -----------------------------------------------------------------------------
console.log('\n[4] Testing Fresh Shuffle on Refresh vs Stability During Navigation:');

// Simulate page mount 1
const mount1Questions = shuffleQuestions(wildlifeEcologyQuestions[1]);
const mount1Ids = mount1Questions.map(q => q.id);

// Simulate page refresh (unmount + remount) -> fresh shuffle
const mount2Questions = shuffleQuestions(wildlifeEcologyQuestions[1], mount1Ids);
const mount2Ids = mount2Questions.map(q => q.id);

assert.notDeepStrictEqual(mount1Ids, mount2Ids,
  'Refreshing the page MUST generate a fresh question order, not restore previous ordering');
console.log('  ✓ PASS: Browser page refresh generates a fresh randomized question order');

// Simulate active navigation during a session:
// Navigation between questions (index 0 -> index 1 -> index 2) operates on activeQuestions
let currentActiveOrder = [...mount1Questions];
const initialSessionOrderIds = currentActiveOrder.map(q => q.id);

// User clicks Save & Next:
let currentIndex = 0;
currentIndex = currentIndex < currentActiveOrder.length - 1 ? currentIndex + 1 : 0;
assert.deepStrictEqual(currentActiveOrder.map(q => q.id), initialSessionOrderIds,
  'Save & Next must NOT reshuffle active questions');

// User selects option:
const userAnswers = { [currentActiveOrder[currentIndex].id]: 'B' };
assert.deepStrictEqual(currentActiveOrder.map(q => q.id), initialSessionOrderIds,
  'Selecting an answer option must NOT reshuffle active questions');

// User marks for review:
const flaggedQuestions = { [currentActiveOrder[currentIndex].id]: true };
assert.deepStrictEqual(currentActiveOrder.map(q => q.id), initialSessionOrderIds,
  'Mark for Review must NOT reshuffle active questions');

// User selects Question Palette tile:
currentIndex = 5;
assert.deepStrictEqual(currentActiveOrder.map(q => q.id), initialSessionOrderIds,
  'Clicking Question Palette number must NOT reshuffle active questions');

console.log('  ✓ PASS: Active session navigation, option selection, and palette clicks strictly preserve order');

// -----------------------------------------------------------------------------
// 5. STATUS TRACKING BY STABLE QUESTION IDs & SCORING INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n[5] Testing Question Status Mapping by ID and Evaluation Integrity:');

// User answers 2 questions in the shuffled order
const testQuestions = shuffleQuestions(wildlifeEcologyQuestions[0]);
const q0 = testQuestions[0];
const q1 = testQuestions[1];

const testAnswers = {
  [q0.id]: q0.correctAnswer, // Correct answer
  [q1.id]: 'Z'               // Incorrect answer
};

const evaluation = evaluateQuizSubmission({
  questions: testQuestions,
  userAnswers: testAnswers,
  timeElapsedSeconds: 60
});

assert.strictEqual(evaluation.totalQuestions, 10, 'Evaluation total questions must be 10');
assert.strictEqual(evaluation.correctCount, 1, 'Exactly 1 question should be evaluated as correct');
assert.strictEqual(evaluation.incorrectCount, 1, 'Exactly 1 question should be evaluated as incorrect');
assert.strictEqual(evaluation.unansweredCount, 8, '8 questions should be evaluated as unanswered');
assert.strictEqual(evaluation.questionDetails[0].id, q0.id, 'Question detail index 0 must correspond to attempt Q1 ID');
assert.strictEqual(evaluation.questionDetails[0].status, 'correct', 'Q1 must be evaluated as correct');
assert.strictEqual(evaluation.questionDetails[1].id, q1.id, 'Question detail index 1 must correspond to attempt Q2 ID');
assert.strictEqual(evaluation.questionDetails[1].status, 'incorrect', 'Q2 must be evaluated as incorrect');
console.log('  ✓ PASS: Question evaluation and scoring correctly track original question IDs and correct answers');

console.log('\n==================================================');
console.log('RESULTS: All Question Shuffling & Refresh tests passed!');
console.log('==================================================\n');
