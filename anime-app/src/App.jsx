import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AnimeSection from './components/AnimeSection';
import Footer from './components/Footer';
import { useTrendingAnime, useTopRatedAnime, useFeaturedAnime } from './hooks/useAnime';
import './App.css';

function App() {
  const { data: trendingAnime, loading: trendingLoading, error: trendingError } = useTrendingAnime(10);
  const { data: topRatedAnime, loading: topRatedLoading, error: topRatedError } = useTopRatedAnime(8);
  const { data: featuredAnime, loading: featuredLoading } = useFeaturedAnime();

  // Popular genres to display
  const [selectedGenre] = useState('Action');

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        {/* Hero Section */}
        <Hero featuredAnime={featuredLoading ? null : featuredAnime?.[0]} />
        
        {/* Trending Anime Section - Top 10 */}
        <section id="trending" className="content-section">
          <AnimeSection 
            title="🔥 Trending Now" 
            anime={trendingAnime} 
            loading={trendingLoading} 
            error={trendingError} 
          />
        </section>

        {/* Top Rated Anime Section */}
        <section id="top-rated" className="content-section">
          <AnimeSection 
            title="⭐ Top Rated" 
            anime={topRatedAnime} 
            loading={topRatedLoading} 
            error={topRatedError} 
          />
        </section>

        {/* Genre-based Section */}
        <section id="genres" className="content-section">
          <GenreSection genre={selectedGenre} />
        </section>

        {/* Seasonal Anime Section */}
        <section id="seasonal" className="content-section">
          <SeasonalSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * GenreSection component to display anime by genre
 */
function GenreSection({ genre }) {
  const [genreData, setGenreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useState(() => {
    async function fetchGenreData() {
      try {
        setLoading(true);
        const { fetchAnimeByGenre } = await import('./api/anilist');
        const result = await fetchAnimeByGenre(genre, 8);
        setGenreData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGenreData();
  }, [genre]);

  return (
    <AnimeSection 
      title={`📚 ${genre} Anime`} 
      anime={genreData} 
      loading={loading} 
      error={error} 
    />
  );
}

/**
 * SeasonalSection component to display current season anime
 */
function SeasonalSection() {
  const [seasonalData, setSeasonalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useState(() => {
    async function fetchSeasonalData() {
      try {
        setLoading(true);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // Determine current season
        let season;
        if (month >= 2 && month <= 4) {
          season = 'SPRING';
        } else if (month >= 5 && month <= 7) {
          season = 'SUMMER';
        } else if (month >= 8 && month <= 10) {
          season = 'FALL';
        } else {
          season = 'WINTER';
        }

        const query = `
          query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                description
                coverImage {
                  large
                  medium
                }
                bannerImage
                genres
                averageScore
                popularity
                episodes
                status
                format
              }
            }
          }
        `;

        const variables = {
          season: season,
          seasonYear: season === 'WINTER' && month === 0 ? year - 1 : year,
          page: 1,
          perPage: 8,
        };

        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSeasonalData(data.data.Page.media);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSeasonalData();
  }, []);

  const currentSeason = new Date().getMonth();
  let seasonName;
  if (currentSeason >= 2 && currentSeason <= 4) {
    seasonName = 'Spring';
  } else if (currentSeason >= 5 && currentSeason <= 7) {
    seasonName = 'Summer';
  } else if (currentSeason >= 8 && currentSeason <= 10) {
    seasonName = 'Fall';
  } else {
    seasonName = 'Winter';
  }

  return (
    <AnimeSection 
      title={`🍂 ${seasonName} Season`} 
      anime={seasonalData} 
      loading={loading} 
      error={error} 
    />
  );
}

export default App;
