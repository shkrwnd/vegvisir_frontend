/**
=========================================================
* useBudgets Hook
=========================================================
* Custom hook for fetching and managing budgets with tracking
*/

import { useState, useEffect } from "react";
import { budgetAPI } from "../api";

export const useBudgets = (includeTracking = true) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = includeTracking
        ? await budgetAPI.getAllWithTracking()
        : await budgetAPI.getAll();

      console.log("Budgets API Response:", response);
      console.log("Budgets Data:", response.data);

      const budgetsData = response.data || [];
      console.log("Setting budgets:", budgetsData);
      setBudgets(budgetsData);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      console.error("Error response:", err.response);
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch budgets";
      console.error("Error message:", errorMessage);
      setError(errorMessage);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [includeTracking]);

  const createBudget = async (budgetData) => {
    try {
      const response = await budgetAPI.create(budgetData);
      await fetchBudgets(); // Refresh the list
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create budget",
      };
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      const response = await budgetAPI.update(id, budgetData);
      await fetchBudgets(); // Refresh the list
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update budget",
      };
    }
  };

  const deleteBudget = async (id) => {
    try {
      // Delete endpoint returns 204 No Content (no response body)
      await budgetAPI.delete(id);
      await fetchBudgets(); // Refresh the list
      return { success: true };
    } catch (err) {
      // Handle 204 as success (some axios versions might throw on 204)
      if (err.response?.status === 204) {
        await fetchBudgets();
        return { success: true };
      }
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Failed to delete budget",
      };
    }
  };

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
};
