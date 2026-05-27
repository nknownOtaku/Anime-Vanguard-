import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({
  anime,
  type = 'standard',
  isRecent = false
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log('AnimeCard Props:', {
    anime,
    type,
    isRecent
  });

  if (!anime) return null;

  /* =========================
     RECENT UPLOAD CARD
  ========================= */

  if (isRecent) {
    const title =
      anime.title ||
      anime.anime_title ||
      'Unknown Title';

    const image =
      anime.image ||
      anime.snapshot ||
      'https://via.placeholder.com/300x450?text=No+Image';

    const episode =
      anime.episode || '?';

    const fansub =
      anime.fansub || 'Sub';

    const handleRecentClick = async () => {
      try {
        if (loading) return;

        setLoading(true);

        const slug = anime.id || anime.anime_id;

        console.log('Fetching info for slug:', slug);

        const res = await fetch(
          `https://animepahe-scrapper.otakusyndicate.workers.dev/animepahe?action=info&slug=${slug}`
        );

        const data = await res.json();

        console.log('Info API response:', data);

        const anilistId = data?.ids?.anilist;

        if (!anilistId) {
          console.log('No AniList ID found');
          setLoading(false);
          return;
        }

        navigate(`/info/${anilistId}`);
      } catch (err) {
        console.error('Failed to fetch anime info:', err);
        setLoading(false);
      }
    };

    return (
      <div
        className="recent-card-link"
        onClick={handleRecentClick}
        style={{
          cursor: loading ? 'not-allowed' : 'pointer',
          pointerEvents: loading ? 'none' : 'auto'
        }}
      >
        <div className="card recent-upload-card">
          <div className="card-image-wrapper">
            <img
              src={image}
              alt={title}
              className="card-image"
              loading="lazy"
            />

            <div className="episode-badge">
              EP {episode}
            </div>

            <div className="fansub-tag">
              {fansub}
            </div>

            <div className="play-overlay">
              {loading ? '⏳' : '▶'}
            </div>
          </div>

          <div className="card-content">
            <h3 className="card-title">
              {title}
            </h3>

            <div className="card-meta">
              <span>
                {loading
                  ? 'Loading...'
                  : 'New Episode'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     STANDARD ANILIST CARD
  ========================= */

  const title =
    anime.title?.english ||
    anime.title?.romaji ||
    anime.title ||
    'Unknown Title';

  const cover =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    anime.image ||
    'https://via.placeholder.com/300x450';

  const score =
    anime.meanScore ||
    anime.averageScore;

  const episodes =
    anime.episodes ||
    anime.nextAiringEpisode?.episode - 1 ||
    '?';

  const format =
    anime.format || 'TV';

  const year =
    anime.seasonYear || 'N/A';

  return (
    <Link
      to={`/info/${anime.id}`}
      className="standard-card-link"
    >
      <div
        className={`card ${
          type === 'simple'
            ? 'simple-card'
            : 'detailed-card'
        }`}
      >
        <div className="card-image-wrapper">
          <img
            src={cover}
            alt={title}
            className="card-image"
            loading="lazy"
          />

          {score && (
            <div className="score-badge">
              ⭐ {(score / 10).toFixed(1)}
            </div>
          )}

          {type === 'simple' && (
            <div className="format-tag">
              {format}
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="card-title">
            {title}
          </h3>

          {type !== 'simple' && (
            <div className="card-meta">
              <span>{year}</span>

              <span>•</span>

              <span>
                {episodes} Eps
              </span>
            </div>
          )}
        </div>

        {type === 'simple' && (
          <div className="simple-footer">
            <span className="year-text">
              {year}
            </span>

            <span className="rating-text">
              {score
                ? (score / 10).toFixed(1)
                : 'N/A'}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;