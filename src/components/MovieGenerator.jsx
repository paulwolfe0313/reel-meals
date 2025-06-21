import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { fetchRandomMovie, fetchWatchProviders } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { saveMovieRating } from "../utils/firestore";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import PreferencesModal from "./PreferencesModal";

const MovieGenerator = forwardRef((props, ref) => {
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState([]);
  const [showProjector, setShowProjector] = useState(true);
  const [ratingStatus, setRatingStatus] = useState("");
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [userPrefs, setUserPrefs] = useState(null);
  const [ageGroup, setAgeGroup] = useState(null);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [pendingMovie, setPendingMovie] = useState(null);
  const [error, setError] = useState(null);
  const [animateKey, setAnimateKey] = useState(0); // force animation re-run

  const { user } = useAuth();

  const loadMovie = async () => {
    if (!userPrefs) return;

    setShowProjector(true);
    setMovie(null);
    setError(null);

    try {
      const selectedMovie = await fetchRandomMovie(userPrefs);
      if (!selectedMovie?.title) throw new Error("No movie returned.");

      // Handle age restrictions
      const isAdult = selectedMovie.adult === true;
      const isUnrated = selectedMovie.vote_average < 3 && !selectedMovie.vote_count;
      const titleLC = selectedMovie.title?.toLowerCase() || "";
      const needsWarning =
        isAdult || isUnrated || titleLC.includes("sex");

      if (ageGroup === "18+") {
        if (needsWarning) {
          setPendingMovie({ movie: selectedMovie, services: [] });
          setShowAgeWarning(true);
          return;
        }
      } else if (needsWarning) {
        return loadMovie(); // auto-regenerate
      }

      setMovie(selectedMovie);
      const services = !selectedMovie.fallback
        ? await fetchWatchProviders(selectedMovie.id)
        : [];
      setProviders(services);
      setAnimateKey((prev) => prev + 1);
    } catch (err) {
      console.warn("Movie generation failed:", err.message);
      setError("No suitable movie found. Please adjust your preferences or try wildcard mode.");
    } finally {
      setTimeout(() => setShowProjector(false), 1000);
    }
  };

  useImperativeHandle(ref, () => ({
    regenerate: () => {
      loadMovie();
    },
  }));

  useEffect(() => {
    const checkPrefs = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.data();

      if (!data?.preferences) {
        setShowPreferencesModal(true);
      } else {
        setUserPrefs(data.preferences);
        setPreferencesLoaded(true);
      }

      setAgeGroup(data?.ageGroup || "18+");
    };

    checkPrefs();
  }, [user]);

  useEffect(() => {
    if (preferencesLoaded) loadMovie();
  }, [preferencesLoaded]);

  useEffect(() => {
    if (ratingStatus) {
      const timeout = setTimeout(() => setRatingStatus(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [ratingStatus]);

  const handleAgeWarningAccept = () => {
    setMovie(pendingMovie.movie);
    setProviders(pendingMovie.services || []);
    setShowAgeWarning(false);
    setPendingMovie(null);
    setTimeout(() => setShowProjector(false), 1000);
    setAnimateKey((prev) => prev + 1);
  };

  return (
    <>
      {showPreferencesModal && (
        <PreferencesModal
          onClose={() => {
            setShowPreferencesModal(false);
            setPreferencesLoaded(true);
          }}
        />
      )}

      {showAgeWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center text-center px-4">
          <div className="bg-white text-black p-6 rounded max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-red-600">⚠️ Age Restricted Content</h2>
            <p className="mb-4 text-sm">
              This movie may be rated R or contain content not suitable for viewers under 18.
              By continuing, you acknowledge you are 18+.
            </p>
            <button
              onClick={handleAgeWarningAccept}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              I'm 18+, Show the Movie
            </button>
          </div>
        </div>
      )}

      {showProjector && preferencesLoaded && (
        <div className="absolute top-[22%] left-1/2 transform -translate-x-1/2 z-10 w-[70%] h-[40%] bg-white/10 blur-2xl rounded-xl animate-projector" />
      )}

      {error && (
        <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 z-30 w-[90%] max-w-2xl bg-white text-black text-center p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold">😢 No Suitable Movie Found</h2>
          <p className="mt-2 text-sm">{error}</p>
          <button
            onClick={() => {
              setUserPrefs((prev) => ({ ...prev, wildcard: true }));
              setError(null);
              loadMovie();
            }}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded"
          >
            🎲 Try Wildcard Instead
          </button>
        </div>
      )}

      {movie && !error && preferencesLoaded && !showAgeWarning && (
        <div
          key={animateKey}
          className="absolute top-[33%] sm:top-[25.5%] xl:top-[14%] left-1/2 transform -translate-x-1/2 z-20 w-[95%] max-w-7xl px-4 text-white animate-fadeIn"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 justify-center">
            <img
              src={
                movie.poster_path?.startsWith("http")
                  ? movie.poster_path
                  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              }
              alt={movie.title}
              className="rounded shadow-lg w-44 sm:w-52 lg:w-64 xl:w-72 max-w-[300px]"
            />

            <div className="text-center md:text-left max-w-md">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-md">
                {movie.title}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg drop-shadow-sm leading-relaxed">
                {movie.overview}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                {providers.map((p) => (
                  <img
                    key={p.provider_id}
                    src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                    alt={p.provider_name}
                    title={p.provider_name}
                    className="w-8 h-8"
                  />
                ))}
              </div>

              {user && !movie.fallback && (
                <div className="mt-6 text-white text-center md:text-left">
                  <p className="text-sm md:text-base mb-2 font-semibold">
                    Already seen this movie? Did you enjoy it?
                  </p>
                  <div className="flex justify-center md:justify-start gap-6 text-2xl">
                    <button
                      onClick={() => {
                        saveMovieRating(user.uid, movie.id.toString(), {
                          title: movie.title,
                          liked: true,
                          poster_path: movie.poster_path,
                        });
                        setRatingStatus("👍 Thanks for your feedback!");
                      }}
                      className="hover:scale-125 transition-transform text-green-400"
                      title="I liked it!"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => {
                        saveMovieRating(user.uid, movie.id.toString(), {
                          title: movie.title,
                          liked: false,
                          poster_path: movie.poster_path,
                        });
                        setRatingStatus("👎 Thanks for your feedback!");
                      }}
                      className="hover:scale-125 transition-transform text-red-400"
                      title="I didn't like it"
                    >
                      👎
                    </button>
                  </div>
                  {ratingStatus && (
                    <p className="text-green-400 text-sm mt-3">{ratingStatus}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default MovieGenerator;
