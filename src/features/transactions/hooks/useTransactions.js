/**
=========================================================
* useTransactions Hook
=========================================================
* Custom hook for fetching transactions with filters
*/

import { useState, useEffect, useCallback } from "react";
import { transactionAPI } from "../api";

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        skip: filters.skip || 0,
        limit: filters.limit || 50,
        ...(filters.category && { category: filters.category }),
        ...(filters.start_date && { start_date: filters.start_date }),
        ...(filters.end_date && { end_date: filters.end_date }),
      };

      const response = await transactionAPI.getAll(params);

      console.log("Transactions API Response:", response);
      console.log("Transactions Data:", response.data);

      setTransactions(response.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      console.error("Error response:", err.response);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch transactions";
      console.error("Error message:", errorMessage);
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions({ skip: 0, limit: 50 });
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
