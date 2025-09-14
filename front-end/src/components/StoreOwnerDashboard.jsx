import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StoreOwnerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch ratings for this owner's store(s)
  useEffect(() => {
    async function fetchRatings() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/owner/ratings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRatings(data);
      } catch (err) {
        console.error("Failed to load ratings", err);
      }
    }
    fetchRatings();
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

  // Compute average rating per store
  const averageRatings = ratings.reduce((acc, r) => {
    if (!acc[r.store_id])
      acc[r.store_id] = { total: 0, count: 0, name: r.store_name };
    acc[r.store_id].total += r.rating;
    acc[r.store_id].count += 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
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
      </div>

      {/* Ratings list */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">
          User Ratings for Your Stores
        </h3>
        {ratings.length === 0 ? (
          <p>No ratings yet.</p>
        ) : (
          <ul className="space-y-2">
            {ratings.map((r) => (
              <li key={r.id} className="p-2 border rounded">
                <p>
                  <strong>User:</strong> {r.user_name} ({r.user_email})
                </p>
                <p>
                  <strong>Store:</strong> {r.store_name}
                </p>
                <p>
                  <strong>Rating:</strong> {r.rating}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Average ratings */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Average Ratings</h3>
        {Object.keys(averageRatings).length === 0 ? (
          <p>No data available</p>
        ) : (
          <ul>
            {Object.values(averageRatings).map((s, i) => (
              <li key={i} className="p-2 border rounded mb-2">
                {s.name} → {(s.total / s.count).toFixed(2)} / 5 ⭐
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
