import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';
import { searchAnime } from '../api/anilist';
import Header from '../components/Header';
import Footer from '../components/Footer';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        setResults([]);
        setSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  async function performSearch() {
    try {
      setLoading(true);
      const data = await searchAnime(query);
      setResults(data);
      setSearched(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleCardClick(id) {
    navigate(`/info/${id}`);
  }

  return (
    <div className="search-page">
      <Header />
      
      <div className="search-header">
        <h1>🔍 Search Anime</h1>
        <p>Find your favorite anime titles</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="clear-btn" onClick={() => setQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="search-results">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="no-results">
            <p>😔 No results found for "{query}"</p>
            <p>Try searching with different keywords</p>
          </div>
        )}
        
        {!loading && searched && results.length > 0 && (
          <>
            <p className="results-count">{results.length} results found</p>
            <div className="results-grid">
              {results.map(anime => (
                <div
                  key={anime.id}
                  className="result-card"
                  onClick={() => handleCardClick(anime.id)}
                >
                  <img src={anime.coverImage.medium} alt={anime.title.romaji} />
                  <div className="result-info">
                    <h3>{anime.title.english || anime.title.romaji}</h3>
                    <div className="result-meta">
                      <span className="year">{anime.seasonYear}</span>
                      <span className="rating">⭐ {anime.averageScore / 10}</span>
                      <span className="episodes">{anime.episodes || '?'} eps</span>
                    </div>
                    <div className="result-genres">
                      {anime.genres.slice(0, 3).map(genre => (
                        <span key={genre} className="genre-tag">{genre}</span>
                      ))}
                    </div>
                    <p className="result-description">
                      {anime.description?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SearchPage;
