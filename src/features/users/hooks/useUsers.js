/**
=========================================================
* useUsers Hook
=========================================================
* Custom hook for fetching and managing users data
*/

import { useState, useEffect } from "react";
import { userAPI } from "../api";

export const useUsers = (params = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAll(params);
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refetch = () => {
    fetchUsers();
  };

  const createUser = async (userData) => {
    try {
      const response = await userAPI.create(userData);
      setUsers((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create user",
      };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await userAPI.update(id, userData);
      setUsers((prev) => prev.map((user) => (user.id === id ? response.data : user)));
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update user",
      };
    }
  };

  const deleteUser = async (id) => {
    try {
      await userAPI.delete(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete user",
      };
    }
  };

  return {
    users,
    loading,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
  };
};
