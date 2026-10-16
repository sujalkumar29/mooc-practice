import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getCourseBySlug } from '../data/courses';
import { getWeeklyQuestions, getWeekMetadata } from '../utils/questionLoader';
import QuizInterface from '../components/QuizInterface';

export default function WeeklyQuiz() {
  const { subjectSlug, weekNumber, weekParam } = useParams();
  const course = getCourseBySlug(subjectSlug);

  if (!course) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state">
          <AlertCircle size={40} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="empty-state-title">Course Not Found</h2>
          <p className="empty-state-desc">Subject "{subjectSlug}" does not exist in the course registry.</p>
          <Link to="/subjects" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to All Subjects</span>
          </Link>
        </div>
      </div>
    );
  }

  // Support both 'week-1', 'week-12', '1', etc.
  const rawWeek = weekParam !== undefined ? weekParam : weekNumber;
  const parsedWeek = String(rawWeek ?? '').replace(/^week-?/i, '').trim();
  const weekNum = parsedWeek !== '' && !isNaN(Number(parsedWeek)) ? Number(parsedWeek) : null;

  if (weekNum === null || weekNum < 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state">
          <AlertCircle size={40} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="empty-state-title">Invalid Week Specified</h2>
          <p className="empty-state-desc">The week "{rawWeek}" is not a valid week number for {course.title}.</p>
          <Link to={`/subjects/${course.slug}`} className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to {course.title}</span>
          </Link>
        </div>
      </div>
    );
  }

  const weekMeta = getWeekMetadata(course, weekNum);
  const questions = getWeeklyQuestions(course, weekNum);
  const plannedCount = weekMeta?.plannedQuestions || course.plannedQuestionsPerWeek || 10;

  return (
    <div className="weekly-quiz-page">
      <div className="container quiz-page-container">
        <QuizInterface
          key={`week-${weekNum}`}
          course={course}
          quizKey={`week-${weekNum}`}
          quizTitle={`${course.title} — Week ${weekNum}`}
          subtitle={weekMeta?.title || `Weekly Assessment • Week ${weekNum}`}
          questions={questions}
          plannedCount={plannedCount}
          backUrl={`/subjects/${course.slug}`}
        />
      </div>
    </div>
  );
}
