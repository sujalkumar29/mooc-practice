# MOOC Practice — Multi-Subject Educational Quiz Platform

**MOOC Practice** is a modern, modular educational quiz platform designed for learners tackling rigorous online courses (such as NPTEL and Swayam). It provides structured week-by-week quiz practice, full-syllabus mock assessments in a dynamic combined quiz, instant feedback in Study Mode, and simulated proctored testing in Exam Mode.

---

## 🌟 Key Features

- **Multi-Subject Extensible Architecture**: Central course registry (`COURSES_REGISTRY`) where new courses (DBMS, Operating Systems, Computer Networks, Mathematics) plug in seamlessly without touching UI components.
- **Wildlife Ecology Inaugural Course**:
  - Full 13-week curriculum configuration: **Week 0 through Week 12**.
  - Planned complete question bank of **130 MCQs** (10 MCQs per week).
  - Dynamically aggregated **Combined Quiz (Week 0 to Week 12)** with no duplicate question banks.
- **Dual Practice Modes**:
  - **Study Mode**: Select any option, click **Check Answer**, and receive instant visual verification (correct/incorrect) with comprehensive concept explanations.
  - **Exam Mode**: Simulates proctored exam conditions with an active elapsed timer, question navigator palette, bookmarking/flagging, answer concealment until submission, confirmation modal, and rigorous score/accuracy analytics.
- **Question Navigator Palette**:
  - Color-coded question indicators (Active, Answered, Unanswered, Flagged for review).
  - Quick filter tabs (`All`, `Done`, `Left`, `Flagged`) and click-to-jump navigation.
- **Zero-Fabrication Data Integrity**:
  - Conforms strictly to academic integrity: no fake or hallucinated questions.
  - Questions without answer keys are marked as "Answer Key Pending" rather than evaluated or guessed.
- **Results & Solutions Review**:
  - Circular accuracy score meter, total marks earned, correct/incorrect/unanswered breakdown, and time spent.
  - Interactive filterable question review with user answers highlighted against verified official solutions.
- **Local Persistence**:
  - In-progress attempts auto-saved to `localStorage` (prevents lost progress on accidental page reloads).
  - Completed attempts, scores, and user preferences (Dark/Light theme, default mode) saved locally.
- **Modern UI/UX Design**:
  - Curated deep navy (`#0B192C`) and emerald forest green (`#059669`) color palette.
  - Dark mode and light mode toggle with smooth CSS transitions.
  - Full keyboard accessibility, clean responsive layouts for desktop, tablet, and mobile.

---

## 🏗️ Architecture & Hierarchy

```
MOOC Practice
  └── All Subjects (/subjects)
        └── Individual Subject (/subjects/:subjectSlug)
              ├── Weekly Quizzes (/subjects/:subjectSlug/quiz/week-:weekNumber)
              ├── Combined Quiz (/subjects/:subjectSlug/quiz/combined)
              └── Results & Solutions Review
```

### Directory Structure

```
src/
├── components/
│   ├── AnswerReview.jsx         # Detailed question-by-question review & solution explanations
│   ├── Breadcrumbs.jsx          # Hierarchical navigation breadcrumbs
│   ├── CourseCard.jsx           # Reusable data-driven course card
│   ├── ExitModal.jsx            # Route-protection confirmation modal with live running timer
│   ├── Footer.jsx               # Footer with links, course roadmap, and disclaimers
│   ├── Navbar.jsx               # Glassmorphic top navigation with theme toggle
│   ├── QuestionNavigator.jsx    # Question palette with status indicators and filters
│   ├── QuizInterface.jsx        # Reusable core quiz engine (Study Mode & Exam Mode)
│   ├── ResultsSummary.jsx       # Results dashboard with accuracy ring & statistics
│   ├── ScrollToTop.jsx          # Global scroll restoration component on route changes
│   ├── SubmitModal.jsx          # Submission confirmation modal with answered summary
│   └── WeekCard.jsx             # Reusable card for each week with live question counters
├── data/
│   ├── courses.js               # Central course registry
│   ├── fixtures/
│   │   └── sampleQuizFixture.js # 5 sample verification questions for test sandbox
│   └── wildlifeEcology/
│       ├── course.js            # Wildlife Ecology 13-week syllabus & metadata
│       └── questions.js         # Week 0 to Week 12 question bank (ready for real questions)
├── pages/
│   ├── About.jsx                # Platform guide, dual mode explanation, and FAQ
│   ├── CombinedQuiz.jsx         # Dynamic combined quiz (aggregates Week 0-12)
│   ├── Home.jsx                 # Landing page with hero, featured course, and modes overview
│   ├── QuizSandbox.jsx          # Interactive quiz engine demo (/demo-quiz)
│   ├── SubjectOverview.jsx      # Wildlife Ecology 13-week dashboard & combined banner
│   ├── Subjects.jsx             # All subjects catalog with live search
│   └── WeeklyQuiz.jsx           # Week 0 to Week 12 individual quiz route
├── styles/
│   ├── components.css           # Navigation, cards, footer, and breadcrumbs styling
│   ├── index.css                # Global design system, CSS tokens, and theme overrides
│   └── quiz.css                 # Quiz workspace, option buttons, palette, and results
├── utils/
│   ├── questionLoader.js        # Dynamic question aggregator and course statistics
│   ├── questionValidation.js    # Schema validation and option normalization
│   ├── quizScoring.js           # Score, percentage, and time formatting engine
│   └── storage.js               # LocalStorage management for progress, attempts, and theme
├── App.jsx                      # React Router route definitions
└── main.jsx                     # Application entry point
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Automated Test Suite
```bash
npm test
# Or run individual test suites:
node tests/test_quiz_engine.js
node tests/test_routes_and_navigation.js
```
Runs the automated test suite (557+ validation checks) covering question banks across Weeks 0–12, scoring engine, routing, exam-style controls, timer & exit confirmation, and scroll restoration.

---

## 📝 How to Add Questions to Wildlife Ecology

Questions for Wildlife Ecology are kept separate in [`src/data/wildlifeEcology/questions.js`](src/data/wildlifeEcology/questions.js).

To add questions for any week (Week 0 to Week 12), open `questions.js` and paste your questions into the respective week array:

```javascript
// Example: Adding questions to Week 1
export const wildlifeEcologyQuestions = {
  0: [],
  1: [
    {
      id: "we_w1_q1",
      subjectId: "wildlife-ecology",
      week: 1,
      question: "Which of the following best defines an ecological niche?",
      options: [
        "The physical location where an organism resides",
        "The functional role and position of a species in its ecosystem",
        "The geographic boundaries of a national park",
        "The total biomass of vegetation consumed by herbivores"
      ],
      correctAnswer: "B",
      explanation: "An ecological niche encompasses both the physical habitat and the functional role, resource utilization, and interactions of a species within its community.",
      marks: 1
    }
    // Add up to 10 questions...
  ],
  2: [],
  // ... through 12
};
```

**Once added:**
- The week card on the dashboard will immediately show updated question counts (e.g., `1 / 10 MCQs`).
- The **Start Quiz** button will automatically activate.
- The **Combined Quiz** will dynamically include these questions without duplicate data entry.

---

## ➕ How to Add a New Subject (e.g. DBMS, Operating Systems)

Adding a brand new subject requires **zero changes to UI components**:

1. **Create the subject folder:**
   Create `src/data/dbms/course.js` and `src/data/dbms/questions.js`.
2. **Define course metadata:**
   ```javascript
   // src/data/dbms/course.js
   export const dbmsCourse = {
     id: 'dbms',
     slug: 'dbms',
     title: 'Database Management Systems',
     subtitle: 'Relational Models, SQL & Transaction Management',
     category: 'Computer Science',
     totalWeeks: 8,
     plannedQuestionsPerWeek: 10,
     totalPlannedQuestions: 80,
     weeks: [ ... ]
   };
   ```
3. **Register in `src/data/courses.js`:**
   ```javascript
   import { dbmsCourse } from './dbms/course.js';
   import { dbmsQuestions } from './dbms/questions.js';

   export const COURSES_REGISTRY = [
     { ...wildlifeEcologyCourse, ... },
     {
       ...dbmsCourse,
       getQuestionsForWeek: (w) => dbmsQuestions[w] || [],
       getAllQuestionsMap: () => dbmsQuestions
     }
   ];
   ```
4. That's it! The All Subjects catalog, course overview, weekly routes, combined quiz, and results will automatically support DBMS.

---

## 📄 Academic Integrity Policy

- **No Fake Questions**: Questions are only displayed when supplied by educators.
- **Accurate Evaluation**: Questions with unsupplied answer keys are marked as "Answer Key Pending" and are never guessed or counted as correct.
- **Study Mode**: Provides safe exploration and conceptual explanations.
- **Exam Mode**: Prepares students with authentic timed conditions.
