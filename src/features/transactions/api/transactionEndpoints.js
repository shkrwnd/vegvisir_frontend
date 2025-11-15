/**
=========================================================
* Transactions API Endpoints
=========================================================
* API endpoints for transaction management
*/

import { apiClient } from "core/api";

export const transactionAPI = {
  /**
   * Get all transactions
   * @param {Object} params - { skip, limit, category, start_date, end_date }
   * @returns {Promise} Array of transactions
   */
  getAll: (params = {}) => {
    return apiClient.get("/api/v1/transactions/", { params });
  },

  /**
   * Get transaction by ID
   * @param {number} id - Transaction ID
   * @returns {Promise} Transaction object
   */
  getById: (id) => {
    return apiClient.get(`/api/v1/transactions/${id}`);
  },
};
