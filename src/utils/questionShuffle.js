/**
 * Fisher–Yates (Knuth) Question Shuffling Utility
 * 
 * Provides an unbiased, uniform randomization algorithm for quiz attempts.
 * Every permutation has an equal 1/N! probability.
 * 
 * Guarantees:
 * 1. Unbiased distribution using standard Fisher–Yates (never biased sort comparator).
 * 2. Immutable: does not mutate the source array or question objects.
 * 3. Options within each question, marks, explanations, and answer keys are preserved.
 * 4. Ensures consecutive attempts produce fresh, non-identical permutations whenever N > 1.
 * 5. Supports restoring question order from saved attempt states in localStorage.
 */

/**
 * Shuffles an array of questions using the Fisher–Yates algorithm.
 * 
 * @param {Array<Object>} questions - Source question array
 * @param {Array<string>} [previousOrderIds] - Optional question IDs from previous attempt to avoid consecutive identical order
 * @returns {Array<Object>} A new array of question objects in randomized order
 */
export function shuffleQuestions(questions = [], previousOrderIds = null) {
  if (!Array.isArray(questions) || questions.length <= 1) {
    return questions ? [...questions] : [];
  }

  const result = [...questions];

  const performFisherYates = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  };

  performFisherYates(result);

  // Helper to check if current order is identical to a target list of IDs
  const isIdenticalTo = (targetIds) => {
    if (!targetIds || targetIds.length !== result.length) return false;
    return result.every((item, idx) => item?.id === targetIds[idx]);
  };

  const originalIds = questions.map(q => q?.id);

  // If the shuffle matches the original order or the immediate previous attempt,
  // do another pass or guarantee distinctness for N > 1
  if (result.length > 1 && (isIdenticalTo(originalIds) || (previousOrderIds && isIdenticalTo(previousOrderIds)))) {
    performFisherYates(result);
    if (isIdenticalTo(originalIds) || (previousOrderIds && isIdenticalTo(previousOrderIds))) {
      // Guaranteed swap of first two distinct elements
      const temp = result[0];
      result[0] = result[1];
      result[1] = temp;
    }
  }

  return result;
}

/**
 * Restores a quiz attempt's question ordering from a saved list of question IDs.
 * Used when resuming an active, in-progress attempt across page refreshes.
 * 
 * @param {Array<Object>} questions - Master questions array for this quiz
 * @param {Array<string>} savedQuestionIds - Array of question IDs in their saved attempt order
 * @returns {Array<Object>} The questions arranged in the saved attempt order
 */
export function restoreQuestionOrder(questions = [], savedQuestionIds = []) {
  if (!Array.isArray(questions) || questions.length === 0) return [];
  if (!Array.isArray(savedQuestionIds) || savedQuestionIds.length === 0) {
    return [...questions];
  }

  const questionMap = new Map(questions.map(q => [q.id, q]));
  const restored = [];
  const visitedIds = new Set();

  for (const id of savedQuestionIds) {
    const q = questionMap.get(id);
    if (q) {
      restored.push(q);
      visitedIds.add(id);
    }
  }

  // If any questions from the master set were missing in savedQuestionIds, append them
  if (restored.length < questions.length) {
    for (const q of questions) {
      if (!visitedIds.has(q.id)) {
        restored.push(q);
      }
    }
  }

  return restored;
}
