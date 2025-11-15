/**
=========================================================
* useRegister Hook
=========================================================
* Custom hook for handling user registration
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "core/context";
import { ROUTES } from "core/config";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      // Update auth context
      setAuthUser(user, token);

      // Redirect to home
      navigate(ROUTES.HOME);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed. Please try again.";
      console.error("Registration error:", err);
      console.error("Registration error message:", errorMessage);
      console.error("Registration error response:", err.response?.data);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
};
