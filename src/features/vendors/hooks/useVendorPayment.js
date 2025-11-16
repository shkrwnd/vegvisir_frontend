/**
=========================================================
* useVendorPayment Hook
=========================================================
* Custom hook for creating payments to vendors
*/

import { useState } from "react";
import { vendorAPI } from "../api";

export const useVendorPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await vendorAPI.createPayment(paymentData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Failed to create payment";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
    error,
  };
};
