import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Users, Store, Star, UserPlus } from "lucide-react";

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  // const [ setStores] = useState([]);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  // Change password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [showUsers, setShowUsers] = useState(false);
  const [showStores, setShowStores] = useState(false);

  // Add user/store form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  // const [newStore, setNewStore] = useState({
  //   name: "",
  //   address: "",
  // });

  const [newStore, setNewStore] = useState({
    name: "",
    owner_id: "",
    email: "",
    address: "",
  });

  // const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch admin profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        setProfile(await res.json());
      } catch (err) {
        console.error("Failed to load profile:", err);
        navigate("/");
      }
    }
    fetchProfile();
  }, [navigate, token]);

  // Fetch stores
  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch("http://localhost:5000/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(await res.json());
      } catch (err) {
        console.error("Failed to load stores", err);
      }
    }
    fetchStores();
  }, [setStores, token]);

  // Fetch users (admin API)
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:5000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(await res.json());
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }
    fetchUsers();
  }, [token]);

  // Fetch stats (admin API)
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:5000/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(await res.json());
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    fetchStats();
  }, [token]);

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
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

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Failed to add user");
      alert("User added!");
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // your auth token
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
        return;
      }

      // Remove user from state
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the user");
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      const res = await fetch(`http://localhost:5000/stores/${storeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete store");
        return;
      }

      setStores((prev) => prev.filter((s) => s.id !== storeId));
    } catch (err) {
      console.error("Error deleting store:", err);
      alert("Something went wrong while deleting the store");
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (newStore.name.length < 2 || newStore.name.length > 60) {
      return setMessage("Store name must be between 2 and 60 characters");
    }
    if (newStore.address.length > 400) {
      return setMessage("Address must be less than 400 characters");
    }
    if (!newStore.email) {
      return setMessage("Owner email is required");
    }

    try {
      // Step 1: Fetch owner ID by email
      // Fetch owner by email
      const ownerRes = await fetch(
        `http://localhost:5000/admin/users?email=${encodeURIComponent(
          newStore.email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ownerData = await ownerRes.json();

      // Check if the response is an array
      const owner = Array.isArray(ownerData) ? ownerData[0] : ownerData;

      if (!owner || !owner.id) {
        return setMessage("Owner with this email not found");
      }

      const owner_id = owner.id;

      // Step 2: Add the store
      const res = await fetch("http://localhost:5000/admin/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStore.name,
          owner_id, // automatically fetched owner ID
          email: newStore.email,
          address: newStore.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setMessage(data.error || "Failed to add store");
      }

      setMessage("Store added successfully!");
      setNewStore({ name: "", owner_id: "", email: "", address: "" });
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while adding the store");
    }
  };

  // Filters
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.address.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {profile?.name}</h2>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Users */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="bg-white/20 p-3 rounded-full">
            <Users size={28} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm opacity-80">Users</p>
          </div>
        </div>

        {/* Stores */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="bg-white/20 p-3 rounded-full">
            <Store size={28} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalStores}</p>
            <p className="text-sm opacity-80">Stores</p>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="bg-white/20 p-3 rounded-full">
            <Star size={28} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalRatings}</p>
            <p className="text-sm opacity-80">Ratings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Add User */}
        {/* Add User Card */}
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
            Add User
          </h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              placeholder="Address"
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none col-span-2"
            >
              <option value="user">User</option>
              <option value="OWNER">Owner</option>
              <option value="admin">Admin</option>
            </select>

            {/* Buttons row */}
            <div className="col-span-2 flex justify-center gap-3">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={20} />
                Add User
              </button>
              <button
                type="button"
                onClick={() => setShowUsers(!showUsers)}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Users size={20} />
                {showUsers ? "Hide Users" : "Show Users"}
              </button>
            </div>
          </form>
        </div>

        {/* Add Store */}
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
            Add Store
          </h3>
          <form onSubmit={handleAddStore} className="space-y-4">
            <input
              type="text"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              placeholder="Store Name"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="number"
              value={newStore.owner_id}
              onChange={(e) =>
                setNewStore({ ...newStore, owner_id: Number(e.target.value) })
              }
              placeholder="Owner ID"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="email"
              value={newStore.email}
              onChange={(e) =>
                setNewStore({ ...newStore, email: e.target.value })
              }
              placeholder="Store Email"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <textarea
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
              placeholder="Store Address"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="3"
              required
            ></textarea>
            <div className="flex justify-center gap-3">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Store size={20} />
                Add Store
              </button>
              <button
                type="button"
                onClick={() => setShowStores(!showStores)}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Store size={20} />
                {showStores ? "Hide Stores" : "Show Stores"}
              </button>
            </div>
          </form>
          {message && (
            <p className="mt-3 text-sm font-medium text-green-600">{message}</p>
          )}
        </div>
      </div>
      {/* Show stores*/}
      {showStores && (
        <div className="mt-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold mb-3 text-gray-800">All Stores</h3>
          {stores.length === 0 ? (
            <p className="text-gray-600">No stores available.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Address</th>
                    <th className="p-3 text-left">Rating</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr
                      key={store.id}
                      className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition"
                    >
                      <td className="p-3">{store.name}</td>
                      <td className="p-3">{store.email}</td>
                      <td className="p-3">{store.address}</td>
                      <td className="p-3">{store.rating || "N/A"}</td>
                      <td className="p-3 text-center">
                        <button
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Show Users Table */}
      {showUsers && (
        <div className="mt-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold mb-3 text-gray-800">All Users</h3>

          {/* Search */}
          <input
            placeholder="Search..."
            className="border border-gray-300 p-2 rounded-lg mb-4 w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Table */}
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white sticky top-0">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.address}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3 text-center">
                      <button
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password change modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
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
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
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
  );
}
