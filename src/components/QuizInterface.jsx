import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useBlocker, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  Sparkles,
  BookOpen,
  Code,
  ArrowLeft,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import QuestionNavigator from './QuestionNavigator';
import SubmitModal from './SubmitModal';
import ExitModal from './ExitModal';
import ResultsSummary from './ResultsSummary';
import AnswerReview from './AnswerReview';
import { evaluateQuizSubmission, formatTime } from '../utils/quizScoring';
import { isAnswerKeyAvailable } from '../utils/questionValidation';
import {
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
  saveQuizAttemptResult,
  getUserPreferences
} from '../utils/storage';

export default function QuizInterface({
  course,
  quizKey,
  quizTitle,
  subtitle,
  questions = [],
  plannedCount = 10,
  backUrl = '/subjects',
  durationSeconds
}) {
  const initialPrefs = getUserPreferences();
  const [mode, setMode] = useState(initialPrefs.defaultMode || 'exam'); // 'study' | 'exam'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState({}); // For Study Mode

  // Visited Questions Tracking for standard instruction-screen status
  const [visitedQuestions, setVisitedQuestions] = useState(() => {
    const firstQ = questions[0]?.id;
    return firstQ ? { [firstQ]: true } : {};
  });

  // Authoritative Exam Mode Countdown Timer
  // Combined Quiz is 15 minutes (900s); weekly quizzes are 90s/question (default 15 min for 10 MCQs)
  const totalExamDurationSeconds = durationSeconds !== undefined
    ? durationSeconds
    : (quizKey === 'combined' ? 900 : Math.max(600, questions.length * 90));

  const [examStartTime, setExamStartTime] = useState(null); // Timestamp in ms
  const [examDeadline, setExamDeadline] = useState(null);   // Timestamp in ms
  const [remainingSeconds, setRemainingSeconds] = useState(totalExamDurationSeconds);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const timerIntervalRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const answeredCount = Object.keys(userAnswers).filter(
    k => userAnswers[k] !== undefined && userAnswers[k] !== null && userAnswers[k] !== ''
  ).length;

  // Track visited questions whenever active question changes
  useEffect(() => {
    const activeQ = questions[currentIndex];
    if (activeQ?.id) {
      setVisitedQuestions(prev => {
        if (prev[activeQ.id]) return prev;
        return {
          ...prev,
          [activeQ.id]: true
        };
      });
    }
  }, [currentIndex, questions]);

  // Navigation Protection:
  // Intercept attempts to leave only if in Exam Mode, with >=1 answer selected, and attempt is active (unsubmitted)
  const isProtectedExam = mode === 'exam' && answeredCount > 0 && !evaluationResult && !isSubmittingRef.current;

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isProtectedExam && nextLocation.pathname !== currentLocation.pathname,
      [isProtectedExam]
    )
  );

  // Tab Close / Browser Refresh Native Warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isProtectedExam) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isProtectedExam]);

  // Load any in-progress attempt from localStorage on mount
  useEffect(() => {
    if (course && quizKey) {
      const saved = loadQuizProgress(course.id, quizKey);
      if (saved && !evaluationResult) {
        if (saved.userAnswers) setUserAnswers(saved.userAnswers);
        if (saved.flaggedQuestions) setFlaggedQuestions(saved.flaggedQuestions);
        if (saved.checkedQuestions) setCheckedQuestions(saved.checkedQuestions);
        if (saved.visitedQuestions) {
          setVisitedQuestions(saved.visitedQuestions);
        } else {
          // If previously saved attempt had answers, mark those and first as visited
          const initialVisited = { [questions[0]?.id]: true };
          if (saved.userAnswers) {
            Object.keys(saved.userAnswers).forEach(qid => {
              initialVisited[qid] = true;
            });
          }
          setVisitedQuestions(initialVisited);
        }
        if (saved.currentIndex !== undefined && saved.currentIndex < questions.length) {
          setCurrentIndex(saved.currentIndex);
        }
        if (saved.mode) setMode(saved.mode);

        // Resume authoritative timer state if already started
        if (saved.examDeadline) {
          const now = Date.now();
          const rem = Math.max(0, Math.ceil((saved.examDeadline - now) / 1000));
          setExamStartTime(saved.examStartTime);
          setExamDeadline(saved.examDeadline);
          setRemainingSeconds(rem);

          if (rem <= 0) {
            // Expired while away -> submit immediately
            setTimeout(() => {
              handleTimeoutSubmission();
            }, 0);
          }
        }
      }
    }
  }, [course, quizKey, questions.length]);

  // Save progress on answer change or question navigation
  useEffect(() => {
    if (course && quizKey && !evaluationResult && questions.length > 0) {
      saveQuizProgress(course.id, quizKey, {
        userAnswers,
        flaggedQuestions,
        checkedQuestions,
        visitedQuestions,
        currentIndex,
        mode,
        examStartTime,
        examDeadline
      });
    }
  }, [userAnswers, flaggedQuestions, checkedQuestions, visitedQuestions, currentIndex, mode, examStartTime, examDeadline, course, quizKey, evaluationResult, questions.length]);

  // Authoritative Countdown Timer Interval
  // Critical: Never pauses while the exit confirmation modal is open!
  useEffect(() => {
    if (mode !== 'exam' || evaluationResult || !examDeadline) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    const checkTimer = () => {
      const now = Date.now();
      const rem = Math.max(0, Math.ceil((examDeadline - now) / 1000));
      setRemainingSeconds(rem);

      if (rem <= 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        handleTimeoutSubmission();
      }
    };

    checkTimer();
    timerIntervalRef.current = setInterval(checkTimer, 500);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [mode, evaluationResult, examDeadline]);

  // Automatic Submission on Timer Expiration
  const handleTimeoutSubmission = useCallback(() => {
    if (isSubmittingRef.current || evaluationResult) return;
    isSubmittingRef.current = true;

    // Reset blocker if modal was open so view switches cleanly
    if (blocker && blocker.state === 'blocked') {
      blocker.reset();
    }
    setIsSubmitModalOpen(false);

    const timeSpent = examStartTime ? Math.round((Date.now() - examStartTime) / 1000) : totalExamDurationSeconds;
    const result = evaluateQuizSubmission({
      questions,
      userAnswers,
      timeElapsedSeconds: Math.min(totalExamDurationSeconds, Math.max(1, timeSpent))
    });

    setEvaluationResult(result);
    setShowReview(true);

    if (course && quizKey) {
      saveQuizAttemptResult(course.id, quizKey, result);
      clearQuizProgress(course.id, quizKey);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [blocker, course, quizKey, questions, userAnswers, examStartTime, totalExamDurationSeconds, evaluationResult]);

  // User-Confirmed Submission
  const handleConfirmSubmit = () => {
    if (isSubmittingRef.current || evaluationResult) return;
    isSubmittingRef.current = true;
    setIsSubmitModalOpen(false);

    const timeSpent = examStartTime ? Math.round((Date.now() - examStartTime) / 1000) : 0;
    const result = evaluateQuizSubmission({
      questions,
      userAnswers,
      timeElapsedSeconds: Math.min(totalExamDurationSeconds, Math.max(1, timeSpent))
    });

    setEvaluationResult(result);
    setShowReview(true);

    if (course && quizKey) {
      saveQuizAttemptResult(course.id, quizKey, result);
      clearQuizProgress(course.id, quizKey);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // Handle Exit Quiz Navigation: Pops back to original course history entry when available
  const handleExitQuizNav = () => {
    const hasHistoryEntry = typeof window !== 'undefined' &&
      window.history?.state &&
      typeof window.history.state.idx === 'number' &&
      window.history.state.idx > 0;

    if (hasHistoryEntry) {
      navigate(-1);
    } else {
      navigate(backUrl, {
        state: {
          restoreScroll: true,
          isBackNav: true,
          targetKey: location.state?.sourceKey,
          targetScrollY: location.state?.sourceScrollY
        }
      });
    }
  };

  // Action 1: Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    // 1. Mark current question for review
    setFlaggedQuestions(prev => {
      const nextFlagged = {
        ...prev,
        [currentQuestion.id]: true
      };
      if (course && quizKey) {
        saveQuizProgress(course.id, quizKey, {
          userAnswers,
          flaggedQuestions: nextFlagged,
          checkedQuestions,
          currentIndex: currentIndex < questions.length - 1 ? currentIndex + 1 : currentIndex,
          mode,
          examStartTime,
          examDeadline
        });
      }
      return nextFlagged;
    });

    // 2. Navigate to next question, or remain on final question
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Action 2: Clear Response
  const handleClearResponse = () => {
    setUserAnswers(prev => {
      if (!prev[currentQuestion.id]) return prev;
      const nextAnswers = { ...prev };
      delete nextAnswers[currentQuestion.id];

      if (course && quizKey) {
        saveQuizProgress(course.id, quizKey, {
          userAnswers: nextAnswers,
          flaggedQuestions,
          checkedQuestions,
          currentIndex,
          mode,
          examStartTime,
          examDeadline
        });
      }
      return nextAnswers;
    });

    if (mode === 'study') {
      setCheckedQuestions(prev => {
        if (!prev[currentQuestion.id]) return prev;
        const nextChecked = { ...prev };
        delete nextChecked[currentQuestion.id];
        return nextChecked;
      });
    }
  };

  // Action 3: Save & Next (wraps around to Question 1 if on final question)
  const handleSaveAndNext = () => {
    const nextIndex = currentIndex < questions.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);

    if (course && quizKey) {
      saveQuizProgress(course.id, quizKey, {
        userAnswers,
        flaggedQuestions,
        checkedQuestions,
        visitedQuestions: {
          ...visitedQuestions,
          [questions[nextIndex]?.id]: true
        },
        currentIndex: nextIndex,
        mode,
        examStartTime,
        examDeadline
      });
    }
  };

  // Exit Quiz Handler from Confirmation Modal
  const handleExitQuiz = () => {
    if (course && quizKey) {
      clearQuizProgress(course.id, quizKey);
    }
    if (blocker && blocker.state === 'blocked') {
      blocker.proceed();
    } else {
      handleExitQuizNav();
    }
  };

  // Continue Quiz Handler from Confirmation Modal
  const handleContinueQuiz = () => {
    if (blocker && blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  // Option Selection: STARTS TIMER ON FIRST ANSWER IN EXAM MODE
  const handleSelectOption = (optionId) => {
    let currentStartTime = examStartTime;
    let currentDeadline = examDeadline;

    // Start timer immediately upon selecting the first answer in Exam Mode
    if (mode === 'exam' && !currentDeadline) {
      const now = Date.now();
      const deadline = now + totalExamDurationSeconds * 1000;
      currentStartTime = now;
      currentDeadline = deadline;
      setExamStartTime(now);
      setExamDeadline(deadline);
      setRemainingSeconds(totalExamDurationSeconds);
    }

    setUserAnswers(prev => {
      const nextAnswers = {
        ...prev,
        [currentQuestion.id]: optionId
      };

      if (course && quizKey) {
        saveQuizProgress(course.id, quizKey, {
          userAnswers: nextAnswers,
          flaggedQuestions,
          checkedQuestions,
          currentIndex,
          mode,
          examStartTime: currentStartTime,
          examDeadline: currentDeadline
        });
      }

      return nextAnswers;
    });

    if (mode === 'study') {
      setCheckedQuestions(prev => ({
        ...prev,
        [currentQuestion.id]: false
      }));
    }
  };

  // Mode Switcher Handler
  const handleModeChange = (newMode) => {
    setMode(newMode);
    // If switching to Exam Mode and answers already exist, start timer if not running
    if (newMode === 'exam' && answeredCount > 0 && !examDeadline) {
      const now = Date.now();
      const deadline = now + totalExamDurationSeconds * 1000;
      setExamStartTime(now);
      setExamDeadline(deadline);
      setRemainingSeconds(totalExamDurationSeconds);
    }
  };

  // Retake Quiz Handler
  const handleRetake = () => {
    if (course && quizKey) clearQuizProgress(course.id, quizKey);
    isSubmittingRef.current = false;
    setUserAnswers({});
    setFlaggedQuestions({});
    setCheckedQuestions({});
    const firstQ = questions[0]?.id;
    setVisitedQuestions(firstQ ? { [firstQ]: true } : {});
    setCurrentIndex(0);
    setExamStartTime(null);
    setExamDeadline(null);
    setRemainingSeconds(totalExamDurationSeconds);
    setEvaluationResult(null);
    setShowReview(false);

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // If questions array is empty
  if (questions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <HelpCircle size={28} />
        </div>
        <h3 className="empty-state-title">Questions In Preparation</h3>
        <p className="empty-state-desc">
          There are currently <strong>0 / {plannedCount}</strong> questions available for this module.
          Per project requirements, questions will be added week by week without fake or fabricated content.
        </p>

        <div style={{
          textAlign: 'left',
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          margin: '1.5rem 0',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-main)', marginBottom: '0.5rem', fontWeight: 600 }}>
            <Code size={15} />
            <span>How to add questions:</span>
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            Populate the array for this week in:
            <br />
            <code>src/data/{course?.id === 'wildlife-ecology' ? 'wildlifeEcology/questions.js' : '...'}</code>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExitQuizNav}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} />
            <span>Return to {course?.title || 'Course'}</span>
          </button>
          <Link to="/demo-quiz" className="btn btn-primary">
            <Sparkles size={16} />
            <span>Try Quiz Engine Demo (5 Sample Questions)</span>
          </Link>
        </div>
      </div>
    );
  }

  // If already evaluated, display Results and Solutions
  if (evaluationResult) {
    return (
      <div className="quiz-evaluation-view">
        <ResultsSummary
          course={course}
          quizTitle={quizTitle}
          evaluation={evaluationResult}
          onRetake={handleRetake}
          onToggleReview={() => setShowReview(!showReview)}
          showReview={showReview}
        />

        {showReview && (
          <AnswerReview questionDetails={evaluationResult.questionDetails} />
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex] || questions[0];
  const isCurrentFlagged = !!flaggedQuestions[currentQuestion.id];
  const currentAnswer = userAnswers[currentQuestion.id];
  const isCheckedInStudyMode = !!checkedQuestions[currentQuestion.id];
  const hasAnswerKey = isAnswerKeyAvailable(currentQuestion);

  const toggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleCheckAnswer = () => {
    if (!currentAnswer) return;
    setCheckedQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  return (
    <div className="quiz-interface-container">
      {/* Top Bar: Title, Mode Toggle, Timer, Exit & Flag */}
      <div className="quiz-top-bar">
        <div className="quiz-info-group">
          <div>
            <h2 className="quiz-main-heading">{quizTitle}</h2>
            {subtitle && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{subtitle}</span>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="mode-selector" role="radiogroup" aria-label="Quiz Practice Mode">
            <button
              type="button"
              className={`mode-btn ${mode === 'study' ? 'active active-study' : ''}`}
              onClick={() => handleModeChange('study')}
              title="Study Mode: Verify answers instantly with explanations (Untimed)"
            >
              Study Mode
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'exam' ? 'active active-exam' : ''}`}
              onClick={() => handleModeChange('exam')}
              title="Exam Mode: Timed countdown begins upon selecting your first answer"
            >
              Exam Mode
            </button>
          </div>
        </div>

        <div className="quiz-status-group">
          {/* Exit Quiz Button */}
          <button
            type="button"
            onClick={handleExitQuizNav}
            className="btn-exit-quiz"
            title="Exit this quiz and return to course"
          >
            <ArrowLeft size={14} />
            <span>Exit Quiz</span>
          </button>

          {/* Timer Display */}
          {mode === 'exam' ? (
            examDeadline ? (
              <div
                className="quiz-timer timer-running"
                title="Exam Countdown: Running live from authoritative deadline"
                aria-label={`Time remaining: ${formatTime(remainingSeconds)}`}
              >
                <Clock size={16} className="timer-active-icon" />
                <span style={{ fontWeight: 700, color: remainingSeconds < 60 ? 'var(--color-danger)' : 'inherit' }}>
                  {formatTime(remainingSeconds)}
                </span>
              </div>
            ) : (
              <div
                className="quiz-timer timer-waiting"
                title="Exam Timer: Inactive until you select your first answer"
                aria-label="Exam Timer starts on first answer"
              >
                <Clock size={16} />
                <span>{formatTime(totalExamDurationSeconds)}</span>
                <span className="timer-hint-text">(starts on first answer)</span>
              </div>
            )
          ) : (
            <div
              className="quiz-timer"
              title="Study Mode: Untimed practice with immediate concept feedback"
              aria-label="Study Mode is untimed"
            >
              <BookOpen size={15} color="var(--color-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Untimed</span>
            </div>
          )}

          {/* Bookmark / Flag Button */}
          <button
            type="button"
            className={`btn-flag ${isCurrentFlagged ? 'flagged' : ''}`}
            onClick={toggleFlag}
            title={isCurrentFlagged ? 'Unmark question' : 'Flag question for review'}
            aria-pressed={isCurrentFlagged}
          >
            <Bookmark size={15} fill={isCurrentFlagged ? 'currentColor' : 'none'} />
            <span>{isCurrentFlagged ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>
      </div>

      {/* Main Responsive 2-Column Layout */}
      <div className="quiz-layout">
        {/* Left Column: Active Question Workspace */}
        <section className="question-card" aria-label={`Question ${currentIndex + 1}`}>
          {/* Question Header */}
          <div className="question-header">
            <div className="question-meta-tags">
              <span className="question-number-badge">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {currentQuestion.week !== undefined && (
                <span className="badge badge-navy">Week {currentQuestion.week}</span>
              )}
              {isCurrentFlagged && (
                <span className="badge badge-warning">
                  <Bookmark size={12} fill="currentColor" /> Flagged
                </span>
              )}
            </div>

            <span className="question-marks-badge">
              {currentQuestion.marks || 1} Mark{(currentQuestion.marks || 1) > 1 ? 's' : ''}
            </span>
          </div>

          {/* Question Statement */}
          <h3 className="question-statement">{currentQuestion.question}</h3>

          {/* Options */}
          <div className="options-list" role="radiogroup" aria-label="Answer options">
            {currentQuestion.options.map((opt, optIndex) => {
              const optId = typeof opt === 'object' && opt !== null ? (opt.id || String.fromCharCode(65 + optIndex)) : String.fromCharCode(65 + optIndex);
              const optText = typeof opt === 'object' && opt !== null ? (opt.text ?? '') : String(opt);
              const isSelected = String(currentAnswer) === String(optId);

              let optionClasses = 'option-item';
              if (isSelected) optionClasses += ' selected';

              // If Study Mode & Checked
              if (mode === 'study' && isCheckedInStudyMode && hasAnswerKey) {
                const isCorrectOpt = String(optId).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
                if (isCorrectOpt) {
                  optionClasses += ' study-correct';
                } else if (isSelected && !isCorrectOpt) {
                  optionClasses += ' study-incorrect';
                }
              }

              return (
                <button
                  key={`${currentQuestion.id}_${optId}_${optIndex}`}
                  type="button"
                  className={optionClasses}
                  onClick={() => handleSelectOption(optId)}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <span className="option-letter">{optId}</span>
                  <span className="option-text">{optText}</span>
                  {mode === 'study' && isCheckedInStudyMode && hasAnswerKey && (
                    <span style={{ marginLeft: 'auto' }}>
                      {String(optId).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase() ? (
                        <CheckCircle2 size={18} color="var(--color-success)" />
                      ) : isSelected ? (
                        <XCircle size={18} color="var(--color-danger)" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Study Mode: Check Answer Button & Instant Feedback */}
          {mode === 'study' && (
            <div style={{ marginBottom: '1.5rem' }}>
              {!isCheckedInStudyMode ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={!currentAnswer}
                  className="btn btn-outline-primary"
                  style={{ width: '100%' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Check Answer</span>
                </button>
              ) : (
                <div className="study-feedback-box">
                  <div className="study-feedback-header">
                    {!hasAnswerKey ? (
                      <span style={{ color: 'var(--color-warning-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertCircle size={18} />
                        Answer key is not yet provided for this question.
                      </span>
                    ) : String(currentAnswer).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase() ? (
                      <span className="feedback-correct" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={18} />
                        Correct! Excellent job.
                      </span>
                    ) : (
                      <span className="feedback-incorrect" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <XCircle size={18} />
                        Incorrect. Correct answer is option: <strong>{currentQuestion.correctAnswer}</strong>
                      </span>
                    )}
                  </div>

                  {currentQuestion.explanation && (
                    <div className="study-explanation-text">
                      <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                        Explanation
                      </strong>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}



          {/* Exam-Style Horizontal Action Bar */}
          <div className="quiz-action-bar">
            {/* Left side, in exact order: 1. Mark for Review & Next, 2. Clear Response */}
            <div className="action-group-left">
              <button
                type="button"
                className="btn-action-mark"
                onClick={handleMarkForReviewAndNext}
                title="Mark this question for review and proceed to next question"
              >
                <Bookmark size={15} />
                <span>Mark for Review & Next</span>
              </button>

              <button
                type="button"
                className="btn-action-clear"
                onClick={handleClearResponse}
                title="Clear selected answer for this question"
              >
                <RotateCcw size={15} />
                <span>Clear Response</span>
              </button>
            </div>

            {/* Right side: 3. Save & Next */}
            <div className="action-group-right">
              <button
                type="button"
                className="btn-action-save"
                onClick={handleSaveAndNext}
                title={currentIndex === questions.length - 1 ? 'Save response and return to Question 1' : 'Save response and proceed to next question'}
              >
                <span>Save & Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Question Navigator Palette with Submit Action */}
        <QuestionNavigator
          questions={questions}
          currentIndex={currentIndex}
          userAnswers={userAnswers}
          flaggedQuestions={flaggedQuestions}
          visitedQuestions={visitedQuestions}
          onSelectQuestion={(idx) => {
            setCurrentIndex(idx);
          }}
          onSubmit={() => setIsSubmitModalOpen(true)}
        />
      </div>

      {/* Confirmation Modal Before Voluntary Submission */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsSubmitModalOpen(false)}
      />

      {/* Exit Confirmation Modal for Protected Exam Attempt */}
      <ExitModal
        isOpen={blocker.state === 'blocked'}
        remainingSeconds={remainingSeconds}
        onContinue={handleContinueQuiz}
        onExit={handleExitQuiz}
      />
    </div>
  );
}
