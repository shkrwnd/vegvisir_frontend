/**
=========================================================
* useLogin Hook
=========================================================
* Custom hook for handling user login
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "core/context";
import { ROUTES } from "core/config";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(credentials);
      const { user, token } = response.data;

      // Update auth context
      setAuthUser(user, token);

      // Log successful login for debugging
      console.log("Login successful, navigating to:", ROUTES.HOME);
      console.log("User data:", user);

      // Use setTimeout to ensure state updates complete before navigation
      // This prevents race conditions during route transition
      setTimeout(() => {
        try {
          console.log("Attempting navigation to:", ROUTES.HOME);
          navigate(ROUTES.HOME, { replace: true });
        } catch (navError) {
          console.error("Navigation error:", navError);
          // Fallback: use window.location if navigate fails
          window.location.href = ROUTES.HOME;
        }
      }, 0);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed. Please try again.";
      console.error("Login error:", err);
      console.error("Login error message:", errorMessage);
      console.error("Login error response:", err.response?.data);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};
