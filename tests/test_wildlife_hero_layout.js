import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== TEST SUITE: WILDLIFE ECOLOGY HERO SECTION REDESIGN ===\n');

// 1. Verify SubjectOverview.jsx layout & structure
console.log('[1] Verifying SubjectOverview.jsx Component Structure:');

const subjectOverviewPath = path.join(__dirname, '../src/pages/SubjectOverview.jsx');
const subjectOverviewSource = fs.readFileSync(subjectOverviewPath, 'utf-8');

// Section wrapper
assert(subjectOverviewSource.includes('className="subject-hero-section"'),
  'SubjectOverview.jsx must use .subject-hero-section');
console.log('  ✓ PASS: Hero section uses .subject-hero-section');

// Background blurred image element
assert(subjectOverviewSource.includes('className="subject-hero-bg"'),
  'SubjectOverview.jsx must render .subject-hero-bg layer');
assert(subjectOverviewSource.includes('course.coverImage || \'/images/wildlife_ecology.jpg\''),
  'SubjectOverview.jsx must reuse the existing wildlife image asset for background');
console.log('  ✓ PASS: Background layer renders existing image asset');

// Overlay element
assert(subjectOverviewSource.includes('className="subject-hero-overlay"'),
  'SubjectOverview.jsx must render .subject-hero-overlay layer');
console.log('  ✓ PASS: Soft overlay layer is present');

// Container & Z-index layering
assert(subjectOverviewSource.includes('className="container subject-hero-container"'),
  'SubjectOverview.jsx must use .container.subject-hero-container for foreground content');
console.log('  ✓ PASS: Foreground container properly separates text from blurred background');

// Back button preservation
assert(subjectOverviewSource.includes('className="subject-hero-nav"'),
  'SubjectOverview.jsx must wrap Back button in .subject-hero-nav');
assert(subjectOverviewSource.includes('to="/subjects"'),
  'Back button must navigate to /subjects');
assert(subjectOverviewSource.includes('Back to All Subjects'),
  'Back button label must be preserved');
assert(subjectOverviewSource.includes('<ArrowLeft size={14} />'),
  'Back button icon must be preserved');
console.log('  ✓ PASS: "← Back to All Subjects" button preserved in top-left with original functionality');

// Centered Hero Content
assert(subjectOverviewSource.includes('className="subject-hero-content"'),
  'SubjectOverview.jsx must wrap hero content in .subject-hero-content');
assert(subjectOverviewSource.includes('className="subject-hero-badges"'),
  'SubjectOverview.jsx must wrap badges in .subject-hero-badges');
assert(subjectOverviewSource.includes('className="subject-hero-title"'),
  'SubjectOverview.jsx must style title with .subject-hero-title');
assert(subjectOverviewSource.includes('className="subject-hero-subtitle"'),
  'SubjectOverview.jsx must style subtitle with .subject-hero-subtitle');
assert(subjectOverviewSource.includes('className="subject-hero-description"'),
  'SubjectOverview.jsx must style description with .subject-hero-description');
assert(subjectOverviewSource.includes('className="subject-hero-divider"'),
  'SubjectOverview.jsx must include .subject-hero-divider');
assert(subjectOverviewSource.includes('className="subject-hero-stats"'),
  'SubjectOverview.jsx must wrap stats in .subject-hero-stats');
console.log('  ✓ PASS: All hero text, badges, divider, and stats wrapped in centered structure');

// Removal of separate right-column image
assert(!subjectOverviewSource.includes('gridTemplateColumns: \'1fr 340px\''),
  'Old 2-column hero grid must be removed');
assert(!subjectOverviewSource.includes('maxHeight: \'230px\''),
  'Old right-side image box must be removed');
console.log('  ✓ PASS: Old right-side image box and 2-column grid successfully removed');

// 2. Verify components.css rules
console.log('\n[2] Verifying components.css Styling Rules:');

const cssPath = path.join(__dirname, '../src/styles/components.css');
const cssSource = fs.readFileSync(cssPath, 'utf-8');

assert(cssSource.includes('.subject-hero-section'),
  'components.css must define .subject-hero-section');
assert(cssSource.includes('.subject-hero-bg'),
  'components.css must define .subject-hero-bg');
assert(cssSource.includes('filter: blur('),
  'components.css must apply filter: blur() to .subject-hero-bg');
assert(cssSource.includes('.subject-hero-overlay'),
  'components.css must define .subject-hero-overlay');
assert(cssSource.includes('.subject-hero-container'),
  'components.css must define .subject-hero-container');
assert(cssSource.includes('.subject-hero-nav'),
  'components.css must define .subject-hero-nav');
assert(cssSource.includes('justify-content: flex-start'),
  '.subject-hero-nav must align back button to top-left (flex-start)');
assert(cssSource.includes('.subject-hero-content'),
  'components.css must define .subject-hero-content');
assert(cssSource.includes('align-items: center') && cssSource.includes('text-align: center'),
  '.subject-hero-content must center align items and text');
assert(cssSource.includes('.subject-hero-divider'),
  'components.css must define .subject-hero-divider');
assert(cssSource.includes('.subject-hero-stats'),
  'components.css must define .subject-hero-stats');
console.log('  ✓ PASS: CSS properly defines background blur, overlay, top-left back button, and centered alignment');

console.log('\n==================================================');
console.log('RESULTS: All Wildlife Ecology Hero Redesign tests passed!');
console.log('==================================================\n');
