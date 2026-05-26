// Anilist API GraphQL endpoint
const ANILIST_API_URL = 'https://graphql.anilist.co';

/**
 * Fetch trending anime from Anilist API
 * @param {number} limit - Number of anime to fetch (default: 10)
 * @returns {Promise<Array>} - Array of anime data
 */
export async function fetchTrendingAnime(limit = 10) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME) {
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
          season
          seasonYear
          format
        }
      }
    }
  `;

  const variables = {
    page: 1,
    perPage: limit,
  };

  try {
    const response = await fetch(ANILIST_API_URL, {
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
    return data.data.Page.media;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    throw error;
  }
}

/**
 * Fetch anime by genre from Anilist API
 * @param {string} genre - Genre to filter by
 * @param {number} limit - Number of anime to fetch
 * @returns {Promise<Array>} - Array of anime data
 */
export async function fetchAnimeByGenre(genre, limit = 10) {
  const query = `
    query ($genre: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
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
    genre: genre,
    page: 1,
    perPage: limit,
  };

  try {
    const response = await fetch(ANILIST_API_URL, {
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
    return data.data.Page.media;
  } catch (error) {
    console.error(`Error fetching anime by genre (${genre}):`, error);
    throw error;
  }
}

/**
 * Fetch top rated anime from Anilist API
 * @param {number} limit - Number of anime to fetch
 * @returns {Promise<Array>} - Array of anime data
 */
export async function fetchTopRatedAnime(limit = 10) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: SCORE_DESC, status_not_in: CANCELLED) {
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
    page: 1,
    perPage: limit,
  };

  try {
    const response = await fetch(ANILIST_API_URL, {
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
    return data.data.Page.media;
  } catch (error) {
    console.error('Error fetching top rated anime:', error);
    throw error;
  }
}

/**
 * Search anime by title from Anilist API
 * @param {string} searchQuery - Search term
 * @param {number} limit - Number of anime to fetch
 * @returns {Promise<Array>} - Array of anime data
 */
export async function searchAnime(searchQuery, limit = 10) {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME) {
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
    search: searchQuery,
    page: 1,
    perPage: limit,
  };

  try {
    const response = await fetch(ANILIST_API_URL, {
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
    return data.data.Page.media;
  } catch (error) {
    console.error(`Error searching anime (${searchQuery}):`, error);
    throw error;
  }
}
