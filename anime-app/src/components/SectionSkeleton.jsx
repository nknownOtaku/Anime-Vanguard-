import './SectionSkeleton.css';

function SectionSkeleton() {
  return (
    <div className="skeleton-section">
      <div className="skeleton-title"></div>
      <div className="skeleton-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SectionSkeleton;