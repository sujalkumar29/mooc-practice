import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Layers,
  HelpCircle,
  Play,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
  Info
} from 'lucide-react';
import { getCourseBySlug } from '../data/courses';
import { getCourseStatistics } from '../utils/questionLoader';
import { getCompletedQuizKeys } from '../utils/storage';
import { preserveCourseScroll, persistScrollPosition } from '../components/ScrollToTop';
import WeekCard from '../components/WeekCard';
import Breadcrumbs from '../components/Breadcrumbs';

export default function SubjectOverview() {
  const { subjectSlug } = useParams();
  const location = useLocation();
  const course = getCourseBySlug(subjectSlug);

  if (!course) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state">
          <AlertCircle size={40} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="empty-state-title">Course Not Found</h2>
          <p className="empty-state-desc">The requested subject "{subjectSlug}" is not registered in the course catalog.</p>
          <Link to="/subjects" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to All Subjects</span>
          </Link>
        </div>
      </div>
    );
  }

  const stats = getCourseStatistics(course);
  const completedKeys = getCompletedQuizKeys(course.id);
  const isCombinedCompleted = completedKeys.includes('combined');

  return (
    <div className="subject-overview-page">
      <Breadcrumbs items={[
        { label: 'All Subjects', to: '/subjects' },
        { label: course.title }
      ]} />

      {/* Course Hero Banner */}
      <section style={{
        padding: '2.5rem 0 3rem',
        background: 'linear-gradient(180deg, rgba(5, 150, 105, 0.08) 0%, transparent 100%)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <Link
            to="/subjects"
            state={{ restoreScroll: true, isBackNav: true }}
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: '1.5rem', display: 'inline-flex' }}
          >
            <ArrowLeft size={14} />
            <span>Back to All Subjects</span>
          </Link>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{course.category}</span>
                <span className="badge badge-navy">{course.code || 'NPTEL Syllabus'}</span>
                <span className="badge badge-warning">
                  {stats.availableQuestions > 0 ? `${stats.availableQuestions}/${stats.totalPlannedQuestions} Loaded` : 'Questions Pending'}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                {course.title}
              </h1>

              {course.subtitle && (
                <p style={{ fontSize: '1.15rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1rem' }}>
                  {course.subtitle}
                </p>
              )}

              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '1.5rem' }}>
                {course.description}
              </p>

              {/* Course Meta Stats */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--color-border)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    {stats.totalWeeks} Weeks
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Week 0 to Week 12
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                    {course.plannedQuestionsPerWeek || 10} MCQs
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Per Weekly Quiz
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    {stats.totalPlannedQuestions} MCQs
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Planned Question Bank
                  </div>
                </div>
              </div>
            </div>

            {/* Course Imagery Visual */}
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              maxHeight: '230px'
            }}>
              <img
                src={course.coverImage || '/images/wildlife_ecology.jpg'}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Content */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          {/* Combined Quiz Banner Card */}
          <div className="combined-quiz-card">
            <div>
              <span className="badge combined-quiz-badge">
                <Sparkles size={13} /> Full-Syllabus Mock Assessment
              </span>
              <h2 className="combined-quiz-title">Combined Quiz — Week 0 to Week 12</h2>
              <p className="combined-quiz-desc">
                Dynamically aggregates all available questions across all 13 weekly modules into one comprehensive practice exam. Ideal for final semester revision.
              </p>

              <div className="combined-stats-row">
                <div className="combined-stat">
                  <span className="combined-stat-val">
                    {stats.availableQuestions} / {stats.totalPlannedQuestions}
                  </span>
                  <span className="combined-stat-lbl">Available Questions</span>
                </div>

                <div className="combined-stat">
                  <span className="combined-stat-val">{stats.totalWeeks} Weeks</span>
                  <span className="combined-stat-lbl">Curriculum Scope</span>
                </div>

                <div className="combined-stat">
                  <span className="combined-stat-val">
                    {stats.isFullyPopulated ? '100% Complete' : 'Dynamic Aggregation'}
                  </span>
                  <span className="combined-stat-lbl">Bank Status</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                to={`/subjects/${course.slug}/quiz/combined`}
                state={{
                  sourceKey: location.key,
                  sourcePath: location.pathname,
                  sourceScrollY: typeof window !== 'undefined' ? (window.scrollY || document.documentElement.scrollTop || 0) : 0
                }}
                onClick={() => {
                  const y = window.scrollY || document.documentElement.scrollTop || 0;
                  persistScrollPosition(location.key, location.pathname, y);
                  preserveCourseScroll(course.slug, location.key, y);
                }}
                className="btn btn-primary btn-lg"
                style={{
                  background: 'var(--color-primary)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Play size={18} fill="currentColor" />
                <span>
                  {stats.availableQuestions > 0 ? 'Start Combined Quiz' : 'View Combined Quiz'}
                </span>
              </Link>
            </div>
          </div>

          {/* Section Header: Weekly Quizzes */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>Weekly Quiz Modules</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Practice questions week by week in either Study Mode (instant feedback) or Exam Mode (timed).
              </p>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Total Weeks: <strong>{stats.weekDetails.length}</strong> (Week 0 – Week 12)
            </div>
          </div>

          {/* Week Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {stats.weekDetails.map((week) => (
              <WeekCard
                key={week.weekNumber}
                subjectSlug={course.slug}
                week={week}
                isCompleted={completedKeys.includes(`week-${week.weekNumber}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
