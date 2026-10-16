import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, Info } from 'lucide-react';

export default function AnswerReview({ questionDetails = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'unanswered'

  if (!questionDetails || questionDetails.length === 0) return null;

  const filteredItems = questionDetails.filter(item => {
    if (filter === 'correct') return item.status === 'correct';
    if (filter === 'incorrect') return item.status === 'incorrect';
    if (filter === 'unanswered') return item.status === 'unanswered';
    return true;
  });

  return (
    <div className="solutions-review-container" aria-label="Detailed Question Review">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Detailed Answer & Solution Review</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Inspect every question, your selected response, and official explanations.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            type="button"
            className={`btn-sm ${filter === 'all' ? 'btn-navy' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            All ({questionDetails.length})
          </button>
          <button
            type="button"
            className={`btn-sm ${filter === 'correct' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('correct')}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            Correct ({questionDetails.filter(q => q.status === 'correct').length})
          </button>
          <button
            type="button"
            className={`btn-sm ${filter === 'incorrect' ? 'btn-secondary' : 'btn-secondary'}`}
            onClick={() => setFilter('incorrect')}
            style={{
              borderRadius: 'var(--radius-sm)',
              background: filter === 'incorrect' ? 'var(--color-danger)' : undefined,
              color: filter === 'incorrect' ? '#ffffff' : undefined
            }}
          >
            Incorrect ({questionDetails.filter(q => q.status === 'incorrect').length})
          </button>
          <button
            type="button"
            className={`btn-sm ${filter === 'unanswered' ? 'btn-secondary' : 'btn-secondary'}`}
            onClick={() => setFilter('unanswered')}
            style={{
              borderRadius: 'var(--radius-sm)',
              background: filter === 'unanswered' ? 'var(--color-warning)' : undefined,
              color: filter === 'unanswered' ? '#ffffff' : undefined
            }}
          >
            Unanswered ({questionDetails.filter(q => q.status === 'unanswered').length})
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div>
        {filteredItems.map((item) => {
          const isCorrect = item.status === 'correct';
          const isIncorrect = item.status === 'incorrect';
          const isUnanswered = item.status === 'unanswered';
          const isUnavailable = item.status === 'unavailable';

          const cardClass = isCorrect
            ? 'correct-item'
            : isIncorrect
            ? 'incorrect-item'
            : isUnanswered
            ? 'unanswered-item'
            : '';

          return (
            <article key={item.id} className={`solution-item-card ${cardClass}`}>
              {/* Question Status Meta */}
              <div className="solution-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    Question {item.index}
                  </span>
                  {item.week !== undefined && (
                    <span className="badge badge-navy">Week {item.week}</span>
                  )}
                  <span className="badge badge-navy">{item.marks} Mark{item.marks > 1 ? 's' : ''}</span>
                </div>

                <div>
                  {isCorrect && (
                    <span className="badge badge-success">
                      <CheckCircle2 size={13} /> Correct (+{item.earnedMarks})
                    </span>
                  )}
                  {isIncorrect && (
                    <span className="badge badge-danger">
                      <XCircle size={13} /> Incorrect (0)
                    </span>
                  )}
                  {isUnanswered && (
                    <span className="badge badge-warning">
                      <AlertCircle size={13} /> Not Attempted
                    </span>
                  )}
                  {isUnavailable && (
                    <span className="badge badge-warning">
                      <HelpCircle size={13} /> Answer Key Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Statement */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0.75rem 0 1rem', lineHeight: 1.5 }}>
                {item.question}
              </h4>

              {/* Options Breakdown */}
              <div className="solution-options-list">
                {item.options.map((opt) => {
                  const isUserSelection = String(item.selectedAnswer).trim().toLowerCase() === String(opt.id).trim().toLowerCase();
                  const isOfficialCorrect = isUnavailable ? false : (String(item.correctAnswer).trim().toLowerCase() === String(opt.id).trim().toLowerCase());

                  let optClass = '';
                  if (isOfficialCorrect) {
                    optClass = 'correct-option';
                  } else if (isUserSelection && !isOfficialCorrect) {
                    optClass = 'user-selected-wrong';
                  }

                  return (
                    <div key={opt.id} className={`solution-option ${optClass}`}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isOfficialCorrect ? 'var(--color-success)' : (isUserSelection ? 'var(--color-danger)' : 'var(--color-bg-muted)'),
                        color: (isOfficialCorrect || isUserSelection) ? '#ffffff' : 'var(--color-text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {opt.id}
                      </span>
                      <span style={{ flex: 1 }}>{opt.text}</span>
                      {isUserSelection && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                          (Your Choice)
                        </span>
                      )}
                      {isOfficialCorrect && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-success-text)' }}>
                          (Correct Answer)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {item.explanation ? (
                <div className="solution-explanation">
                  <strong>Explanation:</strong>
                  <p>{item.explanation}</p>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>
                  No official explanation has been provided for this question yet.
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
