import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
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

      {/* Profile section */}
      {userProfile && (
        <div className="bg-white shadow rounded p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Profile Details</h3>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Role:</strong> {userProfile.role}
          </p>
          <p>
            <strong>Address:</strong> {userProfile.address || "N/A"}
          </p>
        </div>
      )}

      {/* Store search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Store list */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Stores</h3>
        {filteredStores.length === 0 ? (
          <p>No stores found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredStores.map((store) => (
              <li
                key={store.id}
                className="p-2 border rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{store.name}</p>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <p className="text-sm">Rating: {store.rating || "N/A"}</p>
                </div>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
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
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-72 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Rate Store
            </h3>

            {/* Stars */}
            <div className="flex justify-center mb-4 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= (hoverValue || ratingValue) ? "gold" : "gray"}
                  className="w-8 h-8 cursor-pointer transition-transform transform hover:scale-110"
                  onMouseEnter={() => setHoverValue(star)}
                  onMouseLeave={() => setHoverValue(0)}
                  onClick={() => setRatingValue(star)}
                >
                  <path d="M12 .587l3.668 7.568L24 9.75l-6 5.849L19.336 24 12 19.897 4.664 24 6 15.599 0 9.75l8.332-1.595z" />
                </svg>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={() => setRatingModal({ open: false, storeId: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
