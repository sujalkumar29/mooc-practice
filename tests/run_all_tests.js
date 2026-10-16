/**
 * run_all_tests.js
 * 
 * Test runner executing the complete MOOC Practice automated test suite:
 * 1. Quiz Engine & Question Bank Verification (130 MCQs, Scoring, Aggregation)
 * 2. Routing & Navigation Integrity (Week 0-12, Combined, Aliases)
 * 3. Exam-Style Bottom Controls & Question Palette Submit
 * 4. Timer Behavior & Exit Confirmation Modal Flow
 * 5. Question Palette Statuses & Conditional Footer Rendering
 * 6. Quiz Spacing, Usable Width & Vertical Viewport Fit
 * 7. Page Refresh Scroll Behavior vs In-App Navigation
 * 8. Quiz Exit Scroll Restoration across Weeks & Combined Quiz
 * 9. Smooth Scroll Downward Restoration on Back/Forward Navigation
 */

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
  'test_quiz_engine.js',
  'test_wildlife_week1_bank.js',
  'test_wildlife_week2_bank.js',
  'test_wildlife_weeks_3_to_6_banks.js',
  'test_wildlife_weeks_7_to_12_banks.js',
  'test_routes_and_navigation.js',
  'test_exam_style_bottom_controls.js',
  'test_timer_and_exit_modal.js',
  'test_quiz_palette_and_footer.js',
  'test_quiz_spacing_and_vertical_fit.js',
  'test_quiz_viewport_fit_and_uniform_palette.js',
  'test_question_spacing_and_palette_consistency.js',
  'test_matched_container_heights.js',
  'test_page_refresh_scroll.js',
  'test_quiz_exit_scroll_restoration.js',
  'test_smooth_scroll_restoration.js',
  'test_final_question_and_wraparound.js',
  'test_weekly_quiz_no_breadcrumbs.js',
  'test_wildlife_hero_layout.js',
  'test_combined_quiz_15min_timer.js',
  'test_question_shuffling.js',
  'test_home_hero_video.js',
  'test_vercel_routing_and_fallback.js',
  'test_next_week_navigation.js'
];

console.log('====================================================');
console.log('  RUNNING COMPLETE MOOC PRACTICE TEST SUITE (24 Suites)');
console.log('====================================================\n');

let failedSuites = 0;
const results = [];

for (const file of testFiles) {
  const filePath = path.join(__dirname, file);
  console.log(`▶ Executing: tests/${file}...`);
  const startTime = Date.now();
  const res = spawnSync(process.execPath, [filePath], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (res.status === 0) {
    results.push({ file, status: 'PASSED', duration: `${duration}s` });
  } else {
    failedSuites++;
    results.push({ file, status: 'FAILED', duration: `${duration}s` });
  }
  console.log('');
}

console.log('====================================================');
console.log('                 TEST SUITE SUMMARY                 ');
console.log('====================================================');
results.forEach(r => {
  const icon = r.status === 'PASSED' ? '✓' : '✗';
  console.log(`  ${icon} ${r.file.padEnd(40)} ${r.status.padEnd(8)} (${r.duration})`);
});
console.log('====================================================');

if (failedSuites === 0) {
  console.log(`\n🎉 ALL ${testFiles.length} TEST SUITES PASSED SUCCESSFULLY!\n`);
  process.exit(0);
} else {
  console.error(`\n❌ ${failedSuites} of ${testFiles.length} TEST SUITES FAILED!\n`);
  process.exit(1);
}
