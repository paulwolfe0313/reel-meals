import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import PreferencesModal from "../components/PreferencesModal";

const MyAccount = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [showPrefsEditor, setShowPrefsEditor] = useState(false);

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword(user, newPassword);
      setStatus("✅ Password updated successfully.");
      setNewPassword("");
    } catch (error) {
      setStatus(`❌ ${error.message}`);
    }
  };

  const handleAddressSave = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), { address }, { merge: true });
      setStatus("✅ Address saved.");
    } catch (error) {
      setStatus(`❌ ${error.message}`);
    }
  };

  if (!user) return <p className="text-white p-6">Loading user...</p>;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-black text-white p-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Update Password</h2>
          <input
            type="password"
            placeholder="New Password"
            className="p-2 w-full text-black rounded mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
          >
            Update Password
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Address</h2>
          <input
            type="text"
            placeholder="123 Reel Street, Movietown"
            className="p-2 w-full text-black rounded mb-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            onClick={handleAddressSave}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Address
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate("/my-ratings")}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            🎞️ View My Ratings
          </button>
        </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Movie Preferences</h2>
                <button
                    onClick={() => setShowPrefsEditor(true)}
                    className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600"
                >
                    Edit Preferences
                </button>
                </div>

                {showPrefsEditor && (
                <PreferencesModal isEdit={true} onClose={() => setShowPrefsEditor(false)} />
                )}

        {status && <p className="mt-4 text-sm text-green-400">{status}</p>}
      </div>
    </>
  );
};

export default MyAccount;
