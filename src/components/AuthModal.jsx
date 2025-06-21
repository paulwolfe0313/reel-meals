import { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const AuthModal = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageGroup, setAgeGroup] = useState("18+");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Save age group at signup
        await setDoc(doc(db, "users", cred.user.uid), {
          ageGroup,
        }, { merge: true });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 max-w-md w-full text-black shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLogin && (
          <div className="mb-4">
            <label className="text-sm font-semibold block mb-1">Select Your Age Group:</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="under-13">Under 13</option>
              <option value="13-17">13–17</option>
              <option value="18+">18+</option>
            </select>
            <p className="text-xs mt-1 text-gray-500 italic">
              This cannot be changed later.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-700 mt-4 text-center cursor-pointer hover:underline"
        >
          {isLogin ? "Need an account? Sign Up" : "Have an account? Sign In"}
        </p>
      </form>
    </div>
  );
};

export default AuthModal;
