/**
=========================================================
* Donation API Endpoints
=========================================================
* API calls for donation management
*/

import apiClient from "core/api/clients/axios";

export const donationAPI = {
  /**
   * Make a donation
   * @param {Object} data - { amount, description }
   * @returns {Promise} Donation object with donation_box_total
   */
  makeDonation: (data) => {
    return apiClient.post("/api/v1/donations/", data);
  },

  /**
   * Get donation box information
   * @returns {Promise} Donation box object with total_amount
   */
  getDonationBox: () => {
    return apiClient.get("/api/v1/donations/box");
  },
};
