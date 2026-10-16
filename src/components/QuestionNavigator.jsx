import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function QuestionNavigator({
  questions = [],
  currentIndex = 0,
  userAnswers = {},
  flaggedQuestions = {},
  visitedQuestions = {},
  onSelectQuestion,
  onSubmit
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'answered' | 'not-answered' | 'marked' | 'not-visited'

  const totalQuestions = questions.length;

  // Standard instruction-screen status logic
  const processedQuestions = questions.map((q, idx) => {
    const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null && userAnswers[q.id] !== '';
    const isFlagged = !!flaggedQuestions[q.id];
    const isVisited = !!visitedQuestions[q.id] || (idx === currentIndex);
    const isActive = idx === currentIndex;

    // 1. Answered & Marked for Review: answered + flagged (evaluated in scoring)
    // 2. Marked for Review: flagged, but not answered
    // 3. Answered: selected option, not flagged
    // 4. Not Answered: visited, but no option selected, not flagged
    // 5. Not Visited: never visited, not flagged, not answered
    let status = 'not-visited';
    if (isAnswered && isFlagged) {
      status = 'answered-marked';
    } else if (!isAnswered && isFlagged) {
      status = 'marked';
    } else if (isAnswered) {
      status = 'answered';
    } else if (isVisited) {
      status = 'not-answered';
    } else {
      status = 'not-visited';
    }

    let statusLabel = 'Not Visited';
    if (status === 'answered') statusLabel = 'Answered';
    else if (status === 'not-answered') statusLabel = 'Not Answered';
    else if (status === 'marked') statusLabel = 'Marked for Review';
    else if (status === 'answered-marked') statusLabel = 'Answered & Marked for Review';

    let matches = true;
    if (filter === 'answered') matches = (status === 'answered' || status === 'answered-marked');
    if (filter === 'not-answered') matches = (status === 'not-answered');
    if (filter === 'marked') matches = (status === 'marked' || status === 'answered-marked');
    if (filter === 'not-visited') matches = (status === 'not-visited');

    return {
      index: idx,
      id: q.id,
      week: q.week,
      isAnswered,
      isFlagged,
      isVisited,
      isActive,
      status,
      statusLabel,
      matches
    };
  });

  const counts = processedQuestions.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const answeredTotal = (counts['answered'] || 0) + (counts['answered-marked'] || 0);
  const markedTotal = (counts['marked'] || 0) + (counts['answered-marked'] || 0);

  return (
    <aside className="navigator-sidebar" aria-label="Question Navigator">
      <div className="navigator-header">
        <h4 className="navigator-title">Question Palette</h4>
        <span className="navigator-progress-text">
          {answeredTotal}/{totalQuestions} Answered
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="navigator-filter-tabs" role="tablist">
        <button
          type="button"
          className={`palette-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({totalQuestions})
        </button>
        <button
          type="button"
          className={`palette-filter-btn ${filter === 'answered' ? 'active' : ''}`}
          onClick={() => setFilter('answered')}
        >
          Answered ({answeredTotal})
        </button>
        <button
          type="button"
          className={`palette-filter-btn ${filter === 'not-answered' ? 'active' : ''}`}
          onClick={() => setFilter('not-answered')}
        >
          Not Ans. ({counts['not-answered'] || 0})
        </button>
        {markedTotal > 0 && (
          <button
            type="button"
            className={`palette-filter-btn ${filter === 'marked' ? 'active' : ''}`}
            onClick={() => setFilter('marked')}
          >
            Marked ({markedTotal})
          </button>
        )}
      </div>

      {/* Numbered Grid */}
      <div 
        className={`questions-grid ${totalQuestions <= 10 ? 'questions-grid-weekly' : 'questions-grid-combined'}`} 
        role="group" 
        aria-label="Questions list"
      >
        {processedQuestions.map((item) => {
          if (!item.matches) return null;
          return (
            <button
              key={item.id}
              type="button"
              className={`palette-btn status-${item.status} ${item.isActive ? 'active' : ''}`}
              onClick={() => onSelectQuestion(item.index)}
              aria-label={`Question ${item.index + 1}: ${item.statusLabel}${item.isActive ? ' (Current)' : ''}`}
              title={`Question ${item.index + 1}: ${item.statusLabel}${item.week !== undefined ? ` • Week ${item.week}` : ''}`}
            >
              <span className="palette-btn-num">{item.index + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Standard Instruction-Screen Status Legend */}
      <div className="palette-legend" aria-label="Question status legend">
        <div className="legend-item" title="Answered: An option has been selected">
          <span className="legend-dot status-answered"></span>
          <span className="legend-label">Answered</span>
          <span className="legend-count-pill">{counts['answered'] || 0}</span>
        </div>
        <div className="legend-item" title="Not Answered: Question visited without selecting an answer">
          <span className="legend-dot status-not-answered"></span>
          <span className="legend-label">Not Answered</span>
          <span className="legend-count-pill">{counts['not-answered'] || 0}</span>
        </div>
        <div className="legend-item" title="Not Visited: You have not visited this question yet">
          <span className="legend-dot status-not-visited"></span>
          <span className="legend-label">Not Visited</span>
          <span className="legend-count-pill">{counts['not-visited'] || 0}</span>
        </div>
        <div className="legend-item" title="Marked for Review: Flagged for review without selecting an answer">
          <span className="legend-dot status-marked"></span>
          <span className="legend-label">Marked for Review</span>
          <span className="legend-count-pill">{counts['marked'] || 0}</span>
        </div>
        <div className="legend-item" title="Answered & Marked for Review: Flagged and answered (evaluated in score)">
          <span className="legend-dot status-answered-marked">
            <span className="legend-answered-badge"></span>
          </span>
          <span className="legend-label">Ans. & Marked for Review</span>
          <span className="legend-count-pill">{counts['answered-marked'] || 0}</span>
        </div>
        <div className="legend-item legend-active-note" title="Blue outline marks current active question">
          <span className="legend-dot active-indicator"></span>
          <span className="legend-label">Current Question</span>
        </div>
      </div>

      {/* Submit Quiz Action Button */}
      {onSubmit && (
        <div className="palette-submit-container">
          <button
            type="button"
            className="btn btn-primary btn-submit-palette"
            onClick={onSubmit}
            title="Submit your quiz attempt for scoring"
          >
            <Send size={15} />
            <span>Submit Quiz</span>
          </button>
        </div>
      )}
    </aside>
  );
}
