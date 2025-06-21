const SPOONACULAR_BASE = "https://api.spoonacular.com";
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

/**
 * Get a random recipe
 */
export const fetchRandomRecipe = async () => {
  const res = await fetch(
    `${SPOONACULAR_BASE}/recipes/random?apiKey=${API_KEY}&number=1`
  );
  const data = await res.json();
  return data.recipes?.[0];
};
