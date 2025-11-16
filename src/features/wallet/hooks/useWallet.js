/**
=========================================================
* useWallet Hook
=========================================================
* Custom hook for fetching and managing wallet (Flex Dollars)
*/

import { useState, useEffect } from "react";
import { walletAPI } from "../api";

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletAPI.getBalance();

      console.log("Wallet API Response:", response);
      console.log("Wallet Data:", response.data);

      setWallet(response.data);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      console.error("Error response:", err.response);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch wallet balance";
      console.error("Error message:", errorMessage);
      setError(errorMessage);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const loadMoney = async (amount, cardId) => {
    try {
      const response = await walletAPI.loadMoney({ amount, card_id: cardId });
      // Update wallet state immediately if response contains wallet data
      if (response.data && response.data.balance !== undefined) {
        setWallet(response.data);
      }
      // Also refetch to ensure we have the latest data
      await fetchBalance();
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to load money",
      };
    }
  };

  return {
    wallet,
    balance: wallet?.balance || 0,
    loading,
    error,
    refetch: fetchBalance,
    loadMoney,
  };
};
