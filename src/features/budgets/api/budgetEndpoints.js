/**
=========================================================
* Budgets API Endpoints
=========================================================
* API endpoints for budget management
*/

import { apiClient } from "core/api";

export const budgetAPI = {
  /**
   * Get all budgets
   * @param {Object} params - { skip, limit }
   * @returns {Promise} Array of budgets
   */
  getAll: (params = {}) => {
    return apiClient.get("/api/v1/budgets/", { params });
  },

  /**
   * Get all budgets with tracking
   * @returns {Promise} Array of budgets with tracking info
   */
  getAllWithTracking: () => {
    return apiClient.get("/api/v1/budgets/tracking");
  },

  /**
   * Get budget by ID
   * @param {number} id - Budget ID
   * @returns {Promise} Budget object
   */
  getById: (id) => {
    return apiClient.get(`/api/v1/budgets/${id}`);
  },

  /**
   * Get budget tracking
   * @param {number} id - Budget ID
   * @returns {Promise} Budget with tracking info
   */
  getTracking: (id) => {
    return apiClient.get(`/api/v1/budgets/${id}/tracking`);
  },

  /**
   * Create a new budget
   * @param {Object} data - { category, limit_amount, period, start_date, end_date }
   * @returns {Promise} Created budget
   */
  create: (data) => {
    return apiClient.post("/api/v1/budgets/", data);
  },

  /**
   * Update budget
   * @param {number} id - Budget ID
   * @param {Object} data - Budget data to update
   * @returns {Promise} Updated budget
   */
  update: (id, data) => {
    return apiClient.put(`/api/v1/budgets/${id}`, data);
  },

  /**
   * Delete budget
   * @param {number} id - Budget ID
   * @returns {Promise} Success message
   */
  delete: (id) => {
    return apiClient.delete(`/api/v1/budgets/${id}`);
  },
};
