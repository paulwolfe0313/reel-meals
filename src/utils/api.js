const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetch a random movie, filtered by user preferences if provided.
 */
export const fetchRandomMovie = async (prefs = null) => {
  let page = Math.floor(Math.random() * 10) + 1;
  let url = `${TMDB_BASE}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;

  // If preferences exist and wildcard is false, apply filters
  if (prefs && !prefs.wildcard) {
    // Genres
    if (prefs.genres?.length > 0) {
      url += `&with_genres=${prefs.genres.join(",")}`;
    }

    // Language
    if (prefs.language) {
      url += `&with_original_language=${prefs.language}`;
    }

    // Age Rating: We'll use `include_adult` to filter R-rated/adult content
    // If the user selected "G", "PG", or "PG-13", we exclude adult content
    if (["G", "PG", "PG-13"].includes(prefs.ageRating)) {
      url += `&include_adult=false`;
    } else {
      url += `&include_adult=true`;
    }
  } else {
    // If wildcard, include adult for full randomness
    url += `&include_adult=true`;
  }

  const res = await fetch(url);
  const data = await res.json();
  const results = data.results;

  if (!results || results.length === 0) {
    throw new Error("No movies found with these preferences.");
  }

  // Return a random movie from the page
  return results[Math.floor(Math.random() * results.length)];
};

/**
 * Fetch streaming providers for a given movie ID
 */
export const fetchWatchProviders = async (movieId) => {
  const res = await fetch(
    `${TMDB_BASE}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
  );
  const data = await res.json();
  return data.results?.US?.flatrate || []; // Use 'US' region
};
