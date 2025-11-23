import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

// Example restaurant data
const restaurants = [
  {
    name: "JBJ Soul Kitchen",
    address: "350 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
    flex: true,
    mealSwipe: false,
    raider: true,
    link: "https://www.google.com/maps/search/?api=1&query=350+Dr+Martin+Luther+King+Jr+Blvd+Newark+NJ",
  },
  {
    name: "7 Heaven",
    address: "162 University Avenue, Newark, NJ 07102",
    flex: false,
    mealSwipe: false,
    raider: true,
    link: "https://www.google.com/maps/search/?api=1&query=162+University+Avenue+Newark+NJ",
  },
  {
    name: "Blaze Pizza",
    address: "691 Broad Street, Newark, NJ 07102",
    flex: false,
    mealSwipe: false,
    raider: false,
    link: "https://www.google.com/maps/search/?api=1&query=691+Broad+Street+Newark+NJ",
  },
  {
    name: "Cold Stone Creamery",
    address: "635 Broad Street, Newark, NJ 07102",
    flex: false,
    mealSwipe: false,
    raider: false,
    link: "https://www.google.com/maps/search/?api=1&query=635+Broad+Street+Newark+NJ",
  },
];

function Restaurants() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(searchLower) ||
      restaurant.address.toLowerCase().includes(searchLower)
    );
  });

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
            Restaurants
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Search Bar */}
      <MKBox mb={3} sx={{ px: 3 }}>
        <TextField
          fullWidth
          placeholder="Search restaurants by name or address..."
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

      {/* Restaurants Grid */}
      <Grid container spacing={3} sx={{ px: 3 }}>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: ({ palette: { mode } }) =>
                    mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
                  background: ({ palette: { mode } }) =>
                    mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "white",
                  border: ({ palette: { mode } }) =>
                    mode === "dark"
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: ({ palette: { mode } }) =>
                      mode === "dark"
                        ? "0 12px 40px rgba(0,0,0,0.4)"
                        : "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <MKBox mb={1}>
                  <MKTypography variant="h6" fontWeight="bold" sx={{ color: "#ffffff" }}>
                    {restaurant.name}
                  </MKTypography>
                </MKBox>
                <MKTypography variant="body2" color="text.secondary" mb={2}>
                  {restaurant.address}
                </MKTypography>
                <MKBox display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {restaurant.flex && <Chip label="Flex Dollars" color="primary" size="small" />}
                  {restaurant.mealSwipe && (
                    <Chip label="Meal Swipes" color="success" size="small" />
                  )}
                  {restaurant.raider && (
                    <Chip label="Raider Dollars" color="warning" size="small" />
                  )}
                </MKBox>
                <MKButton
                  variant="gradient"
                  color="info"
                  size="small"
                  onClick={() => window.open(restaurant.link, "_blank")}
                >
                  View Location
                </MKButton>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <MKBox textAlign="center" py={6}>
              <Icon sx={{ fontSize: "4rem", color: "text.secondary", mb: 2 }}>restaurant</Icon>
              <MKTypography variant="h5" color="text" mb={1}>
                No restaurants found
              </MKTypography>
              <MKTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                Try adjusting your search terms
              </MKTypography>
            </MKBox>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Restaurants;
