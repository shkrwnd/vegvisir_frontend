/**
=========================================================
* Marketplace Page - Vendors List
=========================================================
* Displays all vendors that accept Raider card with search and filtering
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";

// Features
import { useVendors } from "features/vendors";
import { VendorCard } from "features/vendors/components";

// Core
import { ROUTES } from "core/config";

function MarketplacePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch vendors with current category filter
  const { vendors, loading, error } = useVendors(
    selectedCategory === "all" ? null : selectedCategory,
    true
  );

  // Filter vendors based on search query
  const filteredVendors = vendors.filter((vendor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vendor.name.toLowerCase().includes(searchLower) ||
      vendor.description?.toLowerCase().includes(searchLower) ||
      vendor.location?.toLowerCase().includes(searchLower)
    );
  });

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleVendorClick = (vendor) => {
    navigate(`${ROUTES.VENDOR_DETAIL}/${vendor.id}`, { state: { vendor } });
  };

  // Category tabs configuration
  const categories = [
    { value: "all", label: "All", icon: "store" },
    { value: "dining", label: "Dining", icon: "restaurant" },
    { value: "retail", label: "Retail", icon: "shopping_bag" },
    { value: "service", label: "Services", icon: "build" },
    { value: "entertainment", label: "Entertainment", icon: "theaters" },
  ];

  return (
    <MKBox
      sx={{
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <MKBox
        mb={{ xs: 4, sm: 6 }}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3, md: 4 },
          mx: { xs: 1, sm: 2, md: 3 },
          background:
            "linear-gradient(135deg, rgba(204, 0, 0, 0.1) 0%, rgba(204, 0, 0, 0.05) 100%)",
          borderRadius: 3,
          border: "1px solid rgba(204, 0, 0, 0.2)",
          boxShadow: "0 4px 20px rgba(204, 0, 0, 0.1)",
          width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)", md: "calc(100% - 48px)" },
          boxSizing: "border-box",
        }}
      >
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
            Marketplace
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Search Bar */}
      <MKBox
        mb={3}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search vendors by name, location, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
            "& .MuiInputBase-input": {
              padding: { xs: "12px 14px", sm: "14px 16px" },
            },
          }}
        />
      </MKBox>

      {/* Category Tabs */}
      <Card
        sx={{
          mb: 3,
          mx: { xs: 1, sm: 2, md: 3 },
          width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)", md: "calc(100% - 48px)" },
          boxSizing: "border-box",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: { xs: 1, sm: 2 },
            "& .MuiTab-root": {
              minWidth: { xs: "80px", sm: "120px" },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              padding: { xs: "8px 12px", sm: "12px 16px" },
              textTransform: "none",
              fontWeight: 500,
              "&.Mui-selected": {
                backgroundColor: "#ffffff",
                color: "#000000",
                borderRadius: "8px",
                margin: "4px",
              },
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTab-icon": {
              marginRight: { xs: "4px", sm: "8px" },
              fontSize: { xs: "18px", sm: "20px" },
            },
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category.value}
              value={category.value}
              label={category.label}
              icon={<Icon>{category.icon}</Icon>}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Card>

      {/* Loading State */}
      {loading && (
        <MKBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
          sx={{ px: { xs: 1, sm: 2, md: 3 } }}
        >
          <CircularProgress />
        </MKBox>
      )}

      {/* Error State */}
      {error && !loading && (
        <MKBox sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </MKBox>
      )}

      {/* Vendors Grid */}
      {!loading && !error && (
        <MKBox
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {filteredVendors.length > 0 ? (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {filteredVendors.map((vendor) => (
                <Grid item xs={12} sm={6} md={4} key={vendor.id}>
                  <VendorCard vendor={vendor} onClick={() => handleVendorClick(vendor)} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <MKBox textAlign="center" py={6}>
              <Icon sx={{ fontSize: "4rem", color: "text.secondary", mb: 2 }}>store</Icon>
              <MKTypography
                variant="h5"
                color="text"
                mb={1}
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                No vendors found
              </MKTypography>
              <MKTypography
                variant="body2"
                color="text"
                sx={{
                  opacity: 0.7,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "No vendors available in this category"}
              </MKTypography>
            </MKBox>
          )}
        </MKBox>
      )}
    </MKBox>
  );
}

export default MarketplacePage;
