import React, { useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login: store user + token
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token); // or sessionStorage
  };

  // Logout: clear user + token
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // clear JWT
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
