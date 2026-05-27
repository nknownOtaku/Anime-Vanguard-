import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchAnime, fetchAnimeDetails } from '../api/anilist';
import Header from '../components/Header';
import './WatchPage.css';

const API = 'https://animepahe-scrapper.otakusyndicate.workers.dev/animepahe';

const WatchPage = () => {
  const { title } = useParams();

  const [anime, setAnime] = useState(null);
  const [details, setDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cleanText = (text) =>
    text
      ? text
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .trim()
      : '';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const decodedTitle = decodeURIComponent(title);

        // AnimePahe Search
        const watchSearch = await fetch(
          `${API}?action=search&query=${encodeURIComponent(decodedTitle)}`
        ).then((res) => res.json());

        const firstAnime = watchSearch?.data?.[0];

        if (!firstAnime) {
          setError('Anime not found.');
          return;
        }

        setAnime(firstAnime);

        // Episodes
        const epRes = await fetch(
          `${API}?action=episodes&slug=${firstAnime.session}`
        );

        const epData = await epRes.json();

        const epList = epData?.episodes || [];

        setEpisodes(epList);
        setSelectedEpisode(epList[0] || null);

        // AniList Search
        const aniResults = await searchAnime(decodedTitle);

        if (aniResults?.length > 0) {
          const exactMatch =
            aniResults.find(
              (a) =>
                a.title?.english?.toLowerCase() ===
                  decodedTitle.toLowerCase() ||
                a.title?.romaji?.toLowerCase() ===
                  decodedTitle.toLowerCase()
            ) || aniResults[0];

          const fullData = await fetchAnimeDetails(exactMatch.id);
          setDetails(fullData);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load anime.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [title]);

  if (loading) {
    return (
      <div className="watch-loading-page">
        <Header />
        <div className="watch-loader">
          <div className="spinner"></div>
          <p>Loading Anime...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="watch-error-page">
        <Header />
        <div className="watch-error-box">
          <h2>Oops!</h2>
          <p>{error}</p>

          <Link to="/" className="watch-back-btn">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  const animeTitle =
    details?.title?.english ||
    details?.title?.romaji ||
    anime?.title;

  const banner =
    details?.bannerImage ||
    details?.coverImage?.extraLarge ||
    anime?.poster;

  const poster =
    details?.coverImage?.extraLarge ||
    anime?.poster;

  const description =
    cleanText(details?.description) ||
    'No synopsis available.';

  const relationEdges =
    details?.relations?.edges?.filter(
      (r) =>
        r.relationType === 'SEQUEL' ||
        r.relationType === 'PREQUEL' ||
        r.relationType === 'ADAPTATION'
    ) || [];

  const recommendations =
    details?.recommendations?.nodes?.map(
      (node) => node.mediaRecommendation
    ) || [];


  return (
    <div className="watch-page">
      <Header />

      {/* HERO */}
      <section className="watch-hero">
        <img
          src={banner}
          alt={animeTitle}
          className="watch-banner"
        />

        <div className="watch-overlay"></div>

        <div className="watch-hero-content">
          <img
            src={poster}
            alt={animeTitle}
            className="watch-poster"
          />

          <div className="watch-info">
            <h1 className="watch-title">{animeTitle}</h1>

            <div className="watch-badges">
              <span>{details?.format || anime?.type}</span>
              <span>{details?.status || anime?.status}</span>
              <span>
                ⭐{' '}
                {details?.averageScore
                  ? (details.averageScore / 10).toFixed(1)
                  : anime?.score || 'N/A'}
              </span>
              <span>
                {details?.episodes || anime?.episodes || '?'} EPS
              </span>
            </div>

            <div className="watch-genres">
              {details?.genres?.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>

            <p className="watch-description">
              {description}
            </p>

            <div className="watch-buttons">
              {episodes[0] && (
                <Link
                  to={`/play/${anime.session}/${episodes[0].session}`}
                  className="watch-btn primary"
                >
                  ▶ Watch Now
                </Link>
              )}

              <Link
                to={`/info/${details?.id || ''}`}
                className="watch-btn secondary"
              >
                ℹ More Info
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="watch-content">

        {/* EPISODES FIRST */}
        <section className="episodes-section">
          <div className="section-top">
            <h2>Episodes</h2>

            <span>
              {episodes.length} Episodes
            </span>
          </div>

          <div className="episodes-scroll">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                to={`/play/${anime.session}/${ep.session}`}
                className={`episode-card ${
                  selectedEpisode?.id === ep.id ? 'active' : ''
                }`}
                onMouseEnter={() => setSelectedEpisode(ep)}
              >
                <img
                  src={ep.snapshot}
                  alt={`Episode ${ep.episode}`}
                />

                <div className="episode-overlay"></div>

                <div className="episode-details">
                  <h3>Episode {ep.episode}</h3>

                  <p>{ep.duration}</p>

                  {ep.filler === 1 && (
                    <span className="filler-tag">
                      FILLER
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* RELATED ANIME */}
        {relationEdges.length > 0 && (
          <section className="recommendations-section">
            <div className="section-top">
              <h2>Sequels & Related</h2>
            </div>

            <div className="recommendations-grid">
              {relationEdges.map((rel, index) => {
                const relAnime = rel.node;
                const relTitle =
                  relAnime?.title?.english ||
                  relAnime?.title?.romaji;

                return (
                  <Link
                    key={index}
                    to={`/watch/${encodeURIComponent(relTitle)}`}
                    className="recommend-card related-card"
                  >
                    <img
                      src={relAnime?.coverImage?.large}
                      alt={relTitle}
                    />

                    <div className="recommend-info">
                      <h3>{relTitle}</h3>
                      <span className="relation-label">
                        {rel.relationType}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        
        {recommendations.length >
            0 && (
            <section className="recommend-section">
              <h2>
                Recommendations
              </h2>

              <div className="recommend-grid">
                {recommendations
                  .slice(0, 8)
                  .map((rec) => (
                    <Link
                      key={rec.id}
                      to={`/watch/${encodeURIComponent(
                        rec.title
                          ?.english ||
                          rec.title
                            ?.romaji
                      )}`}
                      className="recommend-card"
                    >
                      <img
                        src={
                          rec.coverImage
                            ?.large
                        }
                        alt={
                          rec.title
                            ?.romaji
                        }
                      />

                      <div className="recommend-info">
                        <p>
                          {rec.title
                            ?.english ||
                            rec.title
                              ?.romaji}
                        </p>

                        <span>
                          {rec.format}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          )}
      </div>
    </div>
  );
};

export default WatchPage;