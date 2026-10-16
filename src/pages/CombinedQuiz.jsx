import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Sparkles, AlertTriangle } from 'lucide-react';
import { getCourseBySlug } from '../data/courses';
import { getCombinedQuestions, getCourseStatistics } from '../utils/questionLoader';
import QuizInterface from '../components/QuizInterface';

export default function CombinedQuiz() {
  const { subjectSlug } = useParams();
  const course = getCourseBySlug(subjectSlug);

  if (!course) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state">
          <AlertCircle size={40} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="empty-state-title">Course Not Found</h2>
          <p className="empty-state-desc">Subject "{subjectSlug}" was not found.</p>
          <Link to="/subjects" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to All Subjects</span>
          </Link>
        </div>
      </div>
    );
  }

  // Dynamically aggregate combined questions directly from the weekly modules
  const questions = getCombinedQuestions(course);
  const stats = getCourseStatistics(course);
  const plannedTotal = stats.totalPlannedQuestions || 130;
  const isPartiallyPopulated = questions.length > 0 && questions.length < plannedTotal;

  return (
    <div className="combined-quiz-page">
      <div className="container quiz-page-container">
        {/* Banner if partially populated */}
        {isPartiallyPopulated && (
          <div style={{
            background: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: 'var(--color-warning-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Partial Question Bank Notice:</strong> Currently, {questions.length} of {plannedTotal} planned questions are available across the weekly modules. In accordance with platform integrity rules, missing questions are never fabricated.
            </div>
          </div>
        )}

        <QuizInterface
          course={course}
          quizKey="combined"
          quizTitle={`${course.title} — Full Syllabus Combined Quiz`}
          subtitle={`Dynamically consolidated from Week 0 to Week 12 (${questions.length} / ${plannedTotal} Questions)`}
          questions={questions}
          plannedCount={plannedTotal}
          backUrl={`/subjects/${course.slug}`}
          durationSeconds={900}
        />
      </div>
    </div>
  );
}
