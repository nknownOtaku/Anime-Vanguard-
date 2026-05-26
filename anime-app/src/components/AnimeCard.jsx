import './AnimeCard.css';

/**
 * AnimeCard component to display individual anime information
 * @param {Object} anime - Anime data object
 */
function AnimeCard({ anime }) {
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

export default AnimeCard;
