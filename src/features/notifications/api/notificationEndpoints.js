/**
=========================================================
* Notifications API Endpoints
=========================================================
*/

import { apiClient } from "core/api";

export const notificationAPI = {
  getAll: (params) => apiClient.get("/notifications", { params }),
  getById: (id) => apiClient.get(`/notifications/${id}`),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch("/notifications/read-all"),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
  deleteAll: () => apiClient.delete("/notifications"),
};
