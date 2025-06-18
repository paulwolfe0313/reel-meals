import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { fetchRandomMovie, fetchWatchProviders } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { saveMovieRating } from "../utils/firestore";

const MovieGenerator = forwardRef((props, ref) => {
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState([]);
  const [showProjector, setShowProjector] = useState(true);
  const [ratingStatus, setRatingStatus] = useState("");
  const { user } = useAuth();

  const loadMovie = async () => {
    setShowProjector(true);
    setMovie(null);
    const selectedMovie = await fetchRandomMovie();
    const services = await fetchWatchProviders(selectedMovie.id);
    setMovie(selectedMovie);
    setProviders(services);
    setTimeout(() => setShowProjector(false), 2500);
  };

  useImperativeHandle(ref, () => ({
    regenerate: () => {
      loadMovie();
    },
  }));

  useEffect(() => {
    loadMovie();
  }, []);

  useEffect(() => {
    if (ratingStatus) {
      const timeout = setTimeout(() => setRatingStatus(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [ratingStatus]);

  return (
    <>
      {showProjector && (
        <div className="absolute top-[22%] left-1/2 transform -translate-x-1/2 z-10 w-[70%] h-[40%] bg-white/10 blur-2xl rounded-xl animate-pulse" />
      )}

      {movie && (
        <div className="absolute top-[33%] sm:top-[25.5%] xl:top-[14%] left-1/2 transform -translate-x-1/2 z-20 w-[95%] max-w-7xl px-4 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 justify-center">
            {/* Movie Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded shadow-lg w-44 sm:w-52 lg:w-64 xl:w-72 max-w-[300px]"
            />

            {/* Text + Providers */}
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

              {/* Thumbs Up/Down */}
              {user && (
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
                            liked: true,
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
