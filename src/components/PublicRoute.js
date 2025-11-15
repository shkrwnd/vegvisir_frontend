/**
=========================================================
* Public Route Component
=========================================================
* Wrapper component for public routes (login, register, etc.)
* Redirects to home if user is already authenticated
*/

import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "core/context";
import { ROUTES } from "core/config";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return null; // Or you can return a loading spinner here
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // User is not authenticated, render the public content
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
