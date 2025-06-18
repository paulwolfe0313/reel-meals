import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";

const MyRatings = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatings = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "ratings", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRatings(docSnap.data());
        } else {
          setRatings({});
        }
      } catch (error) {
        console.error("Failed to load ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [user]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">🎞️ My Ratings</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading your rated movies...</p>
        ) : Object.keys(ratings).length === 0 ? (
          <p className="text-center text-gray-400">You haven't rated any movies yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(ratings).map(([movieId, data]) => (
              <div
                key={movieId}
                className="bg-white text-black rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                {data.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
                    alt={data.title}
                    className="rounded w-full max-h-[300px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center text-xl text-gray-600">
                    🎬 No Poster
                  </div>
                )}
                <h2 className="mt-4 text-xl font-semibold text-center">{data.title}</h2>
                <p className="text-sm mt-2 text-gray-700">
                  You {data.liked ? "👍 liked" : "👎 disliked"} this movie.
                </p>
                {data.timestamp && (
                  <p className="text-xs mt-1 text-gray-500">
                    Rated on {new Date(data.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyRatings;
