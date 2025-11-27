/**
=========================================================
* Material Kit 2 PRO React - v2.1.1
=========================================================
*
* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2025 Made by Vegvisir Team
*
Coded by Vegvisir Team
*
 =========================================================
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState, useEffect, useMemo } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme as useMUITheme } from "@mui/material/styles";

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

// Recharts components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { analytics, loading, error, fetchAnalytics } = useTransactionAnalytics();
  const muiTheme = useMUITheme();
  const isDarkMode = muiTheme.palette.mode === "dark";

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

  // Calculate future projections based on historical patterns
  const calculateProjections = (historicalData, daysToProject = 7) => {
    if (!historicalData || historicalData.length === 0) return [];

    // Use average of recent days (last 7 or all if less than 7)
    const recentDays = historicalData.slice(-7);
    const average = recentDays.reduce((sum, item) => sum + item.total, 0) / recentDays.length;

    // Calculate trend using simple linear regression
    const n = historicalData.length;
    const xValues = historicalData.map((_, i) => i);
    const yValues = historicalData.map((item) => item.total);

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate future dates and projected values
    const projections = [];
    const lastDate = new Date(historicalData[historicalData.length - 1].period);

    for (let i = 1; i <= daysToProject; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);

      // Project using trend line, but don't go below 0
      const projectedValue = slope * (n + i - 1) + intercept;
      // Use average if trend gives negative or very low values
      const finalValue = projectedValue > 0 ? Math.max(projectedValue, average * 0.5) : average;

      projections.push({
        period: futureDate.toISOString(),
        total: finalValue,
        isProjected: true,
      });
    }

    return projections;
  };

  // Format date for chart (short format)
  const formatDateForChart = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  // Prepare chart data with historical and projected values
  const chartData = useMemo(() => {
    if (!analytics?.spending_over_time || analytics.spending_over_time.length === 0) return [];

    const historical = analytics.spending_over_time.map((item) => ({
      date: formatDateForChart(item.period),
      dateFull: item.period,
      spending: item.total,
      projected: null,
      isProjected: false,
    }));

    const projections = calculateProjections(analytics.spending_over_time, 7);
    const projected = projections.map((item) => ({
      date: formatDateForChart(item.period),
      dateFull: item.period,
      spending: null,
      projected: item.total,
      isProjected: true,
    }));

    // Combine historical and projected data
    return [...historical, ...projected];
  }, [analytics]);

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox
        mb={6}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4, md: 5 },
          background:
            "linear-gradient(135deg, rgba(204, 0, 0, 0.1) 0%, rgba(204, 0, 0, 0.05) 100%)",
          borderRadius: 3,
          border: "1px solid rgba(204, 0, 0, 0.2)",
          boxShadow: "0 4px 20px rgba(204, 0, 0, 0.1)",
        }}
      >
        <MKBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <MKBox>
            <MKBox display="flex" alignItems="center" gap={2} mb={2}>
              <MKBox
                sx={{
                  width: { xs: "4px", sm: "6px" },
                  height: { xs: "40px", sm: "50px" },
                  background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
                  borderRadius: "4px",
                  boxShadow: "0 4px 12px rgba(204, 0, 0, 0.3)",
                }}
              />
              <MKTypography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                  letterSpacing: "0.5px",
                  lineHeight: 1.2,
                }}
              >
                Transaction Analytics
              </MKTypography>
            </MKBox>
            <MKTypography
              variant="body1"
              sx={{
                color: ({ palette: { text } }) => text.main,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                lineHeight: 1.6,
                opacity: 0.9,
                pl: { xs: 3, sm: 4 },
              }}
            >
              Analyze your spending patterns and track your financial activity
            </MKTypography>
          </MKBox>
          <MKButton
            variant="outlined"
            color="info"
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<RefreshIcon />}
            sx={{
              color: "#CC0000",
              borderColor: "#CC0000",
              "&:hover": {
                borderColor: "#CC0000",
                backgroundColor: "rgba(204, 0, 0, 0.05)",
              },
            }}
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
              mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255,255,255,0.8)",
            border: ({ palette: { mode } }) =>
              mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}
        >
          <MKBox display="flex" alignItems="center" mb={2.5}>
            <CalendarTodayIcon sx={{ fontSize: 24, mr: 1.5, color: "#ffffff" }} />
            <MKTypography variant="h6" fontWeight="bold" sx={{ color: "#ffffff" }}>
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
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffffff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#ffffff",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
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
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffffff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#ffffff",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
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
                        ? "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)"
                        : "linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(233, 30, 99, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
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
                          mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(233, 30, 99, 0.1)",
                        mr: 2,
                      }}
                    >
                      <AttachMoneyIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" sx={{ color: "#ffffff" }} fontWeight="medium">
                        Total Spending
                      </MKTypography>
                      <MKTypography variant="h4" fontWeight="bold" sx={{ color: "#ffffff" }}>
                        {formatCurrency(totalSpending)}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  {analytics.period && (
                    <MKTypography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
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
                        ? "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)"
                        : "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
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
                          mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(33, 150, 243, 0.1)",
                        mr: 2,
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" sx={{ color: "#ffffff" }} fontWeight="medium">
                        Average Daily
                      </MKTypography>
                      <MKTypography variant="h4" fontWeight="bold" sx={{ color: "#ffffff" }}>
                        {formatCurrency(averageSpending)}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  <MKTypography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
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
                        ? "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)"
                        : "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
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
                          mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(76, 175, 80, 0.1)",
                        mr: 2,
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" sx={{ color: "#ffffff" }} fontWeight="medium">
                        Categories
                      </MKTypography>
                      <MKTypography variant="h4" fontWeight="bold" sx={{ color: "#ffffff" }}>
                        {categoryCount}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  <MKTypography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
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
                        ? "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)"
                        : "linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.03) 100%)",
                    border: ({ palette: { mode } }) =>
                      mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
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
                          mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 152, 0, 0.1)",
                        mr: 2,
                      }}
                    >
                      <ShoppingCartIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="body2" sx={{ color: "#ffffff" }} fontWeight="medium">
                        Top Category
                      </MKTypography>
                      <MKTypography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#ffffff" }}
                        textTransform="capitalize"
                      >
                        {topCategory ? topCategory.category : "N/A"}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  <MKTypography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {topCategory ? formatCurrency(topCategory.total) : "No data"}
                  </MKTypography>
                </Card>
              </Grid>
            </Grid>
          </MKBox>

          {/* Daily Spending Graph with Projections */}
          <MKBox mb={4} sx={{ px: 3 }}>
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: ({ palette: { mode } }) =>
                  mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
                background: ({ palette: { mode } }) =>
                  mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.8)",
                border: ({ palette: { mode } }) =>
                  mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                    />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: isDarkMode ? "#fff" : "#000" }}
                    />
                    <YAxis
                      tick={{ fill: isDarkMode ? "#fff" : "#000" }}
                      label={{
                        value: "Spending ($)",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          textAnchor: "middle",
                          fill: isDarkMode ? "#fff" : "#000",
                        },
                      }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (value === null) return null;
                        return [
                          formatCurrency(value),
                          name === "spending" ? "Historical" : "Projected",
                        ];
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: isDarkMode
                          ? "rgba(30, 30, 30, 0.95)"
                          : "rgba(255, 255, 255, 0.95)",
                        border: isDarkMode
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "1px solid rgba(0,0,0,0.2)",
                        borderRadius: 8,
                        color: isDarkMode ? "#fff" : "#000",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: 20,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="spending"
                      stroke="#e91e63"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#e91e63" }}
                      activeDot={{ r: 6 }}
                      name="Historical Spending"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      stroke="#2196f3"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: "#2196f3" }}
                      activeDot={{ r: 6 }}
                      name="Projected Spending"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
                  <TrendingUpIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 1, opacity: 0.5 }}
                  />
                  <MKTypography variant="body2" color="text.secondary">
                    No spending data available for chart
                  </MKTypography>
                </MKBox>
              )}
            </Card>
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
                    mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255,255,255,0.8)",
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
                        mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(25, 118, 210, 0.1)",
                      mr: 1.5,
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                  </MKBox>
                  <MKTypography variant="h5" fontWeight="bold" sx={{ color: "#ffffff" }}>
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
                                    sx={{ color: "#ffffff" }}
                                  >
                                    {item.category}
                                  </MKTypography>
                                  <MKTypography
                                    variant="caption"
                                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                  >
                                    {categoryPercentage.toFixed(1)}% of total
                                  </MKTypography>
                                </MKBox>
                              </MKBox>
                              <MKBox textAlign="right">
                                <MKTypography
                                  variant="h6"
                                  fontWeight="bold"
                                  sx={{ color: "#ffffff" }}
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
                    mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255,255,255,0.8)",
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
                        mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(33, 150, 243, 0.1)",
                      mr: 1.5,
                    }}
                  >
                    <TimelineIcon sx={{ fontSize: 28, color: "#ffffff" }} />
                  </MKBox>
                  <MKTypography variant="h5" fontWeight="bold" sx={{ color: "#ffffff" }}>
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
                                sx={{ fontSize: 20, color: "#ffffff", opacity: 0.7 }}
                              />
                              <MKBox>
                                <MKTypography
                                  variant="body1"
                                  fontWeight="medium"
                                  sx={{ color: "#ffffff" }}
                                >
                                  {formatDate(item.period)}
                                </MKTypography>
                                <MKTypography
                                  variant="caption"
                                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                >
                                  {percentage.toFixed(1)}% of peak
                                </MKTypography>
                              </MKBox>
                            </MKBox>
                            <MKTypography variant="h6" fontWeight="bold" sx={{ color: "#ffffff" }}>
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
