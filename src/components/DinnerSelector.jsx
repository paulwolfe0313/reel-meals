import { useState } from "react";

const DinnerSelector = () => {
  const [choice, setChoice] = useState(null);
  const [platform, setPlatform] = useState(null);

  const handleDeliveryChoice = (option) => {
    setChoice("delivery");
    setPlatform(option);
  };

  const handleRecipe = () => {
    setChoice("recipe");
  };

  return (
    <div className="mt-8 p-4 bg-white bg-opacity-10 border border-white rounded w-full max-w-xl text-white text-center">
      <h2 className="text-2xl font-semibold mb-4">🍽️ What’s for Dinner?</h2>
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handleRecipe}
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-bold"
        >
          👩‍🍳 Recipe
        </button>
        <button
          onClick={() => setChoice("delivery")}
          className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded font-bold"
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

      {choice === "recipe" && (
        <p className="mt-4">🍝 A delicious recipe will be selected for you soon!</p>
      )}

      {platform && (
        <p className="mt-4">
          🍔 We’ll recommend something near you on <strong>{platform}</strong>!
        </p>
      )}
    </div>
  );
};

export default DinnerSelector;
