import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

/**
 * Header component with navigation and branding
 */
function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.querySelector('input').value;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">🎌</span>
          <h1 className="logo-text">Anime Vanguard</h1>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search anime, movies, series..."
            className="search-input"
          />
          <button type="submit" className="search-btn-header">
            🔍
          </button>
        </form>

        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/search?status=completed" className={`nav-link ${location.pathname === '/search' && location.search.includes('completed') ? 'active' : ''}`}>Completed</Link>
            </li>
            <li className="nav-item">
              <Link to="/search?status=ongoing" className={`nav-link ${location.pathname === '/search' && location.search.includes('ongoing') ? 'active' : ''}`}>Ongoing</Link>
            </li>
            <li className="nav-item">
              <Link to="/search?sort=schedule" className={`nav-link ${location.pathname === '/search' && location.search.includes('schedule') ? 'active' : ''}`}>Schedule</Link>
            </li>
            <li className="nav-item">
              <Link to="/search?sort=recent" className={`nav-link ${location.pathname === '/search' && location.search.includes('recent') ? 'active' : ''}`}>Recent</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
