/**
=========================================================
* Users API Endpoints
=========================================================
* Feature-specific API endpoints for user management
*/

import { apiClient } from "core/api";

export const userAPI = {
  /**
   * Get all users
   */
  getAll: (params) => {
    return apiClient.get("/users", { params });
  },

  /**
   * Get user by ID
   */
  getById: (id) => {
    return apiClient.get(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  create: (data) => {
    return apiClient.post("/users", data);
  },

  /**
   * Update user
   */
  update: (id, data) => {
    return apiClient.put(`/users/${id}`, data);
  },

  /**
   * Delete user
   */
  delete: (id) => {
    return apiClient.delete(`/users/${id}`);
  },

  /**
   * Search users
   */
  search: (query) => {
    return apiClient.get("/users/search", { params: { q: query } });
  },
};
