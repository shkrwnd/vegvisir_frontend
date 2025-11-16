import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

// Updated restaurant data
const restaurants = [
  // Raider Dollars + Flex Dollars
  {
    name: "On the RUN",
    address: "Paul Robeson Campus Center, 350 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
    flex: true,
    mealSwipe: false,
    link: "https://www.google.com/maps/search/?api=1&query=Paul+Robeson+Campus+Center+Newark+NJ",
  },
  {
    name: "Robeson Food Court",
    address: "Paul Robeson Campus Center, 350 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
    flex: true,
    mealSwipe: false,
    link: "https://www.google.com/maps/search/?api=1&query=Paul+Robeson+Campus+Center+Newark+NJ",
  },
  {
    name: "Starbucks Coffee (Robeson)",
    address: "Paul Robeson Campus Center, 350 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
    flex: true,
    mealSwipe: false,
    link: "https://www.google.com/maps/search/?api=1&query=Paul+Robeson+Campus+Center+Newark+NJ",
  },
  {
    name: "Starbucks Coffee (RBS)",
    address: "Rutgers Business School, 1 Washington Park, Newark, NJ 07102",
    flex: true,
    mealSwipe: false,
    link: "https://www.google.com/maps/search/?api=1&query=Rutgers+Business+School+Newark+NJ",
  },
  {
    name: "Stonsby Commons",
    address: "Adjacent to Woodward Hall, 91 Bleeker Street, Newark, NJ 07102",
    flex: true,
    mealSwipe: true,
    link: "https://www.google.com/maps/search/?api=1&query=91+Bleeker+Street+Newark+NJ",
  },

  // Raider Dollars only (no Flex or Meal Swipes)
  {
    name: "7 Heaven",
    address: "162 University Avenue, Newark, NJ 07102",
    flex: false,
    mealSwipe: false,
    link: "https://www.google.com/maps/search/?api=1&query=162+University+Avenue+Newark+NJ",
  },
  {
    name: "Blaze Pizza",
    address: "691 Broad Street, Newark, NJ 07102",
    flex: false,
    mealSwipe: false,
    link: "https://www.google.com/maps/search/?api=1&query=691+Broad+Street+Newark+NJ",
  },
  {
    name: "Cold Stone Creamery",
    address: "635 Broad Street, Newark, NJ 07102",
    flex: false,
    mealSwipe: false,
    link: "https://www.google.com/maps/search/?api=1&query=635+Broad+Street+Newark+NJ",
  },
  // Add more Raider Dollar locations as needed...
];

function Restaurants() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MKTypography variant="h4" fontWeight="bold" mb={3}>
        Campus Dining Locations
      </MKTypography>
      <Grid container spacing={3}>
        {restaurants.map((restaurant, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <MKBox mb={1}>
                <MKTypography variant="h6" fontWeight="bold">
                  {restaurant.name}
                </MKTypography>
              </MKBox>
              <MKTypography variant="body2" color="text.secondary" mb={2}>
                {restaurant.address}
              </MKTypography>

              <MKBox display="flex" flexWrap="wrap" gap={1} mb={2}>
                <Chip label="Raider Dollars" color="warning" size="small" />
                {restaurant.flex && <Chip label="Flex Dollars" color="primary" size="small" />}
                {restaurant.mealSwipe && <Chip label="Meal Swipes" color="success" size="small" />}
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
        ))}
      </Grid>
    </Container>
  );
}

export default Restaurants;
