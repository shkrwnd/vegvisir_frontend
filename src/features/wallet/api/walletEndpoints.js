/**
=========================================================
* Wallet API Endpoints
=========================================================
* API endpoints for wallet (Flex Dollars) management
*/

import { apiClient } from "core/api";

export const walletAPI = {
  /**
   * Get wallet balance (Flex Dollars)
   * @returns {Promise} Wallet object with balance
   */
  getBalance: () => {
    return apiClient.get("/api/v1/wallet");
  },

  /**
   * Load money into wallet
   * @param {Object} data - { amount, card_id }
   * @returns {Promise} Updated wallet object
   */
  loadMoney: (data) => {
    return apiClient.post("/api/v1/wallet/load", data);
  },
};
