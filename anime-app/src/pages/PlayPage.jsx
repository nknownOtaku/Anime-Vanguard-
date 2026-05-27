import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import './PlayPage.css';

const API =
  'https://animepahe-scrapper.otakusyndicate.workers.dev/animepahe';

const PlayPage = () => {
  const { slug, session } = useParams();

  const [episodeData, setEpisodeData] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [objectUrl, setObjectUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinks();
  }, [slug, session]);

  // cleanup blob URLs on unmount or when objectUrl changes
  useEffect(() => {
    return () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch (e) {}
      }
    };
  }, [objectUrl]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API}?action=links&slug=${slug}&session=${session}`
      );

      const data = await response.json();

      setEpisodeData(data);

      if (data?.links?.length > 0) {
        const first = data.links[0];

        // use handleSelect so headers/fetch logic is applied
        await handleSelect(first);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load episode links');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (link) => {
    (async () => {
      try {
        setSelectedQuality(link);

        // revoke previous object URL
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          setObjectUrl(null);
        }

        const target = link.embed || link.kwik_url || link.mp4_url || link.link;

        if (!target) {
          setVideoUrl('');
          return;
        }

        // attempt to fetch resource with custom headers and create blob URL
        try {
          const res = await fetch(target, {
            method: 'GET',
            headers: {
              accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8',
            },
            // mode: 'cors' // rely on browser default
          });

          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setObjectUrl(url);
            setVideoUrl(url);
            return;
          }
        } catch (err) {
          // fetch with headers failed (CORS or other). fall back to original URL
          console.warn('Fetch with headers failed, falling back to original url', err);
        }

        // fallback to direct URL if fetch didn't work
        setVideoUrl(target);
      } catch (err) {
        console.error(err);
        setError('Failed to load selected stream.');
      }
    })();
  };

  if (loading) {
    return (
      <div className="play-loading-page">
        <Header />

        <div className="play-loading-box">
          <div className="spinner"></div>
          <p>Loading Episode...</p>
        </div>
      </div>
    );
  }

  if (error || !episodeData) {
    return (
      <div className="play-error-page">
        <Header />

        <div className="play-error-box">
          <h2>Unable to load episode</h2>
          <p>{error}</p>

          <Link to="/" className="play-back-btn">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="play-page">
      <Header />

      <div className="play-container">
        <div className="play-top">
          <Link to="/" className="back-link">
            ← Home
          </Link>

          <h1 className="play-title">
            {episodeData.title || 'Anime Episode'}
          </h1>
        </div>

        <div className="video-wrapper">
          {videoUrl ? (
            // using iframe for HTML/embed content or blob URL
            <iframe
              src={videoUrl}
              title="Anime Player"
              allowFullScreen
              allow="autoplay; encrypted-media"
              className="video-iframe"
            />
          ) : (
            <div className="video-placeholder">
              No video available
            </div>
          )}
        </div>

        <div className="player-controls">
          <div className="quality-section">
            <h2>Select Quality</h2>

            <div className="quality-grid">
              {episodeData.links?.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(link)}
                  className={`quality-btn ${
                    selectedQuality === link ? 'active' : ''
                  }`}
                >
                  <span className="quality-name">
                    {link.resolution}
                  </span>

                  <span className="quality-size">
                    {link.filesize}
                  </span>

                  {link.isDub && (
                    <span className="dub-badge">
                      DUB
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedQuality && (
            <div className="episode-info-card">
              <div className="info-item">
                <span>Fansub</span>
                <strong>{selectedQuality.fansub}</strong>
              </div>

              <div className="info-item">
                <span>Resolution</span>
                <strong>{selectedQuality.resolution}</strong>
              </div>

              <div className="info-item">
                <span>Size</span>
                <strong>{selectedQuality.filesize}</strong>
              </div>

              <div className="info-item">
                <span>Audio</span>
                <strong>
                  {selectedQuality.isDub
                    ? 'English Dub'
                    : 'Japanese Sub'}
                </strong>
              </div>
            </div>
          )}

          <div className="download-section">
            <a
              href={
                selectedQuality?.kwik_url ||
                selectedQuality?.link
              }
              target="_blank"
              rel="noreferrer"
              className="download-btn"
            >
              Download Episode
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayPage;