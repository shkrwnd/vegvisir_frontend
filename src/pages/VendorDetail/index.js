/**
=========================================================
* Vendor Detail Page
=========================================================
* Displays detailed information about a vendor and allows payment
*/

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

// Features
import { useVendorPayment } from "features/vendors";
import { useWallet } from "features/wallet";

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

  const { createPayment, loading, error } = useVendorPayment();
  const { balance, loading: walletLoading } = useWallet();

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

  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
    setDescription(`Payment to ${vendor.name}`);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setAmount("");
    setDescription("");
    setPaymentSuccess(false);
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
      setPaymentSuccess(true);
      // Close dialog after 2 seconds and navigate back
      setTimeout(() => {
        handleClosePaymentDialog();
        navigate(ROUTES.MARKETPLACE);
      }, 2000);
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
          {paymentSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Payment successful! Redirecting...
            </Alert>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
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
              disabled={loading || paymentSuccess || !amount || parseFloat(amount) <= 0}
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </MKButton>
          </Box>
        </DialogActions>
      </Dialog>
    </MKBox>
  );
}

export default VendorDetailPage;
