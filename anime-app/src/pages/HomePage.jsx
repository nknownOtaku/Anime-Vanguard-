import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { fetchTrendingAnime, fetchTopRatedAnime, fetchSeasonalAnime } from '../api/anilist';
import { fetchRecentAnime } from '../api/customApi';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HomePage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [recentAnime, setRecentAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [moviesAnime, setMoviesAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [trending, topRated, seasonal, recent, popular, movies] = await Promise.all([
          fetchTrendingAnime(15),
          fetchTopRatedAnime(12),
          fetchSeasonalAnime(12),
          fetchRecentAnime(),
          fetchTopRatedAnime(12, 'POPULARITY_DESC'),
          fetchTrendingAnime(12, 'MOVIE')
        ]);
        setTrendingAnime(trending);
        setTopRatedAnime(topRated);
        setSeasonalAnime(seasonal);
        setRecentAnime(recent);
        setPopularAnime(popular);
        setMoviesAnime(movies);
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (id, title) => {
    navigate(`/info/${id}`, { state: { title } });
  };

  const handleWatchNow = (id) => {
    navigate(`/info/${id}`);
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="anime-card-popular skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta">
          <div className="skeleton-year"></div>
          <div className="skeleton-rating"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <Header />
      
      {/* Auto-scrolling Trending Section */}
      <section className="auto-scroll-section">
        <h2 className="section-title">🔥 Trending Now</h2>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading trending anime...</p>
          </div>
        ) : (
          <div className="auto-scroll-container">
            <div className="auto-scroll-track">
              {[...trendingAnime, ...trendingAnime].map((anime, index) => (
                <div key={`${anime.id}-${index}`} className="scroll-card">
                  <div className="scroll-card-image">
                    <img src={anime.coverImage.large} alt={anime.title.romaji} />
                    <div className="scroll-card-overlay">
                      <h3>{anime.title.english || anime.title.romaji}</h3>
                      <p className="year">{anime.seasonYear}</p>
                      <p className="rating">⭐ {(anime.averageScore / 10).toFixed(1)}</p>
                      <p className="format">{anime.format}</p>
                      <div className="genres">
                        {anime.genres.slice(0, 3).map(genre => (
                          <span key={genre} className="genre-tag">{genre}</span>
                        ))}
                      </div>
                      <p className="description">{anime.description?.replace(/<[^>]*>/g, '').slice(0, 150)}...</p>
                      <div className="card-actions">
                        <button className="btn-download" onClick={() => handleWatchNow(anime.id)}>
                          Download Now
                        </button>
                        <button className="btn-info" onClick={() => handleMoreInfo(anime.id, anime.title.english || anime.title.romaji)}>
                          More Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Popular of all time Section */}
      <section className="content-section" id="popular">
        <h2 className="section-title">🏆 Popular of all time</h2>
        <div className="anime-grid-popular">
          {loading 
            ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : popularAnime.map(anime => (
                <div key={anime.id} className="anime-card-popular" onClick={() => handleMoreInfo(anime.id, anime.title.english || anime.title.romaji)}>
                  <div className="card-badge-cc">CC</div>
                  <div className="card-badge-dub">DUB</div>
                  <div className="card-episodes">{anime.episodes || '?'}</div>
                  <img src={anime.coverImage.medium} alt={anime.title.romaji} />
                  <div className="card-info-popular">
                    <h4>{anime.title.english || anime.title.romaji}</h4>
                    <div className="card-meta-popular">
                      <span className="year">{anime.seasonYear}</span>
                      <span className="rating">⭐ {(anime.averageScore / 10).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* Ongoing Now Section */}
      <section className="content-section" id="ongoing">
        <h2 className="section-title">📺 Ongoing Now</h2>
        <div className="anime-grid-popular">
          {loading 
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : seasonalAnime.slice(0, 8).map(anime => (
                <div key={anime.id} className="anime-card-popular" onClick={() => handleMoreInfo(anime.id, anime.title.english || anime.title.romaji)}>
                  <div className="card-badge-cc">CC</div>
                  <div className="card-badge-dub">DUB</div>
                  <div className="card-episodes">{anime.episodes || '?'}</div>
                  <img src={anime.coverImage.medium} alt={anime.title.romaji} />
                  <div className="card-info-popular">
                    <h4>{anime.title.english || anime.title.romaji}</h4>
                    <div className="card-meta-popular">
                      <span className="year">{anime.seasonYear}</span>
                      <span className="rating">⭐ {(anime.averageScore / 10).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* Recent Uploads Section */}
      <section className="content-section" id="recent">
        <h2 className="section-title">🆕 Recent Uploads</h2>
        <div className="anime-grid-popular">
          {loading 
            ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : recentAnime.map((anime, index) => (
                <div key={`${anime.anime_id}-${index}`} className="anime-card-popular" onClick={() => handleMoreInfo(anime.anime_id, anime.anime_title)}>
                  <div className="card-badge-cc">CC</div>
                  {anime.fansub !== 'SubsPlease' && <div className="card-badge-dub">DUB</div>}
                  <div className="card-episodes">{anime.episode}</div>
                  <img src={anime.snapshot} alt={anime.anime_title} />
                  <div className="card-info-popular">
                    <h4>{anime.anime_title}</h4>
                    <div className="card-meta-popular">
                      <span className="year">{new Date(anime.created_at).getFullYear()}</span>
                      <span className="rating">⭐ {anime.fansub === 'Amazon' ? '8.0' : '7.5'}</span>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="load-more-container">
          <button className="btn-load-more">Load More Recent Uploads</button>
          <p className="view-all-text">View all recent anime additions</p>
        </div>
      </section>

      {/* Movies Spotlight Section */}
      <section className="content-section" id="movies">
        <h2 className="section-title">🎬 Movies Spotlight</h2>
        <div className="anime-grid">
          {loading 
            ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : moviesAnime.map(anime => (
                <div key={anime.id} className="anime-card-simple" onClick={() => handleMoreInfo(anime.id, anime.title.english || anime.title.romaji)}>
                  <img src={anime.coverImage.medium} alt={anime.title.romaji} />
                  <div className="card-info-simple">
                    <h4>{anime.title.english || anime.title.romaji}</h4>
                    <div className="card-meta-simple">
                      <span className="year">{anime.seasonYear}</span>
                      <span className="rating">⭐ {(anime.averageScore / 10).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* Explore More Section */}
      <section className="content-section" id="explore">
        <h2 className="section-title">🔍 Explore More</h2>
        <div className="anime-grid-popular">
          {loading 
            ? Array(24).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : [...topRatedAnime, ...seasonalAnime].slice(0, 24).map(anime => (
                <div key={`explore-${anime.id}`} className="anime-card-popular" onClick={() => handleMoreInfo(anime.id, anime.title.english || anime.title.romaji)}>
                  <div className="card-badge-cc">CC</div>
                  <div className="card-badge-dub">DUB</div>
                  <div className="card-episodes">{anime.episodes || '?'}</div>
                  <img src={anime.coverImage.medium} alt={anime.title.romaji} />
                  <div className="card-info-popular">
                    <h4>{anime.title.english || anime.title.romaji}</h4>
                    <div className="card-meta-popular">
                      <span className="year">{anime.seasonYear}</span>
                      <span className="rating">⭐ {(anime.averageScore / 10).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
