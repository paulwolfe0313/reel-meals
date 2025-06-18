const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetch a random popular movie (can later support preferences)
 */
export const fetchRandomMovie = async () => {
  const page = Math.floor(Math.random() * 10) + 1;
  const res = await fetch(`${TMDB_BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  const movies = data.results;
  return movies[Math.floor(Math.random() * movies.length)];
};

/**
 * Fetch streaming providers (Netflix, Hulu, etc.)
 */
export const fetchWatchProviders = async (movieId) => {
  const res = await fetch(`${TMDB_BASE}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results?.US?.flatrate || []; // Adjust region if needed
};
