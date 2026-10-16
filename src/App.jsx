import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import SubjectOverview from './pages/SubjectOverview';
import WeeklyQuiz from './pages/WeeklyQuiz';
import CombinedQuiz from './pages/CombinedQuiz';
import QuizSandbox from './pages/QuizSandbox';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Styles
import './styles/index.css';
import './styles/components.css';
import './styles/quiz.css';

function RootLayout() {
  const location = useLocation();
  // Exclude global footer from all active quiz routes (Week 0-12, combined, sandbox, and aliases)
  const isQuizRoute =
    /\/quiz(\/|$)/.test(location.pathname) ||
    /\/(combined|week(-\d+|\/\d+))$/.test(location.pathname) ||
    location.pathname === '/demo-quiz';

  return (
    <>
      <ScrollToTop />
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main className={`main-content ${isQuizRoute ? 'main-content-quiz' : ''}`} role="main">
          <Outlet />
        </main>

        {!isQuizRoute && <Footer />}
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'subjects', element: <Subjects /> },
      { path: 'subjects/:subjectSlug', element: <SubjectOverview /> },
      { path: 'subjects/:subjectSlug/quiz/combined', element: <CombinedQuiz /> },
      { path: 'subjects/:subjectSlug/quiz/:weekParam', element: <WeeklyQuiz /> },
      { path: 'subjects/:subjectSlug/quiz/week/:weekNumber', element: <WeeklyQuiz /> },
      // Route aliases for direct access and backwards-compatibility
      { path: 'subjects/:subjectSlug/combined', element: <CombinedQuiz /> },
      { path: 'subjects/:subjectSlug/week/:weekNumber', element: <WeeklyQuiz /> },
      { path: 'subjects/:subjectSlug/week-:weekNumber', element: <WeeklyQuiz /> },
      { path: 'demo-quiz', element: <QuizSandbox /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
