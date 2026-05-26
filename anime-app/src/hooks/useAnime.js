import { useState, useEffect } from 'react';
import { fetchTrendingAnime } from '../api/anilist';

/**
 * Custom hook to fetch trending anime
 * @param {number} limit - Number of anime to fetch
 * @returns {Object} - { data, loading, error }
 */
export function useTrendingAnime(limit = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await fetchTrendingAnime(limit);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [limit]);

  return { data, loading, error };
}

/**
 * Custom hook to fetch top rated anime
 * @param {number} limit - Number of anime to fetch
 * @returns {Object} - { data, loading, error }
 */
export function useTopRatedAnime(limit = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { fetchTopRatedAnime } = await import('../api/anilist');
        const result = await fetchTopRatedAnime(limit);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [limit]);

  return { data, loading, error };
}

/**
 * Custom hook to fetch featured anime from custom API
 * @returns {Object} - { data, loading, error }
 */
export function useFeaturedAnime() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { fetchFeaturedAnime } = await import('../api/customApi');
        const result = await fetchFeaturedAnime();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
