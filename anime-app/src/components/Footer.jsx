import './Footer.css';

/**
 * Footer component with site information and links
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="footer-logo-icon">🎌</span>
            <h3 className="footer-logo-text">Anime Hub</h3>
            <p className="footer-tagline">
              Your ultimate destination for discovering and tracking anime series.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-link-group">
              <h4 className="footer-link-title">Navigation</h4>
              <ul className="footer-link-list">
                <li><a href="#home">Home</a></li>
                <li><a href="#trending">Trending</a></li>
                <li><a href="#top-rated">Top Rated</a></li>
                <li><a href="#genres">Genres</a></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="footer-link-title">Categories</h4>
              <ul className="footer-link-list">
                <li><a href="#action">Action</a></li>
                <li><a href="#adventure">Adventure</a></li>
                <li><a href="#comedy">Comedy</a></li>
                <li><a href="#drama">Drama</a></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="footer-link-title">Support</h4>
              <ul className="footer-link-list">
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Anime Hub. All rights reserved.
          </p>
          <p className="footer-attribution">
            Anime data provided by{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer">
              AniList API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
