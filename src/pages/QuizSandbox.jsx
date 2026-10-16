import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Info, ArrowLeft, ShieldCheck } from 'lucide-react';
import { sampleQuizFixture } from '../data/fixtures/sampleQuizFixture';
import QuizInterface from '../components/QuizInterface';
import Breadcrumbs from '../components/Breadcrumbs';

export default function QuizSandbox() {
  const dummyCourse = {
    id: 'demo-sandbox',
    slug: 'demo-sandbox',
    title: 'Quiz Engine Verification & Demo',
    description: 'Interactive verification fixture with 5 sample questions across Ecology, CS, and Systems.'
  };

  return (
    <div className="quiz-sandbox-page">
      <Breadcrumbs items={[
        { label: 'Quiz Engine Demo' }
      ]} />

      <div className="container quiz-page-container">
        {/* Verification Notice Banner */}
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-primary-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={18} />
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>
              Interactive Quiz Engine Verification Sandbox
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              This environment loads 5 isolated sample test questions to allow testing of all quiz engine capabilities (Study Mode with instant answer checking & explanations, Exam Mode with timer, question palette navigation, flagging, submission modal, scoring, and solutions review) without placing any unverified content into the Wildlife Ecology course bank.
            </p>
          </div>
        </div>

        <QuizInterface
          course={dummyCourse}
          quizKey="demo-verification"
          quizTitle="Platform Quiz Engine Demonstration"
          subtitle="5 Sample Questions • Test Study Mode, Exam Mode, Navigator & Results"
          questions={sampleQuizFixture.questions}
          plannedCount={5}
          backUrl="/subjects"
        />
      </div>
    </div>
  );
}
