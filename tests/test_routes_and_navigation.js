import { matchPath } from 'react-router-dom';
import { getCourseBySlug } from '../src/data/courses.js';
import { getWeeklyQuestions, getCombinedQuestions } from '../src/utils/questionLoader.js';

console.log('--- TESTING REACT ROUTER ROUTE MATCHING & NAVIGATION ---');

const routes = [
  { path: '/subjects/:subjectSlug/quiz/combined', name: 'CombinedQuiz' },
  { path: '/subjects/:subjectSlug/quiz/:weekParam', name: 'WeeklyQuiz' },
  { path: '/subjects/:subjectSlug/quiz/week/:weekNumber', name: 'WeeklyQuiz (alias)' },
  { path: '/subjects/:subjectSlug', name: 'SubjectOverview' },
  { path: '/subjects', name: 'Subjects' },
  { path: '/', name: 'Home' }
];

function testRoute(url) {
  for (const r of routes) {
    const match = matchPath(r.path, url);
    if (match) {
      return { matched: true, route: r.name, pattern: r.path, params: match.params };
    }
  }
  return { matched: false };
}

const course = getCourseBySlug('wildlife-ecology');
if (!course) {
  console.error('FAIL: Course wildlife-ecology not found!');
  process.exit(1);
}

// 1. Test Combined Quiz route
const combinedRes = testRoute('/subjects/wildlife-ecology/quiz/combined');
console.log('1. Combined Quiz Route:');
if (combinedRes.matched && combinedRes.route === 'CombinedQuiz') {
  const qCombined = getCombinedQuestions(course);
  console.log(`  ✓ PASS: Matched CombinedQuiz, loaded ${qCombined.length} questions`);
} else {
  console.error('  ✗ FAIL: Combined quiz did not match CombinedQuiz route', combinedRes);
  process.exit(1);
}

// 2. Test Week 0 through 12
console.log('\n2. Weekly Quiz Routes (Week 0 to Week 12):');
for (let w = 0; w <= 12; w++) {
  const url = `/subjects/wildlife-ecology/quiz/week-${w}`;
  const res = testRoute(url);
  
  if (!res.matched || res.route !== 'WeeklyQuiz') {
    console.error(`  ✗ FAIL: ${url} did not match WeeklyQuiz route!`, res);
    process.exit(1);
  }

  // Parse weekParam
  const raw = res.params.weekParam;
  const parsed = String(raw).replace(/^week-?/i, '').trim();
  const weekNum = Number(parsed);

  if (weekNum !== w) {
    console.error(`  ✗ FAIL: parsed weekNum (${weekNum}) != expected (${w})`);
    process.exit(1);
  }

  const questions = getWeeklyQuestions(course, weekNum);
  const expectedCount = 10;
  if (questions.length !== expectedCount) {
    console.error(`  ✗ FAIL: Week ${w} questions count (${questions.length}) != expected (${expectedCount})`);
    process.exit(1);
  }

  console.log(`  ✓ PASS: Week ${w} URL '${url}' -> matched WeeklyQuiz, parsed week ${weekNum}, loaded ${questions.length} questions`);
}

// 3. Test alternate valid formats
console.log('\n3. Alternate Weekly URL Formats:');
const altUrls = [
  { url: '/subjects/wildlife-ecology/quiz/1', expectedWeek: 1 },
  { url: '/subjects/wildlife-ecology/quiz/12', expectedWeek: 12 },
  { url: '/subjects/wildlife-ecology/quiz/week/5', expectedWeek: 5 }
];

for (const item of altUrls) {
  const res = testRoute(item.url);
  if (res.matched && (res.route === 'WeeklyQuiz' || res.route === 'WeeklyQuiz (alias)')) {
    const raw = res.params.weekParam !== undefined ? res.params.weekParam : res.params.weekNumber;
    const weekNum = Number(String(raw).replace(/^week-?/i, ''));
    if (weekNum === item.expectedWeek) {
      console.log(`  ✓ PASS: Alternate format '${item.url}' correctly resolves to Week ${weekNum}`);
    } else {
      console.error(`  ✗ FAIL: Alternate format '${item.url}' got week ${weekNum}, expected ${item.expectedWeek}`);
      process.exit(1);
    }
  } else {
    console.error(`  ✗ FAIL: '${item.url}' did not match WeeklyQuiz`, res);
    process.exit(1);
  }
}

console.log('\n==================================================');
console.log('ALL ROUTING & NAVIGATION INTEGRITY TESTS PASSED!');
console.log('==================================================');
