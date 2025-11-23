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

import React, { useState, useEffect, useRef } from "react";

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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import EventIcon from "@mui/icons-material/Event";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
import { useTransactions } from "features/transactions";
import { useDonations } from "features/donations";

// Shared hooks
import { useSnackbar } from "shared/hooks";

// Core
import { useAuth } from "core/context";
import { ROUTES } from "core/config";

// React Router
import { useNavigate } from "react-router-dom";

// Material Kit 2 PRO React examples

// Custom components
import RutgersWalletCardFinal from "components/custom/RutgersWalletCardFinal";

function Home() {
  const navigate = useNavigate();
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
  const { makeDonation, getDonationBox, loading: donationLoading } = useDonations();

  // Fetch top 10 recent transactions
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions();

  // Fetch only 10 transactions on mount
  useEffect(() => {
    refetchTransactions({ skip: 0, limit: 10 });
  }, [refetchTransactions]);

  // Get top 10 transactions sorted by date (most recent first)
  const recentTransactions = transactions
    .sort((a, b) => {
      const dateA = new Date(a.transaction_date || a.created_at);
      const dateB = new Date(b.transaction_date || b.created_at);
      return dateB - dateA; // Descending order (newest first)
    })
    .slice(0, 10);

  const [openDialog, setOpenDialog] = useState(false);
  const [openSendMoneyDialog, setOpenSendMoneyDialog] = useState(false);
  const [openDonationDialog, setOpenDonationDialog] = useState(false);
  const [donationBox, setDonationBox] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    card_id: "",
  });
  const [donationFormData, setDonationFormData] = useState({
    amount: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [donationFormErrors, setDonationFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittingDonation, setSubmittingDonation] = useState(false);
  const [previousBalance, setPreviousBalance] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const cardRefs = useRef([]);

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

  // Fetch donation box on mount
  useEffect(() => {
    const fetchDonationBox = async () => {
      try {
        const data = await getDonationBox();
        setDonationBox(data);
      } catch (err) {
        console.error("Error fetching donation box:", err);
      }
    };
    fetchDonationBox();
  }, [getDonationBox]);

  const handleOpenDonationDialog = async () => {
    setOpenSendMoneyDialog(false);
    // Fetch latest donation box info
    try {
      const data = await getDonationBox();
      setDonationBox(data);
    } catch (err) {
      console.error("Error fetching donation box:", err);
    }
    setDonationFormData({
      amount: "",
      description: "",
    });
    setDonationFormErrors({});
    setOpenDonationDialog(true);
  };

  const handleCloseDonationDialog = () => {
    setOpenDonationDialog(false);
    setDonationFormData({
      amount: "",
      description: "",
    });
    setDonationFormErrors({});
  };

  const validateDonationForm = () => {
    const errors = {};

    if (!donationFormData.amount || donationFormData.amount.trim() === "") {
      errors.amount = "Amount is required";
    } else {
      const amount = parseFloat(donationFormData.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = "Amount must be a positive number";
      } else if (amount > balance) {
        errors.amount = `Amount cannot exceed your wallet balance of ${formatCurrency(balance)}`;
      }
    }

    if (donationFormData.description && donationFormData.description.length > 500) {
      errors.description = "Description must be 500 characters or less";
    }

    setDonationFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDonationInputChange = (e) => {
    const { name, value } = e.target;
    setDonationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (donationFormErrors[name]) {
      setDonationFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    if (!validateDonationForm()) {
      return;
    }

    try {
      setSubmittingDonation(true);

      // Store previous balance before donation
      setPreviousBalance(formatCurrency(balance));

      const donationData = await makeDonation(
        donationFormData.amount,
        donationFormData.description
      );

      // Update donation box total
      if (donationData.donation_box_total !== undefined) {
        setDonationBox((prev) => ({
          ...prev,
          total_amount: donationData.donation_box_total,
        }));
      }

      // Refetch donation box and wallet
      const updatedBox = await getDonationBox();
      setDonationBox(updatedBox);
      await refetch();

      showSnackbar(
        "success",
        "check_circle",
        "Donation Successful!",
        `Thank you for your donation of ${formatCurrency(parseFloat(donationFormData.amount))}!`
      );

      handleCloseDonationDialog();

      // Clear previous balance after animation completes (wait for animation to finish)
      setTimeout(() => {
        setPreviousBalance(null);
      }, 3000); // Wait for full animation to complete
    } catch (err) {
      console.error("Error making donation:", err);
      showSnackbar(
        "error",
        "error",
        "Donation Failed",
        err.response?.data?.message || "Failed to process donation. Please try again."
      );
    } finally {
      setSubmittingDonation(false);
    }
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

  const formatTransactionDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Sample card data for carousel - you can replace this with actual data from your API
  // Note: First card uses actual balance from API, others use sample data
  const walletCards = [
    {
      id: 1,
      userName: user?.full_name || user?.email || "User",
      balance: formatCurrency(balance), // This will be overridden in the component with actual balance
      type: "Flex Dollars",
      walletType: "VIRTUAL WALLET",
      transactions: [
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
      ],
    },
    {
      id: 2,
      userName: "President",
      balance: formatCurrency(balance * 0.5), // Example: different balance
      type: "Student Governing Association",
      walletType: "SGA",
      transactions: [
        {
          id: 1,
          date: "Dec 15, 2024",
          merchant: "Event Supplies - Fall Fest",
          amount: -450.0,
          type: "purchase",
        },
        {
          id: 2,
          date: "Dec 14, 2024",
          merchant: "Student Council Meeting Catering",
          amount: -125.5,
          type: "purchase",
        },
        {
          id: 3,
          date: "Dec 13, 2024",
          merchant: "SGA Budget Allocation",
          amount: 2000.0,
          type: "load",
        },
        {
          id: 4,
          date: "Dec 12, 2024",
          merchant: "Office Supplies - SGA",
          amount: -89.75,
          type: "purchase",
        },
        {
          id: 5,
          date: "Dec 11, 2024",
          merchant: "Speaker Honorarium",
          amount: -500.0,
          type: "purchase",
        },
        {
          id: 6,
          date: "Dec 10, 2024",
          merchant: "SGA Budget Allocation",
          amount: 1500.0,
          type: "load",
        },
      ],
    },
    {
      id: 3,
      userName: "Treasurer",
      balance: formatCurrency(balance * 1.2), // Example: different balance
      type: "Program Board",
      walletType: "PB",
      transactions: [
        {
          id: 1,
          date: "Dec 15, 2024",
          merchant: "Concert Venue Rental",
          amount: -1200.0,
          type: "purchase",
        },
        {
          id: 2,
          date: "Dec 14, 2024",
          merchant: "Artist Performance Fee",
          amount: -2500.0,
          type: "purchase",
        },
        {
          id: 3,
          date: "Dec 13, 2024",
          merchant: "Program Board Budget",
          amount: 5000.0,
          type: "load",
        },
        {
          id: 4,
          date: "Dec 12, 2024",
          merchant: "Sound Equipment Rental",
          amount: -350.0,
          type: "purchase",
        },
        {
          id: 5,
          date: "Dec 11, 2024",
          merchant: "Marketing Materials",
          amount: -175.25,
          type: "purchase",
        },
        {
          id: 6,
          date: "Dec 10, 2024",
          merchant: "Program Board Budget",
          amount: 3000.0,
          type: "load",
        },
      ],
    },
  ];

  // Get transactions for the current card
  const currentCardTransactions = walletCards[currentCardIndex]?.transactions || [];

  const handlePreviousCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex === 0 ? walletCards.length - 1 : prevIndex - 1));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex === walletCards.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        px: { xs: 0.5, sm: 2, md: 3 },
        backgroundColor: ({ palette: { background } }) => background.default,
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Wallet Card Section with Carousel */}
      <MKBox
        mb={{ xs: 4, md: 6 }}
        sx={{
          px: { xs: 0, sm: 1, md: 3 },
          width: "100%",
          overflowX: "hidden",
          overflowY: "visible",
        }}
      >
        <MKBox
          sx={{
            position: "relative",
            maxWidth: { xs: "100%", sm: "600px", md: "750px" },
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 2, md: 3 },
            width: "100%",
            boxSizing: "border-box",
            px: { xs: 0, sm: 1, md: 3 },
          }}
        >
          {/* Left Navigation Button - Outside */}
          {walletCards.length > 1 && (
            <MKBox
              onClick={handlePreviousCard}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "36px", sm: "56px" },
                height: { xs: "36px", sm: "56px" },
                flexShrink: 0,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow:
                  "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(204, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                transition: "all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%)",
                  transform: "scale(1.15)",
                  boxShadow:
                    "0 12px 32px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(204, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                },
                "&:active": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <ChevronLeftIcon
                sx={{
                  fontSize: { xs: "24px", sm: "32px" },
                  color: "#CC0000",
                  filter: "drop-shadow(0 2px 4px rgba(204, 0, 0, 0.2))",
                }}
              />
            </MKBox>
          )}

          {/* Carousel Container */}
          <MKBox
            sx={{
              position: "relative",
              overflow: "hidden",
              flex: 1,
              minWidth: 0,
              width: "100%",
              display: "flex",
            }}
          >
            {/* Cards Container */}
            <MKBox
              sx={{
                display: "flex",
                transform: `translateX(-${currentCardIndex * 100}%)`,
                transition: "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)",
                willChange: "transform",
                width: "100%",
              }}
            >
              {walletCards.map((card, index) => (
                <MKBox
                  key={card.id}
                  sx={{
                    minWidth: "100%",
                    flexShrink: 0,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: { xs: 0, sm: "0 8px", md: "0 12px" },
                  }}
                >
                  <RutgersWalletCardFinal
                    ref={(el) => (cardRefs.current[index] = el)}
                    userName={
                      index === 0 ? user?.full_name || user?.email || "User" : card.userName
                    }
                    balance={index === 0 ? formatCurrency(balance) : card.balance}
                    previousBalance={index === 0 ? previousBalance : null}
                    expiryDate={null} // Will be calculated as 2 years from now
                    onLoadMoney={handleOpenDialog}
                    onRefresh={refetch}
                    onSendMoney={() => {
                      setOpenSendMoneyDialog(true);
                    }}
                    isLoading={walletLoading}
                    hideButtons={true}
                    walletType={card.walletType}
                    cardTheme={index === 0 ? "white" : "black"}
                    defaultBackground={
                      index === 0
                        ? "/IMG_868.JPG"
                        : index === 1
                        ? "/ff44df36-103b-4776-883a-030843546a4b.JPG"
                        : index === 2
                        ? "/2018_02_17_0372_Rutgers_SAS-1x2.jpg"
                        : null
                    }
                  />
                </MKBox>
              ))}
            </MKBox>

            {/* Carousel Indicators */}
            {walletCards.length > 1 && (
              <MKBox
                sx={{
                  position: "absolute",
                  bottom: "24px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  zIndex: 10,
                  padding: "8px 16px",
                  borderRadius: "20px",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                {walletCards.map((_, index) => (
                  <MKBox
                    key={index}
                    onClick={() => setCurrentCardIndex(index)}
                    sx={{
                      width: index === currentCardIndex ? "32px" : "10px",
                      height: "10px",
                      borderRadius: index === currentCardIndex ? "5px" : "50%",
                      background:
                        index === currentCardIndex
                          ? "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)"
                          : "rgba(255, 255, 255, 0.4)",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
                      boxShadow:
                        index === currentCardIndex
                          ? "0 4px 12px rgba(204, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                          : "0 2px 4px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        background:
                          index === currentCardIndex
                            ? "linear-gradient(135deg, #8b0000 0%, #CC0000 100%)"
                            : "rgba(255, 255, 255, 0.7)",
                        transform: "scale(1.2)",
                        boxShadow:
                          index === currentCardIndex
                            ? "0 6px 16px rgba(204, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                            : "0 4px 8px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  />
                ))}
              </MKBox>
            )}
          </MKBox>

          {/* Right Navigation Button - Outside */}
          {walletCards.length > 1 && (
            <MKBox
              onClick={handleNextCard}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "36px", sm: "56px" },
                height: { xs: "36px", sm: "56px" },
                flexShrink: 0,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow:
                  "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(204, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                transition: "all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%)",
                  transform: "scale(1.15)",
                  boxShadow:
                    "0 12px 32px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(204, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                },
                "&:active": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <ChevronRightIcon
                sx={{
                  fontSize: { xs: "24px", sm: "32px" },
                  color: "#CC0000",
                  filter: "drop-shadow(0 2px 4px rgba(204, 0, 0, 0.2))",
                }}
              />
            </MKBox>
          )}
        </MKBox>

        {/* Action Buttons Below Carousel - Fixed Position */}
        <MKBox
          sx={{
            maxWidth: "480px",
            margin: { xs: "16px auto 0", sm: "24px auto 0" },
            px: { xs: 2, sm: 0 },
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: { xs: "12px", sm: "16px" },
            transition: "all 0.3s ease",
          }}
        >
          {/* Pay Button - Main Button - Only show for Virtual Wallet (first card) */}
          {currentCardIndex === 0 && (
            <MKButton
              onClick={() => setOpenSendMoneyDialog(true)}
              disabled={walletLoading}
              variant="gradient"
              color="error"
              fullWidth
              sx={{
                padding: { xs: "14px 24px", sm: "16px 32px" },
                borderRadius: "20px",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 700,
                letterSpacing: "0.5px",
                background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
                boxShadow:
                  "0 8px 24px rgba(204, 0, 0, 0.35), 0 4px 12px rgba(204, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #8b0000 0%, #CC0000 100%)",
                  boxShadow:
                    "0 12px 32px rgba(204, 0, 0, 0.45), 0 6px 16px rgba(204, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginRight: "10px", filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))" }}
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              Pay
            </MKButton>
          )}

          {/* Refresh, Load Money, and Add Background Buttons */}
          <MKBox sx={{ display: "flex", gap: { xs: "8px", sm: "12px" }, flexWrap: "wrap" }}>
            <MKButton
              onClick={refetch}
              disabled={walletLoading}
              variant="outlined"
              color="error"
              sx={{
                flex: { xs: "1 1 auto", sm: 1 },
                minWidth: { xs: "calc(50% - 4px)", sm: "auto" },
                padding: { xs: "12px 16px", sm: "14px 24px" },
                borderRadius: "18px",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                fontWeight: 700,
                textTransform: "none",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(204, 0, 0, 0.2)",
                color: "#CC0000",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(204, 0, 0, 0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
                "&:hover": {
                  background: "rgba(204, 0, 0, 0.05)",
                  border: "2px solid rgba(204, 0, 0, 0.3)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(204, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{
                  marginRight: "8px",
                  animation: walletLoading ? "spin 1s linear infinite" : "none",
                }}
              >
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Refresh
            </MKButton>
            {/* Load Money Button - Only show for Virtual Wallet (first card) */}
            {currentCardIndex === 0 && (
              <MKButton
                onClick={handleOpenDialog}
                disabled={walletLoading}
                variant="outlined"
                color="error"
                sx={{
                  flex: { xs: "1 1 auto", sm: 1 },
                  minWidth: { xs: "calc(50% - 4px)", sm: "auto" },
                  padding: { xs: "12px 16px", sm: "14px 24px" },
                  borderRadius: "18px",
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  fontWeight: 700,
                  textTransform: "none",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(204, 0, 0, 0.2)",
                  color: "#CC0000",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(204, 0, 0, 0.1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
                  "&:hover": {
                    background: "rgba(204, 0, 0, 0.05)",
                    border: "2px solid rgba(204, 0, 0, 0.3)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(204, 0, 0, 0.15)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ marginRight: "8px" }}
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Load Money
              </MKButton>
            )}
            {/* Add Background Button */}
            <MKButton
              onClick={() => {
                // Trigger background upload for the current card
                if (cardRefs.current[currentCardIndex]) {
                  cardRefs.current[currentCardIndex].triggerBackgroundUpload();
                }
              }}
              variant="outlined"
              color="error"
              sx={{
                flex: { xs: "1 1 auto", sm: 1 },
                minWidth: { xs: "100%", sm: "auto" },
                padding: { xs: "12px 16px", sm: "14px 24px" },
                borderRadius: "18px",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                fontWeight: 700,
                textTransform: "none",
                background:
                  "linear-gradient(135deg, rgba(204, 0, 0, 0.08) 0%, rgba(204, 0, 0, 0.12) 100%)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(204, 0, 0, 0.25)",
                color: "#CC0000",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(204, 0, 0, 0.12)",
                transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(204, 0, 0, 0.15) 0%, rgba(204, 0, 0, 0.2) 100%)",
                  border: "2px solid rgba(204, 0, 0, 0.35)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(204, 0, 0, 0.2)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginRight: "8px" }}
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              Add Background
            </MKButton>
          </MKBox>
        </MKBox>
      </MKBox>

      {/* Send Money Dialog */}
      <Dialog
        open={openSendMoneyDialog}
        onClose={() => setOpenSendMoneyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MKTypography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: ({ palette: { text } }) => text.main,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            }}
          >
            Pay
          </MKTypography>
        </DialogTitle>
        <DialogContent>
          <MKBox sx={{ pt: 2 }}>
            <MKTypography
              variant="body1"
              sx={{
                color: ({ palette: { text } }) => text.secondary,
                mb: 3,
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              Choose how you want to pay
            </MKTypography>
            <Grid container spacing={2}>
              {/* Pay a Friend Option */}
              <Grid item xs={12} sm={6}>
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
                    height: "100%",
                    p: 3.5,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1.5px solid",
                    borderColor: "rgba(204, 0, 0, 0.15)",
                    borderRadius: 3,
                    background: ({ palette: { mode, white, grey } }) =>
                      mode === "dark" ? grey[800] : white.main,
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                        : "0 2px 8px rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.02)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 32px rgba(204, 0, 0, 0.4)"
                          : "0 12px 32px rgba(204, 0, 0, 0.25)",
                      borderColor: "rgba(204, 0, 0, 0.4)",
                      background: ({ palette: { mode, grey } }) =>
                        mode === "dark" ? grey[700] : "rgba(204, 0, 0, 0.08)",
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
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(204, 0, 0, 0.2) 0%, rgba(204, 0, 0, 0.1) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                        boxShadow: "0 4px 12px rgba(204, 0, 0, 0.15)",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 36, color: "#CC0000" }} />
                    </MKBox>
                    <MKTypography
                      variant="h6"
                      fontWeight="bold"
                      mb={1}
                      sx={{
                        color: "#000000",
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                      }}
                    >
                      Pay a Friend
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      sx={{
                        color: "#000000",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        opacity: 0.8,
                      }}
                    >
                      Send money to another user
                    </MKTypography>
                  </MKBox>
                </Card>
              </Grid>

              {/* Pay a Vendor Option */}
              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() => {
                    setOpenSendMoneyDialog(false);
                    navigate(ROUTES.MARKETPLACE);
                  }}
                  sx={{
                    height: "100%",
                    p: 3.5,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1.5px solid",
                    borderColor: "rgba(204, 0, 0, 0.15)",
                    borderRadius: 3,
                    background: ({ palette: { mode, white, grey } }) =>
                      mode === "dark" ? grey[800] : white.main,
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                        : "0 2px 8px rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.02)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 32px rgba(204, 0, 0, 0.4)"
                          : "0 12px 32px rgba(204, 0, 0, 0.25)",
                      borderColor: "rgba(204, 0, 0, 0.4)",
                      background: ({ palette: { mode, grey } }) =>
                        mode === "dark" ? grey[700] : "rgba(204, 0, 0, 0.08)",
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
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(204, 0, 0, 0.2) 0%, rgba(204, 0, 0, 0.1) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                        boxShadow: "0 4px 12px rgba(204, 0, 0, 0.15)",
                      }}
                    >
                      <StoreIcon sx={{ fontSize: 36, color: "#CC0000" }} />
                    </MKBox>
                    <MKTypography
                      variant="h6"
                      fontWeight="bold"
                      mb={1}
                      sx={{
                        color: "#000000",
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                      }}
                    >
                      Marketplace
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      sx={{
                        color: "#000000",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        opacity: 0.8,
                      }}
                    >
                      Make a payment to a campus vendor
                    </MKTypography>
                  </MKBox>
                </Card>
              </Grid>

              {/* Pay for Events Option */}
              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() => {
                    setOpenSendMoneyDialog(false);
                    navigate(ROUTES.EVENTS);
                  }}
                  sx={{
                    height: "100%",
                    p: 3.5,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1.5px solid",
                    borderColor: "rgba(204, 0, 0, 0.15)",
                    borderRadius: 3,
                    background: ({ palette: { mode, white, grey } }) =>
                      mode === "dark" ? grey[800] : white.main,
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                        : "0 2px 8px rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.02)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 32px rgba(204, 0, 0, 0.4)"
                          : "0 12px 32px rgba(204, 0, 0, 0.25)",
                      borderColor: "rgba(204, 0, 0, 0.4)",
                      background: ({ palette: { mode, grey } }) =>
                        mode === "dark" ? grey[700] : "rgba(204, 0, 0, 0.08)",
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
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(204, 0, 0, 0.2) 0%, rgba(204, 0, 0, 0.1) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                        boxShadow: "0 4px 12px rgba(204, 0, 0, 0.15)",
                      }}
                    >
                      <EventIcon sx={{ fontSize: 36, color: "#CC0000" }} />
                    </MKBox>
                    <MKTypography
                      variant="h6"
                      fontWeight="bold"
                      mb={1}
                      sx={{
                        color: "#000000",
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                      }}
                    >
                      Pay for Events
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      sx={{
                        color: "#000000",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        opacity: 0.8,
                      }}
                    >
                      Purchase tickets for campus events
                    </MKTypography>
                  </MKBox>
                </Card>
              </Grid>

              {/* Donate Option */}
              <Grid item xs={12} sm={6}>
                <Card
                  onClick={handleOpenDonationDialog}
                  sx={{
                    height: "100%",
                    p: 3.5,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1.5px solid",
                    borderColor: "rgba(244, 67, 54, 0.2)",
                    borderRadius: 3,
                    background: ({ palette: { mode, white, grey } }) =>
                      mode === "dark" ? grey[800] : white.main,
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "0 2px 8px rgba(244, 67, 54, 0.2)"
                        : "0 2px 8px rgba(244, 67, 54, 0.12)",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.02)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 32px rgba(244, 67, 54, 0.4)"
                          : "0 12px 32px rgba(244, 67, 54, 0.3)",
                      borderColor: "rgba(244, 67, 54, 0.5)",
                      background: ({ palette: { mode, grey } }) =>
                        mode === "dark" ? grey[700] : "rgba(244, 67, 54, 0.1)",
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
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(244, 67, 54, 0.25) 0%, rgba(244, 67, 54, 0.15) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                        boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 36, color: "#F44336" }} />
                    </MKBox>
                    <MKTypography
                      variant="h6"
                      fontWeight="bold"
                      mb={1}
                      sx={{
                        color: "#000000",
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                      }}
                    >
                      Donate
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      sx={{
                        color: "#000000",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        opacity: 0.8,
                      }}
                    >
                      Support campus initiatives
                    </MKTypography>
                    {donationBox && (
                      <MKTypography
                        variant="caption"
                        mt={1.5}
                        sx={{
                          fontWeight: 600,
                          color: "#F44336",
                          fontSize: "0.8125rem",
                        }}
                      >
                        Total: {formatCurrency(donationBox.total_amount || 0)}
                      </MKTypography>
                    )}
                  </MKBox>
                </Card>
              </Grid>
            </Grid>
          </MKBox>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <MKButton
            onClick={() => setOpenSendMoneyDialog(false)}
            variant="outlined"
            sx={{
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Cancel
          </MKButton>
        </DialogActions>
      </Dialog>

      {/* Donation Dialog */}
      <Dialog open={openDonationDialog} onClose={handleCloseDonationDialog} maxWidth="sm" fullWidth>
        <MKBox component="form" onSubmit={handleDonationSubmit}>
          <DialogTitle>
            <MKBox display="flex" alignItems="center" gap={1}>
              <FavoriteIcon sx={{ color: "error.main" }} />
              <MKTypography variant="h5" fontWeight="bold">
                Make a Donation
              </MKTypography>
            </MKBox>
          </DialogTitle>
          <DialogContent>
            <MKBox sx={{ pt: 2 }}>
              {donationBox && (
                <MKBox
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: ({ palette: { error } }) => `${error.main}10`,
                    border: ({ palette: { error } }) => `1px solid ${error.main}30`,
                  }}
                >
                  <MKTypography variant="body2" color="text.secondary" mb={0.5}>
                    Total Donated
                  </MKTypography>
                  <MKTypography variant="h5" fontWeight="bold" color="error.main">
                    {formatCurrency(donationBox.total_amount || 0)}
                  </MKTypography>
                </MKBox>
              )}

              <Grid container spacing={3}>
                {/* Amount Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Donation Amount"
                    name="amount"
                    type="number"
                    value={donationFormData.amount}
                    onChange={handleDonationInputChange}
                    error={!!donationFormErrors.amount}
                    helperText={
                      donationFormErrors.amount || `Your wallet balance: ${formatCurrency(balance)}`
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                      inputProps: {
                        min: 0.01,
                        step: 0.01,
                      },
                    }}
                    disabled={submittingDonation || donationLoading}
                    required
                  />
                </Grid>

                {/* Description Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    name="description"
                    value={donationFormData.description}
                    onChange={handleDonationInputChange}
                    error={!!donationFormErrors.description}
                    helperText={
                      donationFormErrors.description ||
                      `${donationFormData.description.length}/500 characters`
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon />
                        </InputAdornment>
                      ),
                    }}
                    multiline
                    rows={4}
                    disabled={submittingDonation || donationLoading}
                    inputProps={{
                      maxLength: 500,
                    }}
                  />
                </Grid>
              </Grid>
            </MKBox>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <MKButton
              type="button"
              onClick={handleCloseDonationDialog}
              color="secondary"
              disabled={submittingDonation}
            >
              Cancel
            </MKButton>
            <MKButton
              type="submit"
              variant="gradient"
              color="error"
              disabled={submittingDonation || donationLoading || !donationFormData.amount}
              startIcon={
                submittingDonation ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FavoriteIcon />
                )
              }
            >
              {submittingDonation ? "Processing..." : "Donate"}
            </MKButton>
          </DialogActions>
        </MKBox>
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
        <MKBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
        >
          <MKTypography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: ({ palette: { text } }) => text.main,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Recent Transactions
            {currentCardIndex > 0
              ? ` - ${walletCards[currentCardIndex]?.type || "Transactions"}`
              : ""}
          </MKTypography>
          {currentCardIndex === 0 && (
            <MKButton
              variant="outlined"
              color="info"
              size="medium"
              onClick={() => navigate(ROUTES.TRANSACTIONS)}
              endIcon={<Icon>arrow_forward</Icon>}
            >
              View All Transactions
            </MKButton>
          )}
        </MKBox>
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
            transition: "all 0.3s ease",
          }}
        >
          {/* Transactions - Show API transactions for first card, sample transactions for others */}
          {currentCardIndex === 0 ? (
            // Actual transactions from API for Virtual Wallet
            transactionsLoading ? (
              <MKBox display="flex" justifyContent="center" alignItems="center" py={6}>
                <CircularProgress />
              </MKBox>
            ) : transactionsError ? (
              <MKBox p={3} textAlign="center">
                <MKTypography variant="body2" color="error">
                  Error loading transactions: {transactionsError}
                </MKTypography>
              </MKBox>
            ) : recentTransactions.length === 0 ? (
              <MKBox p={3} textAlign="center">
                <MKTypography variant="body2" color="text.secondary">
                  No transactions found
                </MKTypography>
              </MKBox>
            ) : (
              recentTransactions.map((transaction, index) => (
                <MKBox
                  key={transaction.id}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderBottom: ({ palette: { mode, primary, grey } }) =>
                      index < recentTransactions.length - 1
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
                      {transaction.description || "Transaction"}
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      sx={{
                        color: ({ palette: { mode, grey, text } }) =>
                          mode === "dark" ? grey[600] : text.secondary || grey[600],
                        fontSize: { xs: "0.8rem", md: "0.875rem" },
                      }}
                    >
                      {formatTransactionDate(
                        transaction.transaction_date || transaction.created_at
                      )}
                    </MKTypography>
                  </MKBox>
                  <MKTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: ({ palette: { mode, success, error, text } }) => {
                        // If transaction has payment_method, it's a payment (expense) - show in red
                        // Otherwise, it's a credit/load (income) - show in green
                        const isPayment = !!transaction.payment_method;
                        return isPayment ? error.main || "#F44335" : success.main || "#4CAF50";
                      },
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    {transaction.payment_method ? "-" : "+"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </MKTypography>
                </MKBox>
              ))
            )
          ) : // Sample transactions for other cards
          currentCardTransactions.length > 0 ? (
            currentCardTransactions.map((transaction, index) => (
              <MKBox
                key={transaction.id}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderBottom: ({ palette: { mode, primary, grey } }) =>
                    index < currentCardTransactions.length - 1
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
            ))
          ) : (
            <MKBox
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: "center",
              }}
            >
              <MKTypography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                No transactions found for this card
              </MKTypography>
            </MKBox>
          )}
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
