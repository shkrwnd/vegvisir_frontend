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

      // Redirect to dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed. Please try again.";
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
