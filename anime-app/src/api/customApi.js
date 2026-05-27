const CUSTOM_API_URL =
  'https://animepahe-scrapper.otakusyndicate.workers.dev/animepahe?action=airing';

export const fetchRecentUploads = async () => {
  try {
    const response = await fetch(CUSTOM_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch recent uploads');
    }
    const result = await response.json();
    if (!result.data || !Array.isArray(result.data)) {
      console.log('No valid data array found');
      return [];
    }

    // Map the custom API response to a standard format
    const mappedData = result.data.map((item) => ({
      id: item.anime_session,
      title: item.anime_title,
      episode: item.episode,

      // Trim whitespace from URL explicitly
      image: item.snapshot
        ? item.snapshot.trim()
        : '',

      session: item.session,
      created_at: item.created_at,
      fansub: item.fansub
    }));

    console.log('Mapped Recent Uploads:', mappedData);

    return mappedData;
  } catch (error) {
    console.error(
      'Error fetching recent uploads:',
      error
    );

    return [];
  }
};