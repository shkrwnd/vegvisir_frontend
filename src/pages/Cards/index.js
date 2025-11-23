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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKInput from "components/base/MKInput";
import MKSnackbar from "components/base/MKSnackbar";

// @mui icons
import Icon from "@mui/material/Icon";

// Features
import { useCards } from "features/cards";

// Shared hooks
import { useSnackbar } from "shared/hooks";

function Cards() {
  const { cards, loading, error, createCard, updateCard, deleteCard, refetch } = useCards();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [formData, setFormData] = useState({
    card_number: "",
    cardholder_name: "",
    expiry_date: "",
    card_type: "debit",
    bank_name: "",
    is_default: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleOpenDialog = (card = null) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        card_number: card.card_number || "",
        cardholder_name: card.cardholder_name || "",
        expiry_date: card.expiry_date || "",
        card_type: card.card_type || "debit",
        bank_name: card.bank_name || "",
        is_default: card.is_default || false,
      });
    } else {
      setEditingCard(null);
      setFormData({
        card_number: "",
        cardholder_name: "",
        expiry_date: "",
        card_type: "debit",
        bank_name: "",
        is_default: false,
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCard(null);
    setFormData({
      card_number: "",
      cardholder_name: "",
      expiry_date: "",
      card_type: "debit",
      bank_name: "",
      is_default: false,
    });
    setFormErrors({});
  };

  const handleMenuOpen = (event, cardId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCardId(cardId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCardId(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!editingCard) {
      // Only validate card_number and card_type on create
      if (!formData.card_number.trim()) {
        errors.card_number = "Card number is required";
      } else if (!/^\d{4}$/.test(formData.card_number.trim())) {
        errors.card_number = "Card number must be exactly 4 digits";
      }

      if (!formData.card_type) {
        errors.card_type = "Card type is required";
      }
    }

    if (!formData.cardholder_name.trim()) {
      errors.cardholder_name = "Cardholder name is required";
    }

    if (!formData.expiry_date) {
      errors.expiry_date = "Expiry date is required";
    } else {
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        errors.expiry_date = "Expiry date must be in the future";
      }
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
      const cardData = {
        cardholder_name: formData.cardholder_name.trim(),
        expiry_date: formData.expiry_date,
        bank_name: formData.bank_name.trim() || undefined,
        is_default: formData.is_default,
      };

      // Only include card_number and card_type on create
      if (!editingCard) {
        cardData.card_number = formData.card_number.trim();
        cardData.card_type = formData.card_type;
      }

      let result;
      if (editingCard) {
        const cardId = editingCard.id;
        result = await updateCard(cardId, cardData);
        if (result.success) {
          showSnackbar("success", "check_circle", "Success", "Card updated successfully!");
        } else {
          showSnackbar("error", "error", "Error", result.error || "Failed to update card");
        }
      } else {
        result = await createCard(cardData);
        if (result.success) {
          showSnackbar("success", "check_circle", "Success", "Card created successfully!");
        } else {
          showSnackbar("error", "error", "Error", result.error || "Failed to create card");
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
    if (!selectedCardId) return;

    if (window.confirm("Are you sure you want to delete this card?")) {
      const result = await deleteCard(selectedCardId);
      if (result.success) {
        showSnackbar("success", "check_circle", "Success", "Card deleted successfully!");
      } else {
        showSnackbar("error", "error", "Error", result.error || "Failed to delete card");
      }
    }
  };

  const handleEdit = () => {
    const card = cards.find((c) => c.id === selectedCardId);
    if (card) {
      handleMenuClose();
      handleOpenDialog(card);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return "";
    return `**** **** **** ${cardNumber}`;
  };

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
                Cards
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
              Add Card
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

      {/* Cards List */}
      {!cards || cards.length === 0 ? (
        <MKBox sx={{ px: 3, textAlign: "center", py: 8 }}>
          <MKTypography variant="h6" color="text.secondary" mb={2}>
            No cards found
          </MKTypography>
          <MKTypography variant="body2" color="text.secondary" mb={3}>
            Add your first payment card to get started.
          </MKTypography>
          <MKButton variant="gradient" color="info" onClick={() => handleOpenDialog()}>
            Add Card
          </MKButton>
        </MKBox>
      ) : (
        <Grid container spacing={3} sx={{ px: 3 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} md={6} lg={4} key={card.id || index}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  background: card.is_default
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "white",
                  color: card.is_default ? "white" : "inherit",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {card.is_default && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Default"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                )}
                <MKBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <MKBox display="flex" alignItems="center" gap={1}>
                    <CreditCardIcon sx={{ fontSize: 32 }} />
                    <MKBox>
                      <MKTypography variant="h6" fontWeight="bold" mb={0.5}>
                        {maskCardNumber(card.card_number)}
                      </MKTypography>
                      <MKTypography variant="body2" opacity={0.8}>
                        {card.cardholder_name}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, card.id)}
                    sx={{
                      ml: 1,
                      color: card.is_default ? "white" : "inherit",
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </MKBox>

                <MKBox
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: card.is_default ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.02)",
                    mb: 2,
                  }}
                >
                  <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <MKTypography variant="caption" opacity={0.8}>
                      Expires
                    </MKTypography>
                    <MKTypography variant="body2" fontWeight="bold">
                      {formatDate(card.expiry_date)}
                    </MKTypography>
                  </MKBox>
                  <MKBox display="flex" justifyContent="space-between" alignItems="center">
                    <MKTypography variant="caption" opacity={0.8}>
                      Type
                    </MKTypography>
                    <Chip
                      label={card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: card.is_default
                          ? "rgba(255,255,255,0.2)"
                          : card.card_type === "credit"
                          ? "#4caf50"
                          : "#2196f3",
                        color: card.is_default ? "white" : "white",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                  </MKBox>
                  {card.bank_name && (
                    <MKBox display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <MKTypography variant="caption" opacity={0.8}>
                        Bank
                      </MKTypography>
                      <MKTypography variant="body2" fontWeight="medium">
                        {card.bank_name}
                      </MKTypography>
                    </MKBox>
                  )}
                </MKBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Card Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#FFFFFF",
            color: "#000000",
            border: "2px solid #000000",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#000000",
            borderBottom: "2px solid #000000",
          }}
        >
          <MKTypography variant="h5" fontWeight="bold" sx={{ color: "#000000" }}>
            {editingCard ? "Edit Card" : "Add New Card"}
          </MKTypography>
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#000000",
          }}
        >
          <MKBox sx={{ pt: 2 }}>
            {!editingCard && (
              <>
                <MKBox mb={2}>
                  <MKInput
                    type="text"
                    label="Card Number (Last 4 digits)"
                    name="card_number"
                    value={formData.card_number}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setFormData({ ...formData, card_number: value });
                    }}
                    error={!!formErrors.card_number}
                    helperText={formErrors.card_number || "Enter the last 4 digits of your card"}
                    fullWidth
                    inputProps={{ maxLength: 4 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#000000",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#000000",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#000000",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#666666",
                      },
                    }}
                  />
                </MKBox>
                <MKBox mb={2}>
                  <FormControl fullWidth error={!!formErrors.card_type}>
                    <InputLabel sx={{ color: "#000000" }}>Card Type</InputLabel>
                    <Select
                      value={formData.card_type}
                      onChange={(e) => setFormData({ ...formData, card_type: e.target.value })}
                      label="Card Type"
                      sx={{
                        color: "#000000",
                        fontSize: "1.1rem",
                        padding: "14px 14px",
                        height: "56px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#000000",
                          borderWidth: "2px",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#000000",
                        },
                      }}
                    >
                      <MenuItem
                        value="debit"
                        sx={{
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          fontSize: "1.1rem",
                          padding: "12px 16px",
                          "&:hover": {
                            backgroundColor: "#F5F5F5",
                          },
                        }}
                      >
                        Debit
                      </MenuItem>
                      <MenuItem
                        value="credit"
                        sx={{
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          fontSize: "1.1rem",
                          padding: "12px 16px",
                          "&:hover": {
                            backgroundColor: "#F5F5F5",
                          },
                        }}
                      >
                        Credit
                      </MenuItem>
                    </Select>
                    {formErrors.card_type && (
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {formErrors.card_type}
                      </FormHelperText>
                    )}
                  </FormControl>
                </MKBox>
              </>
            )}
            <MKBox mb={2}>
              <MKInput
                type="text"
                label="Cardholder Name"
                name="cardholder_name"
                value={formData.cardholder_name}
                onChange={(e) => setFormData({ ...formData, cardholder_name: e.target.value })}
                error={!!formErrors.cardholder_name}
                helperText={formErrors.cardholder_name}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                      borderWidth: "2px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#000000",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#666666",
                  },
                }}
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                type="date"
                label="Expiry Date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                error={!!formErrors.expiry_date}
                helperText={formErrors.expiry_date}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                      borderWidth: "2px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#000000",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#666666",
                  },
                }}
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                type="text"
                label="Bank Name (Optional)"
                name="bank_name"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                error={!!formErrors.bank_name}
                helperText={formErrors.bank_name}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#000000",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                      borderWidth: "2px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#000000",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#666666",
                  },
                }}
              />
            </MKBox>
            <MKBox mb={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    color="primary"
                  />
                }
                label="Set as default card"
                sx={{ color: "#000000" }}
              />
              <MKTypography variant="caption" display="block" mt={0.5} sx={{ color: "#666666" }}>
                Setting this as default will unset other default cards
              </MKTypography>
            </MKBox>
          </MKBox>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            backgroundColor: "#FFFFFF",
            borderTop: "2px solid #000000",
          }}
        >
          <MKButton
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              color: "#000000",
              borderColor: "#000000",
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#000000",
                borderWidth: "2px",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            Cancel
          </MKButton>
          <MKButton
            onClick={handleSubmit}
            variant="gradient"
            color="info"
            disabled={submitting}
            sx={{
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            {submitting ? "Saving..." : editingCard ? "Update" : "Add"}
          </MKButton>
        </DialogActions>
      </Dialog>

      {/* Card Menu */}
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

export default Cards;
