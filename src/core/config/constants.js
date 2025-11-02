/**
=========================================================
* Application Constants
=========================================================
* Centralized configuration and constants
*/

export const API_CONFIG = {
  // eslint-disable-next-line no-undef
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  RECENT_SEARCHES: "recentSearches",
};

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
  USERS: "/users",
  ANALYTICS: "/analytics",
  DATA_TABLES: "/data-tables",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
};
