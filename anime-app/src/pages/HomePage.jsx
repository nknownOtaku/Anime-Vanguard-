import { useEffect, useState } from 'react';
import { fetchTrending, fetchPopular, fetchSeasonal, fetchMovies } from '../api/anilist';
import { fetchRecentUploads } from '../api/customApi';
import Header from '../components/Header';
import AnimeCard from '../components/AnimeCard';
import TrendingCarousel from '../components/TrendingCarousel';
import SectionSkeleton from '../components/SectionSkeleton';
import './HomePage.css';
import Footer from '../components/Footer';

function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [movies, setMovies] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendingData, popularData, seasonalData, moviesData, recentData] = await Promise.all([
          fetchTrending(),
          fetchPopular(),
          fetchSeasonal(),
          fetchMovies(),
          fetchRecentUploads()
        ]);
        
        // Safety check: ensure we always have arrays
        setTrending(Array.isArray(trendingData) ? trendingData : []);
        setPopular(Array.isArray(popularData) ? popularData : []);
        setSeasonal(Array.isArray(seasonalData) ? seasonalData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setRecent(Array.isArray(recentData) ? recentData : []);
      } catch (error) {
        console.error('Error loading home data:', error);
        // Set empty arrays on error to prevent crash
        setTrending([]);
        setPopular([]);
        setSeasonal([]);
        setMovies([]);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Render Header + Skeletons while loading
  if (loading) {
    return (
      <>
        <Header />
        <div className="home-loading" style={{ paddingTop: '100px' }}>
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="home-page">
        <section className="trending-section">
          <TrendingCarousel items={trending} />
        </section>

        {popular.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Popular of all time</h2>
            <div className="anime-grid">
              {popular.map(anime => (
                <AnimeCard key={anime.id} anime={anime} type="simple" />
              ))}
            </div>
          </section>
        )}

        {/* Ongoing Now */}
        {seasonal.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Ongoing Now</h2>
            <div className="anime-grid">
              {seasonal.map(anime => (
                <AnimeCard key={anime.id} anime={anime} type="simple" />
              ))}
            </div>
          </section>
        )}

        {/* Recent Uploads (Custom API) */}
        {recent.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Recent Uploads</h2>
            <div className="anime-grid recent-grid">
              {recent.map((item, index) => (
                <AnimeCard 
                  key={`${item.anime_id}-${index}`} 
                  anime={item} 
                  type="standard"
                  isRecent={true}
                  episodeData={item}
                />
              ))}
            </div>
          </section>
        )}

        {/* Movies Spotlight */}
        {movies.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Movies Spotlight</h2>
            <div className="anime-grid">
              {movies.map(anime => (
                <AnimeCard key={anime.id} anime={anime} type="simple" />
              ))}
            </div>
          </section>
        )}
        
        {/* Explore More */}
        {popular.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">Explore More</h2>
            <div className="anime-grid">
              {[...popular].reverse().slice(0, 8).map(anime => (
                <AnimeCard key={`explore-${anime.id}`} anime={anime} type="simple" />
              ))}
            </div>
          </section>
        )}
        <Footer />
      </div>
      
    </>
  );
}

export default HomePage;