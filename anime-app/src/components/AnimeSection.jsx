import './AnimeSection.css';

/**
 * AnimeSection component to display a section of anime cards
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {Array} props.anime - Array of anime data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message if any
 */
function AnimeSection({ title, anime = [], loading, error }) {
  if (loading) {
    return (
      <section className="anime-section">
        <h2 className="anime-section-title">{title}</h2>
        <div className="anime-section-loading">
          <div className="loading-spinner"></div>
          <p>Loading {title.toLowerCase()}...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="anime-section">
        <h2 className="anime-section-title">{title}</h2>
        <div className="anime-section-error">
          <p>⚠️ Error loading {title.toLowerCase()}: {error}</p>
        </div>
      </section>
    );
  }

  if (!anime || anime.length === 0) {
    return (
      <section className="anime-section">
        <h2 className="anime-section-title">{title}</h2>
        <div className="anime-section-empty">
          <p>No anime found in this category.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="anime-section">
      <div className="anime-section-header">
        <h2 className="anime-section-title">{title}</h2>
        <a href="#" className="anime-section-view-all">
          View All →
        </a>
      </div>
      <div className="anime-section-grid">
        {anime.map((animeItem, index) => (
          <div key={animeItem.id || index} className="anime-section-item">
            {/* Inline AnimeCard component for simplicity */}
            <AnimeCardInline anime={animeItem} />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Inline AnimeCard component for use within AnimeSection
 */
function AnimeCardInline({ anime }) {
  const title = anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown Title';
  const coverImage = anime.coverImage?.large || anime.coverImage?.medium || 'https://via.placeholder.com/300x450';
  const score = anime.averageScore || 'N/A';
  const genres = anime.genres?.slice(0, 3) || [];
  const episodes = anime.episodes || '?';
  const description = anime.description 
    ? anime.description.replace(/<[^>]*>/g, '').slice(0, 150) + '...' 
    : 'No description available';

  return (
    <div className="anime-card">
      <div className="anime-card-image">
        <img src={coverImage} alt={title} loading="lazy" />
        {score !== 'N/A' && (
          <div className="anime-card-score">
            ⭐ {score}%
          </div>
        )}
      </div>
      <div className="anime-card-content">
        <h3 className="anime-card-title">{title}</h3>
        <div className="anime-card-meta">
          <span className="anime-card-episodes">{episodes} eps</span>
          {genres.length > 0 && (
            <div className="anime-card-genres">
              {genres.map((genre, index) => (
                <span key={index} className="anime-card-genre">{genre}</span>
              ))}
            </div>
          )}
        </div>
        <p className="anime-card-description">{description}</p>
      </div>
    </div>
  );
}

export default AnimeSection;
