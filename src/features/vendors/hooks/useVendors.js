/**
=========================================================
* useVendors Hook
=========================================================
* Custom hook for fetching and managing vendors
*/

import { useState, useEffect } from "react";
import { vendorAPI } from "../api";

export const useVendors = (category = null, activeOnly = true) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        active_only: activeOnly,
      };
      if (category) {
        params.category = category;
      }

      const response = await vendorAPI.getAll(params);
      setVendors(response.data || []);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch vendors";
      setError(errorMessage);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [category, activeOnly]);

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendors,
  };
};
