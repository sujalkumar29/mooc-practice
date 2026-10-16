import React, { useEffect } from 'react';
import { AlertCircle, X, ArrowLeft, Play, Clock } from 'lucide-react';
import { formatTime } from '../utils/quizScoring';

/**
 * ExitModal Component
 * 
 * Displayed when a user attempts to leave an active, answered Exam Mode attempt.
 * The exam timer CONTINUES running in the background while this modal is displayed.
 */
export default function ExitModal({
  isOpen,
  remainingSeconds,
  onContinue,
  onExit
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onContinue();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onContinue]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 id="exit-modal-title" className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={22} color="var(--color-warning)" />
              Leave Quiz?
            </h3>
            <button
              type="button"
              onClick={onContinue}
              aria-label="Close dialog"
              style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          </div>
          <p className="modal-desc" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            Your exam timer is running. Do you want to exit this quiz or continue your attempt?
          </p>
        </div>

        {/* Live Timer Status Box - Demonstrates timer never pauses */}
        {remainingSeconds !== undefined && remainingSeconds !== null && (
          <div style={{
            background: 'var(--color-bg-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.15rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <Clock size={16} color="var(--color-warning)" />
              <span>Time Remaining (Running Live):</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: remainingSeconds < 60 ? 'var(--color-danger)' : 'var(--color-text-main)'
            }}>
              {formatTime(remainingSeconds)}
            </span>
          </div>
        )}

        <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onExit}
            style={{ borderColor: 'var(--color-border)' }}
          >
            <ArrowLeft size={15} />
            <span>Exit Quiz</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onContinue}
          >
            <Play size={14} fill="currentColor" />
            <span>Continue Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
