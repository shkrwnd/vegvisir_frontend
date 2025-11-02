/**
=========================================================
* Data Tables API Endpoints
=========================================================
* Feature-specific API endpoints for data tables
*/

import { apiClient } from "core/api";

export const dataTableAPI = {
  /**
   * Get table data with filters and pagination
   */
  getTableData: (params) => {
    return apiClient.get("/data-tables", { params });
  },

  /**
   * Export table data
   */
  exportData: (params, format = "csv") => {
    return apiClient.get("/data-tables/export", {
      params: { ...params, format },
      responseType: "blob",
    });
  },
};
