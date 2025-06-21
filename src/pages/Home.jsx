import { useEffect, useRef } from "react";
import MovieGenerator from "../components/MovieGenerator";
import DinnerSelector from "../components/DinnerSelector";
import AuthModal from "../components/AuthModal";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const movieRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    const audio = new Audio("/assets/public/drivein-ambience.mp3");
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch((e) => console.log("Audio autoplay blocked", e));
  }, []);

  const handleRegenerate = () => {
    movieRef.current?.regenerate();
  };
  useEffect(() => {
  const handleGenerate = () => {
    movieRef.current?.regenerate();
  };
  window.addEventListener("generate-new-movie", handleGenerate);
  return () => window.removeEventListener("generate-new-movie", handleGenerate);
}, []);


  return (
    <div className="relative min-h-screen font-oldschool bg-black text-white overflow-hidden">
      <NavBar />
      {!user && <AuthModal />}
      <img
        src="/assets/bg-reelmeals.png"
        alt="Drive-in"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <MovieGenerator ref={movieRef} />
      <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 z-20">
        <DinnerSelector />
      </div>
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={handleRegenerate}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded shadow-lg"
        >
          🎲 Generate New Movie
        </button>
      </div>
    </div>
  );
};

export default Home;
