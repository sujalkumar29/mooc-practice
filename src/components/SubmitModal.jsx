import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function SubmitModal({
  isOpen,
  totalQuestions,
  answeredCount,
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;
  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 id="modal-title" className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {hasUnanswered ? (
                <AlertTriangle size={22} color="var(--color-warning)" />
              ) : (
                <CheckCircle size={22} color="var(--color-success)" />
              )}
              Confirm Quiz Submission
            </h3>
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close dialog"
              style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          </div>
          <p className="modal-desc">
            {hasUnanswered
              ? `You still have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Are you ready to submit your attempt for evaluation?`
              : 'You have answered all questions. Would you like to submit your answers now?'}
          </p>
        </div>

        {/* Breakdown Stats */}
        <div className="modal-stats-grid">
          <div>
            <div className="modal-stat-val" style={{ color: 'var(--color-text-main)' }}>{totalQuestions}</div>
            <div className="modal-stat-lbl">Total</div>
          </div>
          <div>
            <div className="modal-stat-val" style={{ color: 'var(--color-success)' }}>{answeredCount}</div>
            <div className="modal-stat-lbl">Answered</div>
          </div>
          <div>
            <div className="modal-stat-val" style={{ color: hasUnanswered ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
              {unansweredCount}
            </div>
            <div className="modal-stat-lbl">Unanswered</div>
          </div>
        </div>

        {hasUnanswered && (
          <div style={{
            background: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-border)',
            color: 'var(--color-warning-text)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            fontSize: '0.825rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>Unanswered questions will not earn marks. You can still return and answer them.</span>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Continue Quiz
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
