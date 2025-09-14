import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StoreOwnerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch only this owner's stores with average ratings
  useEffect(() => {
    async function fetchOwnerStores() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          "http://localhost:5000/stores/owner/my-stores",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch owner stores");

        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error("Failed to load owner stores:", err);
      }
    }

    fetchOwnerStores();
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.error || "Failed to update password");

      setMessage("Password updated successfully ✅");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user?.name || "Owner"}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Password modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-72">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Update
                </button>
              </div>
            </form>
            {message && (
              <p className="mt-2 text-sm text-green-600">{message}</p>
            )}
          </div>
        </div>
      )}

      {/* Store List with average ratings */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          My Stores
        </h3>
        {stores.length === 0 ? (
          <p className="text-gray-600">No stores found.</p>
        ) : (
          <ul className="space-y-3">
            {stores.map((store) => (
              <li
                key={store.id}
                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{store.name}</p>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <p className="text-sm text-gray-700">
                    Avg Rating:{" "}
                    <span className="font-medium">{store.rating || "N/A"}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
