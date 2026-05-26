// Custom API configuration
// Replace with your actual custom API endpoint
const CUSTOM_API_BASE_URL = import.meta.env.VITE_CUSTOM_API_URL || 'http://localhost:3001/api';

/**
 * Fetch featured anime from custom API
 * @returns {Promise<Array>} - Array of featured anime data
 */
export async function fetchFeaturedAnime() {
  try {
    const response = await fetch(`${CUSTOM_API_BASE_URL}/featured`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching featured anime from custom API:', error);
    // Return mock data for development/demo purposes
    return getMockFeaturedAnime();
  }
}

/**
 * Fetch anime recommendations from custom API
 * @returns {Promise<Array>} - Array of recommended anime
 */
export async function fetchRecommendations() {
  try {
    const response = await fetch(`${CUSTOM_API_BASE_URL}/recommendations`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations from custom API:', error);
    // Return mock data for development/demo purposes
    return getMockRecommendations();
  }
}

/**
 * Fetch seasonal anime from custom API
 * @param {string} season - Season (e.g., 'winter', 'spring', 'summer', 'fall')
 * @param {number} year - Year
 * @returns {Promise<Array>} - Array of seasonal anime
 */
export async function fetchSeasonalAnime(season, year) {
  try {
    const response = await fetch(`${CUSTOM_API_BASE_URL}/seasonal?season=${season}&year=${year}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching seasonal anime from custom API:', error);
    // Return mock data for development/demo purposes
    return getMockSeasonalAnime();
  }
}

/**
 * Mock data for development when custom API is not available
 */
function getMockFeaturedAnime() {
  return [
    {
      id: 'custom-1',
      title: 'Featured Anime 1',
      description: 'This is a featured anime from the custom API',
      image: 'https://via.placeholder.com/300x450',
      rating: 4.5,
    },
    {
      id: 'custom-2',
      title: 'Featured Anime 2',
      description: 'Another amazing featured anime',
      image: 'https://via.placeholder.com/300x450',
      rating: 4.8,
    },
  ];
}

function getMockRecommendations() {
  return [
    {
      id: 'rec-1',
      title: 'Recommended Anime 1',
      reason: 'Based on your viewing history',
      image: 'https://via.placeholder.com/300x450',
    },
    {
      id: 'rec-2',
      title: 'Recommended Anime 2',
      reason: 'Popular in your region',
      image: 'https://via.placeholder.com/300x450',
    },
  ];
}

function getMockSeasonalAnime() {
  return [
    {
      id: 'seasonal-1',
      title: 'Winter 2024 Anime 1',
      description: 'A great winter season anime',
      image: 'https://via.placeholder.com/300x450',
      episodes: 12,
    },
    {
      id: 'seasonal-2',
      title: 'Winter 2024 Anime 2',
      description: 'Another exciting winter release',
      image: 'https://via.placeholder.com/300x450',
      episodes: 24,
    },
  ];
}
