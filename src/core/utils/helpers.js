/**
=========================================================
* Utility Helper Functions
=========================================================
* General-purpose helper functions used across the application
*/

/**
 * Format date to readable string
 */
export const formatDate = (date, format = "DD/MM/YY") => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return format.replace("DD", day).replace("MM", month).replace("YY", year);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get status color for badges/chips
 */
export const getStatusColor = (status) => {
  const statusColors = {
    Active: "success",
    Inactive: "secondary",
    Pending: "warning",
    Rejected: "error",
    Approved: "success",
  };
  return statusColors[status] || "default";
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
