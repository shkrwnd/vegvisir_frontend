/**
=========================================================
* useAnalytics Hook
=========================================================
* Custom hook for fetching analytics data
*/

import { useState, useEffect } from "react";
import { analyticsAPI } from "../api";

export const useAnalytics = (params = {}) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getDashboardData(params);
      setAnalytics(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch analytics");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const refetch = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refetch,
  };
};
