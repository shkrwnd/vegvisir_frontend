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
    <MKBox>
      {/* Header */}
      <MKBox mb={4}>
        <MKTypography variant="h3" fontWeight="bold" mb={1}>
          Marketplace
        </MKTypography>
        <MKTypography variant="body1" color="text" sx={{ opacity: 0.8 }}>
          Browse and pay vendors that accept your Raider card
        </MKTypography>
      </MKBox>

      {/* Search Bar */}
      <MKBox mb={3}>
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
            },
          }}
        />
      </MKBox>

      {/* Category Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
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
        <MKBox display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </MKBox>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Vendors Grid */}
      {!loading && !error && (
        <>
          {filteredVendors.length > 0 ? (
            <Grid container spacing={3}>
              {filteredVendors.map((vendor) => (
                <Grid item xs={12} sm={6} md={4} key={vendor.id}>
                  <VendorCard vendor={vendor} onClick={() => handleVendorClick(vendor)} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <MKBox textAlign="center" py={6}>
              <Icon sx={{ fontSize: "4rem", color: "text.secondary", mb: 2 }}>store</Icon>
              <MKTypography variant="h5" color="text" mb={1}>
                No vendors found
              </MKTypography>
              <MKTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "No vendors available in this category"}
              </MKTypography>
            </MKBox>
          )}
        </>
      )}
    </MKBox>
  );
}

export default MarketplacePage;
