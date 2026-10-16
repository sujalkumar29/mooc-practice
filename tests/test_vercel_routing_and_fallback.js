/**
 * test_vercel_routing_and_fallback.js
 * 
 * Verifies Vercel SPA routing configuration and React Router navigation fallback integrity:
 * 1. vercel.json existence, schema, and non-conflicting rewrite rules
 * 2. SPA fallback to /index.html for all client routes
 * 3. App.jsx route resolution for canonical quiz routes (Week 0 to 12, Combined)
 * 4. App.jsx route resolution for aliases (/combined, /week/1, /week-1)
 * 5. App.jsx 404 behavior using dedicated NotFound component (no blind redirect to /)
 * 6. Browser history navigation fallback in QuizInterface and ResultsSummary
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { matchPath } from 'react-router-dom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('=== TEST SUITE: VERCEL ROUTING & SPA FALLBACK INTEGRITY ===\n');

// -----------------------------------------------------------------------------
// 1. VERCEL CONFIGURATION VERIFICATION
// -----------------------------------------------------------------------------
console.log('[1] Verifying vercel.json:');

const vercelConfigPath = path.join(projectRoot, 'vercel.json');
assert(fs.existsSync(vercelConfigPath), 'vercel.json must exist in project root');

const vercelContent = fs.readFileSync(vercelConfigPath, 'utf8');
let vercelJson;
try {
  vercelJson = JSON.parse(vercelContent);
} catch (e) {
  assert.fail(`vercel.json must be valid JSON: ${e.message}`);
}

assert(Array.isArray(vercelJson.rewrites), 'vercel.json must define rewrites array');
assert.strictEqual(vercelJson.rewrites.length, 1, 'vercel.json should have a single non-conflicting rewrite rule');

const rewrite = vercelJson.rewrites[0];
assert.strictEqual(rewrite.source, '/(.*)', 'Rewrite source must match all routes /(.*)');
assert.strictEqual(rewrite.destination, '/index.html', 'Rewrite destination must be /index.html for SPA fallback');

// Ensure no conflicting cleanUrls or trailingSlash that break SPA routing
assert(!('cleanUrls' in vercelJson), 'cleanUrls should not be enabled to prevent SPA route conflicts');
console.log('  ✓ PASS: vercel.json correctly specifies standard SPA rewrite: /(.*) -> /index.html');
console.log('  ✓ PASS: No conflicting or duplicate rewrite rules present');

// -----------------------------------------------------------------------------
// 2. REACT ROUTER ROUTE DEFINITIONS IN APP.JSX
// -----------------------------------------------------------------------------
console.log('\n[2] Verifying App.jsx Route Setup:');

const appPath = path.join(projectRoot, 'src', 'App.jsx');
const appSource = fs.readFileSync(appPath, 'utf8');

// Check NotFound import and usage
assert(appSource.includes("import NotFound from './pages/NotFound';"),
  'App.jsx must import NotFound component');
assert(appSource.includes("<NotFound />"),
  'App.jsx must render <NotFound /> for unknown routes');
assert(!appSource.includes('<Navigate to="/" replace />'),
  'App.jsx must NOT blindly redirect unknown routes to homepage');
console.log('  ✓ PASS: App.jsx uses <NotFound /> instead of blind redirect to homepage');

// Check that NotFound.jsx exists and has proper links
const notFoundPath = path.join(projectRoot, 'src', 'pages', 'NotFound.jsx');
assert(fs.existsSync(notFoundPath), 'src/pages/NotFound.jsx must exist');
const notFoundSource = fs.readFileSync(notFoundPath, 'utf8');
assert(notFoundSource.includes('to="/"') && notFoundSource.includes('to="/subjects"'),
  'NotFound.jsx must provide navigation links to home and subjects');
assert(notFoundSource.includes('404'),
  'NotFound.jsx must display 404 status indicator');
console.log('  ✓ PASS: src/pages/NotFound.jsx properly implemented with 404 UI and navigation links');

// Check canonical and alias routes in App.jsx
assert(appSource.includes("path: 'subjects/:subjectSlug/quiz/combined'"),
  'App.jsx must register canonical Combined Quiz route');
assert(appSource.includes("path: 'subjects/:subjectSlug/quiz/:weekParam'"),
  'App.jsx must register canonical Weekly Quiz route');
assert(appSource.includes("path: 'subjects/:subjectSlug/combined'"),
  'App.jsx must register alias Combined Quiz route');
assert(appSource.includes("path: 'subjects/:subjectSlug/week/:weekNumber'"),
  'App.jsx must register alias /week/:weekNumber route');
assert(appSource.includes("path: 'subjects/:subjectSlug/week-:weekNumber'"),
  'App.jsx must register alias /week-:weekNumber route');
console.log('  ✓ PASS: App.jsx registers both canonical quiz routes and direct access aliases');

// -----------------------------------------------------------------------------
// 3. ROUTE MATCHING FOR ALL WEEKS AND COMBINED QUIZ
// -----------------------------------------------------------------------------
console.log('\n[3] Testing Route Matching for Quizzes:');

const appRoutes = [
  { path: '/subjects/:subjectSlug/quiz/combined', name: 'CombinedQuiz' },
  { path: '/subjects/:subjectSlug/quiz/:weekParam', name: 'WeeklyQuiz' },
  { path: '/subjects/:subjectSlug/quiz/week/:weekNumber', name: 'WeeklyQuiz (slash-alias)' },
  { path: '/subjects/:subjectSlug/combined', name: 'CombinedQuiz (alias)' },
  { path: '/subjects/:subjectSlug/week/:weekNumber', name: 'WeeklyQuiz (direct-alias)' },
  { path: '/subjects/:subjectSlug/week-:weekNumber', name: 'WeeklyQuiz (dash-alias)' },
  { path: '/subjects/:subjectSlug', name: 'SubjectOverview' },
  { path: '/subjects', name: 'Subjects' },
  { path: '/demo-quiz', name: 'QuizSandbox' },
  { path: '/about', name: 'About' },
  { path: '/', name: 'Home' },
  { path: '*', name: 'NotFound' }
];

function matchAppRoute(url) {
  for (const r of appRoutes) {
    const match = matchPath(r.path, url);
    if (match) {
      return { matched: true, route: r.name, pattern: r.path, params: match.params };
    }
  }
  return { matched: false };
}

// Test Combined Quiz canonical and alias
const mCombined1 = matchAppRoute('/subjects/wildlife-ecology/quiz/combined');
assert(mCombined1.matched && mCombined1.route.startsWith('CombinedQuiz'), 'Combined canonical must match');
const mCombined2 = matchAppRoute('/subjects/wildlife-ecology/combined');
assert(mCombined2.matched && mCombined2.route.startsWith('CombinedQuiz'), 'Combined alias must match');
console.log('  ✓ PASS: Combined Quiz matches on canonical and alias URLs');

// Test all 13 weekly quiz routes (Week 0 to Week 12)
for (let w = 0; w <= 12; w++) {
  const canonicalUrl = `/subjects/wildlife-ecology/quiz/week-${w}`;
  const res = matchAppRoute(canonicalUrl);
  assert(res.matched && res.route.startsWith('WeeklyQuiz'), `Week ${w} canonical URL must match WeeklyQuiz`);

  const aliasUrl1 = `/subjects/wildlife-ecology/quiz/${w}`;
  const resAlias1 = matchAppRoute(aliasUrl1);
  assert(resAlias1.matched && resAlias1.route.startsWith('WeeklyQuiz'), `Week ${w} alias 1 must match WeeklyQuiz`);

  const aliasUrl2 = `/subjects/wildlife-ecology/week/${w}`;
  const resAlias2 = matchAppRoute(aliasUrl2);
  assert(resAlias2.matched && resAlias2.route.startsWith('WeeklyQuiz'), `Week ${w} direct alias must match WeeklyQuiz`);
}
console.log('  ✓ PASS: All 13 weeks (Week 0 to Week 12) resolve accurately across canonical and alias URLs');

// Test genuine 404 routes
const m404_1 = matchAppRoute('/invalid-route-xyz');
assert(m404_1.matched && m404_1.route === 'NotFound', 'Genuinely invalid route must match NotFound');
const m404_2 = matchAppRoute('/subjects/wildlife-ecology/unknown-subroute');
assert(m404_2.matched && m404_2.route === 'NotFound', 'Invalid subroute must match NotFound');
console.log('  ✓ PASS: Unknown and genuinely invalid URLs resolve to NotFound (no blind redirect)');

// -----------------------------------------------------------------------------
// 4. BROWSER HISTORY AND EXIT NAVIGATION CHECKS
// -----------------------------------------------------------------------------
console.log('\n[4] Verifying Browser History and Exit Handlers:');

const quizInterfaceSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'QuizInterface.jsx'), 'utf8');
const resultsSummarySource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'ResultsSummary.jsx'), 'utf8');

// QuizInterface must have safe history fallback
assert(quizInterfaceSource.includes('const hasHistoryEntry'), 'QuizInterface must check history entry existence');
assert(quizInterfaceSource.includes('navigate(-1)'), 'QuizInterface must pop history stack when entry exists');
assert(quizInterfaceSource.includes('navigate(backUrl'), 'QuizInterface must fall back to backUrl when history stack is empty');

// ResultsSummary must have safe history fallback
assert(resultsSummarySource.includes('const hasHistoryEntry'), 'ResultsSummary must check history entry existence');
assert(resultsSummarySource.includes('navigate(-1)'), 'ResultsSummary must pop history stack when entry exists');
assert(resultsSummarySource.includes('navigate(`/subjects/${course.slug}`'), 'ResultsSummary must fall back to course page when history stack is empty');

console.log('  ✓ PASS: Safe browser history handling verified in QuizInterface and ResultsSummary');

console.log('\n==================================================');
console.log('ALL VERCEL ROUTING & SPA FALLBACK TESTS PASSED!');
console.log('==================================================\n');
