import './Header.css';

/**
 * Header component with navigation and branding
 */
function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">🎌</span>
          <h1 className="logo-text">Anime Hub</h1>
        </div>
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#home" className="nav-link active">Home</a>
            </li>
            <li className="nav-item">
              <a href="#trending" className="nav-link">Trending</a>
            </li>
            <li className="nav-item">
              <a href="#top-rated" className="nav-link">Top Rated</a>
            </li>
            <li className="nav-item">
              <a href="#genres" className="nav-link">Genres</a>
            </li>
            <li className="nav-item">
              <a href="#seasonal" className="nav-link">Seasonal</a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="search-btn" aria-label="Search">
            🔍
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
