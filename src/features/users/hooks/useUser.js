/**
=========================================================
* useUser Hook
=========================================================
* Custom hook for fetching a single user by ID
*/

import { useState, useEffect } from "react";
import { userAPI } from "../api";

export const useUser = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userAPI.getById(id);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await userAPI.getById(id);
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, refetch };
};
