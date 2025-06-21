import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const genreOptions = [
  { id: 28, name: "Action", icon: "💥" },
  { id: 12, name: "Adventure", icon: "🧭" },
  { id: 16, name: "Animation", icon: "🎨" },
  { id: 35, name: "Comedy", icon: "😂" },
  { id: 80, name: "Crime", icon: "🕵️" },
  { id: 99, name: "Documentary", icon: "🎬" },
  { id: 18, name: "Drama", icon: "🎭" },
  { id: 10751, name: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: 14, name: "Fantasy", icon: "🧚" },
  { id: 36, name: "History", icon: "📜" },
  { id: 27, name: "Horror", icon: "👻" },
  { id: 10402, name: "Music", icon: "🎵" },
  { id: 9648, name: "Mystery", icon: "🧩" },
  { id: 10749, name: "Romance", icon: "❤️" },
  { id: 878, name: "Sci-Fi", icon: "👽" },
  { id: 10770, name: "TV Movie", icon: "📺" },
  { id: 53, name: "Thriller", icon: "🔪" },
  { id: 10752, name: "War", icon: "⚔️" },
  { id: 37, name: "Western", icon: "🤠" },
];


const PreferencesModal = ({ onClose, isEdit = false }) => {
  const { user } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [language, setLanguage] = useState("en");
  const [wildcard, setWildcard] = useState(false);
  const [ageGroup, setAgeGroup] = useState("18+");

 useEffect(() => {
  const loadUserInfo = async () => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const data = snap.data();
    const prefs = data?.preferences;

    if (prefs && isEdit) {
      setSelectedGenres(prefs.genres || []);
      setLanguage(prefs.language || "en");
      setWildcard(prefs.wildcard || false);
    } else if (!isEdit) {
      const saved = JSON.parse(localStorage.getItem("reelmeals_prefs_temp"));
      if (saved) {
        setSelectedGenres(saved.genres || []);
        setLanguage(saved.language || "en");
        setWildcard(saved.wildcard || false);
      }
    }

    setAgeGroup(data?.ageGroup || "18+");
  };

  loadUserInfo();
}, [isEdit, user]);

useEffect(() => {
  if (!isEdit) {
    const data = {
      genres: selectedGenres,
      language,
      wildcard,
    };
    localStorage.setItem("reelmeals_prefs_temp", JSON.stringify(data));
  }
}, [selectedGenres, language, wildcard, isEdit]);



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
          language,
          wildcard,
        },
      },
      { merge: true }
    );
    localStorage.removeItem("reelmeals_prefs_temp");
    onClose();
  };

  const toggleWildcard = () => {
    setWildcard(!wildcard);
  };

  // 🔒 Filter genres by age group
  const getAllowedGenres = () => {
    if (ageGroup === "under-13") {
      return genreOptions.filter((g) =>
        ["Animation", "Family", "Comedy", "Adventure", "Fantasy", "Music"].includes(g.name)
      );
    }
    if (ageGroup === "13-17") {
      return genreOptions.filter((g) =>
        !["Horror", "Thriller", "War", "Western", "Crime"].includes(g.name)
      );
    }
    return genreOptions; // 18+ gets all
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded max-w-lg w-full text-black shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          {isEdit ? "✏️ Edit Movie Preferences" : "🎯 Set Your Movie Preferences"}
        </h2>

        <div className="mb-4">
          <label className="font-semibold">Select up to 4 favorite genres:</label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-scroll pr-1">
            {getAllowedGenres().map((genre) => (
                <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`border rounded px-3 py-1 text-sm ${
                    selectedGenres.includes(genre.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                >
                    {genre.icon} {genre.name}
                </button>
                ))}

          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">Preferred language:</label>
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., en, es, fr"
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={wildcard}
            onChange={toggleWildcard}
          />
          <span className="text-sm">
            Use Wildcard (fully random movies, preferences ignored)
          </span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
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
