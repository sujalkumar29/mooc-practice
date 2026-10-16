import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('=== TEST SUITE: HOMEPAGE HERO VIDEO BACKGROUND & CENTERED LAYOUT ===\n');

// 1. Verify Home.jsx source
const homePath = path.join(projectRoot, 'src', 'pages', 'Home.jsx');
const homeSource = fs.readFileSync(homePath, 'utf8');

// Check hero section class
assert(homeSource.includes('className="home-hero-section"'),
  'Home.jsx must render <section className="home-hero-section">');
console.log('  ✓ PASS: Hero section uses .home-hero-section');

// Check video container and attributes
assert(homeSource.includes('className="home-hero-video-bg"'),
  'Home.jsx must render .home-hero-video-bg container');
assert(homeSource.includes('className="home-hero-video"'),
  'Home.jsx must render video with .home-hero-video');
assert(homeSource.includes('src="/bgvideo.mp4"'),
  'Home.jsx must reference /bgvideo.mp4');
assert(homeSource.includes('autoPlay'),
  'Video element must have autoPlay attribute');
assert(homeSource.includes('muted'),
  'Video element must have muted attribute');
assert(homeSource.includes('loop'),
  'Video element must have loop attribute');
assert(homeSource.includes('playsInline'),
  'Video element must have playsInline attribute');
console.log('  ✓ PASS: Video element correctly configured with src="/bgvideo.mp4", autoPlay, muted, loop, playsInline');

// Check overlay
assert(homeSource.includes('className="home-hero-overlay"'),
  'Home.jsx must render .home-hero-overlay');
console.log('  ✓ PASS: Readability overlay layer .home-hero-overlay is present');

// Check removal of old illustration & 2-column grid
assert(!homeSource.includes('/images/hero.jpg'),
  'Home.jsx must no longer reference /images/hero.jpg');
assert(!homeSource.includes('1.15fr 0.85fr'),
  'Home.jsx must no longer use the old 2-column grid');
console.log('  ✓ PASS: Old hero illustration and 2-column grid successfully removed');

// Check centered elements and preserved text
assert(homeSource.includes('className="home-hero-badge"'),
  'Home.jsx must render .home-hero-badge');
assert(homeSource.includes('Next-Gen MOOC Practice Platform'),
  'Home.jsx must preserve "Next-Gen MOOC Practice Platform" badge');
assert(homeSource.includes('className="home-hero-title"'),
  'Home.jsx must render .home-hero-title');
assert(homeSource.includes('Master Your MOOC Courses with'),
  'Home.jsx must preserve heading text');
assert(homeSource.includes('className="home-hero-title-accent"'),
  'Home.jsx must highlight "Precision Quizzing" with .home-hero-title-accent');
assert(homeSource.includes('Precision Quizzing'),
  'Home.jsx must retain "Precision Quizzing" text');
assert(homeSource.includes('className="home-hero-description"'),
  'Home.jsx must render .home-hero-description');
assert(homeSource.includes('className="home-hero-actions"'),
  'Home.jsx must render .home-hero-actions');
assert(homeSource.includes('Explore All Subjects'),
  'Home.jsx must retain "Explore All Subjects" button');
assert(homeSource.includes('Try Quiz Engine Demo'),
  'Home.jsx must retain "Try Quiz Engine Demo" button');
assert(homeSource.includes('Multiple') && homeSource.includes('Subjects'),
  'Home.jsx must render "Multiple" / "Subjects"');
assert(homeSource.includes('130 MCQs') && homeSource.includes('Question Bank'),
  'Home.jsx must render "130 MCQs" / "Question Bank"');
assert(homeSource.includes('2 Modes') && homeSource.includes('Study & Exam'),
  'Home.jsx must render "2 Modes" / "Study & Exam"');
console.log('  ✓ PASS: Platform-wide statistics (Multiple Subjects, 130 MCQs Question Bank, 2 Modes Study & Exam) verified');

// 2. Verify components.css rules
const cssPath = path.join(projectRoot, 'src', 'styles', 'components.css');
const cssSource = fs.readFileSync(cssPath, 'utf8');

assert(cssSource.includes('.home-hero-section'),
  'components.css must define .home-hero-section');
assert(cssSource.includes('.home-hero-video-bg'),
  'components.css must define .home-hero-video-bg');
assert(cssSource.includes('.home-hero-video'),
  'components.css must define .home-hero-video');
assert(cssSource.includes('object-fit: cover;'),
  'components.css must specify object-fit: cover for hero video');
assert(cssSource.includes('.home-hero-overlay'),
  'components.css must define .home-hero-overlay');
assert(cssSource.includes('.home-hero-container'),
  'components.css must define .home-hero-container');
assert(cssSource.includes('.home-hero-content'),
  'components.css must define .home-hero-content');
assert(cssSource.includes('text-align: center;') && cssSource.includes('align-items: center;'),
  'components.css must center align items and text in hero content');
assert(cssSource.includes('.home-hero-title-accent'),
  'components.css must define .home-hero-title-accent');
assert(cssSource.includes('.home-hero-metrics'),
  'components.css must define .home-hero-metrics');
console.log('  ✓ PASS: CSS classes for video, overlay, centered layout, typography, and metrics verified');

console.log('\nRESULTS: All Homepage Hero Video Background tests passed!');
