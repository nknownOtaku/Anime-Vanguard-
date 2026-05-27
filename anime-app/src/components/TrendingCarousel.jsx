import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './TrendingCarousel.css';

const TrendingCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  
  // Safety check for items
  const animeList = Array.isArray(items) ? items : [];
  
  useEffect(() => {
    if (animeList.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animeList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [animeList.length]);

  if (animeList.length === 0) {
    return (
      <div className="trending-section">
        <div className="carousel-track" style={{ justifyContent: 'center', height: '400px', alignItems: 'center' }}>
          <h3 style={{ color: '#666' }}>No trending anime available</h3>
        </div>
      </div>
    );
  }

  const currentAnime = animeList[currentIndex];
  const coverImage = currentAnime.coverImage?.extraLarge || currentAnime.coverImage?.large || 'https://via.placeholder.com/600x900?text=No+Image';
  const image = currentAnime.bannerImage || coverImage; // Fallback to cover if banner is missing
  const title = currentAnime.title?.english || currentAnime.title?.romaji || 'Unknown Title';
  const year = currentAnime.seasonYear || 'N/A';
  const score = currentAnime.averageScore ? (currentAnime.averageScore / 10).toFixed(1) : 'N/A';
  const format = currentAnime.format || 'TV';
  const genres = currentAnime.genres?.slice(0, 3) || [];
  const description = currentAnime.description 
    ? currentAnime.description.replace(/<[^>]*>/g, '').slice(0, 200) + '...' 
    : 'No description available.';

  return (
    <div className="trending-section">
      <div className="carousel-container">
        {/* Navigation Arrows */}
        <button 
          className="nav-arrow left"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + animeList.length) % animeList.length)}
        >
          ❮
        </button>

        {/* Single Card Slide */}
        <div className="carousel-slide">
          <div className="slide-image-wrapper">
            <img src={image} alt={title} className="slide-image" />
            <div className="slide-overlay">
              <div className="slide-content">
                <h2 className="slide-title">{title}</h2>
                <div className="slide-meta">
                  <span>{year}</span>
                  <span>•</span>
                  <span>⭐ {score}</span>
                  <span>•</span>
                  <span className="badge">{format}</span>
                </div>
                
                <div className="slide-genres">
                  {genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
                </div>

                <p className="slide-desc">{description}</p>

                <div className="slide-actions">
                  <button className="btn-download">⬇ Download Now</button>
                  <Link to={`/info/${currentAnime.id}`} className="btn-info">ℹ More Info</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="nav-arrow right"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % animeList.length)}
        >
          ❯
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {animeList.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;