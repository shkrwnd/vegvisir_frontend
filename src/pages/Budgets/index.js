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

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKInput from "components/base/MKInput";
import MKSnackbar from "components/base/MKSnackbar";

// @mui icons
import Icon from "@mui/material/Icon";

// Features
import { useBudgets } from "features/budgets";

// Shared hooks
import { useSnackbar } from "shared/hooks";

function Budgets() {
  const { budgets, loading, error, createBudget, updateBudget, deleteBudget, refetch } =
    useBudgets(true);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    limit_amount: "",
    period: "monthly",
    start_date: "",
    end_date: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleOpenDialog = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        category: budget.category || "",
        limit_amount: budget.limit_amount || "",
        period: budget.period || "monthly",
        start_date: budget.start_date || "",
        end_date: budget.end_date || "",
      });
    } else {
      setEditingBudget(null);
      setFormData({
        category: "",
        limit_amount: "",
        period: "monthly",
        start_date: "",
        end_date: "",
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBudget(null);
    setFormData({
      category: "",
      limit_amount: "",
      period: "monthly",
      start_date: "",
      end_date: "",
    });
    setFormErrors({});
  };

  const handleMenuOpen = (event, budgetId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBudgetId(budgetId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedBudgetId(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    if (!formData.limit_amount || parseFloat(formData.limit_amount) <= 0) {
      errors.limit_amount = "Limit amount must be greater than 0";
    }

    if (!formData.period) {
      errors.period = "Period is required";
    }

    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      errors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      errors.end_date = "End date must be after start date";
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
      const budgetData = {
        category: formData.category.trim(),
        limit_amount: parseFloat(formData.limit_amount),
        period: formData.period,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      let result;
      if (editingBudget) {
        const budgetId = editingBudget.id;
        result = await updateBudget(budgetId, budgetData);
        if (result.success) {
          showSnackbar("success", "check_circle", "Success", "Budget updated successfully!");
        } else {
          showSnackbar("error", "error", "Error", result.error || "Failed to update budget");
        }
      } else {
        result = await createBudget(budgetData);
        if (result.success) {
          showSnackbar("success", "check_circle", "Success", "Budget created successfully!");
        } else {
          showSnackbar("error", "error", "Error", result.error || "Failed to create budget");
        }
      }

      if (result.success) {
        handleCloseDialog();
      }
    } catch (err) {
      showSnackbar("error", "error", "Error", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (!selectedBudgetId) return;

    if (window.confirm("Are you sure you want to delete this budget?")) {
      const result = await deleteBudget(selectedBudgetId);
      if (result.success) {
        showSnackbar("success", "check_circle", "Success", "Budget deleted successfully!");
      } else {
        showSnackbar("error", "error", "Error", result.error || "Failed to delete budget");
      }
    }
  };

  const handleEdit = () => {
    const budget = budgets.find((b) => b.id === selectedBudgetId);
    if (budget) {
      handleMenuClose();
      handleOpenDialog(budget);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "under":
        return "success";
      case "at_limit":
        return "warning";
      case "over":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "under":
        return <TrendingUpIcon fontSize="small" />;
      case "at_limit":
        return <WarningIcon fontSize="small" />;
      case "over":
        return <ErrorIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Debug logging
  console.log("Budgets component render:", {
    budgets,
    loading,
    error,
    budgetsLength: budgets?.length,
  });

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ px: 0 }}>
        <MKBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </MKBox>
      </Container>
    );
  }

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
            <MKBox display="flex" alignItems="center" gap={2}>
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
                Budget
              </MKTypography>
            </MKBox>
          </MKBox>
          <MKBox display="flex" gap={2}>
            <MKButton
              variant="outlined"
              color="info"
              size="small"
              onClick={refetch}
              startIcon={<RefreshIcon />}
              disabled={loading}
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
            <MKButton
              variant="gradient"
              color="info"
              size="small"
              onClick={() => handleOpenDialog()}
              startIcon={<AddIcon />}
            >
              Create Budget
            </MKButton>
          </MKBox>
        </MKBox>
      </MKBox>

      {/* Error Message */}
      {error && (
        <MKBox mb={3} sx={{ px: 3 }}>
          <MKTypography variant="body2" color="error">
            Error: {error}
          </MKTypography>
        </MKBox>
      )}

      {/* Budgets List */}
      {!budgets || budgets.length === 0 ? (
        <MKBox sx={{ px: 3, textAlign: "center", py: 8 }}>
          <MKTypography variant="h6" color="text.secondary" mb={2}>
            No budgets found
          </MKTypography>
          <MKTypography variant="body2" color="text.secondary" mb={3}>
            Create your first budget to start tracking your expenses.
          </MKTypography>
          <MKButton variant="gradient" color="info" onClick={() => handleOpenDialog()}>
            Create Budget
          </MKButton>
        </MKBox>
      ) : (
        <Grid container spacing={3} sx={{ px: 3 }}>
          {budgets.map((budget, index) => {
            // API returns budget with tracking fields directly on the object
            // Tracking fields: current_spending, remaining_amount, percentage_used, status
            const hasTracking = budget.current_spending !== undefined;

            return (
              <Grid item xs={12} md={6} lg={4} key={budget.id || index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <MKBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <MKBox>
                      <MKTypography variant="h5" fontWeight="bold" mb={0.5}>
                        {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                      </MKTypography>
                      <MKTypography variant="body2" color="text.secondary">
                        {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                      </MKTypography>
                    </MKBox>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, budget.id)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </MKBox>

                  {hasTracking && (
                    <>
                      <MKBox mb={2}>
                        <MKBox
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <MKTypography variant="body2" color="text.secondary">
                            Spent: {formatCurrency(budget.current_spending)}
                          </MKTypography>
                          <MKTypography variant="body2" color="text.secondary">
                            Limit: {formatCurrency(budget.limit_amount)}
                          </MKTypography>
                        </MKBox>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(budget.percentage_used || 0, 100)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "rgba(0,0,0,0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor:
                                budget.status === "under"
                                  ? "#4caf50"
                                  : budget.status === "at_limit"
                                  ? "#ff9800"
                                  : "#f44336",
                            },
                          }}
                        />
                        <MKBox
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={0.5}
                        >
                          <MKTypography variant="caption" color="text.secondary">
                            {budget.percentage_used?.toFixed(1)}% used
                          </MKTypography>
                          <Chip
                            icon={getStatusIcon(budget.status)}
                            label={budget.status?.replace("_", " ").toUpperCase()}
                            size="small"
                            color={getStatusColor(budget.status)}
                            sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                          />
                        </MKBox>
                      </MKBox>

                      <MKBox
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(0,0,0,0.02)",
                          mb: 2,
                        }}
                      >
                        <MKTypography variant="body2" color="text.secondary" mb={0.5}>
                          Remaining
                        </MKTypography>
                        <MKTypography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrency(budget.remaining_amount)}
                        </MKTypography>
                      </MKBox>
                    </>
                  )}

                  <MKBox>
                    <MKTypography variant="caption" color="text.secondary">
                      Period: {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
                    </MKTypography>
                  </MKBox>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create/Edit Budget Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <MKTypography variant="h5" fontWeight="bold">
            {editingBudget ? "Edit Budget" : "Create New Budget"}
          </MKTypography>
        </DialogTitle>
        <DialogContent>
          <MKBox sx={{ pt: 2 }}>
            <MKBox mb={2}>
              <MKInput
                type="text"
                label="Category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                error={!!formErrors.category}
                helperText={formErrors.category}
                fullWidth
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                type="number"
                label="Limit Amount ($)"
                name="limit_amount"
                value={formData.limit_amount}
                onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                error={!!formErrors.limit_amount}
                helperText={formErrors.limit_amount}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
            </MKBox>
            <MKBox mb={2}>
              <FormControl fullWidth error={!!formErrors.period}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  label="Period"
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
                {formErrors.period && <FormHelperText>{formErrors.period}</FormHelperText>}
              </FormControl>
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                type="date"
                label="Start Date"
                name="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                error={!!formErrors.start_date}
                helperText={formErrors.start_date}
                fullWidth
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                type="date"
                label="End Date"
                name="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                error={!!formErrors.end_date}
                helperText={formErrors.end_date}
                fullWidth
              />
            </MKBox>
          </MKBox>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <MKButton onClick={handleCloseDialog} color="secondary">
            Cancel
          </MKButton>
          <MKButton onClick={handleSubmit} variant="gradient" color="info" disabled={submitting}>
            {submitting ? "Saving..." : editingBudget ? "Update" : "Create"}
          </MKButton>
        </DialogActions>
      </Dialog>

      {/* Budget Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

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

export default Budgets;
