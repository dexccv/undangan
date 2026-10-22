import React from 'react';

export default function AppSkeleton() {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="Memuat undangan...">
      <div className="skeleton-hero">
        <div className="skeleton-pill"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
        <div className="skeleton-btn"></div>
      </div>
      <div className="skeleton-section">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line full"></div>
        <div className="skeleton-line medium"></div>
      </div>
    </div>
  );
}
