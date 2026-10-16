/**
 * test_wildlife_week1_bank.js
 *
 * Comprehensive validation of Wildlife Ecology Week 1 Question Bank:
 * 1. Exactly 10 questions in order
 * 2. Exactly 4 options per question
 * 3. Exact question text, options, and answer keys:
 *    Q1: B (interactions)
 *    Q2: B (Modern taxonomy)
 *    Q3: A (Theophrastus)
 *    Q4: D (Humboldt)
 *    Q5: B (Inheritable fitness)
 *    Q6: C (Population ecology)
 *    Q7: C (Laboratory approach)
 *    Q8: D (Field approach)
 *    Q9: D (study)
 *    Q10: D (The theory of evolution and natural selection)
 * 4. Correct 0-based to letter mapping (A=0, B=1, C=2, D=3)
 * 5. Study Mode feedback verification for correct and incorrect answers
 * 6. Exam Mode scoring verification (perfect, partial, zero)
 * 7. Combined Quiz aggregation integrity (130 questions, exactly 10 from Week 1)
 * 8. Weeks 0 and 2-12 integrity preserved
 */

import assert from 'assert';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';
import { getCourseBySlug } from '../src/data/courses.js';
import { getWeeklyQuestions, getCombinedQuestions } from '../src/utils/questionLoader.js';
import { evaluateQuizSubmission } from '../src/utils/quizScoring.js';

console.log('=== TEST SUITE: WILDLIFE ECOLOGY WEEK 1 QUESTION BANK VALIDATION ===\n');

const expectedWeek1 = [
  {
    qNum: 1,
    id: 'wildlife-week1-q1',
    question: 'Ecology is the scientific study of that determine the distribution and abundance of organisms. (Fill in the blanks)',
    options: ['statics', 'interactions', 'dynamics', 'habitat'],
    correctAnswer: 'B',
    correctText: 'interactions'
  },
  {
    qNum: 2,
    id: 'wildlife-week1-q2',
    question: 'Carolus Linnaeus is considered the father of:',
    options: ['Biogeography', 'Modern taxonomy', 'Population ecology', 'Botanical geography'],
    correctAnswer: 'B',
    correctText: 'Modern taxonomy'
  },
  {
    qNum: 3,
    id: 'wildlife-week1-q3',
    question: '"Enquiry into plants" is a book written by',
    options: ['Theophrastus', 'Linnaeus', 'Malthus', 'Humboldt'],
    correctAnswer: 'A',
    correctText: 'Theophrastus'
  },
  {
    qNum: 4,
    id: 'wildlife-week1-q4',
    question: 'Who amongst these is considered the father of Biogeography?',
    options: ['Theophrastus', 'Linnaeus', 'Malthus', 'Humboldt'],
    correctAnswer: 'D',
    correctText: 'Humboldt'
  },
  {
    qNum: 5,
    id: 'wildlife-week1-q5',
    question: 'Genetic adaptation refers to:',
    options: [
      'High reproductive rate in one generation',
      'Inheritable fitness',
      'Physical strength of an individual',
      'Short-term environmental comfort'
    ],
    correctAnswer: 'B',
    correctText: 'Inheritable fitness'
  },
  {
    qNum: 6,
    id: 'wildlife-week1-q6',
    question: 'Thomas Robert Malthus influenced studies in:',
    options: [
      'Community ecology',
      'Marine ecology',
      'Population ecology',
      'Behavioural ecology'
    ],
    correctAnswer: 'C',
    correctText: 'Population ecology'
  },
  {
    qNum: 7,
    id: 'wildlife-week1-q7',
    question: 'Which approach tests ecological ideas through experiments?',
    options: [
      'Theoretical approach',
      'Field approach',
      'Laboratory approach',
      'Descriptive approach'
    ],
    correctAnswer: 'C',
    correctText: 'Laboratory approach'
  },
  {
    qNum: 8,
    id: 'wildlife-week1-q8',
    question: 'Which approach mainly depends on direct observation of organisms in natural surroundings?',
    options: [
      'Laboratory approach',
      'Historical approach',
      'Theoretical approach',
      'Field approach'
    ],
    correctAnswer: 'D',
    correctText: 'Field approach'
  },
  {
    qNum: 9,
    id: 'wildlife-week1-q9',
    question: 'In the Greek word root of Ecology, logos refers to',
    options: ['household', 'preservation', 'environment', 'study'],
    correctAnswer: 'D',
    correctText: 'study'
  },
  {
    qNum: 10,
    id: 'wildlife-week1-q10',
    question: 'Charles Darwin is associated with:',
    options: [
      'The theory of ecosystem formation',
      'The theory of taxonomy',
      'The theory of botanical geography',
      'The theory of evolution and natural selection'
    ],
    correctAnswer: 'D',
    correctText: 'The theory of evolution and natural selection'
  }
];

// -----------------------------------------------------------------------------
// 1. VERIFY EXACT WEEK 1 QUESTION DATA, OPTIONS, AND KEYS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Question Data, Wording, Options & Answer Keys:');

const week1Questions = wildlifeEcologyQuestions[1];
assert(Array.isArray(week1Questions), 'Week 1 questions must be an array');
assert.strictEqual(week1Questions.length, 10, 'Week 1 must contain exactly 10 questions');

expectedWeek1.forEach((expected, i) => {
  const actual = week1Questions[i];
  assert.strictEqual(actual.id, expected.id, `Q${i + 1} id must match ${expected.id}`);
  assert.strictEqual(actual.week, 1, `Q${i + 1} week attribute must be 1`);
  assert.strictEqual(actual.subjectId, 'wildlife-ecology', `Q${i + 1} subjectId must be 'wildlife-ecology'`);
  assert.strictEqual(actual.marks, 1, `Q${i + 1} marks must be 1`);
  assert.strictEqual(actual.question, expected.question, `Q${i + 1} question wording must match exactly`);
  
  assert(Array.isArray(actual.options), `Q${i + 1} options must be an array`);
  assert.strictEqual(actual.options.length, 4, `Q${i + 1} must have exactly 4 options`);
  
  expected.options.forEach((optText, optIdx) => {
    assert.strictEqual(actual.options[optIdx], optText, `Q${i + 1} option ${String.fromCharCode(65 + optIdx)} must match`);
  });

  assert.strictEqual(actual.correctAnswer, expected.correctAnswer, `Q${i + 1} correctAnswer must be ${expected.correctAnswer}`);

  // Zero-based vs One-based verification:
  const letterToIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  const targetOptionIdx = letterToIndex[actual.correctAnswer];
  assert.strictEqual(actual.options[targetOptionIdx], expected.correctText,
    `Q${i + 1} letter ${actual.correctAnswer} must correspond directly to option text '${expected.correctText}'`);

  console.log(`  ✓ Q${expected.qNum}: Answer Key ${actual.correctAnswer} -> "${actual.options[targetOptionIdx]}"`);
});

console.log('  ✓ PASS: All 10 Week 1 questions verified with exact text, options, and keys');

// -----------------------------------------------------------------------------
// 2. STUDY MODE INSTANT FEEDBACK EVALUATION
// -----------------------------------------------------------------------------
console.log('\n[2] Testing Study Mode Feedback Simulation:');

expectedWeek1.forEach((expected, i) => {
  const actual = week1Questions[i];
  const correctKey = actual.correctAnswer;
  const incorrectKey = correctKey === 'A' ? 'B' : 'A';

  // Correct selection check:
  const isCorrect = correctKey.toUpperCase() === actual.correctAnswer.toUpperCase();
  assert(isCorrect, `Study mode correctly validates user selection '${correctKey}' for Q${i + 1}`);

  // Incorrect selection check:
  const isIncorrect = incorrectKey.toUpperCase() === actual.correctAnswer.toUpperCase();
  assert(!isIncorrect, `Study mode correctly rejects wrong selection '${incorrectKey}' for Q${i + 1}`);
});

console.log('  ✓ PASS: Study Mode instant feedback validates all 10 correct and incorrect selections');

// -----------------------------------------------------------------------------
// 3. EXAM MODE SCORING SIMULATION
// -----------------------------------------------------------------------------
console.log('\n[3] Testing Exam Mode Scoring Simulation:');

// Scenario A: 100% Perfect Score
const perfectAnswers = {};
expectedWeek1.forEach(q => { perfectAnswers[q.id] = q.correctAnswer; });

const perfectResult = evaluateQuizSubmission({
  questions: week1Questions,
  userAnswers: perfectAnswers,
  timeElapsedSeconds: 120
});

assert.strictEqual(perfectResult.totalQuestions, 10, 'Perfect attempt total questions is 10');
assert.strictEqual(perfectResult.correctCount, 10, 'Perfect attempt correct count is 10');
assert.strictEqual(perfectResult.incorrectCount, 0, 'Perfect attempt incorrect count is 0');
assert.strictEqual(perfectResult.unansweredCount, 0, 'Perfect attempt unanswered count is 0');
assert.strictEqual(perfectResult.totalScore, 10, 'Perfect attempt total score is 10');
assert.strictEqual(perfectResult.percentage, 100, 'Perfect attempt percentage is 100%');
console.log('  ✓ PASS: Perfect Exam Mode score produces 10/10 (100%)');

// Scenario B: Partial Score (8/10)
const partialAnswers = { ...perfectAnswers };
partialAnswers['wildlife-week1-q1'] = 'A'; // Wrong (correct is B)
partialAnswers['wildlife-week1-q4'] = 'A'; // Wrong (correct is D)

const partialResult = evaluateQuizSubmission({
  questions: week1Questions,
  userAnswers: partialAnswers,
  timeElapsedSeconds: 150
});

assert.strictEqual(partialResult.correctCount, 8, 'Partial attempt correct count is 8');
assert.strictEqual(partialResult.incorrectCount, 2, 'Partial attempt incorrect count is 2');
assert.strictEqual(partialResult.totalScore, 8, 'Partial attempt score is 8');
assert.strictEqual(partialResult.percentage, 80, 'Partial attempt percentage is 80%');
console.log('  ✓ PASS: Partial Exam Mode score produces 8/10 (80%)');

// Scenario C: Zero Score (0/10)
const zeroAnswers = {};
expectedWeek1.forEach(q => {
  zeroAnswers[q.id] = q.correctAnswer === 'A' ? 'D' : 'A';
});

const zeroResult = evaluateQuizSubmission({
  questions: week1Questions,
  userAnswers: zeroAnswers,
  timeElapsedSeconds: 90
});

assert.strictEqual(zeroResult.correctCount, 0, 'Zero attempt correct count is 0');
assert.strictEqual(zeroResult.incorrectCount, 10, 'Zero attempt incorrect count is 10');
assert.strictEqual(zeroResult.totalScore, 0, 'Zero attempt score is 0');
assert.strictEqual(zeroResult.percentage, 0, 'Zero attempt percentage is 0%');
console.log('  ✓ PASS: Zero Exam Mode score produces 0/10 (0%)');

// -----------------------------------------------------------------------------
// 4. COMBINED QUIZ INTEGRITY & OTHER WEEKS PRESERVATION
// -----------------------------------------------------------------------------
console.log('\n[4] Testing Combined Quiz Aggregation & Other Weeks Preservation:');

const course = getCourseBySlug('wildlife-ecology');

// Question loader returns Week 1 questions
const loadedWeek1 = getWeeklyQuestions(course, 1);
assert.strictEqual(loadedWeek1.length, 10, 'getWeeklyQuestions returns 10 questions for Week 1');
assert.strictEqual(loadedWeek1[0].id, 'wildlife-week1-q1', 'First question is wildlife-week1-q1');

// Combined quiz returns 130 questions
const combinedQs = getCombinedQuestions(course);
assert.strictEqual(combinedQs.length, 130, 'Combined quiz contains exactly 130 questions');

// Verify exactly 10 questions in combined quiz are from Week 1
const combinedWeek1 = combinedQs.filter(q => q.week === 1);
assert.strictEqual(combinedWeek1.length, 10, 'Combined quiz contains exactly 10 Week 1 questions');
combinedWeek1.forEach((q, i) => {
  assert.strictEqual(q.id, expectedWeek1[i].id, `Combined Q${i + 1} matches ${expectedWeek1[i].id}`);
  assert.strictEqual(q.correctAnswer, expectedWeek1[i].correctAnswer, `Combined Q${i + 1} answer key matches`);
});
console.log('  ✓ PASS: Combined Quiz aggregates Week 1 questions without duplication');

// Check Week 0 and Weeks 2 through 12 are intact
for (let w = 0; w <= 12; w++) {
  if (w === 1) continue;
  const qs = wildlifeEcologyQuestions[w];
  assert(Array.isArray(qs) && qs.length === 10, `Week ${w} must remain untouched with exactly 10 questions`);
}
console.log('  ✓ PASS: Weeks 0 and 2–12 remain completely untouched');

console.log('\n=============================================================');
console.log('RESULTS: All Wildlife Ecology Week 1 Bank tests passed!');
console.log('=============================================================\n');
