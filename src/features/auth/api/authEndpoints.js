/**
=========================================================
* Authentication API Endpoints
=========================================================
* API endpoints for authentication (login, register, logout, etc.)
*/

import { apiClient } from "core/api";

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} { user, token }
   */
  login: async (credentials) => {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post("/auth/login", credentials);

    // Mock API response for now
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API delay
        if (credentials.email && credentials.password) {
          resolve({
            data: {
              user: {
                id: "1",
                name: credentials.email.split("@")[0],
                email: credentials.email,
                role: "user",
              },
              token: "mock-jwt-token-" + Date.now(),
            },
          });
        } else {
          reject({
            response: {
              data: {
                message: "Email and password are required",
              },
            },
          });
        }
      }, 1000);
    });
  },

  /**
   * Register new user
   * @param {Object} userData - { name, email, password }
   * @returns {Promise} { user, token }
   */
  register: async (userData) => {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post("/auth/register", userData);

    // Mock API response for now
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API delay
        if (userData.email && userData.password && userData.name) {
          resolve({
            data: {
              user: {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                role: "user",
              },
              token: "mock-jwt-token-" + Date.now(),
            },
          });
        } else {
          reject({
            response: {
              data: {
                message: "Name, email, and password are required",
              },
            },
          });
        }
      }, 1000);
    });
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post("/auth/logout");

    // Mock API response for now
    return Promise.resolve({ data: { success: true } });
  },

  /**
   * Refresh access token
   * @returns {Promise} { token }
   */
  refreshToken: async () => {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post("/auth/refresh");

    return Promise.resolve({
      data: {
        token: "mock-refreshed-token-" + Date.now(),
      },
    });
  },

  /**
   * Get current user profile
   * @returns {Promise} { user }
   */
  getCurrentUser: async () => {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get("/auth/me");

    const token = localStorage.getItem("token");
    if (token) {
      return Promise.resolve({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "user@example.com",
            role: "user",
          },
        },
      });
    }
    return Promise.reject({ response: { status: 401 } });
  },
};
