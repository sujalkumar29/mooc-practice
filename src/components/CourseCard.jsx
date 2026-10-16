import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, HelpCircle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { getCourseStatistics } from '../utils/questionLoader';

export default function CourseCard({ course }) {
  if (!course) return null;

  const stats = getCourseStatistics(course);
  const totalWeeks = course.weeks?.length || course.totalWeeks || 0;
  const isReady = stats.availableQuestions > 0;

  return (
    <article className="course-card" aria-label={`Course: ${course.title}`}>
      {/* Cover Image & Status Badge */}
      <div className="course-card-image-wrap">
        <img 
          src={course.coverImage || '/images/hero.jpg'} 
          alt={course.title}
          className="course-card-image"
          loading="lazy"
        />
        <div className="course-card-badge">
          <span className={`badge ${isReady ? 'badge-success' : 'badge-warning'}`}>
            {isReady ? 'Ready for Practice' : 'Questions Pending'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="course-card-content">
        <span className="course-card-category">{course.category || 'MOOC Course'}</span>
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-desc">{course.description}</p>

        {/* Live Meta Info */}
        <div className="course-card-meta">
          <div className="meta-item">
            <span className="meta-label">Curriculum</span>
            <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} color="var(--color-primary)" />
              {totalWeeks} Weeks
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Questions</span>
            <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <HelpCircle size={15} color={isReady ? 'var(--color-primary)' : 'var(--color-warning)'} />
              {stats.availableQuestions} / {stats.totalPlannedQuestions}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="course-card-action">
          <Link 
            to={`/subjects/${course.slug}`} 
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <span>Open Course</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
