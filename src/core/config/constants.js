/**
=========================================================
* Application Constants
=========================================================
* Centralized configuration and constants
*/

export const API_CONFIG = {
  // eslint-disable-next-line no-undef
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  THEME_MODE: "themeMode",
  RECENT_SEARCHES: "recentSearches",
};

export const ROUTES = {
  HOME: "/home",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
  RESET_PASSWORD: "/reset-password",
  USERS: "/users",
  ANALYTICS: "/analytics",
  DATA_TABLES: "/data-tables",
  NOTIFICATIONS: "/notifications",
  CHATBOT: "/chatbot",
  CHATBOT_FULLSCREEN: "/chatbot-fullscreen",
  SETTINGS: "/settings",
  BUDGETS: "/budgets",
  CARDS: "/cards",
  WALLET: "/wallet",
  TRANSACTIONS: "/transactions",
  ORDER: "/order",
  VENDOR_DETAIL: "/order/vendor",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
};
