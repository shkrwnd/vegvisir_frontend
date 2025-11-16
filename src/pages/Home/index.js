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
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import FavoriteIcon from "@mui/icons-material/Favorite";

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

// Core
import { useAuth } from "core/context";

// Material Kit 2 PRO React examples

// Custom components
import RutgersWalletCardFinal from "components/custom/RutgersWalletCardFinal";

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
  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [openSendMoneyDialog, setOpenSendMoneyDialog] = useState(false);
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
        // Explicitly refetch the balance to ensure it updates
        await refetch();
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
    <Container
      maxWidth={false}
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        backgroundColor: ({ palette: { background } }) => background.default,
        minHeight: "100vh",
      }}
    >
      {/* Wallet Card Section */}
      <MKBox mb={{ xs: 4, md: 6 }} sx={{ px: { xs: 0, sm: 1, md: 3 } }}>
        <RutgersWalletCardFinal
          userName={user?.full_name || user?.email || "User"}
          balance={formatCurrency(balance)}
          expiryDate={null} // Will be calculated as 2 years from now
          onLoadMoney={handleOpenDialog}
          onRefresh={refetch}
          onSendMoney={() => {
            setOpenSendMoneyDialog(true);
          }}
          isLoading={walletLoading}
          onAddClubCard={() => {
            // TODO: Implement add club card functionality
            showSnackbar(
              "info",
              "info",
              "Coming Soon",
              "Club card feature will be available soon!"
            );
          }}
        />
      </MKBox>

      {/* Send Money Dialog */}
      <Dialog
        open={openSendMoneyDialog}
        onClose={() => setOpenSendMoneyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MKTypography variant="h5" fontWeight="bold">
            Pay
          </MKTypography>
        </DialogTitle>
        <DialogContent>
          <MKBox sx={{ pt: 2 }}>
            <MKTypography variant="body2" color="text.secondary" mb={3}>
              Choose how you want to pay
            </MKTypography>
            <MKBox
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Pay a Friend Option */}
              <Card
                onClick={() => {
                  setOpenSendMoneyDialog(false);
                  showSnackbar(
                    "info",
                    "info",
                    "Pay a Friend",
                    "Pay a friend feature will be available soon!"
                  );
                }}
                sx={{
                  flex: 1,
                  p: 3,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  borderColor: "rgba(204, 0, 0, 0.2)",
                  borderRadius: 3,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(204, 0, 0, 0.2)",
                    borderColor: "primary.main",
                    backgroundColor: "rgba(204, 0, 0, 0.05)",
                  },
                }}
              >
                <MKBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <MKBox
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "rgba(204, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 32, color: "primary.main" }} />
                  </MKBox>
                  <MKTypography variant="h6" fontWeight="bold" mb={1}>
                    Pay a Friend
                  </MKTypography>
                  <MKTypography variant="body2" color="text.secondary">
                    Send money to another user
                  </MKTypography>
                </MKBox>
              </Card>

              {/* Pay a Vendor Option */}
              <Card
                onClick={() => {
                  setOpenSendMoneyDialog(false);
                  showSnackbar(
                    "info",
                    "info",
                    "Marketplace",
                    "Marketplace feature will be available soon!"
                  );
                }}
                sx={{
                  flex: 1,
                  p: 3,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  borderColor: "rgba(204, 0, 0, 0.2)",
                  borderRadius: 3,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(204, 0, 0, 0.2)",
                    borderColor: "primary.main",
                    backgroundColor: "rgba(204, 0, 0, 0.05)",
                  },
                }}
              >
                <MKBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <MKBox
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "rgba(204, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 32, color: "primary.main" }} />
                  </MKBox>
                  <MKTypography variant="h6" fontWeight="bold" mb={1}>
                    Marketplace
                  </MKTypography>
                  <MKTypography variant="body2" color="text.secondary">
                    Make a payment to a campus vendor
                  </MKTypography>
                </MKBox>
              </Card>

              {/* Pay Forward Option */}
              <Card
                onClick={() => {
                  setOpenSendMoneyDialog(false);
                  showSnackbar(
                    "info",
                    "info",
                    "Pay Forward",
                    "Pay forward feature will be available soon!"
                  );
                }}
                sx={{
                  flex: 1,
                  minWidth: { xs: "100%", sm: "calc(50% - 8px)" },
                  p: 3,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid",
                  borderColor: "rgba(204, 0, 0, 0.2)",
                  borderRadius: 3,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(204, 0, 0, 0.2)",
                    borderColor: "primary.main",
                    backgroundColor: "rgba(204, 0, 0, 0.05)",
                  },
                }}
              >
                <MKBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <MKBox
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "rgba(204, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <FavoriteIcon sx={{ fontSize: 32, color: "primary.main" }} />
                  </MKBox>
                  <MKTypography variant="h6" fontWeight="bold" mb={1}>
                    Pay Forward
                  </MKTypography>
                  <MKTypography variant="body2" color="text.secondary">
                    Make a donation or pay it forward
                  </MKTypography>
                </MKBox>
              </Card>
            </MKBox>
          </MKBox>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <MKButton onClick={() => setOpenSendMoneyDialog(false)} color="secondary">
            Cancel
          </MKButton>
        </DialogActions>
      </Dialog>

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

      {/* Transactions Section */}
      <MKBox mb={6} sx={{ px: { xs: 0, sm: 1, md: 3 } }}>
        <MKTypography
          variant="h5"
          fontWeight="bold"
          mb={3}
          sx={{
            color: ({ palette: { text } }) => text.main,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Recent Transactions
        </MKTypography>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: ({ palette: { primary, mode } }) =>
              mode === "dark"
                ? "0 4px 20px rgba(204, 0, 0, 0.2)"
                : "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: ({ palette: { primary, mode } }) =>
              mode === "dark" ? `1px solid rgba(204, 0, 0, 0.3)` : `1px solid rgba(0, 0, 0, 0.1)`,
            overflow: "hidden",
            backgroundColor: ({ palette: { mode, grey, white } }) =>
              mode === "dark" ? grey[200] : white.main,
            color: ({ palette: { text } }) => text.main,
          }}
        >
          {/* Dummy Transactions - Amex Style */}
          {[
            {
              id: 1,
              date: "Dec 15, 2024",
              merchant: "Campus Dining Hall",
              amount: -12.5,
              type: "purchase",
            },
            {
              id: 2,
              date: "Dec 14, 2024",
              merchant: "Bookstore",
              amount: -45.99,
              type: "purchase",
            },
            {
              id: 3,
              date: "Dec 13, 2024",
              merchant: "Flex Dollars Load",
              amount: 100.0,
              type: "load",
            },
            {
              id: 4,
              date: "Dec 12, 2024",
              merchant: "Campus Coffee Shop",
              amount: -5.75,
              type: "purchase",
            },
            {
              id: 5,
              date: "Dec 11, 2024",
              merchant: "Laundry Services",
              amount: -8.0,
              type: "purchase",
            },
            {
              id: 6,
              date: "Dec 10, 2024",
              merchant: "Flex Dollars Load",
              amount: 50.0,
              type: "load",
            },
          ].map((transaction, index) => (
            <MKBox
              key={transaction.id}
              sx={{
                p: { xs: 2, md: 3 },
                borderBottom: ({ palette: { mode, primary, grey } }) =>
                  index < 5
                    ? mode === "dark"
                      ? `1px solid rgba(204, 0, 0, 0.2)`
                      : `1px solid ${grey[200]}`
                    : "none",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: { xs: 1, sm: 0 },
                transition: "background 0.2s ease",
                "&:hover": {
                  backgroundColor: ({ palette: { mode, primary, grey } }) =>
                    mode === "dark" ? "rgba(204, 0, 0, 0.1)" : grey[100],
                },
              }}
            >
              <MKBox sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
                <MKTypography
                  variant="body1"
                  fontWeight="bold"
                  mb={0.5}
                  sx={{
                    color: ({ palette: { text } }) => text.main,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {transaction.merchant}
                </MKTypography>
                <MKTypography
                  variant="body2"
                  sx={{
                    color: ({ palette: { mode, grey, text } }) =>
                      mode === "dark" ? grey[600] : text.secondary || grey[600],
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                  }}
                >
                  {transaction.date}
                </MKTypography>
              </MKBox>
              <MKTypography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: ({ palette: { mode, success, text } }) =>
                    transaction.amount > 0 ? success.main || "#4CAF50" : text.main,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                {transaction.amount > 0 ? "+" : ""}
                {formatCurrency(Math.abs(transaction.amount))}
              </MKTypography>
            </MKBox>
          ))}
        </Card>
      </MKBox>

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
    </Container>
  );
}

export default Home;
