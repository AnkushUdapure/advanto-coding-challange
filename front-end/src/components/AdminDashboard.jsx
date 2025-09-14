import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [ setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  // Change password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

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

  // Add new store
const handleAddStore = async (e) => {
  e.preventDefault();
  setMessage("");

  //  Basic validation
  if (newStore.name.length < 2 || newStore.name.length > 60) {
    return setMessage("Store name must be between 2 and 60 characters ");
  }
  if (newStore.address.length > 400) {
    return setMessage("Address must be less than 400 characters ");
  }

  try {
    const res = await fetch("http://localhost:5000/admin/stores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newStore.name,
        owner_id: newStore.owner_id, // store owner (must exist in users table)
        email: newStore.email,
        address: newStore.address,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return setMessage(data.error || "Failed to add store ");
    }

    setMessage(" Store added successfully!");
    setNewStore({ name: "", owner_id: "", email: "", address: "" });
  } catch (err) {
    console.error(err);
    setMessage("Something went wrong while adding the store ");
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          Users: {stats.totalUsers}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Stores: {stats.totalStores}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Ratings: {stats.totalRatings}
        </div>
      </div>

      {/* Add user form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Add User</h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-2">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Address"
            value={newUser.address}
            onChange={(e) =>
              setNewUser({ ...newUser, address: e.target.value })
            }
            className="border p-2 rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Add
          </button>
        </form>
      </div>

      {/* Add store form */}
      {/* Add Store Form */}
      <div className="bg-white shadow rounded p-4 mt-6">
        <h3 className="text-lg font-semibold mb-3">Add New Store</h3>
        <form onSubmit={handleAddStore} className="space-y-3">
          <input
            type="text"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            placeholder="Store Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            value={newStore.owner_id}
            onChange={(e) =>
              setNewStore({ ...newStore, owner_id: Number(e.target.value) })
            }
            placeholder="Owner ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            value={newStore.email}
            onChange={(e) =>
              setNewStore({ ...newStore, email: e.target.value })
            }
            placeholder="Store Email"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={newStore.address}
            onChange={(e) =>
              setNewStore({ ...newStore, address: e.target.value })
            }
            placeholder="Store Address"
            className="w-full p-2 border rounded"
            rows="3"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Add Store
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      {/* User list */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">All Users</h3>
        <input
          placeholder="Search..."
          className="border p-2 rounded mb-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.address}</td>
                <td className="p-2 border">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
