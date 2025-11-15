/**
=========================================================
* useForgotPassword Hook
=========================================================
* Custom hook for handling forgot password requests
*/

import { useState } from "react";
import { authAPI } from "../api";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetToken, setResetToken] = useState(null);

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      setResetToken(null);

      const response = await authAPI.forgotPassword({ email });

      // API response structure: { message, reset_token, expires_at }
      // In development, the token is returned in the response
      // In production, it would be sent via email
      const token = response.data?.reset_token || null;
      setResetToken(token);

      return { success: true, token };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send password reset email. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    forgotPassword,
    loading,
    error,
    resetToken,
  };
};
