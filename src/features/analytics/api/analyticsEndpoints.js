/**
=========================================================
* Analytics API Endpoints
=========================================================
* Feature-specific API endpoints for analytics
*/

import { apiClient } from "core/api";

export const analyticsAPI = {
  /**
   * Get analytics dashboard data
   */
  getDashboardData: (params) => {
    return apiClient.get("/analytics/dashboard", { params });
  },

  /**
   * Get analytics report
   */
  getReport: (reportId, params) => {
    return apiClient.get(`/analytics/reports/${reportId}`, { params });
  },
};
