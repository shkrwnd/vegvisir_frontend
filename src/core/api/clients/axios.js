/**
=========================================================
* Core API Client - Axios Configuration
=========================================================
* Centralized axios instance with interceptors for authentication,
* error handling, and request/response transformation.
*/

import axios from "axios";
import { API_CONFIG, STORAGE_KEYS, ROUTES } from "core/config";
import { isTokenValid } from "core/utils/tokenUtils";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      // Check if token is expired before sending request
      if (!isTokenValid(token)) {
        console.warn("Token expired, clearing auth state");
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        // Don't redirect for auth endpoints
        const isAuthEndpoint =
          config.url?.includes("/auth/login") ||
          config.url?.includes("/auth/register") ||
          config.url?.includes("/auth/forgot-password") ||
          config.url?.includes("/auth/reset-password");

        if (!isAuthEndpoint) {
          const currentPath = window.location.pathname;
          const isAuthRoute =
            currentPath === ROUTES.LOGIN ||
            currentPath === ROUTES.REGISTER ||
            currentPath === ROUTES.RESET_PASSWORD;

          if (!isAuthRoute) {
            window.location.href = ROUTES.LOGIN;
          }
        }

        // Reject the request
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
      // Log token addition for debugging (only for non-auth endpoints to avoid spam)
      if (!config.url?.includes("/auth/login") && !config.url?.includes("/auth/register")) {
        console.log("API Request with token:", {
          url: config.url,
          method: config.method,
          hasToken: !!token,
          tokenLength: token?.length,
        });
      }
    } else {
      // Log when token is missing for protected endpoints
      if (!config.url?.includes("/auth/login") && !config.url?.includes("/auth/register")) {
        console.warn("API Request without token:", {
          url: config.url,
          method: config.method,
        });
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log all API errors to console for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Don't redirect if we're already on login/register/reset-password pages
      const currentPath = window.location.pathname;
      const isAuthRoute =
        currentPath === ROUTES.LOGIN ||
        currentPath === ROUTES.REGISTER ||
        currentPath === ROUTES.RESET_PASSWORD;

      // Don't redirect if already on an auth route (prevents redirect loops)
      if (!isAuthRoute) {
        // Check if this is a login/register endpoint - don't redirect for those
        const isAuthEndpoint =
          error.config?.url?.includes("/auth/login") ||
          error.config?.url?.includes("/auth/register") ||
          error.config?.url?.includes("/auth/forgot-password") ||
          error.config?.url?.includes("/auth/reset-password");

        if (!isAuthEndpoint) {
          // In development, check if this might be a hot reload issue
          // Only clear auth if we're sure the token is actually invalid
          const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

          // If there's no token, don't clear anything (might be a race condition)
          if (!token) {
            console.warn(
              "401 error but no token found - might be hot reload issue, not clearing state"
            );
            return Promise.reject(error);
          }

          // Check if error is due to network issues or actual auth failure
          // Network errors during hot reload shouldn't trigger logout
          if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
            console.warn("Network error during API call - might be hot reload, not clearing auth");
            return Promise.reject(error);
          }

          console.error("Unauthorized access (401) - clearing token and redirecting to login");
          console.error("Failed API call:", {
            url: error.config?.url,
            method: error.config?.method,
            path: currentPath,
          });
          console.error("Token exists:", !!token);

          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);

          // Use window.location.href for full page reload to clear any state
          // This ensures a clean redirect without React Router state issues
          window.location.href = ROUTES.LOGIN;
        } else {
          console.warn("401 on auth endpoint, not redirecting:", error.config?.url);
        }
      } else {
        console.warn("401 error on auth route, not redirecting to prevent loop");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
