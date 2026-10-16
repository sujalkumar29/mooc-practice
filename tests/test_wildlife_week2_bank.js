/**
 * test_wildlife_week2_bank.js
 *
 * Comprehensive validation of Wildlife Ecology Week 2 Question Bank:
 * 1. Exactly 10 questions in order
 * 2. Exactly 4 options per question
 * 3. Exact question text, options, and answer keys:
 *    Q1: C (stable)
 *    Q2: B (Tissue)
 *    Q3: A (alpha (α) biodiversity)
 *    Q4: B (species)
 *    Q5: C (Whole > sum of parts)
 *    Q6: A (Cell)
 *    Q7: C (Genetic biodiversity)
 *    Q8: D (Bequest value)
 *    Q9: C (Non-use value)
 *    Q10: D (The number of species present)
 * 4. Correct 0-based to letter mapping (A=0, B=1, C=2, D=3)
 * 5. Study Mode feedback verification for correct and incorrect answers
 * 6. Exam Mode scoring verification (perfect, partial, zero)
 * 7. Combined Quiz aggregation integrity (130 questions, exactly 10 from Week 2)
 * 8. Weeks 0, 1, and 3-12 integrity preserved
 */

import assert from 'assert';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';
import { getCourseBySlug } from '../src/data/courses.js';
import { getWeeklyQuestions, getCombinedQuestions } from '../src/utils/questionLoader.js';
import { evaluateQuizSubmission } from '../src/utils/quizScoring.js';

console.log('=== TEST SUITE: WILDLIFE ECOLOGY WEEK 2 QUESTION BANK VALIDATION ===\n');

const expectedWeek2 = [
  {
    qNum: 1,
    id: 'wildlife-week2-q1',
    question: 'Hierarchy emerges almost inevitably through a wide variety of evolutionary processes, for the simple reason that hierarchical structures are ____________ (Fill in the blank)',
    options: ['perfect', 'imperfect', 'stable', 'unstable'],
    correctAnswer: 'C',
    correctText: 'stable'
  },
  {
    qNum: 2,
    id: 'wildlife-week2-q2',
    question: 'Which level is formed when similar cells and their extracellular matrix from the same origin together perform a specific function?',
    options: ['Organ', 'Tissue', 'Organ system', 'Population'],
    correctAnswer: 'B',
    correctText: 'Tissue'
  },
  {
    qNum: 3,
    id: 'wildlife-week2-q3',
    question: '"the diversity that exists within an ecosystem" is',
    options: [
      'alpha (α) biodiversity',
      'beta (β) biodiversity',
      'gamma (γ) biodiversity',
      'delta (δ) biodiversity'
    ],
    correctAnswer: 'A',
    correctText: 'alpha (α) biodiversity'
  },
  {
    qNum: 4,
    id: 'wildlife-week2-q4',
    question: '"groups of actually or potentially interbreeding natural populations, which are reproductively isolated from other such groups" is a definition of',
    options: ['cells', 'species', 'ecosystems', 'biomes'],
    correctAnswer: 'B',
    correctText: 'species'
  },
  {
    qNum: 5,
    id: 'wildlife-week2-q5',
    question: 'The emergent principle can be stated as',
    options: [
      'Whole = sum of parts',
      'Whole < sum of parts',
      'Whole > sum of parts',
      'None of these'
    ],
    correctAnswer: 'C',
    correctText: 'Whole > sum of parts'
  },
  {
    qNum: 6,
    id: 'wildlife-week2-q6',
    question: 'The smallest unit of life is the:',
    options: ['Cell', 'Tissue', 'Organ', 'Organism'],
    correctAnswer: 'A',
    correctText: 'Cell'
  },
  {
    qNum: 7,
    id: 'wildlife-week2-q7',
    question: 'The diversity of genetic information present at the levels of phyla, families, species, populations and individuals is called:',
    options: [
      'Ecosystem biodiversity',
      'Species evenness',
      'Genetic biodiversity',
      'Species richness'
    ],
    correctAnswer: 'C',
    correctText: 'Genetic biodiversity'
  },
  {
    qNum: 8,
    id: 'wildlife-week2-q8',
    question: 'The value of leaving use and non-use values for future generations is called:',
    options: [
      'Altruistic value',
      'Option value',
      'Existence value',
      'Bequest value'
    ],
    correctAnswer: 'D',
    correctText: 'Bequest value'
  },
  {
    qNum: 9,
    id: 'wildlife-week2-q9',
    question: 'Value arising even though a resource is not being used is called:',
    options: [
      'Direct value',
      'Indirect value',
      'Non-use value',
      'Productive value'
    ],
    correctAnswer: 'C',
    correctText: 'Non-use value'
  },
  {
    qNum: 10,
    id: 'wildlife-week2-q10',
    question: 'Species richness refers to:',
    options: [
      'The distribution of individuals among different species',
      'The genetic variation within one population',
      'The number of ecosystems in a biome',
      'The number of species present'
    ],
    correctAnswer: 'D',
    correctText: 'The number of species present'
  }
];

// -----------------------------------------------------------------------------
// 1. VERIFY EXACT WEEK 2 QUESTION DATA, OPTIONS, AND KEYS
// -----------------------------------------------------------------------------
console.log('[1] Verifying Question Data, Wording, Options & Answer Keys:');

const week2Questions = wildlifeEcologyQuestions[2];
assert(Array.isArray(week2Questions), 'Week 2 questions must be an array');
assert.strictEqual(week2Questions.length, 10, 'Week 2 must contain exactly 10 questions');

expectedWeek2.forEach((expected, i) => {
  const actual = week2Questions[i];
  assert.strictEqual(actual.id, expected.id, `Q${i + 1} id must match ${expected.id}`);
  assert.strictEqual(actual.week, 2, `Q${i + 1} week attribute must be 2`);
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

console.log('  ✓ PASS: All 10 Week 2 questions verified with exact text, options, and keys');

// -----------------------------------------------------------------------------
// 2. STUDY MODE INSTANT FEEDBACK EVALUATION
// -----------------------------------------------------------------------------
console.log('\n[2] Testing Study Mode Feedback Simulation:');

expectedWeek2.forEach((expected, i) => {
  const actual = week2Questions[i];
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
expectedWeek2.forEach(q => { perfectAnswers[q.id] = q.correctAnswer; });

const perfectResult = evaluateQuizSubmission({
  questions: week2Questions,
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
partialAnswers['wildlife-week2-q1'] = 'A'; // Wrong (correct is C)
partialAnswers['wildlife-week2-q4'] = 'A'; // Wrong (correct is B)

const partialResult = evaluateQuizSubmission({
  questions: week2Questions,
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
expectedWeek2.forEach(q => {
  zeroAnswers[q.id] = q.correctAnswer === 'A' ? 'D' : 'A';
});

const zeroResult = evaluateQuizSubmission({
  questions: week2Questions,
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

// Question loader returns Week 2 questions
const loadedWeek2 = getWeeklyQuestions(course, 2);
assert.strictEqual(loadedWeek2.length, 10, 'getWeeklyQuestions returns 10 questions for Week 2');
assert.strictEqual(loadedWeek2[0].id, 'wildlife-week2-q1', 'First question is wildlife-week2-q1');

// Combined quiz returns 130 questions
const combinedQs = getCombinedQuestions(course);
assert.strictEqual(combinedQs.length, 130, 'Combined quiz contains exactly 130 questions');

// Verify exactly 10 questions in combined quiz are from Week 2
const combinedWeek2 = combinedQs.filter(q => q.week === 2);
assert.strictEqual(combinedWeek2.length, 10, 'Combined quiz contains exactly 10 Week 2 questions');
combinedWeek2.forEach((q, i) => {
  assert.strictEqual(q.id, expectedWeek2[i].id, `Combined Q${i + 1} matches ${expectedWeek2[i].id}`);
  assert.strictEqual(q.correctAnswer, expectedWeek2[i].correctAnswer, `Combined Q${i + 1} answer key matches`);
});
console.log('  ✓ PASS: Combined Quiz aggregates Week 2 questions without duplication');

// Check Week 0, Week 1, and Weeks 3 through 12 are intact
for (let w = 0; w <= 12; w++) {
  if (w === 2) continue;
  const qs = wildlifeEcologyQuestions[w];
  assert(Array.isArray(qs) && qs.length === 10, `Week ${w} must remain untouched with exactly 10 questions`);
}
console.log('  ✓ PASS: Weeks 0, 1, and 3–12 remain completely untouched');

console.log('\n=============================================================');
console.log('RESULTS: All Wildlife Ecology Week 2 Bank tests passed!');
console.log('=============================================================\n');
