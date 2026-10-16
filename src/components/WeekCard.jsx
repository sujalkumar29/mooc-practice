import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { preserveCourseScroll, persistScrollPosition } from './ScrollToTop';

export default function WeekCard({ subjectSlug, week, isCompleted = false }) {
  const location = useLocation();

  if (!week) return null;

  const isReady = week.availableQuestions > 0;
  const isPartial = isReady && week.availableQuestions < week.plannedQuestions;

  const handleStartQuiz = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    persistScrollPosition(location.key, location.pathname, y);
    preserveCourseScroll(subjectSlug, location.key, y);
  };

  const navState = {
    sourceKey: location.key,
    sourcePath: location.pathname,
    sourceScrollY: typeof window !== 'undefined' ? (window.scrollY || document.documentElement.scrollTop || 0) : 0
  };

  return (
    <div className="week-card" aria-label={week.title}>
      <div>
        {/* Card Header with Pill & Completed Status */}
        <div className="week-card-header">
          <span className="week-number-pill">
            Week {week.weekNumber}
          </span>
          {isCompleted ? (
            <span className="badge badge-success" title="You have completed this quiz">
              <CheckCircle2 size={13} /> Completed
            </span>
          ) : (
            <span className={`badge ${isReady ? (isPartial ? 'badge-warning' : 'badge-primary') : 'badge-warning'}`}>
              {isReady ? (isPartial ? 'Partial' : 'Ready') : 'Pending Questions'}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="week-card-title">{week.title}</h4>

        {/* Topics preview */}
        {week.topics && week.topics.length > 0 && (
          <ul className="week-topics-list">
            {week.topics.slice(0, 3).map((topic, i) => (
              <li key={i} className="week-topic-item">
                <span className="week-topic-bullet">•</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Card Footer */}
      <div className="week-card-footer">
        <div className="question-count-badge">
          <span className={`status-indicator-dot ${isReady ? 'dot-green' : 'dot-gray'}`}></span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            {week.availableQuestions} / {week.plannedQuestions} MCQs
          </span>
        </div>

        {isReady ? (
          <Link
            to={`/subjects/${subjectSlug}/quiz/week-${week.weekNumber}`}
            state={navState}
            onClick={handleStartQuiz}
            className="btn btn-primary btn-sm"
          >
            <Play size={14} fill="currentColor" />
            <span>Start Quiz</span>
          </Link>
        ) : (
          <Link
            to={`/subjects/${subjectSlug}/quiz/week-${week.weekNumber}`}
            state={navState}
            onClick={handleStartQuiz}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', opacity: 0.9 }}
            title="Inspect week questions status"
          >
            <span>View Week</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}
