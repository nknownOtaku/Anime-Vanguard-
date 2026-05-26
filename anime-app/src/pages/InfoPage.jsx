import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InfoPage.css';
import { fetchAnimeDetails } from '../api/anilist';
import Header from '../components/Header';
import Footer from '../components/Footer';

function InfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await fetchAnimeDetails(id);
        setAnime(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="info-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading anime details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="info-page">
        <Header />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Anime not found'}</p>
          <button onClick={() => navigate('/')} className="btn-back">← Back to Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="info-page">
      <Header />
      
      {/* Hero Banner */}
      <div className="info-hero" style={{ backgroundImage: `url(${anime.bannerImage || anime.coverImage.large})` }}>
        <div className="info-hero-overlay">
          <div className="info-poster">
            <img src={anime.coverImage.large} alt={anime.title.romaji} />
          </div>
          <div className="info-details">
            <h1>{anime.title.english || anime.title.romaji}</h1>
            <p className="native-title">{anime.title.native}</p>

            <div className="info-meta">
              <span className="meta-item">📅 {anime.seasonYear}</span>
              <span className="meta-item">⭐ {anime.averageScore / 10}</span>
              <span className="meta-item">📺 {anime.format}</span>
              <span className="meta-item">🎬 {anime.episodes || '?'} Episodes</span>
              <span className="meta-item">⏱️ {anime.duration || '?'} min/ep</span>
            </div>

            <div className="info-genres">
              {anime.genres.map(genre => (
                <span key={genre} className="genre-badge">{genre}</span>
              ))}
            </div>

            <div className="info-status">
              <span className={`status ${anime.status.toLowerCase()}`}>
                {anime.status}
              </span>
            </div>

            <div className="info-actions">
              <button className="btn-watch" onClick={() => alert('Streaming feature coming soon!')}>
                ▶ Watch Now
              </button>
              <button className="btn-download" onClick={() => alert('Download feature coming soon!')}>
                ⬇ Download
              </button>
              <button className="btn-favorite" onClick={() => alert('Added to favorites!')}>
                ♥ Favorite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="info-content">
        {/* Synopsis */}
        <section className="info-section">
          <h2>📖 Synopsis</h2>
          <p className="synopsis">{anime.description?.replace(/<[^>]*>/g, '') || 'No synopsis available.'}</p>
        </section>

        {/* Characters */}
        {anime.characters && anime.characters.length > 0 && (
          <section className="info-section">
            <h2>👥 Main Characters</h2>
            <div className="characters-grid">
              {anime.characters.slice(0, 6).map(character => (
                <div key={character.id} className="character-card">
                  <img src={character.image.large} alt={character.name.full} />
                  <p className="character-name">{character.name.full}</p>
                  <p className="character-role">{character.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Studios */}
        {anime.studios && anime.studios.length > 0 && (
          <section className="info-section">
            <h2>🎬 Studios</h2>
            <div className="studios-list">
              {anime.studios.map(studio => (
                <span key={studio.id} className="studio-tag">{studio.name}</span>
              ))}
            </div>
          </section>
        )}

        {/* Relations */}
        {anime.relations && anime.relations.length > 0 && (
          <section className="info-section">
            <h2>🔗 Related Anime</h2>
            <div className="relations-grid">
              {anime.relations.slice(0, 6).map(relation => (
                <div
                  key={relation.id}
                  className="relation-card"
                  onClick={() => navigate(`/info/${relation.id}`)}
                >
                  <img src={relation.coverImage.medium} alt={relation.title.romaji} />
                  <p className="relation-title">{relation.title.english || relation.title.romaji}</p>
                  <span className="relation-type">{relation.relationType}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailers */}
        {anime.trailer && (
          <section className="info-section">
            <h2>🎬 Trailer</h2>
            <div className="trailer-container">
              {anime.trailer.site === 'YouTube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                  title="Anime Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <a href={anime.trailer.url} target="_blank" rel="noopener noreferrer" className="trailer-link">
                  Watch Trailer on {anime.trailer.site}
                </a>
              )}
            </div>
          </section>
        )}

        {/* Stats */}
        <section className="info-section">
          <h2>📊 Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{anime.popularity.toLocaleString()}</span>
              <span className="stat-label">Popularity</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{anime.favourites.toLocaleString()}</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{anime.trending}</span>
              <span className="stat-label">Trending Rank</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{anime.rank || 'N/A'}</span>
              <span className="stat-label">Overall Rank</span>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default InfoPage;
