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
    return apiClient.get("/api/v1/users", { params });
  },

  /**
   * Get user by ID
   */
  getById: (id) => {
    return apiClient.get(`/api/v1/users/${id}`);
  },

  /**
   * Create a new user
   */
  create: (data) => {
    return apiClient.post("/api/v1/users", data);
  },

  /**
   * Update user
   */
  update: (id, data) => {
    return apiClient.put(`/api/v1/users/${id}`, data);
  },

  /**
   * Delete user
   */
  delete: (id) => {
    return apiClient.delete(`/api/v1/users/${id}`);
  },

  /**
   * Search users
   */
  search: (query) => {
    return apiClient.get("/api/v1/users/search", { params: { q: query } });
  },
};
