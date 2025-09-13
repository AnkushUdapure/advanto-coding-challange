import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import StoreOwnerDashboard from "./components/StoreOwnerDashboard";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import { AuthContext } from "./contexts/AuthContext"; // make sure path is correct
// import Navbar from "./components/Navbar";

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useContext(AuthContext);

  // If no user logged in → show Login/Signup toggle
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

        <h1 className="text-4xl font-bold mb-6">Store Ratings</h1>
        {/* <Navbar/> */}

        {!showSignup ? (
          <>
            <Login />
            <p className="mt-4 text-sm">
              Don’t have an account?{" "}
              <button
                onClick={() => setShowSignup(true)}
                className="text-blue-600 hover:underline"
              >
                Create New Account
              </button>
            </p>
          </>
        ) : (
          <>
            <Signup />
            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setShowSignup(false)}
                className="text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>
      
    );
  }
  

  // If user is logged in → role-based dashboard
 if (user.role === "ADMIN") return <AdminDashboard />;
 if (user.role === "OWNER") return <StoreOwnerDashboard />;
 if (user.role === "USER") return <UserDashboard />;

  return <div>Unknown role: {user.role}</div>;
}

export default App;
