import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  // This will dispatch a custom event to tell Home to generate a new movie
  const triggerMovieGeneration = () => {
    window.dispatchEvent(new Event("generate-new-movie"));
  };

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center shadow-md z-40 relative">
      <Link to="/" className="text-2xl font-oldschool text-yellow-400">
        🎬 Reel Meals
      </Link>

      <div className="flex items-center gap-4">
        {location.pathname === "/" && (
          <button
            onClick={triggerMovieGeneration}
            className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-500"
          >
            🎲 Generate Movie
          </button>
        )}

        {user ? (
          <>
            <Link to="/account" className="hover:text-yellow-300">
              My Account
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
            >
              Log Out
            </button>
          </>
        ) : (
          <span className="text-sm italic text-gray-400">Not signed in</span>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
