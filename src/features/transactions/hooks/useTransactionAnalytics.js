/**
=========================================================
* useTransactionAnalytics Hook
=========================================================
* Custom hook for fetching transaction analytics
*/

import { useState, useCallback } from "react";
import { transactionAPI } from "../api";

export const useTransactionAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionAPI.getAnalytics(params);
      setAnalytics(response.data);
    } catch (err) {
      console.error("Error fetching transaction analytics:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch analytics";
      setError(errorMessage);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};
