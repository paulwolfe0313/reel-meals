const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const OMDB_BASE = "https://www.omdbapi.com/";
const OMDB_API_KEY = "f166c46f"; // Your OMDb key

const bannedKeywords = ["porn", "xxx", "erotic", "sex", "nude", "naked", "hardcore"];

const ageSafeGenres = {
  "under-13": [16, 35, 10751, 12, 14, 10402], // Animation, Comedy, Family, Adventure, Fantasy, Music
  "13-17": [28, 12, 35, 18, 878, 10749],     // Action, Adventure, Comedy, Drama, Sci-Fi, Romance
  "18+": null,                               // unrestricted
};

const genreMap = {
  28: "action",
  12: "adventure",
  16: "animation",
  35: "comedy",
  80: "crime",
  99: "documentary",
  18: "drama",
  10751: "family",
  14: "fantasy",
  36: "history",
  27: "horror",
  10402: "music",
  9648: "mystery",
  10749: "romance",
  878: "sci-fi",
  10770: "tv",
  53: "thriller",
  10752: "war",
  37: "western",
};

/**
 * Fallback using OMDb
 */
const fetchFallbackMovie = async (genreKeyword = "movie") => {
  const res = await fetch(
    `${OMDB_BASE}?apikey=${OMDB_API_KEY}&s=${genreKeyword}&type=movie`
  );
  const data = await res.json();

  const safeResults = data.Search?.filter(
    (movie) =>
      movie.Title &&
      !bannedKeywords.some((kw) => movie.Title.toLowerCase().includes(kw))
  );

  if (!safeResults?.length) throw new Error("No fallback movie found.");

  const random = safeResults[Math.floor(Math.random() * safeResults.length)];

  const full = await fetch(`${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${random.imdbID}`);
  const fullData = await full.json();

  return {
    id: fullData.imdbID,
    title: fullData.Title,
    overview: fullData.Plot,
    poster_path: fullData.Poster?.includes("http") ? fullData.Poster : null,
    adult: false,
    fallback: true,
  };
};

/**
 * Main movie fetcher with TMDB primary and OMDb fallback
 */
export const fetchRandomMovie = async (prefs = null) => {
  const age = prefs?.ageGroup || "18+";
  let genreList = prefs?.genres;

  if (prefs?.wildcard && (!prefs.genres || prefs.genres.length === 0)) {
    const safeGenres = ageSafeGenres[age];
    if (safeGenres) {
      const randomGenre = safeGenres[Math.floor(Math.random() * safeGenres.length)];
      genreList = [randomGenre];
    }
  }

  let safeMovie = null;
  let tries = 0;

  while (!safeMovie && tries < 3) {
    const page = Math.floor(Math.random() * 10) + 1;
    let url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;

    if (genreList?.length > 0) {
      url += `&with_genres=${genreList.join(",")}`;
    }

    if (prefs?.language) {
      url += `&with_original_language=${prefs.language}`;
    }

    if (age === "under-13" || age === "13-17" || prefs?.ageRating === "G" || prefs?.ageRating === "PG") {
      url += `&include_adult=false`;
    } else {
      url += `&include_adult=true`;
    }

    const res = await fetch(url);
    const data = await res.json();
    const results = data.results;

    if (!results?.length) break;

    const random = results[Math.floor(Math.random() * results.length)];
    const title = random.title?.toLowerCase() || "";
    const overview = random.overview?.toLowerCase() || "";

    const isBanned = bannedKeywords.some((kw) =>
      title.includes(kw) || overview.includes(kw)
    );

    if (!isBanned) safeMovie = random;
    tries++;
  }

  if (!safeMovie) {
    try {
      const fallbackKeyword = genreMap[genreList?.[0]] || "movie";
      safeMovie = await fetchFallbackMovie(fallbackKeyword);
    } catch {
      throw new Error("No movie found from TMDB or OMDb.");
    }
  }

  return safeMovie;
};

/**
 * Streaming provider fetcher
 */
export const fetchWatchProviders = async (movieId) => {
  const res = await fetch(
    `${TMDB_BASE}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results?.US?.flatrate || [];
};
