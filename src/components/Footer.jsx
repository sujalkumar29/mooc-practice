import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand-title">
              <BookOpen size={22} color="#34d399" />
              <span>MOOC Practice</span>
            </div>
            <p className="footer-brand-desc">
              A general-purpose educational quiz platform engineered for MOOC learners. Master course material through week-by-week practice and comprehensive combined assessments.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="footer-column-title">Available Courses</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/subjects/wildlife-ecology">Wildlife Ecology (13 Wks)</Link>
              </li>
              <li>
                <span style={{ color: '#64748b' }}>DBMS (Planned)</span>
              </li>
              <li>
                <span style={{ color: '#64748b' }}>Operating Systems (Planned)</span>
              </li>
              <li>
                <span style={{ color: '#64748b' }}>Computer Networks (Planned)</span>
              </li>
              <li>
                <span style={{ color: '#64748b' }}>Mathematics (Planned)</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-column-title">Platform</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/subjects">All Subjects</Link>
              </li>
              <li>
                <Link to="/demo-quiz">Quiz Engine Demo</Link>
              </li>
              <li>
                <Link to="/about">About & Help</Link>
              </li>
              <li>
                <Link to="/about#modes">Study vs Exam Mode</Link>
              </li>
            </ul>
          </div>

          {/* Architecture Note */}
          <div>
            <h4 className="footer-column-title">Architecture</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Built with a modular course registry architecture. Add any new subject or custom question bank simply by registering its metadata in <code>courses.js</code>.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Strict Answer Key Validation</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MOOC Practice Platform. All rights reserved.</p>
          <p style={{ color: '#64748b' }}>
            Inspired by the practice workflows of NPTEL Companion · Built by Sujal
          </p>
        </div>
      </div>
    </footer>
  );
}
