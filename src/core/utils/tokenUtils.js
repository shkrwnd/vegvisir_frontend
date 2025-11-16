/**
=========================================================
* Token Utilities
=========================================================
* Utility functions for JWT token validation and decoding
*/

/**
 * Decode JWT token and check if it's expired
 * @param {string} token - JWT token string
 * @returns {Object|null} - Decoded payload or null if invalid/expired
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    // JWT tokens have 3 parts: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Invalid token format");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Base64 URL decode
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    // Check expiration
    if (decoded.exp) {
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        console.warn("Token has expired");
        return null;
      }
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if token is valid and not expired
 * @param {string} token - JWT token string
 * @returns {boolean} - True if token is valid and not expired
 */
export const isTokenValid = (token) => {
  return decodeToken(token) !== null;
};
