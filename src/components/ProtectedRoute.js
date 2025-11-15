/**
=========================================================
* Protected Route Component
=========================================================
* Wrapper component to protect routes that require authentication
* Redirects to login if user is not authenticated
*/

import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "core/context";
import { ROUTES } from "core/config";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return null; // Or you can return a loading spinner here
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
