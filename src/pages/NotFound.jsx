import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page" style={{
      padding: '5rem 1.5rem 6rem',
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container" style={{ maxWidth: '620px', textAlign: 'center' }}>
        {/* Visual Badge Icon */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--color-primary)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Compass size={38} strokeWidth={2} />
        </div>

        {/* Status Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.85rem',
          background: 'var(--color-danger-bg)',
          color: 'var(--color-danger-text)',
          border: '1px solid var(--color-danger-border)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
          letterSpacing: '0.04em'
        }}>
          <span>404 • PAGE NOT FOUND</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
          lineHeight: 1.2,
          marginBottom: '1rem',
          letterSpacing: '-0.025em',
          fontFamily: 'var(--font-heading)'
        }}>
          We Couldn't Find That Page
        </h1>

        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '1.05rem',
          lineHeight: 1.65,
          marginBottom: '2.25rem',
          maxWidth: '520px',
          margin: '0 auto 2.25rem'
        }}>
          The address you navigated to does not exist, was moved, or might have been typed incorrectly. Check the URL or return to safety below.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} />
            <span>Return to Homepage</span>
          </Link>
          <Link to="/subjects" className="btn btn-secondary btn-lg">
            <BookOpen size={18} />
            <span>Explore All Subjects</span>
          </Link>
          <Link to="/demo-quiz" className="btn btn-secondary btn-lg">
            <Sparkles size={18} color="var(--color-primary)" />
            <span>Try Demo Quiz</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
