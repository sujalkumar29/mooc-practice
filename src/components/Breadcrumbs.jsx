import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs-bar" aria-label="Breadcrumb">
      <div className="container">
        <ol className="breadcrumbs-list">
          <li>
            <Link to="/" state={{ restoreScroll: true, isBackNav: true }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Home size={15} />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronRight size={14} className="breadcrumb-separator" />
                {isLast || !item.to ? (
                  <span className="breadcrumb-active" aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.to} state={{ restoreScroll: true, isBackNav: true }}>{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
