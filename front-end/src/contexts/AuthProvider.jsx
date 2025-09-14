import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Restore user on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login: store user + token
  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout: clear user + token
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
