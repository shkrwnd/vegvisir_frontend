/**
=========================================================
* Authentication Context
=========================================================
* Global authentication state management using React Context
*/

import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import { STORAGE_KEYS } from "../config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
