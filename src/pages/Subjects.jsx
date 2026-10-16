import React, { useState } from 'react';
import { Search, Filter, Layers, PlusCircle, CheckCircle } from 'lucide-react';
import { getAllCourses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const allCourses = getAllCourses();

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="subjects-page">
      <Breadcrumbs items={[{ label: 'All Subjects' }]} />

      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Course Catalog
            </span>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>All Subjects</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '650px' }}>
              Explore registered MOOC courses. Each course features weekly structured quiz modules, a combined full-course assessment, and dual study/exam modes.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              position: 'relative',
              maxWidth: '380px',
              width: '100%'
            }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-light)'
                }}
              />
              <input
                type="text"
                placeholder="Search courses or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-card)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.925rem'
                }}
              />
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Showing <strong>{filteredCourses.length}</strong> of <strong>{allCourses.length}</strong> registered subject{allCourses.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem'
            }}>
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3 className="empty-state-title">No Subjects Found</h3>
              <p className="empty-state-desc">No courses match your search criteria "{searchTerm}".</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Multi-Subject Architecture Callout */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Layers size={24} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                  Extensible Multi-Subject Registry Architecture
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1rem', maxWidth: '850px' }}>
                  MOOC Practice is designed so that future courses such as <strong>DBMS, Operating Systems, Computer Networks, and Discrete Mathematics</strong> can be plugged in by adding an entry in <code>src/data/courses.js</code> and their respective question data file. The catalog, weekly routes, combined quizzes, and scoring dynamically adapt with zero code duplication.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  <span className="badge badge-success">
                    <CheckCircle size={12} /> Dynamic Registry
                  </span>
                  <span className="badge badge-primary">
                    <CheckCircle size={12} /> Independent Question Banks
                  </span>
                  <span className="badge badge-navy">
                    <CheckCircle size={12} /> Configurable Week Count
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
