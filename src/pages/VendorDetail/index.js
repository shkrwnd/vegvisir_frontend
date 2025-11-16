/**
=========================================================
* Vendor Detail Page
=========================================================
* Displays detailed information about a vendor and allows payment
*/

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

// Features
import { useVendorPayment } from "features/vendors";
import { vendorAPI } from "features/vendors";
import { useWallet } from "features/wallet";
import { useRewards } from "features/rewards";

// Core
import { ROUTES } from "core/config";

function VendorDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor;

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [earnedReward, setEarnedReward] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const { createPayment, loading, error } = useVendorPayment();
  const { balance, loading: walletLoading, refetch: refetchWallet } = useWallet();
  const { refetchBalance: refetchRewards } = useRewards();

  const getCategoryIcon = (category) => {
    switch (category) {
      case "dining":
        return "restaurant";
      case "retail":
        return "shopping_bag";
      case "service":
        return "build";
      case "entertainment":
        return "theaters";
      default:
        return "store";
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Launch confetti from multiple positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Big burst at the start
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
      });
    }, 0);
  };

  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
    setDescription(`Payment to ${vendor.name}`);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setAmount("");
    setDescription("");
    setPaymentSuccess(false);
    setEarnedReward(null);
    setIsPolling(false);
    setPaymentError(null);
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    const paymentData = {
      vendor_id: vendor.id,
      payment_type: vendor.category,
      amount: parseFloat(amount),
      description: description || `Payment to ${vendor.name}`,
    };

    const result = await createPayment(paymentData);

    if (result.success) {
      const payment = result.data;
      // Clear any previous errors
      setPaymentError(null);

      // Check if payment status is pending
      if (payment.status === "pending") {
        // Poll for payment completion
        setIsPolling(true);
        const paymentId = payment.id;
        let attempts = 0;
        const maxAttempts = 30; // 30 attempts = 15 seconds max
        const pollInterval = 500; // Poll every 500ms

        const pollPaymentStatus = async () => {
          try {
            const statusResponse = await vendorAPI.getPaymentById(paymentId);
            const updatedPayment = statusResponse.data;

            if (updatedPayment.status === "completed") {
              setIsPolling(false);
              setPaymentSuccess(true);

              // Check if reward information is in the response
              if (updatedPayment.reward) {
                setEarnedReward(updatedPayment.reward);
                // Trigger confetti celebration
                triggerConfetti();
              }

              // Refresh wallet and rewards balance
              await refetchWallet();
              await refetchRewards();

              // Close dialog after 3 seconds and navigate back
              setTimeout(() => {
                handleClosePaymentDialog();
                navigate(ROUTES.MARKETPLACE);
              }, 3000);
            } else if (updatedPayment.status === "failed") {
              setIsPolling(false);
              setPaymentError("Payment failed. Please try again.");
              setPaymentSuccess(false);
            } else if (attempts < maxAttempts) {
              // Still pending, poll again
              attempts++;
              setTimeout(pollPaymentStatus, pollInterval);
            } else {
              // Timeout - payment is taking too long
              setIsPolling(false);
              setPaymentError(
                "Payment is taking longer than expected. Please check your transactions."
              );
              setPaymentSuccess(false);
            }
          } catch (err) {
            console.error("Error polling payment status:", err);
            if (attempts < maxAttempts) {
              attempts++;
              setTimeout(pollPaymentStatus, pollInterval);
            } else {
              setIsPolling(false);
              setPaymentError("Unable to verify payment status. Please check your transactions.");
              setPaymentSuccess(false);
            }
          }
        };

        // Start polling
        setTimeout(pollPaymentStatus, pollInterval);
      } else if (payment.status === "completed") {
        // Payment completed immediately
        setPaymentSuccess(true);

        // Check if reward information is in the response
        if (payment.reward) {
          setEarnedReward(payment.reward);
          // Trigger confetti celebration
          triggerConfetti();
        }

        // Refresh wallet and rewards balance
        await refetchWallet();
        await refetchRewards();

        // Close dialog after 3 seconds and navigate back
        setTimeout(() => {
          handleClosePaymentDialog();
          navigate(ROUTES.MARKETPLACE);
        }, 3000);
      } else if (payment.status === "failed") {
        setPaymentError("Payment failed. Please try again.");
      }
    } else {
      // Payment creation failed
      setPaymentError(result.error || "Failed to create payment. Please try again.");
    }
  };

  if (!vendor) {
    return (
      <MKBox textAlign="center" py={6}>
        <MKTypography variant="h5" color="text" mb={2}>
          Vendor not found
        </MKTypography>
        <MKButton color="info" onClick={() => navigate(ROUTES.MARKETPLACE)}>
          Back to Vendors
        </MKButton>
      </MKBox>
    );
  }

  return (
    <MKBox>
      <Grid container spacing={3} alignItems="stretch">
        {/* Vendor Info Card */}
        <Grid item xs={12} md={8} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <MKBox sx={{ flexGrow: 1 }}>
                {/* Header with Icon */}
                <MKBox display="flex" alignItems="center" mb={3}>
                  <MKBox
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "16px",
                      background: ({ palette }) =>
                        `linear-gradient(135deg, ${palette.info.main} 0%, ${palette.info.dark} 100%)`,
                      color: "white",
                      mr: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: "2rem" }}>{getCategoryIcon(vendor.category)}</Icon>
                  </MKBox>
                  <MKBox>
                    <MKTypography variant="h3" fontWeight="bold">
                      {vendor.name}
                    </MKTypography>
                    <MKTypography variant="button" color="text" textTransform="capitalize">
                      {vendor.category}
                    </MKTypography>
                  </MKBox>
                </MKBox>

                {/* Location */}
                <MKBox display="flex" alignItems="center" mb={2}>
                  <Icon sx={{ mr: 1, color: "text.secondary" }}>location_on</Icon>
                  <MKTypography variant="body1" color="text">
                    {vendor.location}
                  </MKTypography>
                </MKBox>

                {/* Description */}
                {vendor.description && (
                  <MKBox mb={3}>
                    <MKTypography variant="h6" fontWeight="medium" mb={1}>
                      About
                    </MKTypography>
                    <MKTypography variant="body1" color="text" sx={{ lineHeight: 1.8 }}>
                      {vendor.description}
                    </MKTypography>
                  </MKBox>
                )}
              </MKBox>

              {/* Payment Button at Bottom */}
              <MKButton
                variant="gradient"
                color="info"
                fullWidth
                size="large"
                onClick={handleOpenPaymentDialog}
                disabled={!vendor.accepts_raider_card}
                startIcon={<Icon>payment</Icon>}
              >
                Pay {vendor.name}
              </MKButton>
            </CardContent>
          </Card>
        </Grid>

        {/* Hours Card */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <MKBox display="flex" alignItems="center" mb={2}>
                <Icon sx={{ mr: 1, color: "info.main" }}>schedule</Icon>
                <MKTypography variant="h5" fontWeight="bold">
                  Hours
                </MKTypography>
              </MKBox>
              <MKBox>
                {vendor.hours ? (
                  typeof vendor.hours === "string" ? (
                    <MKBox component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                      {vendor.hours.split(/\r?\n/).map((line, idx) => {
                        const raw = line.replace(/^[\s\-\u2013\u2014\u2022\u00B7]+/, "").trim();
                        const colonIndex = raw.indexOf(":");

                        if (colonIndex !== -1) {
                          const dayPart = raw.slice(0, colonIndex).trim();
                          const hoursPart = raw.slice(colonIndex + 1).trim();
                          return (
                            <MKBox component="li" key={idx} mb={1}>
                              <MKTypography
                                variant="body2"
                                component="span"
                                fontWeight="bold"
                                sx={{ mr: 0.5 }}
                              >
                                {dayPart}:
                              </MKTypography>
                              <MKTypography variant="body2" color="text" component="span">
                                {hoursPart}
                              </MKTypography>
                            </MKBox>
                          );
                        }

                        // Fallback: no colon found — render the whole line
                        return (
                          <MKBox component="li" key={idx} mb={1}>
                            <MKTypography variant="body2" color="text">
                              {raw}
                            </MKTypography>
                          </MKBox>
                        );
                      })}
                    </MKBox>
                  ) : (
                    <MKTypography variant="body2" color="text">
                      {String(vendor.hours)}
                    </MKTypography>
                  )
                ) : (
                  <MKTypography variant="body2" color="text" sx={{ fontStyle: "italic" }}>
                    Hours not available
                  </MKTypography>
                )}
              </MKBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <MKTypography variant="h5" fontWeight="bold">
            Pay {vendor.name}
          </MKTypography>
        </DialogTitle>
        <DialogContent>
          {isPolling ? (
            <MKBox>
              <Alert severity="info" sx={{ mb: 2 }}>
                <MKBox display="flex" alignItems="center" gap={2}>
                  <CircularProgress size={20} />
                  <MKTypography variant="body1">Processing payment... Please wait.</MKTypography>
                </MKBox>
              </Alert>
            </MKBox>
          ) : paymentSuccess ? (
            <MKBox>
              <Alert severity="success" sx={{ mb: 2 }}>
                Payment successful! Redirecting...
              </Alert>
              {earnedReward && (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)",
                    border: "2px solid rgba(102, 126, 234, 0.5)",
                    borderRadius: 3,
                    animation: "pulse 0.5s ease-in-out",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.02)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                >
                  <MKBox>
                    <MKBox display="flex" alignItems="center" gap={1} mb={1.5}>
                      <MKTypography variant="h5" fontWeight="bold" sx={{ fontSize: "1.75rem" }}>
                        🎉
                      </MKTypography>
                      <MKTypography variant="h6" fontWeight="bold" color="primary">
                        You earned a reward!
                      </MKTypography>
                    </MKBox>
                    <MKBox
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 215, 0, 0.1)",
                        border: "1px solid rgba(255, 215, 0, 0.3)",
                        mb: 1.5,
                      }}
                    >
                      <MKTypography variant="h4" fontWeight="bold" color="warning.main" mb={0.5}>
                        ${parseFloat(earnedReward.amount || 0).toFixed(2)}
                      </MKTypography>
                      <MKTypography variant="body2" color="text.secondary">
                        Reward Amount
                      </MKTypography>
                    </MKBox>
                    <MKBox display="flex" gap={2} flexWrap="wrap">
                      <MKBox>
                        <MKTypography variant="caption" color="text.secondary" display="block">
                          Cashback
                        </MKTypography>
                        <MKTypography variant="body2" fontWeight="bold" color="success.main">
                          {(earnedReward.cashback_percentage * 100).toFixed(1)}%
                        </MKTypography>
                      </MKBox>
                      <MKBox>
                        <MKTypography variant="caption" color="text.secondary" display="block">
                          Expires
                        </MKTypography>
                        <MKTypography variant="body2" fontWeight="bold">
                          {new Date(earnedReward.expires_at).toLocaleDateString()}
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                  </MKBox>
                </Alert>
              )}
            </MKBox>
          ) : (
            <>
              {(error || paymentError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {typeof (paymentError || error) === "string"
                    ? paymentError || error
                    : JSON.stringify(paymentError || error)}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Amount ($)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mb: 2, mt: 1 }}
                inputProps={{ min: "0.01", step: "0.01" }}
                required
              />
              <TextField
                fullWidth
                label="Description (optional)"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}
        >
          <Box>
            <MKTypography variant="body2" color="text.secondary">
              Current Balance:
            </MKTypography>
            <MKTypography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
              {walletLoading ? "Loading..." : `$${parseFloat(balance || 0).toFixed(2)}`}
            </MKTypography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <MKButton variant="text" color="dark" onClick={handleClosePaymentDialog}>
              Cancel
            </MKButton>
            <MKButton
              variant="gradient"
              color="info"
              onClick={handlePayment}
              disabled={
                loading || paymentSuccess || isPolling || !amount || parseFloat(amount) <= 0
              }
            >
              {loading || isPolling ? "Processing..." : "Confirm Payment"}
            </MKButton>
          </Box>
        </DialogActions>
      </Dialog>
    </MKBox>
  );
}

export default VendorDetailPage;
