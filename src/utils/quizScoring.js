import { isAnswerKeyAvailable } from './questionValidation.js';

/**
 * Evaluates a user's quiz attempt based on verified questions and user selections.
 * 
 * Rules:
 * - Unanswered questions are counted as unanswered (not incorrect or correct).
 * - If a question is missing an answer key, it is marked as 'unavailable', never guessed or counted as correct.
 * - Score and percentage are calculated strictly on questions with valid keys.
 */
export function evaluateQuizSubmission({ questions = [], userAnswers = {}, timeElapsedSeconds = 0 }) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let unavailableCount = 0;
  let totalScore = 0;
  let maxPossibleScore = 0;

  const questionDetails = questions.map((q, index) => {
    const selectedAnswer = userAnswers[q.id];
    const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== '';
    const hasKey = isAnswerKeyAvailable(q);

    let status = 'unanswered'; // 'correct' | 'incorrect' | 'unanswered' | 'unavailable'
    let earnedMarks = 0;
    const qMarks = q.marks || 1;

    if (!hasKey) {
      status = 'unavailable';
      unavailableCount++;
    } else if (!isAnswered) {
      status = 'unanswered';
      unansweredCount++;
      maxPossibleScore += qMarks;
    } else {
      maxPossibleScore += qMarks;
      // Compare case-insensitively / trimmed
      const isMatch = String(selectedAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      if (isMatch) {
        status = 'correct';
        correctCount++;
        earnedMarks = qMarks;
        totalScore += qMarks;
      } else {
        status = 'incorrect';
        incorrectCount++;
      }
    }

    return {
      index: index + 1,
      id: q.id,
      week: q.week,
      question: q.question,
      options: q.options,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      status,
      marks: qMarks,
      earnedMarks,
      hasKey
    };
  });

  const evaluableCount = questions.length - unavailableCount;
  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  const isCompleteEvaluation = unavailableCount === 0;

  return {
    totalQuestions: questions.length,
    evaluableCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    unavailableCount,
    totalScore,
    maxPossibleScore,
    percentage,
    isCompleteEvaluation,
    timeElapsedSeconds,
    questionDetails
  };
}

export function formatTime(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${pad(remMins)}m ${pad(secs)}s`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
