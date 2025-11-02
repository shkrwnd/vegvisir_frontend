/**
=========================================================
* Material Kit 2 PRO React - v2.1.1
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 PRO React themes
import theme from "assets/theme";

// Core
import { AuthProvider } from "core/context";

// Layouts
import DashboardLayout from "layouts/dashboard/DashboardLayout";
import IllustrationLayout from "layouts/authentication/IllustrationLayout";

// Pages (without layouts)
import HomePage from "pages/Home";
import LoginPage from "pages/Login";
import RegisterPage from "pages/Register";
import ResetPasswordPage from "pages/ResetPassword";
import DashboardPage from "pages/Dashboard";
import AnalyticsPage from "pages/Analytics";
import UsersPage from "pages/Users";
import SettingsPage from "pages/Settings";
import DataTablesPage from "pages/DataTables";
import NotificationsPage from "pages/Notifications";
import ChatBotPage from "pages/ChatBot";

// Images
import signinImage from "assets/images/illustrations/illustration-signin.jpg";
import signupImage from "assets/images/illustrations/illustration-signup.jpg";
import resetImage from "assets/images/illustrations/illustration-reset.jpg";

export default function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Authentication routes with IllustrationLayout */}
          <Route
            path="/login"
            element={
              <IllustrationLayout
                title="Sign In"
                description="Enter your email and password to sign in"
                illustration={signinImage}
              >
                <LoginPage />
              </IllustrationLayout>
            }
          />
          <Route
            path="/register"
            element={
              <IllustrationLayout
                title="Sign Up"
                description="Enter your details to create your account"
                illustration={signupImage}
              >
                <RegisterPage />
              </IllustrationLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <IllustrationLayout
                title="Reset Password"
                description="You will receive an e-mail in maximum 60 seconds"
                illustration={resetImage}
              >
                <ResetPasswordPage />
              </IllustrationLayout>
            }
          />

          {/* Dashboard routes with DashboardLayout */}
          <Route
            path="/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/data-tables" element={<DataTablesPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/chatbot" element={<ChatBotPage />} />
                  <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
