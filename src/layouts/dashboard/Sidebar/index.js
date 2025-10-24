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
  badge: index === 2 ? "New" : null, // Analytics gets "New" badge
}));

function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: ({ palette: { white } }) => white.main,
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
          borderRight: "1px solid",
          borderColor: ({ palette: { grey } }) => grey[200],
          zIndex: 1250,
        },
      }}
    >
      <MKBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          minHeight: 72,
          background: ({ palette: { info } }) =>
            `linear-gradient(135deg, ${info.main} 0%, ${info.dark} 100%)`,
          color: "white",
          boxShadow: ({ boxShadows: { md } }) => md,
        }}
      >
        <MKBox display="flex" alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1.5,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            <AccountCircleIcon />
          </Avatar>
          <MKTypography variant="h6" fontWeight="bold" color="white">
            Dashboard
          </MKTypography>
        </MKBox>
        <Tooltip title="Close sidebar" arrow>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
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
                  transition: "all 0.2s ease-in-out",
                  "&.Mui-selected": {
                    backgroundColor: ({ palette: { info } }) => info.main,
                    color: "white",
                    boxShadow: ({ boxShadows: { sm } }) => sm,
                    transform: "translateX(4px)",
                    "&:hover": {
                      backgroundColor: ({ palette: { info } }) => info.dark,
                      transform: "translateX(4px)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                    "& .MuiListItemText-primary": {
                      color: "white",
                      fontWeight: 600,
                    },
                  },
                  "&:hover": {
                    backgroundColor: ({ palette: { grey } }) => grey[100],
                    borderRadius: 2,
                    transform: "translateX(2px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.route ? "white" : "text.secondary",
                    minWidth: 44,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: location.pathname === item.route ? "white" : "text.primary",
                    fontWeight: location.pathname === item.route ? 600 : 400,
                    "& .MuiTypography-root": {
                      fontSize: "0.875rem",
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
