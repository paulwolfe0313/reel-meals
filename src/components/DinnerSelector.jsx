import { useState, useEffect } from "react";
import { fetchRandomRecipe } from "../utils/recipes";

const DinnerSelector = () => {
  const [choice, setChoice] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Load collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reelmeals_dinner_collapsed");
    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  // Save collapse state to localStorage
  useEffect(() => {
    localStorage.setItem("reelmeals_dinner_collapsed", collapsed);
  }, [collapsed]);

  const handleDeliveryChoice = (option) => {
    setChoice("delivery");
    setPlatform(option);
    setRecipe(null);
    setCollapsed(false);
  };

  const handleRecipe = async () => {
    setChoice("recipe");
    setPlatform(null);
    setLoading(true);
    setCollapsed(false);
    try {
      const recipeData = await fetchRandomRecipe();
      setRecipe(recipeData);
    } catch (err) {
      console.error("Error fetching recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecipe = async () => {
    setLoading(true);
    try {
      const newRecipe = await fetchRandomRecipe();
      setRecipe(newRecipe);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const minimize = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setCollapsed(true);
      setAnimatingOut(false);
    }, 300);
  };

  if (collapsed) {
    return (
      <div className="bg-white/20 border border-white rounded-xl px-4 py-2 text-white text-sm shadow-lg animate-slideInUp">
        <button
          onClick={() => setCollapsed(false)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-3 py-1 rounded-full"
        >
          🍴 View Dinner
        </button>
      </div>
    );
  }

  return (
    <div
      className={`mt-8 p-6 bg-white/10 border border-white rounded-xl backdrop-blur-md shadow-xl text-white text-center w-full max-w-xl relative ${
        animatingOut ? "animate-slideOutDown" : "animate-slideInUp"
      }`}
    >
      <button
        onClick={minimize}
        className="absolute top-2 right-3 text-sm text-white hover:text-yellow-300"
        title="Minimize"
      >
        🔽
      </button>

      <h2 className="text-2xl font-bold mb-4 font-oldschool">🍽️ What’s for Dinner?</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handleRecipe}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-bold transition"
        >
          👩‍🍳 Recipe
        </button>
        <button
          onClick={() => setChoice("delivery")}
          className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded font-bold transition"
        >
          🚗 Delivery
        </button>
      </div>

      {choice === "delivery" && (
        <div className="mt-2">
          <h3 className="text-lg mb-2">Choose your platform:</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleDeliveryChoice("ubereats")}
              className="bg-green-400 hover:bg-green-500 px-3 py-1 rounded"
            >
              Uber Eats
            </button>
            <button
              onClick={() => handleDeliveryChoice("doordash")}
              className="bg-orange-400 hover:bg-orange-500 px-3 py-1 rounded"
            >
              DoorDash
            </button>
          </div>
        </div>
      )}

      {platform && (
        <p className="mt-4 text-sm">
          🍔 We’ll recommend something near you on <strong>{platform}</strong>!
        </p>
      )}

      {choice === "recipe" && (
        <div className="mt-4">
          {loading && <p className="text-sm italic">Cooking up something tasty...</p>}

          {recipe && (
            <div className="mt-4 bg-white/10 border border-white rounded-lg p-4 text-left shadow-md">
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full rounded-lg mb-3"
              />
              <p className="text-sm text-gray-300 mb-2 line-clamp-4">
                {recipe.summary.replace(/<\/?[^>]+(>|$)/g, "")}
              </p>
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:underline text-sm"
              >
                View Full Recipe →
              </a>

              <div className="mt-4 text-center">
                <button
                  onClick={handleNewRecipe}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-full"
                >
                  🎲 Suggest Another
                </button>
              </div>
            </div>
          )}

          {!recipe && !loading && (
            <p className="text-sm italic text-gray-300">
              🍝 A delicious recipe will be selected for you soon!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DinnerSelector;
