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
          duration
          favourites
          trending
          rank
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
    console.error('Error fetching top rated anime:', error);
    throw error;
  }
}

/**
 * Fetch seasonal anime from Anilist API
 * @param {number} limit - Number of anime to fetch
 * @returns {Promise<Array>} - Array of anime data
 */
export async function fetchSeasonalAnime(limit = 12) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
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

  const seasonYear = season === 'WINTER' && month === 0 ? year - 1 : year;

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
          seasonYear
          format
        }
      }
    }
  `;

  const variables = {
    season: season,
    seasonYear: seasonYear,
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
    console.error('Error fetching seasonal anime:', error);
    throw error;
  }
}

/**
 * Fetch anime details by ID from Anilist API
 * @param {number} id - Anime ID
 * @returns {Promise<Object>} - Anime detail data
 */
export async function fetchAnimeDetails(id) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
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
        duration
        favourites
        trending
        rank
        trailer {
          id
          site
          url
        }
        studios {
          nodes {
            id
            name
          }
        }
        characters {
          edges {
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
            role
          }
        }
        relations {
          edges {
            node {
              id
              title {
                romaji
                english
              }
              coverImage {
                medium
              }
              relationType
            }
          }
        }
      }
    }
  `;

  const variables = {
    id: id,
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
    const anime = data.data.Media;
    
    // Transform characters and relations for easier use
    anime.characters = anime.characters.edges.map(edge => ({
      ...edge.node,
      role: edge.role
    }));
    
    anime.relations = anime.relations.edges.map(edge => edge.node);
    anime.studios = anime.studios.nodes;
    
    return anime;
  } catch (error) {
    console.error(`Error fetching anime details (${id}):`, error);
    throw error;
  }
}

/**
 * Search anime by title from Anilist API
 * @param {string} searchQuery - Search term
 * @param {number} limit - Number of anime to fetch
 * @returns {Promise<Array>} - Array of anime data
 */
export async function searchAnime(searchQuery, limit = 20) {
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
          seasonYear
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
