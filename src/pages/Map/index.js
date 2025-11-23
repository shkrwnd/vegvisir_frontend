/**
=========================================================
* Map Page
=========================================================
* Interactive map showing vendor locations that accept Raider wallet
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKBadge from "components/base/MKBadge";

// Features
import { useVendors } from "features/vendors";

// Core
import { ROUTES } from "core/config";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom marker icons based on category
const createCustomIcon = (category) => {
  const colorMap = {
    dining: "#4caf50",
    retail: "#2196f3",
    service: "#ff9800",
    entertainment: "#f44336",
  };

  const iconMap = {
    dining: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
    </svg>`,
    retail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h12v12z"/>
    </svg>`,
    service: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
    </svg>`,
    entertainment: `<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>`,
  };

  const color = colorMap[category] || "#757575";
  const icon =
    iconMap[category] ||
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="8"/></svg>`;

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">${icon}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapPage() {
  const navigate = useNavigate();
  const { vendors, loading } = useVendors();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Rutgers-Newark campus center coordinates
  const campusCenter = [40.74197721114958, -74.17628336972562];

  // Define bounds to restrict map area to campus vicinity
  const bounds = [
    [40.735, -74.18], // Southwest corner
    [40.748, -74.165], // Northeast corner
  ];

  // Filter vendors by category and ensure they have coordinates
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.latitude &&
      vendor.longitude &&
      (!selectedCategory || vendor.category === selectedCategory)
  );

  const handleMarkerClick = (vendor) => {
    navigate(`${ROUTES.VENDOR_DETAIL}/${vendor.id}`, { state: { vendor } });
  };

  if (loading) {
    return (
      <MKBox display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </MKBox>
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
            Campus Map
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Category Filters */}
      <MKBox mb={3} sx={{ px: 3 }} display="flex" gap={1} flexWrap="wrap">
        <MKButton
          variant={selectedCategory === null ? "gradient" : "outlined"}
          color="dark"
          size="small"
          onClick={() => setSelectedCategory(null)}
        >
          All ({vendors.length})
        </MKButton>
        <MKButton
          variant={selectedCategory === "dining" ? "gradient" : "outlined"}
          color="success"
          size="small"
          onClick={() => setSelectedCategory("dining")}
        >
          <Icon sx={{ mr: 0.5 }}>restaurant</Icon>
          Dining
        </MKButton>
        <MKButton
          variant={selectedCategory === "retail" ? "gradient" : "outlined"}
          color="info"
          size="small"
          onClick={() => setSelectedCategory("retail")}
        >
          <Icon sx={{ mr: 0.5 }}>shopping_bag</Icon>
          Retail
        </MKButton>
      </MKBox>

      {/* Map */}
      <Card
        sx={{
          mx: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: ({ palette: { mode } }) =>
            mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
          border: ({ palette: { mode } }) =>
            mode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <MKBox p={0} sx={{ height: "600px", borderRadius: "12px", overflow: "hidden" }}>
          <MapContainer
            center={campusCenter}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            maxBounds={bounds}
            maxBoundsViscosity={1.0}
            minZoom={15}
            maxZoom={18}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredVendors.map((vendor) => (
              <Marker
                key={vendor.id}
                position={[vendor.latitude, vendor.longitude]}
                icon={createCustomIcon(vendor.category)}
              >
                <Popup>
                  <MKBox p={1} sx={{ minWidth: "200px" }}>
                    <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <MKTypography variant="h6" fontWeight="bold">
                        {vendor.name}
                      </MKTypography>
                      <MKBadge
                        variant="contained"
                        badgeContent={vendor.category}
                        color={
                          vendor.category === "dining"
                            ? "success"
                            : vendor.category === "retail"
                            ? "info"
                            : "dark"
                        }
                        size="xs"
                      />
                    </MKBox>

                    {vendor.location && (
                      <MKTypography variant="caption" color="text" display="block" mb={1}>
                        <Icon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }}>
                          location_on
                        </Icon>
                        {vendor.location}
                      </MKTypography>
                    )}

                    <MKButton
                      variant="gradient"
                      color="info"
                      size="small"
                      fullWidth
                      onClick={() => handleMarkerClick(vendor)}
                    >
                      Learn More
                    </MKButton>
                  </MKBox>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </MKBox>
      </Card>
    </Container>
  );
}

export default MapPage;
