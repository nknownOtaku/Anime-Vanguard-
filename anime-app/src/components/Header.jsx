import { Link, useLocation } from 'react-router-dom';
import './Header.css';

/**
 * Header component with navigation and branding
 */
function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">🎌</span>
          <h1 className="logo-text">Anime Vanguard</h1>
        </div>
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>Search</Link>
            </li>
            <li className="nav-item">
              <a href="#trending" className="nav-link">Trending</a>
            </li>
            <li className="nav-item">
              <a href="#top-rated" className="nav-link">Top Rated</a>
            </li>
            <li className="nav-item">
              <a href="#seasonal" className="nav-link">Seasonal</a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <Link to="/search" className="search-btn" aria-label="Search">
            🔍
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
