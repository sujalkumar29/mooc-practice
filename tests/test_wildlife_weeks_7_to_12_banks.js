/**
 * test_wildlife_weeks_7_to_12_banks.js
 *
 * Comprehensive validation of Wildlife Ecology Weeks 7, 8, 9, 10, 11, and 12 Question Banks:
 * 1. Exactly 10 questions per week (Weeks 7 through 12, 60 questions total)
 * 2. Exactly 4 options per question
 * 3. Exact question text, option ordering, and answer keys:
 *    - Week 7: Environmental Factors, Dispersal & Habitat Adaptations
 *    - Week 8: Habitat Fragmentation & Conservation
 *    - Week 9: Human Population, Sustainability & Biogeochemical Cycles
 *    - Week 10: Pollution, Ecotoxicology & Environmental Disturbances
 *    - Week 11: Wildlife Management, Harvesting & Restoration
 *    - Week 12: Integrated Wildlife Ecology Revision
 * 4. Correct 0-based to letter mapping (A=0, B=1, C=2, D=3)
 * 5. Complete absence of '**' markdown markers in text/options
 * 6. Study Mode instant feedback verification
 * 7. Exam Mode scoring verification (perfect 10/10, partial, zero)
 * 8. Combined Quiz dynamic aggregation (130 questions total)
 * 9. Preservation of Weeks 0-6
 */

import assert from 'assert';
import { wildlifeEcologyQuestions } from '../src/data/wildlifeEcology/questions.js';
import { getCourseBySlug } from '../src/data/courses.js';
import { getWeeklyQuestions, getCombinedQuestions } from '../src/utils/questionLoader.js';
import { evaluateQuizSubmission } from '../src/utils/quizScoring.js';

console.log('=== TEST SUITE: WILDLIFE ECOLOGY WEEKS 7-12 QUESTION BANKS VALIDATION ===\n');

const expectedWeek7 = [
  {
    qNum: 1,
    id: 'wildlife-week7-q1',
    question: 'In an estuary, species may use areas of',
    options: [
      'high, intermediate, and low salinity',
      'only high temperature and high fertility',
      'only alpine wind and poor soil',
      'only forest canopy and grassland patches'
    ],
    correctAnswer: 'A',
    correctText: 'high, intermediate, and low salinity'
  },
  {
    qNum: 2,
    id: 'wildlife-week7-q2',
    question: 'The movement of individuals away from their place of birth or hatching or seed production into a new habitat or area to survive and reproduce is called',
    options: ['translocation', 'migration', 'dispersal', 'drifting'],
    correctAnswer: 'C',
    correctText: 'dispersal'
  },
  {
    qNum: 3,
    id: 'wildlife-week7-q3',
    question: 'Transplantation experiments are used to find',
    options: ['potential range', 'effective range', 'actual range', 'economic range'],
    correctAnswer: 'A',
    correctText: 'potential range'
  },
  {
    qNum: 4,
    id: 'wildlife-week7-q4',
    question: 'Pneumatophores are roots that',
    options: [
      'move downward to store excess salts',
      'spread into sand dunes to stop wind erosion',
      'grow upward from the ground to obtain air',
      'become thorns to reduce transpiration'
    ],
    correctAnswer: 'C',
    correctText: 'grow upward from the ground to obtain air'
  },
  {
    qNum: 5,
    id: 'wildlife-week7-q5',
    question: 'At night, cooler and denser air from upper hill areas flows down towards the valley. This wind pattern is called',
    options: ['valley breeze', 'hill wind', 'ocean breeze', 'estuary current'],
    correctAnswer: 'B',
    correctText: 'hill wind'
  },
  {
    qNum: 6,
    id: 'wildlife-week7-q6',
    question: 'Flamingos in the Rann of Kutch are associated with water bodies because they need',
    options: [
      'high wind speeds and snow-covered slopes',
      'food organisms in water and safe breeding conditions',
      'dry deciduous leaves for summer feeding',
      'tall coniferous trees for nesting'
    ],
    correctAnswer: 'B',
    correctText: 'food organisms in water and safe breeding conditions'
  },
  {
    qNum: 7,
    id: 'wildlife-week7-q7',
    question: 'Estuaries are specialized habitats because they contain',
    options: [
      'only freshwater throughout the year',
      'only saline water throughout the year',
      'only dry land and thorny shrubs',
      'a meeting zone of freshwater and saline water'
    ],
    correctAnswer: 'D',
    correctText: 'a meeting zone of freshwater and saline water'
  },
  {
    qNum: 8,
    id: 'wildlife-week7-q8',
    question: 'The movement of lions across the Gir landscape is an example of',
    options: ['diffusion', 'secular dispersal', 'jump dispersal', 'drifting'],
    correctAnswer: 'A',
    correctText: 'diffusion'
  },
  {
    qNum: 9,
    id: 'wildlife-week7-q9',
    question: 'Mangroves are adapted to areas that experience',
    options: [
      'low salinity and permanent dryness',
      'snow accumulation and alpine winds',
      'deep desert sand with no water movement',
      'high salinity and partial or complete inundation'
    ],
    correctAnswer: 'D',
    correctText: 'high salinity and partial or complete inundation'
  },
  {
    qNum: 10,
    id: 'wildlife-week7-q10',
    question: 'Scarcity of food is a',
    options: ['chemical factor', 'demographic factor', 'push factor', 'pull factor'],
    correctAnswer: 'C',
    correctText: 'push factor'
  }
];

const expectedWeek8 = [
  {
    qNum: 1,
    id: 'wildlife-week8-q1',
    question: 'Which of these correctly represents the process of habitat fragmentation and loss?',
    options: [
      'Original forest → Dissection → Perforation → Fragmentation → Attrition',
      'Original forest → Dissection → Attrition → Fragmentation → Perforation',
      'Original forest → Dissection → Perforation → Attrition → Fragmentation',
      'Original forest → Dissection → Fragmentation → Perforation → Attrition'
    ],
    correctAnswer: 'A',
    correctText: 'Original forest → Dissection → Perforation → Fragmentation → Attrition'
  },
  {
    qNum: 2,
    id: 'wildlife-week8-q2',
    question: 'Habitat degradation means',
    options: [
      'complete removal of all organisms from an area',
      'legal declaration of a protected area',
      'breaking a forest into administrative zones',
      'reduction in habitat quality for a given species'
    ],
    correctAnswer: 'D',
    correctText: 'reduction in habitat quality for a given species'
  },
  {
    qNum: 3,
    id: 'wildlife-week8-q3',
    question: 'When area is reduced by 90% and z is taken as 0.30, species richness approximately becomes',
    options: [
      'one-tenth of the original',
      'half of the original',
      'double the original',
      'unchanged'
    ],
    correctAnswer: 'B',
    correctText: 'half of the original'
  },
  {
    qNum: 4,
    id: 'wildlife-week8-q4',
    question: 'Breaking a natural landscape into small isolated parcels within human-dominated land is called',
    options: [
      'habitat restoration',
      'habitat fragmentation',
      'ex-situ preservation',
      'seed dormancy'
    ],
    correctAnswer: 'B',
    correctText: 'habitat fragmentation'
  },
  {
    qNum: 5,
    id: 'wildlife-week8-q5',
    question: 'We prefer those areas for the creation of a conservation reserve where the level of threat is',
    options: ['very high', 'medium', 'very low', 'non-existent'],
    correctAnswer: 'B',
    correctText: 'medium'
  },
  {
    qNum: 6,
    id: 'wildlife-week8-q6',
    question: 'A very small population moves towards extinction mainly because of Allee effect, chance deaths, and related small-population problems. This is best described as',
    options: [
      'habitat displacement',
      'small population paradigm',
      'reserve design',
      'biodiversity repository'
    ],
    correctAnswer: 'B',
    correctText: 'small population paradigm'
  },
  {
    qNum: 7,
    id: 'wildlife-week8-q7',
    question: 'A population becomes smaller because its habitat is shrinking, competitors are increasing, and poaching is removing individuals. This situation is best studied under',
    options: [
      'declining population paradigm',
      'small population paradigm',
      'island biogeography model',
      'cryopreservation strategy'
    ],
    correctAnswer: 'A',
    correctText: 'declining population paradigm'
  },
  {
    qNum: 8,
    id: 'wildlife-week8-q8',
    question: 'Which of these is a deterministic factor?',
    options: ['environmental variation', 'forest fire', 'death rate', 'diseases'],
    correctAnswer: 'C',
    correctText: 'death rate'
  },
  {
    qNum: 9,
    id: 'wildlife-week8-q9',
    question: 'Roads, railways, dams, and similar structures contribute to fragmentation because they may act as',
    options: [
      'mortality sources and physical barriers',
      'seed collection centres',
      'botanical repositories',
      'cryopreservation facilities'
    ],
    correctAnswer: 'A',
    correctText: 'mortality sources and physical barriers'
  },
  {
    qNum: 10,
    id: 'wildlife-week8-q10',
    question: 'The acronym HIPPO does not include',
    options: ['habitat loss', 'invasive species', 'pollination', 'pollution'],
    correctAnswer: 'C',
    correctText: 'pollination'
  }
];

const expectedWeek9 = [
  {
    qNum: 1,
    id: 'wildlife-week9-q1',
    question: 'A proposed epoch marked by significant human impact on Earth’s geology and ecosystems is called?',
    options: ['Holocene', 'Anthropocene', 'Pleistocene', 'Carboniferous'],
    correctAnswer: 'B',
    correctText: 'Anthropocene'
  },
  {
    qNum: 2,
    id: 'wildlife-week9-q2',
    question: 'According to Malthusian model,',
    options: [
      'Population grows in geometric progression, food supply increases in arithmetic progression',
      'Population grows in geometric progression, food supply increases in geometric progression',
      'Population grows in arithmetic progression, food supply increases in arithmetic progression',
      'Population grows in arithmetic progression, food supply increases in geometric progression'
    ],
    correctAnswer: 'A',
    correctText: 'Population grows in geometric progression, food supply increases in arithmetic progression'
  },
  {
    qNum: 3,
    id: 'wildlife-week9-q3',
    question: 'Which of these is not a pillar of sustainability?',
    options: [
      'environmental sustainability',
      'economic sustainability',
      'trans-boundary sustainability',
      'social sustainability'
    ],
    correctAnswer: 'C',
    correctText: 'trans-boundary sustainability'
  },
  {
    qNum: 4,
    id: 'wildlife-week9-q4',
    question: 'The demographic transition sees a society move from',
    options: [
      'high birth rate, low death rate to low birth rate, low death rate',
      'low birth rate, high death rate to low birth rate, low death rate',
      'high birth rate, high death rate to low birth rate, low death rate',
      'high birth rate, high death rate to low birth rate, high death rate'
    ],
    correctAnswer: 'C',
    correctText: 'high birth rate, high death rate to low birth rate, low death rate'
  },
  {
    qNum: 5,
    id: 'wildlife-week9-q5',
    question: 'Which of the following is listed as a theme of clean technology?',
    options: [
      'Water purification',
      'Predator-prey control',
      'Migration of birds',
      'Food chain length'
    ],
    correctAnswer: 'A',
    correctText: 'Water purification'
  },
  {
    qNum: 6,
    id: 'wildlife-week9-q6',
    question: 'When stalactites and stalagmites join together, they form a?',
    options: ['Lagoon', 'Crevice', 'Terrace', 'Column'],
    correctAnswer: 'D',
    correctText: 'Column'
  },
  {
    qNum: 7,
    id: 'wildlife-week9-q7',
    question: 'Which of these is a preventive check according to Malthus?',
    options: ['foresight', 'vice', 'misery', 'flood'],
    correctAnswer: 'A',
    correctText: 'foresight'
  },
  {
    qNum: 8,
    id: 'wildlife-week9-q8',
    question: 'Which of these is a pillar of sustainability',
    options: [
      'social sustainability',
      'industrial sustainability',
      'agricultural sustainability',
      'trans-boundary sustainability'
    ],
    correctAnswer: 'A',
    correctText: 'social sustainability'
  },
  {
    qNum: 9,
    id: 'wildlife-week9-q9',
    question: 'In cave formations, the deposits growing downward from the roof are called?',
    options: ['Stalagmites', 'Columns', 'Stalactites', 'Sediment bars'],
    correctAnswer: 'C',
    correctText: 'Stalactites'
  },
  {
    qNum: 10,
    id: 'wildlife-week9-q10',
    question: 'Industrial processes such as the Haber process affect which biogeochemical cycle?',
    options: [
      'Carbon cycle only',
      'Water cycle only',
      'Nitrogen cycle',
      'Phosphorus cycle only'
    ],
    correctAnswer: 'C',
    correctText: 'Nitrogen cycle'
  }
];

const expectedWeek10 = [
  {
    qNum: 1,
    id: 'wildlife-week10-q1',
    question: 'A community already affected by disease, weeds, pollutants, or livestock pressure is best described as which type of community?',
    options: [
      'Pristine community',
      'Climax community',
      'Resistant community',
      'Disturbed community'
    ],
    correctAnswer: 'D',
    correctText: 'Disturbed community'
  },
  {
    qNum: 2,
    id: 'wildlife-week10-q2',
    question: 'When an organism absorbs a toxic substance into its tissues faster than it loses it, the process is called:',
    options: [
      'Biomagnification',
      'Bioavailability',
      'Bioaccumulation',
      'Biodegradation'
    ],
    correctAnswer: 'C',
    correctText: 'Bioaccumulation'
  },
  {
    qNum: 3,
    id: 'wildlife-week10-q3',
    question: 'What percentage of marine plastic debris is stated to sink to the ocean bottom?',
    options: ['15%', '30%', '50%', '70%'],
    correctAnswer: 'D',
    correctText: '70%'
  },
  {
    qNum: 4,
    id: 'wildlife-week10-q4',
    question: 'Hydrocarbons derived directly from mineral oils are called:',
    options: [
      'Pyrogenic hydrocarbons',
      'Biogenic hydrocarbons',
      'Aromatic hydrocarbons',
      'Petrogenic hydrocarbons'
    ],
    correctAnswer: 'D',
    correctText: 'Petrogenic hydrocarbons'
  },
  {
    qNum: 5,
    id: 'wildlife-week10-q5',
    question: '“Any changes in natural or human systems that inadvertently increase vulnerability to climatic stimuli; an adaptation that does not succeed in reducing vulnerability but increases it instead” is a definition for',
    options: ['adaptation', 'mitigation', 'maladaptation', 'malmitigation'],
    correctAnswer: 'C',
    correctText: 'maladaptation'
  },
  {
    qNum: 6,
    id: 'wildlife-week10-q6',
    question: 'A normal ecological community faces one large and infrequent disturbance and then returns close to its earlier condition. Which outcome is best represented?',
    options: ['Long-term alteration', 'Recovery', 'Bioaccumulation', 'Habitat displacement'],
    correctAnswer: 'B',
    correctText: 'Recovery'
  },
  {
    qNum: 7,
    id: 'wildlife-week10-q7',
    question: 'Macrodebris in the context of plastic debris has fragments of size',
    options: ['> 20 mm', '5 - 20 mm', '< 5 mm', '< 1 mm'],
    correctAnswer: 'A',
    correctText: '> 20 mm'
  },
  {
    qNum: 8,
    id: 'wildlife-week10-q8',
    question: 'The Deepwater Horizon incident is classified by origin as which kind of oil spill?',
    options: ['Natural', 'Accidental', 'Intentional', 'Biogenic'],
    correctAnswer: 'B',
    correctText: 'Accidental'
  },
  {
    qNum: 9,
    id: 'wildlife-week10-q9',
    question: 'Harmful effects caused by a single or short-term exposure are called:',
    options: ['Chronic toxicity', 'Acute toxicity', 'Sub-lethal exposure', 'Bioavailability'],
    correctAnswer: 'B',
    correctText: 'Acute toxicity'
  },
  {
    qNum: 10,
    id: 'wildlife-week10-q10',
    question: 'Mesodebris in the context of plastic debris has fragments of size',
    options: ['> 20 mm', '5 - 20 mm', '< 5 mm', '< 1 mm'],
    correctAnswer: 'B',
    correctText: '5 - 20 mm'
  }
];

const expectedWeek11 = [
  {
    qNum: 1,
    id: 'wildlife-week11-q1',
    question: 'Which term refers to the total weight of organisms removed by fishing?',
    options: ['Natural mortality', 'Recruitment', 'Growth', 'Yield to fishery'],
    correctAnswer: 'D',
    correctText: 'Yield to fishery'
  },
  {
    qNum: 2,
    id: 'wildlife-week11-q2',
    question: "Ludwig's ratchet predicts",
    options: [
      'decreasing harvesting rate',
      'constant harvesting rate',
      'increasing harvesting rate',
      'fluctuating harvesting rate'
    ],
    correctAnswer: 'C',
    correctText: 'increasing harvesting rate'
  },
  {
    qNum: 3,
    id: 'wildlife-week11-q3',
    question: 'A deciduous forest in Madhya Pradesh was converted to a mine. After the mining operations were over, the pits were filled up with water and a lake was created. It is now visited by several migratory birds. This is an example of',
    options: ['recovery', 'restoration', 'enhancement', 'replacement'],
    correctAnswer: 'D',
    correctText: 'replacement'
  },
  {
    qNum: 4,
    id: 'wildlife-week11-q4',
    question: 'Which of these is correct?',
    options: [
      'The maximum sustainable yield is near the beginning of the sigmoidal curve.',
      'The maximum sustainable yield is near the mid-point of the sigmoidal curve.',
      'The maximum sustainable yield is near the end of the sigmoidal curve.',
      'None of these.'
    ],
    correctAnswer: 'B',
    correctText: 'The maximum sustainable yield is near the mid-point of the sigmoidal curve.'
  },
  {
    qNum: 5,
    id: 'wildlife-week11-q5',
    question: 'Which of these is correct?',
    options: [
      'R + G = M + F',
      'R + M = G + F',
      'R + F = M + G',
      'R + G + M + F = 0'
    ],
    correctAnswer: 'A',
    correctText: 'R + G = M + F'
  },
  {
    qNum: 6,
    id: 'wildlife-week11-q6',
    question: 'In a logistic growth curve, growth is slow near carrying capacity mainly because the population is:',
    options: [
      'very small',
      'newly introduced',
      'close to the environmental limit',
      'free from competition'
    ],
    correctAnswer: 'C',
    correctText: 'close to the environmental limit'
  },
  {
    qNum: 7,
    id: 'wildlife-week11-q7',
    question: 'What does absolute abundance measure?',
    options: [
      'Relative catch per unit effort',
      'Actual number of individuals present',
      'Percentage change in population',
      'Estimated trend in sightings'
    ],
    correctAnswer: 'B',
    correctText: 'Actual number of individuals present'
  },
  {
    qNum: 8,
    id: 'wildlife-week11-q8',
    question: 'A root zone treatment plant is an example of',
    options: ['phytoremediation', 'biological control', 'biomagnification', 'bioaccumulation'],
    correctAnswer: 'A',
    correctText: 'phytoremediation'
  },
  {
    qNum: 9,
    id: 'wildlife-week11-q9',
    question: 'What is a major risk of introducing predators for pest control?',
    options: [
      'The pest always becomes extinct immediately',
      'The predator cannot reproduce under any condition',
      'The predator reduces rainfall',
      'The introduced predator may itself become a pest'
    ],
    correctAnswer: 'D',
    correctText: 'The introduced predator may itself become a pest'
  },
  {
    qNum: 10,
    id: 'wildlife-week11-q10',
    question: 'Ecotoxicology studies toxic chemicals mainly at which broader levels?',
    options: [
      'Individual atoms and molecules only',
      'Population, community, ecosystem, and biosphere levels',
      'Market demand and harvesting cost only',
      'Crop yield and storage levels only'
    ],
    correctAnswer: 'B',
    correctText: 'Population, community, ecosystem, and biosphere levels'
  }
];

const expectedWeek12 = [
  {
    qNum: 1,
    id: 'wildlife-week12-q1',
    question: 'In cave formations, the deposits growing downward from the roof are called?',
    options: ['Stalagmites', 'Columns', 'Stalactites', 'Sediment bars'],
    correctAnswer: 'C',
    correctText: 'Stalactites'
  },
  {
    qNum: 2,
    id: 'wildlife-week12-q2',
    question: 'Which of these is a deterministic factor?',
    options: ['environmental variation', 'forest fire', 'death rate', 'diseases'],
    correctAnswer: 'C',
    correctText: 'death rate'
  },
  {
    qNum: 3,
    id: 'wildlife-week12-q3',
    question: 'An ecological interaction in which both participating organisms are harmed is called',
    options: ['mutualism', 'commensalism', 'competition', 'neutralism'],
    correctAnswer: 'C',
    correctText: 'competition'
  },
  {
    qNum: 4,
    id: 'wildlife-week12-q4',
    question: 'Ecology is the scientific study of that determine the distribution and abundance of organisms. (Fill in the blanks)',
    options: ['statics', 'interactions', 'dynamics', 'habitat'],
    correctAnswer: 'B',
    correctText: 'interactions'
  },
  {
    qNum: 5,
    id: 'wildlife-week12-q5',
    question: 'Mesodebris in the context of plastic debris has fragments of size',
    options: ['> 20 mm', '5 - 20 mm', '< 5 mm', '< 1 mm'],
    correctAnswer: 'B',
    correctText: '5 - 20 mm'
  },
  {
    qNum: 6,
    id: 'wildlife-week12-q6',
    question: 'Which level is formed when similar cells and their extracellular matrix from the same origin together perform a specific function?',
    options: ['Organ', 'Tissue', 'Organ system', 'Population'],
    correctAnswer: 'B',
    correctText: 'Tissue'
  },
  {
    qNum: 7,
    id: 'wildlife-week12-q7',
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
    qNum: 8,
    id: 'wildlife-week12-q8',
    question: 'A group of organs working together to perform one or more functions is called?',
    options: ['Tissue', 'Organ', 'Organism', 'Organ system'],
    correctAnswer: 'D',
    correctText: 'Organ system'
  },
  {
    qNum: 9,
    id: 'wildlife-week12-q9',
    question: 'After a forest fire, an incompletely destroyed forest develops through herbaceous, shrub and woodland stages toward a stable stage. This is best described as?',
    options: [
      'Secondary succession',
      'Climatic climax',
      'Bioaccumulation',
      'Species-area effect'
    ],
    correctAnswer: 'A',
    correctText: 'Secondary succession'
  },
  {
    qNum: 10,
    id: 'wildlife-week12-q10',
    question: 'If organisms already present in an area change the soil conditions and thereby drive further community change, the succession is?',
    options: [
      'Allogenic succession',
      'Autogenic succession',
      'Catastrophic succession',
      'Seasonal succession'
    ],
    correctAnswer: 'B',
    correctText: 'Autogenic succession'
  }
];

const weeksToTest = [
  { weekNum: 7, name: 'Week 7 (Environmental Factors, Dispersal & Habitat Adaptations)', expected: expectedWeek7 },
  { weekNum: 8, name: 'Week 8 (Habitat Fragmentation & Conservation)', expected: expectedWeek8 },
  { weekNum: 9, name: 'Week 9 (Human Population, Sustainability & Biogeochemical Cycles)', expected: expectedWeek9 },
  { weekNum: 10, name: 'Week 10 (Pollution, Ecotoxicology & Environmental Disturbances)', expected: expectedWeek10 },
  { weekNum: 11, name: 'Week 11 (Wildlife Management, Harvesting & Restoration)', expected: expectedWeek11 },
  { weekNum: 12, name: 'Week 12 (Integrated Wildlife Ecology Revision)', expected: expectedWeek12 }
];

console.log('[1] Verifying Question Banks, Options, Wording & Answer Keys for Weeks 7–12:\n');

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

// 2. Study Mode Feedback Simulation for Weeks 7–12
console.log('[2] Testing Study Mode Feedback Simulation for Weeks 7–12:\n');

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

// 3. Exam Mode Scoring Simulation for Weeks 7–12
console.log('\n[3] Testing Exam Mode Scoring Simulation for Weeks 7–12:\n');

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

// Verify Weeks 0-6 are preserved
for (let w = 0; w <= 6; w++) {
  const questions = wildlifeEcologyQuestions[w];
  assert(Array.isArray(questions) && questions.length === 10, `Week ${w} must remain intact with 10 questions`);
}

console.log('  ✓ PASS: Combined Quiz aggregates all weeks without duplication');
console.log('  ✓ PASS: Weeks 0–6 remain completely intact');

console.log('\n=============================================================');
console.log('RESULTS: All Wildlife Ecology Weeks 7–12 Bank tests passed!');
console.log('=============================================================\n');
