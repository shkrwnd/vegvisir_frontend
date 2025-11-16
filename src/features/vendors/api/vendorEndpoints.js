/**
=========================================================
* Vendors API Endpoints
=========================================================
* API endpoints for vendor management and payments
*/

import { apiClient } from "core/api";

export const vendorAPI = {
  /**
   * Get all vendors
   * @param {Object} params - { category, active_only, skip, limit }
   * @returns {Promise} Array of vendors
   */
  getAll: (params = {}) => {
    return apiClient.get("/api/v1/vendors/", { params });
  },

  /**
   * Get vendor by ID
   * @param {number} id - Vendor ID
   * @returns {Promise} Vendor object
   */
  getById: (id) => {
    return apiClient.get(`/api/v1/vendors/${id}`);
  },

  /**
   * Create payment to vendor
   * @param {Object} data - { vendor_id, payment_type, amount, description }
   * @returns {Promise} Created payment
   */
  createPayment: (data) => {
    return apiClient.post("/api/v1/payments/", data);
  },
};
