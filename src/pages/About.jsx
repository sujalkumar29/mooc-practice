import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Code2,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <div className="about-page">
      <Breadcrumbs items={[{ label: 'About & Help' }]} />

      <section style={{ padding: '2.5rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Platform Guide
            </span>
            <h1 style={{ fontSize: '2.6rem', marginBottom: '0.75rem' }}>About MOOC Practice</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              A high-precision educational assessment platform tailored for learners undertaking structured online and university-level MOOC courses.
            </p>
          </div>

          {/* Mission & Background */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={22} color="var(--color-primary)" />
              Usability & Purpose
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Inspired by the focused usability of tools like <strong>NPTEL Companion</strong> and <strong>MyQuizPrep</strong>, MOOC Practice provides an original, modern learning environment. Rather than drowning students in convoluted interfaces, it adheres to a clean hierarchical workflow:
            </p>
            <div style={{
              background: 'var(--color-bg-muted)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-main)',
              marginBottom: '1rem',
              overflowX: 'auto'
            }}>
              MOOC Practice → Subjects → Individual Subject → Weekly Quizzes → Combined Quiz → Results & Solutions
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.975rem', lineHeight: 1.7 }}>
              Wildlife Ecology is our first fully-structured 13-week course (Week 0 to Week 12).
            </p>
          </div>

          {/* Study vs Exam Mode */}
          <div id="modes" style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={22} color="#2563eb" />
              Study Mode vs Exam Mode
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'var(--color-bg-muted)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Study Mode
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Select an answer, click <strong>Check Answer</strong>, and immediately see if you were right along with in-depth concept explanations. Perfect for active learning while watching weekly lectures.
                </p>
              </div>

              <div style={{ background: 'var(--color-bg-muted)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#2563eb', marginBottom: '0.5rem' }}>
                  Exam Mode
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Timed practice that simulates proctored exam conditions. Answers remain hidden until submission. Review your score breakdown, accuracy, and detailed solutions afterwards.
                </p>
              </div>
            </div>
          </div>

          {/* Architecture: How to add new courses */}
          <div id="architecture" style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Code2 size={22} color="var(--color-primary)" />
              Extensible Multi-Subject Architecture
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Adding a new subject like <strong>DBMS, Operating Systems, or Computer Networks</strong> requires just three steps with zero modifications to the UI:
            </p>

            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
              <li>
                <strong>Create course folder:</strong> Under <code>src/data/&lt;subjectSlug&gt;/</code>, create <code>course.js</code> (weeks metadata, total weeks, planned count) and <code>questions.js</code> (question bank per week).
              </li>
              <li>
                <strong>Register in course catalog:</strong> Import the new course configuration into <code>src/data/courses.js</code> and add it to <code>COURSES_REGISTRY</code>.
              </li>
              <li>
                <strong>Done:</strong> The catalog, cards, 13-week syllabus routes, combined quiz aggregation, question navigator, and results automatically support the new subject.
              </li>
            </ol>
          </div>

          {/* Question Policy */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={22} color="var(--color-primary)" />
              Zero-Fabrication Question Integrity Policy
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              MOOC Practice adheres strictly to academic integrity:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <li>We never generate or fabricate fake educational questions or simulated answer keys.</li>
              <li>If questions for a week are pending, the week is clearly labeled as pending with 0/10 questions.</li>
              <li>If an answer key is missing for any question, the scoring engine explicitly marks it as "Answer Key Pending" rather than guessing.</li>
            </ul>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/subjects/wildlife-ecology" className="btn btn-primary btn-lg">
              <span>Go to Wildlife Ecology Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
