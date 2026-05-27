import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnimeDetails } from '../api/anilist';
import Header from '../components/Header';
import './InfoPage.css';

function InfoPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnime = async () => {
      try {
        setLoading(true);
        const data = await fetchAnimeDetails(id);
        setAnime(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch anime details:', err);
        setError('Failed to load anime information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadAnime();
  }, [id]);

  /* =========================
     YOUTUBE HELPER
  ========================= */
  const getYouTubeId = (trailer) => {
    if (!trailer || trailer.site !== 'youtube') return null;
    return trailer.id;
  };

  if (loading) {
    return (
      <div className="info-page-loading">
        <Header />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Anime Details...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="info-page-error">
        <Header />
        <div className="error-container">
          <h2>Oops!</h2>
          <p>{error || 'Anime not found.'}</p>
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </div>
    );
  }

  /* =========================
     DATA NORMALIZATION
  ========================= */

  const title =
    anime.title?.english ||
    anime.title?.romaji ||
    anime.title?.native ||
    'Unknown Title';

  const encodedTitle = encodeURIComponent(title);

  const bannerImage =
    anime.bannerImage ||
    anime.coverImage?.extraLarge;

  const posterImage =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large;

  const description = anime.description
    ? anime.description
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
    : 'No description available.';

  const youtubeId = getYouTubeId(anime.trailer);

  /* =========================
     UI
  ========================= */

  return (
    <div className="info-page-wrapper">
      <Header />

      <main className="info-content">

        {/* HERO */}
        <section className="info-hero">
          {bannerImage && (
            <div className="hero-banner">
              <img
                src={bannerImage}
                alt={`${title} banner`}
                className="banner-img"
              />
              <div className="banner-overlay"></div>
            </div>
          )}

          <div className="hero-details">
            <img
              src={posterImage}
              alt={title}
              className="hero-poster"
            />

            <div className="hero-text">
              <h1 className="anime-title">{title}</h1>

              <div className="anime-meta">
                {anime.format && (
                  <span className="meta-badge">
                    {anime.format}
                  </span>
                )}

                {anime.status && (
                  <span className="meta-badge status">
                    {anime.status}
                  </span>
                )}

                {anime.seasonYear && (
                  <span className="meta-badge">
                    {anime.seasonYear}
                  </span>
                )}

                {anime.episodes && (
                  <span className="meta-badge">
                    {anime.episodes} eps
                  </span>
                )}

                {anime.averageScore && (
                  <span className="meta-badge score">
                    ⭐ {(anime.averageScore / 10).toFixed(1)}
                  </span>
                )}
              </div>

              <div className="anime-genres">
                {anime.genres?.map((g) => (
                  <span key={g} className="genre-pill">
                    {g}
                  </span>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="anime-actions">

                <Link
                  to={`/watch/${encodedTitle}`}
                  className="action-btn primary"
                >
                  ▶ Watch Now
                </Link>

                <Link 
                  to={`/watch/${encodedTitle}`} 
                  className="action-btn secondary"
                >
                  ⬇ Download
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* GRID */}
        <div className="info-grid">

          {/* LEFT */}
          <div className="info-main">

            {/* SYNOPSIS */}
            <section className="info-section">
              <h3 className="section-header">Synopsis</h3>
              <p className="synopsis-text">{description}</p>
            </section>

            {/* TRAILER */}
            {youtubeId && (
              <section className="info-section">
                <h3 className="section-header">Trailer</h3>

                <div className="trailer-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Trailer"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* CHARACTERS */}
            {anime.characters?.edges?.length > 0 && (
              <section className="info-section">
                <h3 className="section-header">Characters</h3>

                <div className="characters-grid">
                  {anime.characters.edges
                    .slice(0, 6)
                    .map((char, i) => (
                      <div key={i} className="character-card">
                        <img
                          src={
                            char.node.image?.large ||
                            char.node.image?.medium
                          }
                          alt={char.node.name.full}
                          className="char-image"
                        />

                        <p className="char-name">
                          {char.node.name.full}
                        </p>

                        <p className="char-role">
                          {char.role}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* RECOMMENDATIONS */}
            {anime.recommendations?.length > 0 && (
              <section className="info-section">
                <h3 className="section-header">
                  Recommendations
                </h3>

                <div className="characters-grid">
                  {anime.recommendations
                    .slice(0, 6)
                    .map((rec, i) => (
                      <Link
                        key={i}
                        to={`/watch/${encodeURIComponent(rec.title)}`}
                        className="character-card"
                      >
                        <img
                          src={rec.image}
                          className="char-image"
                          alt={rec.title}
                        />

                        <p className="char-name">
                          {rec.title}
                        </p>

                        <p className="char-role">
                          {rec.type}
                        </p>
                      </Link>
                    ))}
                </div>
              </section>
            )}

            {/* RELATIONS */}
            {anime.relations?.edges?.length > 0 && (
              <section className="info-section">
                <h3 className="section-header">
                  Related Anime
                </h3>

                <div className="characters-grid">
                  {anime.relations.edges.map((rel, i) => (
                    <Link
                      key={i}
                      to={`/info/${rel.node.id}`}
                      className="character-card"
                    >
                      <img
                        src={rel.node.coverImage?.large}
                        className="char-image"
                        alt={rel.node.title.romaji}
                      />

                      <p className="char-name">
                        {rel.node.title.english ||
                          rel.node.title.romaji}
                      </p>

                      <p className="char-role">
                        {rel.relationType}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="info-sidebar">

            <div className="sidebar-card">
              <h3 className="sidebar-title">
                Information
              </h3>

              <div className="info-row">
                <span className="label">Format</span>
                <span className="value">
                  {anime.format || 'N/A'}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Episodes</span>
                <span className="value">
                  {anime.episodes || '?'}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Status</span>
                <span className="value">
                  {anime.status || 'N/A'}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Season</span>
                <span className="value">
                  {anime.season} {anime.seasonYear}
                </span>
              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}

export default InfoPage;