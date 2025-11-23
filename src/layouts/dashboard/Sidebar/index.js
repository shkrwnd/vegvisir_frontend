/**
=========================================================
* Material Kit 2 PRO React - v2.1.1
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

// @mui icons
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";

// react-router-dom components
import { Link, useLocation } from "react-router-dom";

// Route configuration
import { dashboardRoutes } from "routes";

const drawerWidth = 240;

// Convert dashboardRoutes to menuItems format
const menuItems = dashboardRoutes.map((route, index) => ({
  text: route.name,
  icon: route.icon,
  route: route.route,
  badge: index === 1 ? "New" : null, // Analytics gets "New" badge (index changed after removing Dashboard)
}));

function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: { xs: open ? drawerWidth : 0, md: open ? drawerWidth : 0 },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: ({ palette: { background, mode } }) =>
            mode === "dark" ? background.default : "#ffffff",
          boxShadow: ({ boxShadows: { lg } }) => lg,
          borderRight: ({ palette: { primary } }) => `1px solid ${primary.main}`,
          borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
          zIndex: 1250,
          [({ breakpoints }) => breakpoints.down("md")]: {
            position: "fixed",
          },
        },
      }}
    >
      <MKBox
        sx={{
          background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 3 },
          py: 2,
          minHeight: 72,
          color: "white",
          boxShadow: ({ boxShadows: { md } }) => md,
        }}
      >
        <MKBox display="flex" alignItems="center" gap={1.5}>
          <Box
            component="img"
            src="/scarlet-pay-logo.svg"
            alt="Scarlet Pay Logo"
            onError={(e) => {
              e.target.style.display = "none";
            }}
            sx={{
              height: 44,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <MKTypography
            variant="h6"
            fontWeight="bold"
            color="white"
            sx={{
              textTransform: "uppercase",
              fontSize: "1.125rem",
              letterSpacing: "0.5px",
              lineHeight: 1.2,
            }}
          >
            SCARLET PAY
          </MKTypography>
        </MKBox>
        <Tooltip title="Close sidebar" arrow>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white !important",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white !important",
              },
              "& .MuiSvgIcon-root": {
                color: "white !important",
              },
            }}
          >
            <CloseIcon sx={{ color: "white !important" }} />
          </IconButton>
        </Tooltip>
      </MKBox>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={item.text} placement="right" arrow>
              <ListItemButton
                component={Link}
                to={item.route}
                selected={location.pathname === item.route}
                sx={{
                  mx: 0.5,
                  my: 0.25,
                  borderRadius: 2,
                  minHeight: 48,
                  transition: "all 200ms ease-out",
                  "&.Mui-selected": {
                    backgroundColor: ({ palette: { primary } }) => primary.main,
                    color: "white !important",
                    boxShadow: ({ boxShadows: { sm } }) => sm,
                    transform: "translateX(4px)",
                    "&:hover": {
                      backgroundColor: ({ palette: { primary } }) => primary.focus,
                      transform: "translateX(4px)",
                      color: "white !important",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white !important",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white !important",
                      fontWeight: 600,
                    },
                    "& .MuiTypography-root": {
                      color: "white !important",
                    },
                  },
                  "&:hover": {
                    backgroundColor: ({ palette: { mode, grey } }) =>
                      mode === "dark" ? grey[200] : grey[100],
                    borderRadius: 2,
                    transform: "translateX(2px)",
                    "& .MuiListItemIcon-root": {
                      color: ({ palette: { primary } }) => `${primary.main} !important`,
                    },
                    "& .MuiListItemText-primary": {
                      color: ({ palette: { text } }) => `${text.main} !important`,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: ({ palette: { mode } }) =>
                      location.pathname === item.route
                        ? "white !important"
                        : mode === "dark"
                        ? "#ffffff"
                        : "#344767",
                    minWidth: 44,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: ({ palette: { mode } }) =>
                      location.pathname === item.route
                        ? "white !important"
                        : mode === "dark"
                        ? "#ffffff"
                        : "#344767",
                    fontWeight: location.pathname === item.route ? 600 : 400,
                    "& .MuiTypography-root": {
                      fontSize: { xs: "0.8rem", md: "0.875rem" },
                      color: ({ palette: { mode } }) =>
                        location.pathname === item.route
                          ? "white !important"
                          : mode === "dark"
                          ? "#ffffff"
                          : "#344767",
                    },
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{
                      height: 20,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

// Typechecking props for the Sidebar
Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
