import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { fetchTrendingAnime, fetchTopRatedAnime, fetchSeasonalAnime } from '../api/anilist';

function HomePage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [trending, topRated, seasonal] = await Promise.all([
          fetchTrendingAnime(15),
          fetchTopRatedAnime(12),
          fetchSeasonalAnime(12)
        ]);
        setTrendingAnime(trending);
        setTopRatedAnime(topRated);
        setSeasonalAnime(seasonal);
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (id) => {
    navigate(`/info/${id}`);
  };

  const handleWatchNow = (id) => {
    // For now, navigate to info page - can be extended to actual player
    navigate(`/info/${id}`);
  };

  return (
    <div className="home-page">
      {/* Auto-scrolling Trending Section */}
      <section className="auto-scroll-section">
        <h2 className="section-title">🔥 Trending Now</h2>
        <div className="auto-scroll-container">
          <div className="auto-scroll-track">
            {[...trendingAnime, ...trendingAnime].map((anime, index) => (
              <div key={`${anime.id}-${index}`} className="scroll-card">
                <div className="scroll-card-image">
                  <img src={anime.coverImage.large} alt={anime.title.romaji} />
                  <div className="scroll-card-overlay">
                    <h3>{anime.title.english || anime.title.romaji}</h3>
                    <p className="year">{anime.seasonYear}</p>
                    <p className="rating">⭐ {anime.averageScore / 10}</p>
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
                      <button className="btn-info" onClick={() => handleMoreInfo(anime.id)}>
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="content-section">
        <h2 className="section-title">⭐ Top Rated</h2>
        <div className="anime-grid">
          {topRatedAnime.map(anime => (
            <div key={anime.id} className="anime-card-simple" onClick={() => handleMoreInfo(anime.id)}>
              <img src={anime.coverImage.medium} alt={anime.title.romaji} />
              <div className="card-info-simple">
                <h4>{anime.title.english || anime.title.romaji}</h4>
                <div className="card-meta-simple">
                  <span className="year">{anime.seasonYear}</span>
                  <span className="rating">⭐ {anime.averageScore / 10}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal Anime Section */}
      <section className="content-section">
        <h2 className="section-title">🍂 This Season</h2>
        <div className="anime-grid">
          {seasonalAnime.map(anime => (
            <div key={anime.id} className="anime-card-simple" onClick={() => handleMoreInfo(anime.id)}>
              <img src={anime.coverImage.medium} alt={anime.title.romaji} />
              <div className="card-info-simple">
                <h4>{anime.title.english || anime.title.romaji}</h4>
                <div className="card-meta-simple">
                  <span className="year">{anime.seasonYear}</span>
                  <span className="rating">⭐ {anime.averageScore / 10}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
