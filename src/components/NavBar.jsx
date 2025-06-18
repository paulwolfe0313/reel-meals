import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center shadow-md z-40 relative">
      <Link to="/" className="text-2xl font-oldschool text-yellow-400">
        🎬 Reel Meals
      </Link>

      {user ? (
        <div className="flex items-center gap-6">
          <Link to="/account" className="hover:text-yellow-300">
            My Account
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
          >
            Log Out
          </button>
        </div>
      ) : (
        <span className="text-sm italic text-gray-400">
          Not signed in
        </span>
      )}
    </nav>
  );
};

export default NavBar;
