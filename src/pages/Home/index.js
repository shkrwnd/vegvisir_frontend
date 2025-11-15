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

import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

// @mui icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreditCardIcon from "@mui/icons-material/CreditCard";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKInput from "components/base/MKInput";
import MKSnackbar from "components/base/MKSnackbar";

// @mui icons
import Icon from "@mui/material/Icon";

// Features
import { useWallet } from "features/wallet";
import { useCards } from "features/cards";

// Shared hooks
import { useSnackbar } from "shared/hooks";

// Material Kit 2 PRO React examples

// Images
import bgImage from "assets/images/bg-presentation.jpg";

function Home() {
  const {
    wallet,
    balance,
    loading: walletLoading,
    error: walletError,
    refetch,
    loadMoney,
  } = useWallet();
  const { cards, loading: cardsLoading } = useCards();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    card_id: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleOpenDialog = () => {
    setFormData({
      amount: "",
      card_id: cards.length > 0 ? cards[0].id.toString() : "",
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      amount: "",
      card_id: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0";
    } else if (parseFloat(formData.amount) > 10000) {
      errors.amount = "Amount cannot exceed $10,000 per transaction";
    }

    if (!formData.card_id) {
      errors.card_id = "Please select a card";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar("error", "error", "Validation Error", "Please fix the errors in the form.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await loadMoney(parseFloat(formData.amount), parseInt(formData.card_id));
      if (result.success) {
        showSnackbar(
          "success",
          "check_circle",
          "Success",
          `Successfully loaded $${parseFloat(formData.amount).toFixed(
            2
          )} into your Flex Dollars wallet!`
        );
        handleCloseDialog();
      } else {
        showSnackbar("error", "error", "Error", result.error || "Failed to load money");
      }
    } catch (err) {
      showSnackbar("error", "error", "Error", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return "";
    return `**** ${cardNumber}`;
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Hero Section */}
      <MKBox
        mb={6}
        sx={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 3,
          p: { xs: 4, md: 6 },
          mx: 3,
          color: "white",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Chip
            label="Welcome Back"
            color="primary"
            sx={{
              mb: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 500,
            }}
          />
          <MKTypography
            variant="h1"
            fontWeight="bold"
            mb={2}
            sx={({ breakpoints, typography: { size } }) => ({
              [breakpoints.down("md")]: {
                fontSize: size["3xl"],
              },
              [breakpoints.down("sm")]: {
                fontSize: size["2xl"],
              },
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            })}
          >
            Dashboard
          </MKTypography>
          <MKTypography
            variant="h6"
            mb={4}
            sx={{
              opacity: 0.95,
              maxWidth: "600px",
              mx: "auto",
              fontWeight: 300,
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Manage your data, track performance, and make informed decisions with our comprehensive
            dashboard.
          </MKTypography>
        </Box>
      </MKBox>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={6} sx={{ px: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: ({ boxShadows: { md } }) => md,
              border: ({ borders: { borderWidth }, palette: { black }, functions: { rgba } }) =>
                `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
              overflow: "visible",
              transition: "all 200ms ease-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: ({ boxShadows: { lg } }) => lg,
              },
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              1,234
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Total Users
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: ({ boxShadows: { md } }) => md,
              border: ({ borders: { borderWidth }, palette: { black }, functions: { rgba } }) =>
                `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
              overflow: "visible",
              transition: "all 200ms ease-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: ({ boxShadows: { lg } }) => lg,
              },
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 40, mb: 1 }} />
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              98.5%
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Uptime
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: ({ boxShadows: { md } }) => md,
              border: ({ borders: { borderWidth }, palette: { black }, functions: { rgba } }) =>
                `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
              overflow: "visible",
              transition: "all 200ms ease-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: ({ boxShadows: { lg } }) => lg,
              },
            }}
          >
            <AssessmentIcon sx={{ fontSize: 40, mb: 1 }} />
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              567
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Reports
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: ({ boxShadows: { md } }) => md,
              border: ({ borders: { borderWidth }, palette: { black }, functions: { rgba } }) =>
                `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
              overflow: "visible",
              transition: "all 200ms ease-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: ({ boxShadows: { lg } }) => lg,
              },
            }}
          >
            <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              89
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Active Teams
            </MKTypography>
          </Card>
        </Grid>
      </Grid>

      {/* Flex Dollars Wallet Section */}
      <MKBox mb={6} sx={{ px: 3 }}>
        <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MKTypography variant="h5" fontWeight="bold">
            Flex Dollars Wallet
          </MKTypography>
          <MKBox display="flex" gap={2}>
            <MKButton
              variant="outlined"
              color="info"
              size="medium"
              onClick={refetch}
              startIcon={<RefreshIcon />}
              disabled={walletLoading}
            >
              Refresh
            </MKButton>
            <MKButton
              variant="gradient"
              color="info"
              size="medium"
              onClick={handleOpenDialog}
              startIcon={<AddIcon />}
              disabled={cards.length === 0}
            >
              Load Money
            </MKButton>
          </MKBox>
        </MKBox>

        {walletError && (
          <MKBox mb={2}>
            <MKTypography variant="body2" color="error">
              Error: {walletError}
            </MKTypography>
          </MKBox>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={6}>
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <MKBox display="flex" alignItems="center" mb={3}>
                <AccountBalanceWalletIcon sx={{ fontSize: 40, mr: 2 }} />
                <MKBox>
                  <MKTypography variant="h6" fontWeight="medium" opacity={0.9}>
                    Flex Dollars Balance
                  </MKTypography>
                  {walletLoading ? (
                    <CircularProgress size={24} sx={{ color: "white", mt: 1 }} />
                  ) : (
                    <MKTypography variant="h3" fontWeight="bold" mt={1}>
                      {formatCurrency(balance)}
                    </MKTypography>
                  )}
                </MKBox>
              </MKBox>
              {wallet && (
                <MKBox>
                  <MKTypography variant="caption" opacity={0.8}>
                    Last updated: {new Date(wallet.updated_at).toLocaleString()}
                  </MKTypography>
                </MKBox>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={6}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <MKTypography variant="h6" fontWeight="bold" mb={2}>
                About Flex Dollars
              </MKTypography>
              <MKTypography variant="body2" color="text.secondary" mb={2}>
                Flex Dollars is your campus currency that can be used for various services and
                purchases.
              </MKTypography>
              <MKBox component="ul" sx={{ pl: 2, m: 0 }}>
                <MKTypography component="li" variant="body2" color="text.secondary" mb={1}>
                  Load money from your registered cards
                </MKTypography>
                <MKTypography component="li" variant="body2" color="text.secondary" mb={1}>
                  Maximum $10,000 per transaction
                </MKTypography>
                <MKTypography component="li" variant="body2" color="text.secondary">
                  Use Flex Dollars for campus services
                </MKTypography>
              </MKBox>
            </Card>
          </Grid>
        </Grid>

        {cards.length === 0 && !cardsLoading && (
          <MKBox mt={3}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)",
                backgroundColor: "rgba(255, 193, 7, 0.1)",
              }}
            >
              <MKBox display="flex" alignItems="center" gap={2}>
                <CreditCardIcon color="warning" />
                <MKBox>
                  <MKTypography variant="body1" fontWeight="bold" mb={0.5}>
                    No Cards Available
                  </MKTypography>
                  <MKTypography variant="body2" color="text.secondary">
                    You need to add a payment card before you can load money into your Flex Dollars
                    wallet.
                  </MKTypography>
                </MKBox>
              </MKBox>
            </Card>
          </MKBox>
        )}
      </MKBox>

      {/* Load Money Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <MKTypography variant="h5" fontWeight="bold">
            Load Money into Flex Dollars
          </MKTypography>
        </DialogTitle>
        <DialogContent>
          <MKBox sx={{ pt: 2 }}>
            <MKBox mb={3}>
              <MKTypography variant="body2" color="text.secondary">
                Current Balance: <strong>{formatCurrency(balance)}</strong>
              </MKTypography>
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                type="number"
                label="Amount ($)"
                name="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                error={!!formErrors.amount}
                helperText={formErrors.amount || "Enter amount between $0.01 and $10,000"}
                fullWidth
                inputProps={{ min: 0.01, max: 10000, step: 0.01 }}
              />
            </MKBox>
            <MKBox mb={2}>
              <FormControl fullWidth error={!!formErrors.card_id}>
                <InputLabel>Select Card</InputLabel>
                <Select
                  value={formData.card_id}
                  onChange={(e) => setFormData({ ...formData, card_id: e.target.value })}
                  label="Select Card"
                >
                  {cards.map((card) => (
                    <MenuItem key={card.id} value={card.id.toString()}>
                      <MKBox display="flex" alignItems="center" gap={1}>
                        <CreditCardIcon fontSize="small" />
                        <MKTypography variant="body2">
                          {maskCardNumber(card.card_number)} - {card.cardholder_name}
                          {card.is_default && " (Default)"}
                        </MKTypography>
                      </MKBox>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.card_id && <FormHelperText>{formErrors.card_id}</FormHelperText>}
              </FormControl>
            </MKBox>
            {formData.amount && parseFloat(formData.amount) > 0 && (
              <MKBox
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  mt: 2,
                }}
              >
                <MKTypography variant="body2" color="text.secondary" mb={0.5}>
                  New Balance After Loading:
                </MKTypography>
                <MKTypography variant="h6" fontWeight="bold" color="primary">
                  {formatCurrency(balance + parseFloat(formData.amount || 0))}
                </MKTypography>
              </MKBox>
            )}
          </MKBox>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <MKButton onClick={handleCloseDialog} color="secondary">
            Cancel
          </MKButton>
          <MKButton onClick={handleSubmit} variant="gradient" color="info" disabled={submitting}>
            {submitting ? "Loading..." : "Load Money"}
          </MKButton>
        </DialogActions>
      </Dialog>

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

      {/* Feature Cards */}
      <Grid container spacing={4} sx={{ px: 3 }}>
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              p: 4,
              height: "100%",
              backgroundColor: ({ palette: { white } }) => white.main,
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: ({ boxShadows: { md } }) => md,
              border: ({ borders: { borderWidth }, palette: { black }, functions: { rgba } }) =>
                `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
              overflow: "visible",
              transition: "all 200ms ease-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: ({ boxShadows: { lg } }) => lg,
              },
            }}
          >
            <MKBox textAlign="center" mb={3}>
              <MKBox
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <DashboardIcon sx={{ fontSize: 32, color: "white" }} />
              </MKBox>
              <MKTypography variant="h5" fontWeight="bold" mb={2}>
                Dashboard Overview
              </MKTypography>
              <MKTypography variant="body2" color="text" mb={3} sx={{ lineHeight: 1.6 }}>
                Get comprehensive insights into your data with our intuitive dashboard interface.
              </MKTypography>
            </MKBox>
            <MKButton
              variant="gradient"
              color="info"
              size="large"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Get Started
            </MKButton>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              p: 4,
              height: "100%",
              backgroundColor: ({ palette: { white } }) => white.main,
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: ({ boxShadows: { md } }) => md,
              border: ({ borders: { borderWidth }, palette: { black }, functions: { rgba } }) =>
                `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
              overflow: "visible",
              transition: "all 200ms ease-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: ({ boxShadows: { lg } }) => lg,
              },
            }}
          >
            <MKBox textAlign="center" mb={3}>
              <MKBox
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <AnalyticsIcon sx={{ fontSize: 32, color: "white" }} />
              </MKBox>
              <MKTypography variant="h5" fontWeight="bold" mb={2}>
                Analytics
              </MKTypography>
              <MKTypography variant="body2" color="text" mb={3} sx={{ lineHeight: 1.6 }}>
                Track performance metrics and generate detailed reports for better decision making.
              </MKTypography>
            </MKBox>
            <MKButton
              variant="gradient"
              color="success"
              size="large"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              View Analytics
            </MKButton>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              p: 4,
              height: "100%",
              backgroundColor: ({ palette: { white } }) => white.main,
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              boxShadow: ({ boxShadows: { md } }) => md,
              border: ({ borders: { borderWidth }, palette: { black }, functions: { rgba } }) =>
                `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
              overflow: "visible",
              transition: "all 200ms ease-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: ({ boxShadows: { lg } }) => lg,
              },
            }}
          >
            <MKBox textAlign="center" mb={3}>
              <MKBox
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <SettingsIcon sx={{ fontSize: 32, color: "white" }} />
              </MKBox>
              <MKTypography variant="h5" fontWeight="bold" mb={2}>
                Settings
              </MKTypography>
              <MKTypography variant="body2" color="text" mb={3} sx={{ lineHeight: 1.6 }}>
                Customize your experience with our flexible and intuitive settings panel.
              </MKTypography>
            </MKBox>
            <MKButton
              variant="gradient"
              color="warning"
              size="large"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Configure
            </MKButton>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
