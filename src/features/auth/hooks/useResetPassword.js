/**
=========================================================
* useResetPassword Hook
=========================================================
* Custom hook for handling password reset
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { ROUTES } from "core/config";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      await authAPI.resetPassword({
        token,
        new_password: newPassword,
      });

      // Redirect to login after successful password reset
      navigate(ROUTES.LOGIN);

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    loading,
    error,
  };
};
