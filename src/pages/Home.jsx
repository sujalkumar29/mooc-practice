import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
  Compass,
  FileCheck2
} from 'lucide-react';
import { getAllCourses } from '../data/courses';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const courses = getAllCourses();
  const featuredCourse = courses[0];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        padding: '4.5rem 0 3.5rem',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              <Sparkles size={14} />
              <span>Next-Gen MOOC Practice Platform</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              Master Your MOOC Courses with <span style={{ color: 'var(--color-primary)' }}>Precision Quizzing</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '580px' }}>
              Designed for learners tackling rigorous online courses. Practice weekly topic quizzes, test yourself in simulated Exam Mode, and challenge full-syllabus mock assessments with zero friction.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/subjects" className="btn btn-primary btn-lg">
                <span>Explore All Subjects</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/demo-quiz" className="btn btn-secondary btn-lg">
                <Sparkles size={18} color="var(--color-primary)" />
                <span>Try Quiz Engine Demo</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)' }}>13 Weeks</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Wildlife Ecology</div>
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>130 MCQs</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Planned Bank</div>
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-navy-dark)' }}>2 Modes</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Study & Exam</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)'
            }}>
              <img
                src="/images/hero.jpg"
                alt="MOOC Practice Interactive Learning Interface"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Subject Showcase */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Featured Course
              </span>
              <h2 style={{ fontSize: '2.2rem' }}>Start Practicing Wildlife Ecology</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
                The inaugural course on MOOC Practice, featuring a full 13-week curriculum from Week 0 foundation to Week 12 modern conservation technology.
              </p>
            </div>

            <Link to="/subjects" className="btn btn-secondary">
              <span>View All Courses</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Featured Course Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {featuredCourse && (
              <CourseCard course={featuredCourse} />
            )}

            {/* Architecture Card for Future Courses */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'inline-flex', padding: '0.5rem', background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  <Layers size={24} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>Multi-Subject Architecture</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  The platform is built to host numerous MOOC subjects. Upcoming courses in pipeline:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <span className="badge badge-navy">DBMS</span>
                  <span className="badge badge-navy">Operating Systems</span>
                  <span className="badge badge-navy">Computer Networks</span>
                  <span className="badge badge-navy">Mathematics</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <Link to="/about#architecture" className="btn btn-outline-primary" style={{ width: '100%' }}>
                  <span>Learn How Courses are Added</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Mode vs Exam Mode Section */}
      <section style={{
        padding: '4.5rem 0',
        background: 'var(--color-bg-muted)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Dual Practice Modes
            </span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Designed for True Mastery</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Whether you are learning week-by-week concepts or testing your exam readiness under time pressure, MOOC Practice adapts to your study style.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Study Mode Card */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                <BookOpen size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: '0.65rem' }}>Study Mode</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Ideal for weekly review and concept reinforcement as lectures are released.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>Instant option verification with <strong>Check Answer</strong></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>Comprehensive concept explanations revealed on demand</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>Zero penalty for experimenting with different answers</span>
                </li>
              </ul>
            </div>

            {/* Exam Mode Card */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: 'var(--radius-md)', background: '#eff6ff', color: '#2563eb', marginBottom: '1.25rem' }}>
                <Clock size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: '0.65rem' }}>Exam Mode</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Simulate authentic MOOC examination conditions and time management.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#2563eb" />
                  <span>Answers concealed until final submission</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#2563eb" />
                  <span>Live question navigator palette with flagging and filtering</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#2563eb" />
                  <span>Rigorous scoring, accuracy percentage, and full solution review</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Hierarchy Walkthrough */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Structured Learning Pathway</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Navigate seamlessly from broad subjects down to detailed question solutions.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>1</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Subjects</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Browse available MOOC courses in the registry</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>2</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Course Overview</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>13-week syllabus view with question availability</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>3</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Weekly Quiz</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Topic-focused 10 MCQ assessments per week</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>4</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Combined Quiz</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Full-syllabus 130 MCQ dynamically aggregated mock</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>5</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Results & Review</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>In-depth score breakdown & official explanations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
