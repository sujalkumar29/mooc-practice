import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, Clock, RotateCcw, ArrowLeft, Award, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatTime } from '../utils/quizScoring';

export default function ResultsSummary({
  course,
  quizTitle,
  evaluation,
  onRetake,
  onToggleReview,
  showReview
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackToCourse = () => {
    const hasHistoryEntry = typeof window !== 'undefined' &&
      window.history?.state &&
      typeof window.history.state.idx === 'number' &&
      window.history.state.idx > 0;

    if (hasHistoryEntry) {
      navigate(-1);
    } else {
      navigate(`/subjects/${course.slug}`, {
        state: {
          restoreScroll: true,
          isBackNav: true,
          targetKey: location.state?.sourceKey,
          targetScrollY: location.state?.sourceScrollY
        }
      });
    }
  };
  const {
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    unavailableCount,
    totalScore,
    maxPossibleScore,
    percentage,
    timeElapsedSeconds,
    isCompleteEvaluation
  } = evaluation;

  // Trigger confetti for high scores!
  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [percentage]);

  const getScoreMessage = () => {
    if (percentage >= 90) return { title: 'Outstanding Performance!', subtitle: 'You have mastered this assessment with exceptional precision.' };
    if (percentage >= 75) return { title: 'Great Job!', subtitle: 'You demonstrate strong conceptual understanding of the topics.' };
    if (percentage >= 50) return { title: 'Good Effort!', subtitle: 'Review the detailed solutions below to reinforce weaker areas.' };
    return { title: 'Practice Makes Perfect', subtitle: 'Step through the solution explanations below and retake when ready.' };
  };

  const message = getScoreMessage();

  return (
    <section className="results-card" aria-label="Quiz Results Summary">
      {/* Top Banner with Circular Score and Message */}
      <div className="results-banner">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            <Award size={14} /> Attempt Evaluated
          </span>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>{message.title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.975rem', maxWidth: '540px' }}>
            {message.subtitle}
          </p>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Course: <strong>{course?.title || 'MOOC Practice'}</strong> • {quizTitle}
          </div>
        </div>

        {/* Circular Percentage Meter */}
        <div className="results-score-circle" aria-label={`Score: ${percentage}%`}>
          <span className="results-percentage">{percentage}%</span>
          <span className="results-score-label">Accuracy</span>
        </div>
      </div>

      {/* Stats Breakdown Row */}
      <div className="results-stats-row">
        <div className="result-stat-card">
          <div className="result-stat-num" style={{ color: 'var(--color-primary)' }}>
            {totalScore} / {maxPossibleScore}
          </div>
          <div className="result-stat-name">Total Marks</div>
        </div>

        <div className="result-stat-card">
          <div className="result-stat-num" style={{ color: 'var(--color-success)' }}>
            {correctCount}
          </div>
          <div className="result-stat-name">Correct</div>
        </div>

        <div className="result-stat-card">
          <div className="result-stat-num" style={{ color: 'var(--color-danger)' }}>
            {incorrectCount}
          </div>
          <div className="result-stat-name">Incorrect</div>
        </div>

        <div className="result-stat-card">
          <div className="result-stat-num" style={{ color: 'var(--color-warning)' }}>
            {unansweredCount}
          </div>
          <div className="result-stat-name">Unanswered</div>
        </div>

        <div className="result-stat-card">
          <div className="result-stat-num" style={{ color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Clock size={18} />
            {formatTime(timeElapsedSeconds)}
          </div>
          <div className="result-stat-name">Time Elapsed</div>
        </div>
      </div>

      {/* Notice if any question lacked an answer key */}
      {!isCompleteEvaluation && unavailableCount > 0 && (
        <div style={{
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <AlertCircle size={18} color="var(--color-warning)" style={{ flexShrink: 0 }} />
          <span>
            {unavailableCount} question{unavailableCount > 1 ? 's' : ''} had no official answer key provided in the question bank. In accordance with strict evaluation rules, they were not evaluated or guessed.
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {course && (
            <button
              type="button"
              onClick={handleBackToCourse}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Back to Course</span>
            </button>
          )}
          <button type="button" onClick={onRetake} className="btn btn-secondary">
            <RotateCcw size={16} />
            <span>Retake Quiz</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleReview}
          className="btn btn-primary"
        >
          <span>{showReview ? 'Hide Solutions Review' : 'Review Answers & Solutions'}</span>
        </button>
      </div>
    </section>
  );
}
