/**
=========================================================
* Authentication API Endpoints
=========================================================
* API endpoints for authentication (login, register, logout, etc.)
*/

import { apiClient } from "core/api";
import { STORAGE_KEYS } from "core/config";

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} { user, token }
   */
  login: async (credentials) => {
    try {
      // Login endpoint uses application/x-www-form-urlencoded format
      const formData = new URLSearchParams();
      formData.append("username", credentials.email);
      formData.append("password", credentials.password);

      const response = await apiClient.post("/api/v1/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;

      // Store token temporarily to fetch user info
      localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);

      // Fetch current user info after login
      try {
        const userResponse = await apiClient.get("/api/v1/auth/me");
        const user = userResponse.data;

        return {
          data: {
            user,
            token: access_token,
          },
        };
      } catch (error) {
        // If fetching user info fails, still return the token
        // but log the error for debugging
        console.error("Failed to fetch user info after login:", error);
        console.error("User info error response:", error.response?.data);
        console.error("Token that was used:", access_token?.substring(0, 20) + "...");

        // Don't throw error - return minimal user object so login can proceed
        // The token is valid, so the user can still use the app
        return {
          data: {
            user: {
              email: credentials.email,
              id: null, // Will be fetched later if needed
            },
            token: access_token,
          },
        };
      }
    } catch (error) {
      console.error("Login API error:", error);
      console.error("Login API error response:", error.response?.data);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - { email, password, full_name, student_id, major, class_year }
   * @returns {Promise} { user, token }
   */
  register: async (userData) => {
    // Register the user
    await apiClient.post("/api/v1/auth/register", {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name || userData.name,
      student_id: userData.student_id,
      major: userData.major,
      class_year: userData.class_year,
    });

    // After successful registration, login to get the token
    const loginFormData = new URLSearchParams();
    loginFormData.append("username", userData.email);
    loginFormData.append("password", userData.password);

    const loginResponse = await apiClient.post("/api/v1/auth/login", loginFormData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token } = loginResponse.data;

    // Store token temporarily to fetch user info
    localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);

    // Fetch current user info
    const userResponse = await apiClient.get("/api/v1/auth/me");
    const user = userResponse.data;

    return {
      data: {
        user,
        token: access_token,
      },
    };
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    // If backend has a logout endpoint, call it here
    // For now, just return success
    return Promise.resolve({ data: { success: true } });
  },

  /**
   * Refresh access token
   * @returns {Promise} { token }
   */
  refreshToken: async () => {
    // TODO: Implement if backend supports token refresh
    return Promise.resolve({
      data: {
        token: localStorage.getItem(STORAGE_KEYS.TOKEN),
      },
    });
  },

  /**
   * Get current user profile
   * @returns {Promise} { user }
   */
  getCurrentUser: async () => {
    const response = await apiClient.get("/api/v1/auth/me");
    return {
      data: response.data,
    };
  },

  /**
   * Forgot password - Request password reset token
   * @param {Object} data - { email }
   * @returns {Promise} { token } (in development)
   */
  forgotPassword: async (data) => {
    const response = await apiClient.post("/api/v1/auth/forgot-password", {
      email: data.email,
    });
    return response;
  },

  /**
   * Reset password - Reset password using token
   * @param {Object} data - { token, new_password }
   * @returns {Promise} { success }
   */
  resetPassword: async (data) => {
    const response = await apiClient.post("/api/v1/auth/reset-password", {
      token: data.token,
      new_password: data.new_password,
    });
    return response;
  },
};
