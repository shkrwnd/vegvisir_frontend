import { useState, useCallback } from "react";
import { donationAPI } from "../api";

export const useDonations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeDonation = useCallback(async (amount, description = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await donationAPI.makeDonation({
        amount: parseFloat(amount),
        description: description.trim() || undefined,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to make donation. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDonationBox = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await donationAPI.getDonationBox();
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to fetch donation box information.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    makeDonation,
    getDonationBox,
    loading,
    error,
    setError,
  };
};
