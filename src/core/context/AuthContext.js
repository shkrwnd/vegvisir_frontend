/**
=========================================================
* Authentication Context
=========================================================
* Global authentication state management using React Context
*/

import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import { STORAGE_KEYS } from "../config";
import { isTokenValid } from "../utils/tokenUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage immediately to prevent flash of logout
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      // Check if token exists and is valid
      if (token && savedUser) {
        if (isTokenValid(token)) {
          return JSON.parse(savedUser);
        } else {
          // Token is expired, clear storage
          console.warn("Token expired on init, clearing auth state");
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    } catch (error) {
      console.error("Error parsing user data on init:", error);
      // Clear potentially corrupted data
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && savedUser) {
      // Validate token expiration
      if (isTokenValid(token)) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
          // Clear corrupted data
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      } else {
        // Token is expired, clear auth state
        console.warn("Token expired, clearing auth state");
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } else if (!token) {
      // If token is missing, clear user state
      setUser(null);
      // Also clear user data if token is missing
      if (savedUser) {
        localStorage.removeItem(STORAGE_KEYS.USER);
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

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
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
