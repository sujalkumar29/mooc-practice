import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Moon, Sun, Sparkles, Compass, HelpCircle } from 'lucide-react';
import { getUserPreferences, saveUserPreferences } from '../utils/storage';

export default function Navbar() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const prefs = getUserPreferences();
    const savedTheme = prefs.theme || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    saveUserPreferences({ theme: nextTheme });
  };

  return (
    <header className="site-header" role="banner">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-link" aria-label="MOOC Practice Home">
          <div className="brand-logo-icon">
            <BookOpen size={22} strokeWidth={2.4} />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-name">
              MOOC<span>Practice</span>
            </span>
            <span className="brand-tagline">Multi-Subject Quiz Platform</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/subjects" 
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
              >
                All Subjects
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/subjects/wildlife-ecology" 
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
              >
                Wildlife Ecology
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
              >
                About & Help
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          <Link 
            to="/demo-quiz" 
            className="demo-quiz-badge-btn" 
            title="Interactive verification with 5 sample questions"
          >
            <Sparkles size={14} />
            <span>Quiz Engine Demo</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
