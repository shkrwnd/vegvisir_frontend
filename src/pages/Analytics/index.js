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

import React, { useState, useEffect } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// @mui icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CategoryIcon from "@mui/icons-material/Category";
import TimelineIcon from "@mui/icons-material/Timeline";
import RefreshIcon from "@mui/icons-material/Refresh";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

// Features
import { useTransactionAnalytics } from "features/transactions";

function Analytics() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { analytics, loading, error, fetchAnalytics } = useTransactionAnalytics();

  // Set default date range to current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDateForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDateForInput(firstDay));
    setEndDate(formatDateForInput(lastDay));
  }, []);

  // Fetch analytics when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const startDateTime = `${startDate}T00:00:00`;
      const endDateTime = `${endDate}T23:59:59`;
      fetchAnalytics({ start_date: startDateTime, end_date: endDateTime });
    }
  }, [startDate, endDate, fetchAnalytics]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      dining: "error",
      books: "info",
      transportation: "warning",
      entertainment: "success",
      services: "secondary",
      other: "default",
    };
    return colors[category] || "default";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      dining: "🍽️",
      books: "📚",
      transportation: "🚗",
      entertainment: "🎬",
      services: "🔧",
      other: "📦",
    };
    return icons[category] || "📦";
  };

  const handleRefresh = () => {
    if (startDate && endDate) {
      const startDateTime = `${startDate}T00:00:00`;
      const endDateTime = `${endDate}T23:59:59`;
      fetchAnalytics({ start_date: startDateTime, end_date: endDateTime });
    }
  };

  // Calculate max spending for progress bars
  const maxCategorySpending =
    analytics?.spending_by_category?.reduce((max, item) => Math.max(max, item.total), 0) || 0;

  const maxTimeSpending =
    analytics?.spending_over_time?.reduce((max, item) => Math.max(max, item.total), 0) || 0;

  // Calculate additional metrics
  const totalSpending = analytics?.total_spending || 0;
  const categoryCount = analytics?.spending_by_category?.length || 0;
  const timePeriodCount = analytics?.spending_over_time?.length || 0;
  const averageSpending =
    timePeriodCount > 0
      ? analytics?.spending_over_time?.reduce((sum, item) => sum + item.total, 0) / timePeriodCount
      : 0;
  const topCategory =
    analytics?.spending_by_category?.length > 0
      ? analytics.spending_by_category.reduce((max, item) => (item.total > max.total ? item : max))
      : null;

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox mb={6} sx={{ px: 3 }}>
        <MKBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <MKBox>
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              Transaction Analytics
            </MKTypography>
            <MKTypography variant="body2" color="text.secondary">
              Analyze your spending patterns and track your financial activity
            </MKTypography>
          </MKBox>
          <MKButton
            variant="gradient"
            color="info"
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </MKButton>
        </MKBox>
      </MKBox>

      {/* Date Range Selector */}
      <MKBox mb={4} sx={{ px: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: ({ palette: { mode } }) =>
              mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
            background: ({ palette: { mode } }) =>
              mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
            border: ({ palette: { mode } }) =>
              mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}
        >
          <MKBox display="flex" alignItems="center" mb={2.5}>
            <CalendarTodayIcon sx={{ fontSize: 24, mr: 1.5, color: "primary.main" }} />
            <MKTypography variant="h6" fontWeight="bold">
              Select Date Range
            </MKTypography>
          </MKBox>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </MKBox>

      {/* Error State */}
      {error && (
        <MKBox sx={{ px: 3, mb: 4 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "error.lighter",
              border: "1px solid",
              borderColor: "error.main",
            }}
          >
            <MKTypography variant="body1" color="error">
              {error}
            </MKTypography>
          </Card>
        </MKBox>
      )}

      {/* Loading State */}
      {loading && (
        <MKBox sx={{ px: 3, mb: 4 }}>
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Card>
        </MKBox>
      )}

      {/* Analytics Content */}
      {!loading && analytics && (
        <>
          {/* Key Metrics Cards */}
          <MKBox mb={4} sx={{ px: 3 }}>
            <Grid container spacing={3}>
              {/* Total Spending Card */}
              <Grid item xs={12} sm={6} lg={3}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
                    background: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "linear-gradient(135deg, rgba(233, 30, 99, 0.15) 0%, rgba(233, 30, 99, 0.05) 100%)"
                        : "linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(233, 30, 99, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(233, 30, 99, 0.2)" : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 40px rgba(0,0,0,0.4)"
                          : "0 12px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <MKBox display="flex" alignItems="center" mb={2}>
                    <MKBox
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: ({ palette: { mode } }) =>
                          mode === "dark" ? "rgba(233, 30, 99, 0.2)" : "rgba(233, 30, 99, 0.1)",
                        mr: 2,
                      }}
                    >
                      <AttachMoneyIcon sx={{ fontSize: 28, color: "error.main" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" color="text.secondary" fontWeight="medium">
                        Total Spending
                      </MKTypography>
                      <MKTypography variant="h4" fontWeight="bold" color="error.main">
                        {formatCurrency(totalSpending)}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  {analytics.period && (
                    <MKTypography variant="caption" color="text.secondary">
                      {formatDate(analytics.period.start_date)} -{" "}
                      {formatDate(analytics.period.end_date)}
                    </MKTypography>
                  )}
                </Card>
              </Grid>

              {/* Average Spending Card */}
              <Grid item xs={12} sm={6} lg={3}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
                    background: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.05) 100%)"
                        : "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(33, 150, 243, 0.2)" : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 40px rgba(0,0,0,0.4)"
                          : "0 12px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <MKBox display="flex" alignItems="center" mb={2}>
                    <MKBox
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: ({ palette: { mode } }) =>
                          mode === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)",
                        mr: 2,
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 28, color: "info.main" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" color="text.secondary" fontWeight="medium">
                        Average Daily
                      </MKTypography>
                      <MKTypography variant="h4" fontWeight="bold" color="info.main">
                        {formatCurrency(averageSpending)}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  <MKTypography variant="caption" color="text.secondary">
                    Per time period
                  </MKTypography>
                </Card>
              </Grid>

              {/* Categories Count Card */}
              <Grid item xs={12} sm={6} lg={3}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
                    background: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%)"
                        : "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(76, 175, 80, 0.2)" : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 40px rgba(0,0,0,0.4)"
                          : "0 12px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <MKBox display="flex" alignItems="center" mb={2}>
                    <MKBox
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: ({ palette: { mode } }) =>
                          mode === "dark" ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)",
                        mr: 2,
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 28, color: "success.main" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" color="text.secondary" fontWeight="medium">
                        Categories
                      </MKTypography>
                      <MKTypography variant="h4" fontWeight="bold" color="success.main">
                        {categoryCount}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  <MKTypography variant="caption" color="text.secondary">
                    Active categories
                  </MKTypography>
                </Card>
              </Grid>

              {/* Top Category Card */}
              <Grid item xs={12} sm={6} lg={3}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
                    background: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.05) 100%)"
                        : "linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(255, 152, 0, 0.2)" : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: ({ palette: { mode } }) =>
                        mode === "dark"
                          ? "0 12px 40px rgba(0,0,0,0.4)"
                          : "0 12px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <MKBox display="flex" alignItems="center" mb={2}>
                    <MKBox
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: ({ palette: { mode } }) =>
                          mode === "dark" ? "rgba(255, 152, 0, 0.2)" : "rgba(255, 152, 0, 0.1)",
                        mr: 2,
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: 28, color: "warning.main" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" color="text.secondary" fontWeight="medium">
                        Top Category
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        color="warning.main"
                        textTransform="capitalize"
                      >
                        {topCategory ? topCategory.category : "N/A"}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  <MKTypography variant="caption" color="text.secondary">
                    {topCategory ? formatCurrency(topCategory.total) : "No data"}
                  </MKTypography>
                </Card>
              </Grid>
            </Grid>
          </MKBox>

          <Grid container spacing={4} sx={{ px: 3 }}>
            {/* Spending by Category */}
            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: ({ palette: { mode } }) =>
                    mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
                  background: ({ palette: { mode } }) =>
                    mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
                  border: ({ palette: { mode } }) =>
                    mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                <MKBox display="flex" alignItems="center" mb={3}>
                  <MKBox
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: ({ palette: { mode } }) =>
                        mode === "dark" ? "rgba(25, 118, 210, 0.2)" : "rgba(25, 118, 210, 0.1)",
                      mr: 1.5,
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 28, color: "primary.main" }} />
                  </MKBox>
                  <MKTypography variant="h5" fontWeight="bold">
                    Spending by Category
                  </MKTypography>
                </MKBox>

                {analytics.spending_by_category && analytics.spending_by_category.length > 0 ? (
                  <MKBox>
                    {analytics.spending_by_category
                      .sort((a, b) => b.total - a.total)
                      .map((item, index) => {
                        const percentage =
                          maxCategorySpending > 0 ? (item.total / maxCategorySpending) * 100 : 0;
                        const categoryPercentage =
                          totalSpending > 0 ? (item.total / totalSpending) * 100 : 0;
                        return (
                          <MKBox
                            key={index}
                            mb={3}
                            p={2}
                            sx={{
                              borderRadius: 2,
                              backgroundColor: ({ palette: { mode } }) =>
                                mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                              transition: "background-color 0.2s ease",
                              "&:hover": {
                                backgroundColor: ({ palette: { mode } }) =>
                                  mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                              },
                            }}
                          >
                            <MKBox
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={1.5}
                            >
                              <MKBox display="flex" alignItems="center" gap={1.5}>
                                <MKTypography variant="h5">
                                  {getCategoryIcon(item.category)}
                                </MKTypography>
                                <MKBox>
                                  <MKTypography
                                    variant="body1"
                                    fontWeight="bold"
                                    textTransform="capitalize"
                                    mb={0.25}
                                  >
                                    {item.category}
                                  </MKTypography>
                                  <MKTypography variant="caption" color="text.secondary">
                                    {categoryPercentage.toFixed(1)}% of total
                                  </MKTypography>
                                </MKBox>
                              </MKBox>
                              <MKBox textAlign="right">
                                <MKTypography
                                  variant="h6"
                                  fontWeight="bold"
                                  color={getCategoryColor(item.category) + ".main"}
                                >
                                  {formatCurrency(item.total)}
                                </MKTypography>
                              </MKBox>
                            </MKBox>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: ({ palette: { mode } }) =>
                                  mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 5,
                                  backgroundColor: ({ palette }) =>
                                    palette[getCategoryColor(item.category)]?.main ||
                                    palette.primary.main,
                                },
                              }}
                            />
                          </MKBox>
                        );
                      })}
                  </MKBox>
                ) : (
                  <MKBox
                    p={4}
                    textAlign="center"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: ({ palette: { mode } }) =>
                        mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <CategoryIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 1, opacity: 0.5 }}
                    />
                    <MKTypography variant="body2" color="text.secondary">
                      No category data available
                    </MKTypography>
                  </MKBox>
                )}
              </Card>
            </Grid>

            {/* Spending Over Time */}
            <Grid item xs={12} lg={6}>
              <Card
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: ({ palette: { mode } }) =>
                    mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
                  background: ({ palette: { mode } }) =>
                    mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
                  border: ({ palette: { mode } }) =>
                    mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                <MKBox display="flex" alignItems="center" mb={3}>
                  <MKBox
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: ({ palette: { mode } }) =>
                        mode === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)",
                      mr: 1.5,
                    }}
                  >
                    <TimelineIcon sx={{ fontSize: 28, color: "info.main" }} />
                  </MKBox>
                  <MKTypography variant="h5" fontWeight="bold">
                    Spending Over Time
                  </MKTypography>
                </MKBox>

                {analytics.spending_over_time && analytics.spending_over_time.length > 0 ? (
                  <MKBox>
                    {analytics.spending_over_time.map((item, index) => {
                      const percentage =
                        maxTimeSpending > 0 ? (item.total / maxTimeSpending) * 100 : 0;
                      return (
                        <MKBox
                          key={index}
                          mb={3}
                          p={2}
                          sx={{
                            borderRadius: 2,
                            backgroundColor: ({ palette: { mode } }) =>
                              mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                            transition: "background-color 0.2s ease",
                            "&:hover": {
                              backgroundColor: ({ palette: { mode } }) =>
                                mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                            },
                          }}
                        >
                          <MKBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1.5}
                          >
                            <MKBox display="flex" alignItems="center" gap={1.5}>
                              <CalendarTodayIcon
                                sx={{ fontSize: 20, color: "info.main", opacity: 0.7 }}
                              />
                              <MKBox>
                                <MKTypography variant="body1" fontWeight="medium">
                                  {formatDate(item.period)}
                                </MKTypography>
                                <MKTypography variant="caption" color="text.secondary">
                                  {percentage.toFixed(1)}% of peak
                                </MKTypography>
                              </MKBox>
                            </MKBox>
                            <MKTypography variant="h6" fontWeight="bold" color="info.main">
                              {formatCurrency(item.total)}
                            </MKTypography>
                          </MKBox>
                          <Box
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: ({ palette: { mode } }) =>
                                mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                width: `${percentage}%`,
                                background: ({ palette: { mode } }) =>
                                  mode === "dark"
                                    ? "linear-gradient(90deg, rgba(33, 150, 243, 0.8) 0%, rgba(33, 150, 243, 0.6) 100%)"
                                    : "linear-gradient(90deg, rgba(33, 150, 243, 1) 0%, rgba(33, 150, 243, 0.8) 100%)",
                                borderRadius: 5,
                                transition: "width 0.5s ease",
                                boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
                              }}
                            />
                          </Box>
                        </MKBox>
                      );
                    })}
                  </MKBox>
                ) : (
                  <MKBox
                    p={4}
                    textAlign="center"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: ({ palette: { mode } }) =>
                        mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <TimelineIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 1, opacity: 0.5 }}
                    />
                    <MKTypography variant="body2" color="text.secondary">
                      No time series data available
                    </MKTypography>
                  </MKBox>
                )}
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && !analytics && (
        <MKBox sx={{ px: 3 }}>
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <MKTypography variant="body1" color="text.secondary">
              Select a date range to view analytics
            </MKTypography>
          </Card>
        </MKBox>
      )}
    </Container>
  );
}

export default Analytics;
