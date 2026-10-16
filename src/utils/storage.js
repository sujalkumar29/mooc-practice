/**
 * LocalStorage management for MOOC Practice
 * Persists in-progress attempts, completed quiz history, and user preferences.
 */

const STORAGE_KEYS = {
  IN_PROGRESS_PREFIX: 'mooc_practice_inprogress_',
  HISTORY_PREFIX: 'mooc_practice_history_',
  PREFERENCES: 'mooc_practice_preferences'
};

export function getInProgressKey(subjectId, quizKey) {
  return `${STORAGE_KEYS.IN_PROGRESS_PREFIX}${subjectId}_${quizKey}`;
}

export function saveQuizProgress(subjectId, quizKey, progressData) {
  try {
    const key = getInProgressKey(subjectId, quizKey);
    const payload = {
      ...progressData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save quiz progress to localStorage:', err);
  }
}

export function loadQuizProgress(subjectId, quizKey) {
  try {
    const key = getInProgressKey(subjectId, quizKey);
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.warn('Failed to load quiz progress from localStorage:', err);
    return null;
  }
}

export function clearQuizProgress(subjectId, quizKey) {
  try {
    const key = getInProgressKey(subjectId, quizKey);
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Failed to clear quiz progress:', err);
  }
}

export function saveQuizAttemptResult(subjectId, quizKey, result) {
  try {
    const historyKey = `${STORAGE_KEYS.HISTORY_PREFIX}${subjectId}`;
    const existing = localStorage.getItem(historyKey);
    const list = existing ? JSON.parse(existing) : [];
    
    const record = {
      id: `${quizKey}_${Date.now()}`,
      quizKey,
      completedAt: new Date().toISOString(),
      score: result.totalScore,
      maxPossibleScore: result.maxPossibleScore,
      percentage: result.percentage,
      correctCount: result.correctCount,
      incorrectCount: result.incorrectCount,
      unansweredCount: result.unansweredCount,
      totalQuestions: result.totalQuestions,
      timeElapsedSeconds: result.timeElapsedSeconds
    };

    list.unshift(record);
    // Keep last 50 attempts
    if (list.length > 50) list.pop();

    localStorage.setItem(historyKey, JSON.stringify(list));
    // Also clear in-progress on clean completion
    clearQuizProgress(subjectId, quizKey);
  } catch (err) {
    console.warn('Failed to save quiz history:', err);
  }
}

export function loadQuizHistory(subjectId) {
  try {
    const historyKey = `${STORAGE_KEYS.HISTORY_PREFIX}${subjectId}`;
    const raw = localStorage.getItem(historyKey);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function getCompletedQuizKeys(subjectId) {
  const history = loadQuizHistory(subjectId);
  const set = new Set(history.map(item => item.quizKey));
  return Array.from(set);
}

export function getUserPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? JSON.parse(raw) : { defaultMode: 'exam', theme: 'light' };
  } catch {
    return { defaultMode: 'exam', theme: 'light' };
  }
}

export function saveUserPreferences(prefs) {
  try {
    const current = getUserPreferences();
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify({ ...current, ...prefs }));
  } catch (err) {
    console.warn('Failed to save user preferences:', err);
  }
}
