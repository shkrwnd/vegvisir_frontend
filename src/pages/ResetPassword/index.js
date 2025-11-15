/**
=========================================================
* Material Kit 2 PRO React - v2.1.1
=========================================================
*
* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
*
Coded by www.creative-tim.com
*
 =========================================================
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link, useSearchParams } from "react-router-dom";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKInput from "components/base/MKInput";
import MKButton from "components/base/MKButton";
import MKSnackbar from "components/base/MKSnackbar";

// @mui icons
import Icon from "@mui/material/Icon";

// Features
import { useForgotPassword, useResetPassword } from "features/auth";

// Shared hooks
import { useSnackbar } from "shared/hooks";

// Core config
import { ROUTES } from "core/config";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [step, setStep] = useState(tokenFromUrl ? "reset" : "forgot");
  const [formData, setFormData] = useState({
    email: "",
    token: tokenFromUrl || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const {
    forgotPassword,
    loading: forgotLoading,
    error: forgotError,
    resetToken,
  } = useForgotPassword();
  const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForgotPassword = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetPassword = () => {
    const newErrors = {};

    if (!formData.token.trim()) {
      newErrors.token = "Reset token is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateForgotPassword()) {
      showSnackbar("error", "error", "Validation Error", "Please fix the errors in the form.");
      return;
    }

    try {
      const result = await forgotPassword(formData.email.trim());

      if (result.token) {
        // In development, show the token
        setFormData((prev) => ({ ...prev, token: result.token }));
        setStep("reset");
        showSnackbar(
          "success",
          "check_circle",
          "Reset Token Sent",
          `Token: ${result.token} (In development mode)`
        );
      } else {
        showSnackbar(
          "success",
          "check_circle",
          "Reset Email Sent",
          "Please check your email for password reset instructions."
        );
        // In production, user would check email, so we might want to show a message
        // For now, we'll still allow them to proceed if they have the token
      }
    } catch (err) {
      showSnackbar(
        "error",
        "error",
        "Request Failed",
        forgotError || "An error occurred. Please try again."
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateResetPassword()) {
      showSnackbar("error", "error", "Validation Error", "Please fix the errors in the form.");
      return;
    }

    try {
      await resetPassword(formData.token.trim(), formData.newPassword);
      showSnackbar(
        "success",
        "check_circle",
        "Password Reset Successful",
        "Your password has been reset. Please login with your new password."
      );
    } catch (err) {
      showSnackbar(
        "error",
        "error",
        "Reset Failed",
        resetError || "An error occurred. Please try again."
      );
    }
  };

  const loading = forgotLoading || resetLoading;

  return (
    <>
      {step === "forgot" ? (
        <MKBox component="form" role="form" onSubmit={handleForgotPassword}>
          <MKBox mb={2}>
            <MKTypography variant="h4" fontWeight="medium" mb={1}>
              Forgot Password?
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={3}>
              Enter your email address and we&apos;ll send you a password reset token.
            </MKTypography>
          </MKBox>
          <MKBox mb={2}>
            <MKInput
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
          </MKBox>
          <MKBox mt={4} mb={1}>
            <MKButton
              variant="gradient"
              color="info"
              size="large"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Token"}
            </MKButton>
          </MKBox>
          <MKBox mt={3} textAlign="center">
            <MKTypography variant="button" color="text">
              Remember your password?{" "}
              <MKTypography
                component={Link}
                to={ROUTES.LOGIN}
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Back to Login
              </MKTypography>
            </MKTypography>
          </MKBox>
        </MKBox>
      ) : (
        <MKBox component="form" role="form" onSubmit={handleResetPassword}>
          <MKBox mb={2}>
            <MKTypography variant="h4" fontWeight="medium" mb={1}>
              Reset Password
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={3}>
              Enter your reset token and new password.
            </MKTypography>
          </MKBox>
          <MKBox mb={2}>
            <MKInput
              type="text"
              label="Reset Token"
              name="token"
              value={formData.token}
              onChange={handleChange}
              error={!!errors.token}
              helperText={errors.token || "Enter the token sent to your email"}
              fullWidth
            />
          </MKBox>
          <MKBox mb={2}>
            <MKInput
              type="password"
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              fullWidth
            />
          </MKBox>
          <MKBox mb={2}>
            <MKInput
              type="password"
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
            />
          </MKBox>
          <MKBox mt={4} mb={1}>
            <MKButton
              variant="gradient"
              color="info"
              size="large"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </MKButton>
          </MKBox>
          <MKBox mt={2} textAlign="center">
            <MKButton
              variant="text"
              color="info"
              onClick={() => setStep("forgot")}
              disabled={loading}
            >
              Back to Forgot Password
            </MKButton>
          </MKBox>
          <MKBox mt={2} textAlign="center">
            <MKTypography variant="button" color="text">
              Remember your password?{" "}
              <MKTypography
                component={Link}
                to={ROUTES.LOGIN}
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Back to Login
              </MKTypography>
            </MKTypography>
          </MKBox>
        </MKBox>
      )}

      {/* Snackbar */}
      <MKSnackbar
        color={snackbar.color}
        icon={<Icon>{snackbar.icon}</Icon>}
        title={snackbar.title}
        content={snackbar.content}
        dateTime={snackbar.dateTime}
        open={snackbar.open}
        close={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

export default ResetPassword;
