/**
=========================================================
* VendorCard Component
=========================================================
* Feature-specific component for displaying vendor card
*/

import PropTypes from "prop-types";
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKBadge from "components/base/MKBadge";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function VendorCard({ vendor, onClick }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "dining":
        return "restaurant";
      case "retail":
        return "shopping_bag";
      case "service":
        return "build";
      case "entertainment":
        return "theaters";
      default:
        return "store";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "dining":
        return "success";
      case "retail":
        return "info";
      case "service":
        return "warning";
      case "entertainment":
        return "error";
      default:
        return "dark";
    }
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <MKBox>
          {/* Header with icon and badge */}
          <MKBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <MKBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: ({ palette }) =>
                  `linear-gradient(135deg, ${palette[getCategoryColor(vendor.category)].main} 0%, ${
                    palette[getCategoryColor(vendor.category)].dark
                  } 100%)`,
                color: "white",
              }}
            >
              <Icon fontSize="medium">{getCategoryIcon(vendor.category)}</Icon>
            </MKBox>
            <MKBadge
              variant="contained"
              badgeContent={vendor.category}
              color={getCategoryColor(vendor.category)}
              size="sm"
            />
          </MKBox>

          {/* Vendor name */}
          <MKTypography variant="h6" fontWeight="bold" mb={1}>
            {vendor.name}
          </MKTypography>

          {/* Location */}
          <MKBox display="flex" alignItems="center" mb={1}>
            <Icon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }}>
              location_on
            </Icon>
            <MKTypography variant="caption" color="text" sx={{ opacity: 0.8 }}>
              {vendor.location || "Campus Location"}
            </MKTypography>
          </MKBox>

          {/* Description */}
          {vendor.description && (
            <MKTypography
              variant="body2"
              color="text"
              sx={{
                opacity: 0.7,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                minHeight: "40px",
              }}
            >
              {vendor.description}
            </MKTypography>
          )}
        </MKBox>
      </CardContent>
    </Card>
  );
}

VendorCard.propTypes = {
  vendor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    accepts_raider_card: PropTypes.bool,
    is_active: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func,
};

export default VendorCard;
