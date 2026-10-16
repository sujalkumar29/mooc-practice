/**
 * Question validation and normalization utilities
 * Ensures questions across all subjects conform to the standard MOOC Practice schema.
 */

export function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];
  return options.map((opt, index) => {
    if (typeof opt === 'string') {
      const letter = String.fromCharCode(65 + index); // A, B, C, D...
      return { id: letter, text: opt };
    }
    if (typeof opt === 'object' && opt !== null) {
      return {
        id: opt.id || String.fromCharCode(65 + index),
        text: opt.text || opt.label || ''
      };
    }
    return { id: String(index), text: String(opt) };
  });
}

export function validateQuestion(question) {
  const errors = [];
  if (!question) {
    return { isValid: false, errors: ['Question is null or undefined'] };
  }

  if (!question.id && question.id !== 0) {
    errors.push('Missing question id');
  }

  if (!question.question || typeof question.question !== 'string' || !question.question.trim()) {
    errors.push('Missing question text');
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    errors.push('Question must have at least 2 options');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function normalizeQuestion(raw, defaultSubjectId = '', defaultWeek = 0) {
  const options = normalizeOptions(raw.options);
  
  // Format correctAnswer to match option id if possible
  let correctAnswer = raw.correctAnswer ?? raw.answer ?? null;
  if (typeof correctAnswer === 'number' && correctAnswer >= 0 && correctAnswer < options.length) {
    correctAnswer = options[correctAnswer].id;
  } else if (typeof correctAnswer === 'string') {
    correctAnswer = correctAnswer.trim();
  }

  return {
    id: raw.id ?? `q_${defaultSubjectId}_w${defaultWeek}_${Date.now()}`,
    subjectId: raw.subjectId || defaultSubjectId,
    week: raw.week !== undefined ? Number(raw.week) : defaultWeek,
    question: raw.question || '',
    options,
    correctAnswer: correctAnswer !== undefined && correctAnswer !== null ? String(correctAnswer) : null,
    explanation: raw.explanation || '',
    marks: Number(raw.marks) || 1,
    image: raw.image || null
  };
}

export function isAnswerKeyAvailable(question) {
  return question && question.correctAnswer !== null && question.correctAnswer !== undefined && question.correctAnswer !== '';
}
