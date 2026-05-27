import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Anime Vanguard</span>
        </Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search anime, movies, series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {/* Icon removed as requested */}
          <button type="submit" className="search-btn-hidden" aria-label="Search"></button>
        </form>

        <nav className="nav-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
          <Link to="/completed" className={isActive('/completed') ? 'active' : ''}>Completed</Link>
          <Link to="/ongoing" className={isActive('/ongoing') ? 'active' : ''}>Ongoing</Link>
          <Link to="/schedule" className={isActive('/schedule') ? 'active' : ''}>Schedule</Link>
          <Link to="/recent" className={isActive('/recent') ? 'active' : ''}>Recent</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;