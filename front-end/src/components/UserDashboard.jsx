import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { logout } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null); //added for userDetails
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingModal, setRatingModal] = useState({
    open: false,
    storeId: null,
  });
  const [ratingValue, setRatingValue] = useState(5);
  const [hoverValue, setHoverValue] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUserProfile(data); // only update local state
      } catch (err) {
        console.error("Failed to load profile:", err);
        navigate("/"); // redirect to login if profile fetch fails
      }
    }

    fetchProfile();
  }, [navigate]);

  // Example: fetch store list (replace with real backend API)
  useEffect(() => {
    async function fetchStores() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error("Failed to load stores", err);
      }
    }
    fetchStores();
  }, []);

  // Open rating modal
  const openRatingModal = (storeId) => {
    setRatingModal({ open: true, storeId });
    setRatingValue(5); // default rating
  };

  // Submit rating
  const submitRating = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/stores/${ratingModal.storeId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ stars: ratingValue }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit rating");

      alert("Rating submitted!");
      setRatingModal({ open: false, storeId: null });

      // Refresh stores to update average rating
      const storesRes = await fetch("http://localhost:5000/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const storesData = await storesRes.json();
      setStores(storesData);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
    }
  };

  // Filter stores by search input
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

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

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Welcome, {userProfile?.name}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="px-5 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 shadow-md transition transform hover:scale-105"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-md transition transform hover:scale-105"
          >
            Logout
          </button>
        </div>

        {passwordModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-6 w-80 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800 border-b pb-2">
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                    onClick={() => setPasswordModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
              {message && (
                <p className="mt-3 text-sm text-green-600 text-center">
                  {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile section */}
      {userProfile && (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition">
          <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            Profile Details
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-gray-700">
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p>
              <strong>Role:</strong> {userProfile.role}
            </p>
            <p className="col-span-2">
              <strong>Address:</strong> {userProfile.address || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Store search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
      </div>

      {/* Store list */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Stores
        </h3>
        {filteredStores.length === 0 ? (
          <p className="text-gray-600">No stores found.</p>
        ) : (
          <ul className="space-y-3">
            {filteredStores.map((store) => (
              <li
                key={store.id}
                className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{store.name}</p>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <p className="text-sm text-gray-700">
                    Rating:{" "}
                    <span className="font-medium">{store.rating || "N/A"}</span>
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-md"
                  onClick={() => openRatingModal(store.id)}
                >
                  Rate
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal.open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-6 w-80 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800 border-b pb-2">
              Rate Store
            </h3>

            {/* Stars */}
            <div className="flex justify-center mb-6 space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    star <= (hoverValue || ratingValue) ? "gold" : "lightgray"
                  }
                  className="w-8 h-8 cursor-pointer transition-transform transform hover:scale-125"
                  onMouseEnter={() => setHoverValue(star)}
                  onMouseLeave={() => setHoverValue(0)}
                  onClick={() => setRatingValue(star)}
                >
                  <path d="M12 .587l3.668 7.568L24 9.75l-6 5.849L19.336 24 12 19.897 4.664 24 6 15.599 0 9.75l8.332-1.595z" />
                </svg>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setRatingModal({ open: false, storeId: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                onClick={submitRating}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
