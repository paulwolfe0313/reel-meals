import MovieGenerator from "./components/MovieGenerator";
import DinnerSelector from "./components/DinnerSelector";
import FooterCars from "./components/FooterCars";

function App() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-between">
      <main className="flex flex-col items-center pt-12 px-4">
        <h1 className="text-4xl font-bold mb-6">🎬 Reel Meals</h1>
        <MovieGenerator />
        <DinnerSelector />
      </main>
      <FooterCars />
    </div>
  );
}

export default App;
