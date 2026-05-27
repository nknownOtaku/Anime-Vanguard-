const ANILIST_API = 'https://graphql.anilist.co';

// Rate Limiting Configuration
const MAX_REQUESTS_PER_SECOND = 3;
const DELAY_MS = 1000 / MAX_REQUESTS_PER_SECOND; // ~333ms delay
let lastRequestTime = 0;
let requestQueue = [];

// Helper to enforce rate limiting
const enqueueRequest = (requestFn) => {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      const now = Date.now();
      const timeSinceLast = now - lastRequestTime;
      
      if (timeSinceLast < DELAY_MS) {
        await new Promise(r => setTimeout(r, DELAY_MS - timeSinceLast));
      }
      
      lastRequestTime = Date.now();
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    requestQueue.push(execute);
    if (requestQueue.length === 1) {
      processQueue();
    }
  });
};

const processQueue = async () => {
  if (requestQueue.length === 0) return;
  
  const nextRequest = requestQueue.shift();
  await nextRequest();
  processQueue();
};

const queryAnilist = async (query, variables = {}) => {
  return enqueueRequest(async () => {
    let retries = 3;
    
    while (retries > 0) {
      try {
        const response = await fetch(ANILIST_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        if (response.status === 429) {
          retries--;
          await new Promise(r => setTimeout(r, 2000)); // Wait 2s on rate limit
          continue;
        }

        if (!response.ok) {
          throw new Error(`AniList API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }
        return data.data;
      } catch (error) {
        if (retries === 0) throw error;
        retries--;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  });
};

// Query: Trending Anime (No Rank)
export const fetchTrending = async () => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (type: ANIME, sort: TRENDING_DESC, status_not_in: [NOT_YET_RELEASED]) {
          id
          title { romaji english native }
          coverImage { extraLarge large }
          bannerImage
          startDate { year }
          meanScore
          averageScore
          format
          episodes
          status
          genres
          description(asHtml: false)
          siteUrl
        }
      }
    }
  `;
  const data = await queryAnilist(query, { page: 1, perPage: 15 });
  return data.Page.media;
};

// Query: Popular All Time (No Rank)
export const fetchPopular = async () => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (type: ANIME, sort: POPULARITY_DESC, status: FINISHED) {
          id
          title { romaji english native }
          coverImage { extraLarge large }
          startDate { year }
          meanScore
          averageScore
          format
          episodes
          status
          siteUrl
        }
      }
    }
  `;
  const data = await queryAnilist(query, { page: 1, perPage: 12 });
  return data.Page.media;
};

// Query: Ongoing/Seasonal (No Rank)
export const fetchSeasonal = async () => {
  const query = `
    query ($season: MediaSeason, $year: Int) {
      Page (perPage: 12) {
        media (season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          coverImage { extraLarge large }
          startDate { year }
          meanScore
          averageScore
          format
          episodes
          status
          siteUrl
        }
      }
    }
  `;
  const date = new Date();
  const month = date.getMonth() + 1;
  let season = 'WINTER';
  let year = date.getFullYear();
  
  if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else if (month >= 9 && month <= 11) season = 'FALL';
  
  const data = await queryAnilist(query, { season, year });
  return data.Page.media;
};

// Query: Movies (No Rank)
export const fetchMovies = async () => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        media (type: ANIME, format: MOVIE, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          coverImage { extraLarge large }
          startDate { year }
          meanScore
          averageScore
          format
          episodes
          status
          siteUrl
        }
      }
    }
  `;
  const data = await queryAnilist(query, { page: 1, perPage: 12 });
  return data.Page.media;
};

// Query: Search (No Rank)
export const searchAnime = async (queryStr) => {
  const query = `
    query ($search: String) {
      Page (perPage: 20) {
        media (search: $search, type: ANIME) {
          id
          title { romaji english native }
          coverImage { extraLarge large }
          startDate { year }
          meanScore
          averageScore
          format
          episodes
          status
          genres
          description(asHtml: false)
          siteUrl
        }
      }
    }
  `;
  const data = await queryAnilist(query, { search: queryStr });
  return data.Page.media;
};

// Query: Details by ID
export const fetchAnimeDetails = async (id) => {
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        id
        title { romaji english native }
        coverImage { extraLarge large color }
        bannerImage
        startDate { year month day }
        endDate { year month day }
        meanScore
        averageScore
        popularity
        favourites
        format
        episodes
        duration
        status
        season
        seasonYear
        genres
        synonyms
        description(asHtml: true)
        trailer { id site thumbnail }
        studios { nodes { name } }
        characters { edges { role node { name { full } image { large } } } }
        relations { edges { relationType node { id title { romaji english } coverImage { large } format } } }
        recommendations(perPage: 6) {
          nodes {
            mediaRecommendation {
              id
              title { romaji english native }
              coverImage { large extraLarge }
              format
            }
          }
        }
        siteUrl
      }
    }
  `;
  const data = await queryAnilist(query, { id });
  return data.Media;
};