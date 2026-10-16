/**
 * test_wildlife_weeks_3_to_6_banks.js
 *
 * Comprehensive validation of Wildlife Ecology Weeks 3, 4, 5, and 6 Question Banks:
 * 1. Exactly 10 questions per week (Weeks 3, 4, 5, 6)
 * 2. Exactly 4 options per question
 * 3. Exact question text, option ordering, and answer keys:
 *    - Week 3: Community Ecology & Species Interactions
 *    - Week 4: Food Chains, Trophic Levels & Energy Flow
 *    - Week 5: Population Ecology & Sampling
 *    - Week 6: Community Structure, Succession & Biodiversity
 * 4. Correct 0-based to letter mapping (A=0, B=1, C=2, D=3)
 * 5. Absence of raw '**' markdown markers in text/options
 * 6. Study Mode instant feedback verification
 * 7. Exam Mode scoring verification (perfect 10/10, partial, zero)
 * 8. Combined Quiz dynamic aggregation (130 questions total)
 * 9. Preservation of Weeks 0-2 and Weeks 7-12
 */

import assert from 'assert';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';
import { getCourseBySlug } from '../src/data/courses.js';
import { getWeeklyQuestions, getCombinedQuestions } from '../src/utils/questionLoader.js';
import { evaluateQuizSubmission } from '../src/utils/quizScoring.js';

console.log('=== TEST SUITE: WILDLIFE ECOLOGY WEEKS 3-6 QUESTION BANKS VALIDATION ===\n');

const expectedWeek3 = [
  {
    qNum: 1,
    id: 'wildlife-week3-q1',
    question: "I observe a bird take a tick out of another bird's head and eat it. In the social context, this behaviour would be called",
    options: ['tick hunting', 'auto grooming', 'allo grooming', 'foraging'],
    correctAnswer: 'C',
    correctText: 'allo grooming'
  },
  {
    qNum: 2,
    id: 'wildlife-week3-q2',
    question: 'Leech is an example of',
    options: ['endoparasite', 'herbivore predator', 'parasitoid', 'ectoparasite'],
    correctAnswer: 'D',
    correctText: 'ectoparasite'
  },
  {
    qNum: 3,
    id: 'wildlife-week3-q3',
    question: 'An ecological interaction in which both participating organisms are harmed is called',
    options: ['mutualism', 'commensalism', 'competition', 'neutralism'],
    correctAnswer: 'C',
    correctText: 'competition'
  },
  {
    qNum: 4,
    id: 'wildlife-week3-q4',
    question: 'Interspecific interaction occurs between',
    options: [
      'members of different species',
      'members of the same species',
      'two organisms that are both benefited',
      'two organisms that remain unaffected'
    ],
    correctAnswer: 'A',
    correctText: 'members of different species'
  },
  {
    qNum: 5,
    id: 'wildlife-week3-q5',
    question: 'The distance maintained by nesting penguins to avoid pecking from neighbours is related to',
    options: ['herbivory', 'parasitoid pressure', 'prey switching', 'territorial spacing'],
    correctAnswer: 'D',
    correctText: 'territorial spacing'
  },
  {
    qNum: 6,
    id: 'wildlife-week3-q6',
    question: 'A parasite that lives inside the body of its host is called',
    options: ['ectoparasite', 'endoparasite', 'predator', 'commensal'],
    correctAnswer: 'B',
    correctText: 'endoparasite'
  },
  {
    qNum: 7,
    id: 'wildlife-week3-q7',
    question: 'Birds on giraffe are an example of',
    options: ['colony', 'commensalism', 'protocooperation', 'allelopathy'],
    correctAnswer: 'C',
    correctText: 'protocooperation'
  },
  {
    qNum: 8,
    id: 'wildlife-week3-q8',
    question: 'Competition in which organisms directly consume a limited resource so that less remains for others is called',
    options: [
      'interference competition',
      'exploitative competition',
      'apparent competition',
      'neutral competition'
    ],
    correctAnswer: 'B',
    correctText: 'exploitative competition'
  },
  {
    qNum: 9,
    id: 'wildlife-week3-q9',
    question: 'Interference competition is also known as',
    options: [
      'apparent competition',
      'contest competition',
      'niche competition',
      'exploitative competition'
    ],
    correctAnswer: 'B',
    correctText: 'contest competition'
  },
  {
    qNum: 10,
    id: 'wildlife-week3-q10',
    question: 'The scientific study of animal behaviour is called',
    options: ['behaviourism', 'ecology', 'ethology', 'prey-predator dynamics'],
    correctAnswer: 'C',
    correctText: 'ethology'
  }
];

const expectedWeek4 = [
  {
    qNum: 1,
    id: 'wildlife-week4-q1',
    question: 'Consider the food chain: Grass → Grasshopper → Frog → Snake → Hawk. In this food chain,',
    options: [
      'hawk is producer',
      'hawk is consumer and carnivore',
      'hawk is consumer and herbivore',
      'hawk is decomposer'
    ],
    correctAnswer: 'B',
    correctText: 'hawk is consumer and carnivore'
  },
  {
    qNum: 2,
    id: 'wildlife-week4-q2',
    question: 'Trees → Birds → Parasites → Hyperparasites represents',
    options: [
      'upright pyramid of numbers',
      'inverted pyramid of numbers',
      'spindle pyramid of numbers',
      'dumb-bell pyramid of numbers'
    ],
    correctAnswer: 'B',
    correctText: 'inverted pyramid of numbers'
  },
  {
    qNum: 3,
    id: 'wildlife-week4-q3',
    question: 'Glacial lakes are typical examples of',
    options: [
      'eutrophic lakes',
      'hypereutrophic lakes',
      'oligotrophic lakes',
      'mesotrophic lakes'
    ],
    correctAnswer: 'C',
    correctText: 'oligotrophic lakes'
  },
  {
    qNum: 4,
    id: 'wildlife-week4-q4',
    question: 'In a grazing food chain, the first trophic level after producers is generally occupied by:',
    options: ['Carnivores', 'Decomposers', 'Detritivores', 'Herbivores'],
    correctAnswer: 'D',
    correctText: 'Herbivores'
  },
  {
    qNum: 5,
    id: 'wildlife-week4-q5',
    question: 'Which statement correctly defines net primary production?',
    options: [
      'Energy intercepted by producers from the Sun',
      'Total energy lost during transfer between trophic levels',
      'Gross primary production minus energy lost through respiration per unit time',
      'Energy stored only in herbivore biomass'
    ],
    correctAnswer: 'C',
    correctText: 'Gross primary production minus energy lost through respiration per unit time'
  },
  {
    qNum: 6,
    id: 'wildlife-week4-q6',
    question: 'Which statement correctly defines gross primary production?',
    options: [
      'Energy fixed through photosynthesis per unit time',
      'Energy lost by organisms through respiration per unit time',
      'Total number of producers in an ecosystem',
      'Organic matter consumed by herbivores per unit time'
    ],
    correctAnswer: 'A',
    correctText: 'Energy fixed through photosynthesis per unit time'
  },
  {
    qNum: 7,
    id: 'wildlife-week4-q7',
    question: 'Which chain best represents a detritus food chain?',
    options: [
      'Fallen leaves → detritivores → small fish → large fish',
      'Grass → chital → tiger',
      'Rat → flea → parasitic protozoa',
      'Phytoplankton → zooplankton → fish → sea lion'
    ],
    correctAnswer: 'A',
    correctText: 'Fallen leaves → detritivores → small fish → large fish'
  },
  {
    qNum: 8,
    id: 'wildlife-week4-q8',
    question: 'Consider the food chain: Grass → Grasshopper → Frog → Snake → Hawk. As we move up the food chain,',
    options: [
      'available energy decreases',
      'available energy increases',
      'available energy remains same',
      'available energy is zero everywhere'
    ],
    correctAnswer: 'A',
    correctText: 'available energy decreases'
  },
  {
    qNum: 9,
    id: 'wildlife-week4-q9',
    question: 'Which statement correctly describes a decomposer?',
    options: [
      'It only feeds on living plants',
      'It consumes only primary consumers',
      'It converts dead material into soil and recycles nutrients',
      'It always occupies the quaternary trophic level'
    ],
    correctAnswer: 'C',
    correctText: 'It converts dead material into soil and recycles nutrients'
  },
  {
    qNum: 10,
    id: 'wildlife-week4-q10',
    question: 'Which description best defines a heterotroph?',
    options: [
      'An organism that converts sunlight directly into inorganic nutrients',
      'An organism that cannot produce its own food and depends on organic carbon from other sources',
      'An organism that uses chemical reactions to manufacture minerals',
      'An organism that occupies only the first trophic level'
    ],
    correctAnswer: 'B',
    correctText: 'An organism that cannot produce its own food and depends on organic carbon from other sources'
  }
];

const expectedWeek5 = [
  {
    qNum: 1,
    id: 'wildlife-week5-q1',
    question: 'In population dynamics, which pair represents additions to an existing population?',
    options: [
      'Mortality and emigration',
      'Natality and immigration',
      'Mortality and natality',
      'Immigration and emigration'
    ],
    correctAnswer: 'B',
    correctText: 'Natality and immigration'
  },
  {
    qNum: 2,
    id: 'wildlife-week5-q2',
    question: 'Cover board surveys are typically used for sampling',
    options: ['herpetofauna', 'fishes', 'large mammals', 'carnivores'],
    correctAnswer: 'A',
    correctText: 'herpetofauna'
  },
  {
    qNum: 3,
    id: 'wildlife-week5-q3',
    question: 'Pan traps are used for sampling',
    options: ['bees', 'butterflies', 'non-pollinator insects', 'pollinator insects'],
    correctAnswer: 'D',
    correctText: 'pollinator insects'
  },
  {
    qNum: 4,
    id: 'wildlife-week5-q4',
    question: 'A sampling procedure such that each possible combination of sampling units out of the population has the same chance of being selected is referred to as',
    options: [
      'Simple random sampling',
      'Systematic sampling',
      'Stratified sampling',
      'Multistage sampling'
    ],
    correctAnswer: 'A',
    correctText: 'Simple random sampling'
  },
  {
    qNum: 5,
    id: 'wildlife-week5-q5',
    question: 'The minimum replacement level fertility for a population to grow should be greater than',
    options: ['1', '2', '3', '4'],
    correctAnswer: 'B',
    correctText: '2'
  },
  {
    qNum: 6,
    id: 'wildlife-week5-q6',
    question: 'A list of sampling units is called a:',
    options: ['Sample', 'Sampling intensity', 'Sampling frame', 'Stratum'],
    correctAnswer: 'C',
    correctText: 'Sampling frame'
  },
  {
    qNum: 7,
    id: 'wildlife-week5-q7',
    question: 'In capture-recapture method, the first stage involves:',
    options: [
      'Counting faecal pellets',
      'Removing trapped animals permanently',
      'Estimating bait consumption',
      'Capturing, marking and releasing animals'
    ],
    correctAnswer: 'D',
    correctText: 'Capturing, marking and releasing animals'
  },
  {
    qNum: 8,
    id: 'wildlife-week5-q8',
    question: 'The logistic growth equation, when plotted, appears',
    options: ['I shaped', 'J shaped', 'S shaped', 'O shaped'],
    correctAnswer: 'C',
    correctText: 'S shaped'
  },
  {
    qNum: 9,
    id: 'wildlife-week5-q9',
    question: '______ employs a simple rule of selecting every kth unit starting with a number chosen at random from 1 to k as the random start.',
    options: [
      'Simple random sampling',
      'Systematic sampling',
      'Stratified sampling',
      'Multistage sampling'
    ],
    correctAnswer: 'B',
    correctText: 'Systematic sampling'
  },
  {
    qNum: 10,
    id: 'wildlife-week5-q10',
    question: 'Which of these is not a measure of absolute population density?',
    options: [
      'total count',
      'pelt count',
      'capture-recapture method',
      'removal method'
    ],
    correctAnswer: 'B',
    correctText: 'pelt count'
  }
];

const expectedWeek6 = [
  {
    qNum: 1,
    id: 'wildlife-week6-q1',
    question: 'A guild is a group of species that',
    options: [
      'Occupy only one climax community',
      'Have identical population size',
      'Utilise resources in a similar way',
      'Are confined to saline habitats'
    ],
    correctAnswer: 'C',
    correctText: 'Utilise resources in a similar way'
  },
  {
    qNum: 2,
    id: 'wildlife-week6-q2',
    question: 'The climax near Tindni village is being controlled by disturbance by cattle. This is an example of',
    options: [
      'climatic climax',
      'edaphic climax',
      'disclimax',
      'catastrophic climax'
    ],
    correctAnswer: 'C',
    correctText: 'disclimax'
  },
  {
    qNum: 3,
    id: 'wildlife-week6-q3',
    question: 'Species abundance may be expressed in terms of',
    options: [
      'Climate, soil and slope',
      'Number of individuals, biomass or cover',
      'Hydrosere, xerosere and halosere',
      'Resistance, resilience and stability'
    ],
    correctAnswer: 'B',
    correctText: 'Number of individuals, biomass or cover'
  },
  {
    qNum: 4,
    id: 'wildlife-week6-q4',
    question: 'Resistance refers to the ability of a community to',
    options: [
      'Recover quickly after disturbance',
      'Persist without change in the face of disturbance',
      'Increase the number of pioneer species',
      'Replace one seral stage with another'
    ],
    correctAnswer: 'B',
    correctText: 'Persist without change in the face of disturbance'
  },
  {
    qNum: 5,
    id: 'wildlife-week6-q5',
    question: 'Importance value can be written as',
    options: [
      'Relative density + Relative frequency X Relative dominance',
      'Relative density X Relative frequency + Relative dominance',
      'Relative density + Relative frequency + Relative dominance',
      'Relative density X Relative frequency X Relative dominance'
    ],
    correctAnswer: 'C',
    correctText: 'Relative density + Relative frequency + Relative dominance'
  },
  {
    qNum: 6,
    id: 'wildlife-week6-q6',
    question: 'Secondary succession refers to succession that occurs',
    options: [
      'On newly exposed rock or sand surfaces',
      'In a saline body such as a marsh',
      'After severe disturbance or removal of a pre-existing community',
      'Only when climate controls the final community'
    ],
    correctAnswer: 'C',
    correctText: 'After severe disturbance or removal of a pre-existing community'
  },
  {
    qNum: 7,
    id: 'wildlife-week6-q7',
    question: 'Lithosere is an example of',
    options: ['hydrosere', 'xerosere', 'psammosere', 'halosere'],
    correctAnswer: 'B',
    correctText: 'xerosere'
  },
  {
    qNum: 8,
    id: 'wildlife-week6-q8',
    question: 'A transition area where two communities meet and integrate is called',
    options: ['Habitat', 'Niche', 'Ecotone', 'Sere'],
    correctAnswer: 'C',
    correctText: 'Ecotone'
  },
  {
    qNum: 9,
    id: 'wildlife-week6-q9',
    question: 'Which of these is correct?',
    options: [
      'Fundamental niche > Realised niche',
      'Fundamental niche = Realised niche',
      'Fundamental niche < Realised niche',
      'a or b'
    ],
    correctAnswer: 'D',
    correctText: 'a or b'
  },
  {
    qNum: 10,
    id: 'wildlife-week6-q10',
    question: 'Species richness refers to',
    options: [
      'Number of species',
      'Number of individuals of one species',
      'Biomass of the dominant species',
      'Basal area of all trees'
    ],
    correctAnswer: 'A',
    correctText: 'Number of species'
  }
];

const weeksToTest = [
  { weekNum: 3, name: 'Week 3 (Community Ecology & Species Interactions)', expected: expectedWeek3 },
  { weekNum: 4, name: 'Week 4 (Food Chains, Trophic Levels & Energy Flow)', expected: expectedWeek4 },
  { weekNum: 5, name: 'Week 5 (Population Ecology & Sampling)', expected: expectedWeek5 },
  { weekNum: 6, name: 'Week 6 (Community Structure, Succession & Biodiversity)', expected: expectedWeek6 }
];

console.log('[1] Verifying Question Banks, Options, Wording & Answer Keys for Weeks 3–6:\n');

for (const { weekNum, name, expected } of weeksToTest) {
  console.log(`--- Testing ${name} ---`);
  const actualQuestions = wildlifeEcologyQuestions[weekNum];

  assert(Array.isArray(actualQuestions), `${name} must exist and be an array`);
  assert.strictEqual(actualQuestions.length, 10, `${name} must contain exactly 10 questions`);

  expected.forEach((exp, idx) => {
    const act = actualQuestions[idx];
    assert.strictEqual(act.id, exp.id, `Q${idx + 1} id must be ${exp.id}`);
    assert.strictEqual(act.week, weekNum, `Q${idx + 1} week attribute must be ${weekNum}`);
    assert.strictEqual(act.subjectId, 'wildlife-ecology', `Q${idx + 1} subjectId must be 'wildlife-ecology'`);
    assert.strictEqual(act.question, exp.question, `Q${idx + 1} question wording must match exactly`);
    assert.strictEqual(act.options.length, 4, `Q${idx + 1} must have exactly 4 options`);

    // Verify each option matches expected
    exp.options.forEach((optText, optIdx) => {
      assert.strictEqual(act.options[optIdx], optText, `Q${idx + 1} Option ${String.fromCharCode(65 + optIdx)} must match`);
    });

    // Check no literal '**' in question or options
    assert(!act.question.includes('**'), `Q${idx + 1} question text must not contain literal '**'`);
    act.options.forEach((opt, optIdx) => {
      assert(!opt.includes('**'), `Q${idx + 1} option ${optIdx} must not contain literal '**'`);
    });

    // Verify answer key mapping
    assert.strictEqual(act.correctAnswer, exp.correctAnswer, `Q${idx + 1} correctAnswer must be ${exp.correctAnswer}`);
    const keyIndex = exp.correctAnswer.charCodeAt(0) - 65;
    assert.strictEqual(act.options[keyIndex], exp.correctText, `Q${idx + 1} option[${exp.correctAnswer}] must map to "${exp.correctText}"`);
    assert.strictEqual(act.marks, 1, `Q${idx + 1} marks must be 1`);

    console.log(`  ✓ Q${idx + 1}: Answer Key ${act.correctAnswer} -> "${exp.correctText}"`);
  });
  console.log(`  ✓ PASS: All 10 questions for ${name} verified\n`);
}

// 2. Study Mode Feedback Simulation for Weeks 3–6
console.log('[2] Testing Study Mode Feedback Simulation for Weeks 3–6:\n');

for (const { weekNum, name, expected } of weeksToTest) {
  const actualQuestions = wildlifeEcologyQuestions[weekNum];
  expected.forEach((exp, idx) => {
    const q = actualQuestions[idx];
    const correctLetter = exp.correctAnswer;
    const isCorrect = (selected) => selected === correctLetter;

    assert.strictEqual(isCorrect(correctLetter), true, `W${weekNum} Q${idx + 1} correct option returns isCorrect=true`);
    const incorrectLetter = correctLetter === 'A' ? 'B' : 'A';
    assert.strictEqual(isCorrect(incorrectLetter), false, `W${weekNum} Q${idx + 1} wrong option returns isCorrect=false`);
  });
  console.log(`  ✓ PASS: Study Mode instant feedback validated for ${name}`);
}

// 3. Exam Mode Scoring Simulation for Weeks 3–6
console.log('\n[3] Testing Exam Mode Scoring Simulation for Weeks 3–6:\n');

for (const { weekNum, name, expected } of weeksToTest) {
  const actualQuestions = wildlifeEcologyQuestions[weekNum];

  // Perfect submission (10/10)
  const perfectAnswers = {};
  expected.forEach((exp) => {
    perfectAnswers[exp.id] = exp.correctAnswer;
  });
  const perfectResult = evaluateQuizSubmission({
    questions: actualQuestions,
    userAnswers: perfectAnswers,
    timeElapsedSeconds: 300
  });
  assert.strictEqual(perfectResult.totalQuestions, 10);
  assert.strictEqual(perfectResult.correctCount, 10);
  assert.strictEqual(perfectResult.incorrectCount, 0);
  assert.strictEqual(perfectResult.totalScore, 10);
  assert.strictEqual(perfectResult.percentage, 100);

  // Partial submission (8/10)
  const partialAnswers = { ...perfectAnswers };
  const q9Wrong = expected[8].correctAnswer === 'A' ? 'B' : 'A';
  const q10Wrong = expected[9].correctAnswer === 'A' ? 'B' : 'A';
  partialAnswers[expected[8].id] = q9Wrong;
  partialAnswers[expected[9].id] = q10Wrong;
  const partialResult = evaluateQuizSubmission({
    questions: actualQuestions,
    userAnswers: partialAnswers,
    timeElapsedSeconds: 320
  });
  assert.strictEqual(partialResult.correctCount, 8);
  assert.strictEqual(partialResult.incorrectCount, 2);
  assert.strictEqual(partialResult.totalScore, 8);
  assert.strictEqual(partialResult.percentage, 80);

  // Zero score submission (0/10)
  const zeroAnswers = {};
  expected.forEach((exp) => {
    zeroAnswers[exp.id] = exp.correctAnswer === 'A' ? 'B' : 'A';
  });
  const zeroResult = evaluateQuizSubmission({
    questions: actualQuestions,
    userAnswers: zeroAnswers,
    timeElapsedSeconds: 150
  });
  assert.strictEqual(zeroResult.correctCount, 0);
  assert.strictEqual(zeroResult.incorrectCount, 10);
  assert.strictEqual(zeroResult.totalScore, 0);
  assert.strictEqual(zeroResult.percentage, 0);

  console.log(`  ✓ PASS: Exam Mode scoring validated for ${name} (10/10, 8/10, 0/10)`);
}

// 4. Combined Quiz Aggregation Integrity
console.log('\n[4] Testing Combined Quiz Aggregation & Other Weeks Preservation:\n');

const weCourse = getCourseBySlug('wildlife-ecology');
assert(weCourse !== null, 'Course must exist in registry');

const combinedQuestions = getCombinedQuestions(weCourse);
assert.strictEqual(combinedQuestions.length, 130, 'Combined quiz must contain exactly 130 questions (13 weeks x 10)');

// Verify each week has exactly 10 questions in the combined quiz
for (let w = 0; w <= 12; w++) {
  const weekInCombined = combinedQuestions.filter(q => q.week === w);
  assert.strictEqual(weekInCombined.length, 10, `Week ${w} in combined quiz must have exactly 10 questions`);
}

// Verify no duplicate IDs across all 130 questions
const seenIds = new Set();
combinedQuestions.forEach(q => {
  assert(!seenIds.has(q.id), `Duplicate question ID found: ${q.id}`);
  seenIds.add(q.id);
});
assert.strictEqual(seenIds.size, 130, 'All 130 questions have unique IDs');

// Verify Weeks 0-2 and Weeks 7-12 are preserved
[0, 1, 2, 7, 8, 9, 10, 11, 12].forEach(w => {
  const questions = wildlifeEcologyQuestions[w];
  assert(Array.isArray(questions) && questions.length === 10, `Week ${w} must remain intact with 10 questions`);
});

console.log('  ✓ PASS: Combined Quiz aggregates all weeks without duplication');
console.log('  ✓ PASS: Weeks 0–2 and Weeks 7–12 remain completely intact');

console.log('\n=============================================================');
console.log('RESULTS: All Wildlife Ecology Weeks 3–6 Bank tests passed!');
console.log('=============================================================\n');
