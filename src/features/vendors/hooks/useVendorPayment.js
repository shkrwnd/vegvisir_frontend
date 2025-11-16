/**
=========================================================
* useVendorPayment Hook
=========================================================
* Custom hook for creating payments to vendors
*/

import { useState } from "react";
import { vendorAPI } from "../api";

/**
 * Converts error detail to a readable string
 * Handles strings, arrays of validation errors, and objects
 */
const formatErrorDetail = (detail) => {
  if (!detail) return "Failed to create payment";

  // If it's already a string, return it
  if (typeof detail === "string") {
    return detail;
  }

  // If it's an array of validation errors (Pydantic format)
  if (Array.isArray(detail)) {
    return detail
      .map((err) => {
        // Handle error objects with msg property
        if (err && typeof err === "object") {
          const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : "field";
          const message = err.msg || "Invalid value";
          return `${field}: ${message}`;
        }
        // Handle string errors in array
        return String(err);
      })
      .join(", ");
  }

  // If it's an object, try to extract a message
  if (typeof detail === "object") {
    // Check for common error message properties
    if (detail.msg) return detail.msg;
    if (detail.message) return detail.message;
    if (detail.error) return detail.error;
    // If it has loc and msg (Pydantic format)
    if (detail.loc && detail.msg) {
      const field = detail.loc.length > 1 ? detail.loc[detail.loc.length - 1] : "field";
      return `${field}: ${detail.msg}`;
    }
    // Fallback: stringify the object
    return JSON.stringify(detail);
  }

  // Fallback: convert to string
  return String(detail);
};

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
      const errorDetail = err.response?.data?.detail || err.response?.data?.message || err.message;
      const errorMessage = formatErrorDetail(errorDetail);
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
