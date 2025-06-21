import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const genreOptions = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
  { id: 12, name: "Adventure" },
];

const PreferencesModal = ({ onClose }) => {
  const { user } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ageRating, setAgeRating] = useState("PG-13");
  const [language, setLanguage] = useState("en");

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  };

  const handleSave = async () => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        preferences: {
          genres: selectedGenres,
          ageRating,
          language,
          wildcard: false,
        },
      },
      { merge: true }
    );
    onClose(); // close modal after saving
  };

  const handleWildcard = async () => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        preferences: { wildcard: true },
      },
      { merge: true }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded max-w-lg w-full text-black shadow-xl">
        <h2 className="text-2xl font-bold mb-4">🎯 Set Your Movie Preferences</h2>

        <div className="mb-4">
          <label className="font-semibold">Select up to 4 favorite genres:</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {genreOptions.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`border rounded px-3 py-1 ${
                  selectedGenres.includes(genre.id)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">Preferred age rating:</label>
          <select
            value={ageRating}
            onChange={(e) => setAgeRating(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="font-semibold block mb-1">Preferred language:</label>
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., en, es, fr"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleWildcard}
            className="text-sm text-gray-600 hover:underline"
          >
            🎲 Skip with Wildcard
          </button>
          <button
            onClick={handleSave}
            disabled={selectedGenres.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
