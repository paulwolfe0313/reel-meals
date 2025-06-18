const Screen = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="w-full max-w-2xl bg-gray-800 p-4 rounded shadow-xl border-4 border-white">
      <h1 className="text-white text-2xl font-bold mb-2">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full max-h-[400px] object-contain rounded"
      />
      <p className="text-white mt-2">{movie.overview}</p>
    </div>
  );
};

export default Screen;
