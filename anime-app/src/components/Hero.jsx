import './Hero.css';

/**
 * Hero component for the homepage featuring a showcase banner
 * @param {Object} props - Component props
 * @param {Object} props.featuredAnime - Featured anime data to display
 */
function Hero({ featuredAnime }) {
  const defaultHero = {
    title: {
      english: 'Welcome to Anime Hub',
      romaji: 'Anime Hub e Youkoso',
    },
    description: 'Discover the latest and most popular anime series. Your ultimate destination for anime entertainment!',
    bannerImage: 'https://images4.alphacoders.com/932/932417.png',
  };

  const hero = featuredAnime || defaultHero;
  const title = hero.title?.english || hero.title?.romaji || defaultHero.title.english;
  const description = hero.description 
    ? hero.description.replace(/<[^>]*>/g, '').slice(0, 200) + '...'
    : defaultHero.description;
  const bannerImage = hero.bannerImage || defaultHero.bannerImage;

  return (
    <section className="hero">
      <div className="hero-background">
        <img src={bannerImage} alt="Hero background" loading="eager" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-description">{description}</p>
          <div className="hero-buttons">
            <button className="hero-btn primary">
              ▶ Explore Now
            </button>
            <button className="hero-btn secondary">
              ℹ Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Anime Titles</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">500K+</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">Daily</span>
          <span className="stat-label">Updates</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
