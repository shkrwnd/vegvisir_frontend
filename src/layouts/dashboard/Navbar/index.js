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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

// @mui icons
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";

// Core config
import { ROUTES } from "core/config";
import { useAuth } from "core/context";

const drawerWidth = 240;

function Navbar({ sidebarOpen, onSidebarToggle }) {
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const settingsOpen = Boolean(settingsAnchorEl);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleLogout = () => {
    // Close the settings menu
    handleSettingsClose();

    // Call logout from auth context (clears localStorage and user state)
    logout();

    // Navigate to login page
    navigate(ROUTES.LOGIN, { replace: true });

    console.log("User logged out successfully");
  };

  return (
    <MKBox
      id="dashboard-top-navbar"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1300}
      sx={{
        transition: "left 0.3s ease",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <MKBox
        id="dashboard-navbar-content"
        py={{ xs: 1, sm: 1.5, md: 2 }}
        px={{ xs: 1, sm: 2, md: 3 }}
        my={{ xs: 1, sm: 2 }}
        mx={{ xs: 0.5, sm: 2, md: 3 }}
        width={{ xs: "calc(100vw - 8px)", sm: "calc(100% - 32px)", md: "calc(100% - 48px)" }}
        maxWidth={{ xs: "calc(100vw - 8px)", sm: "none" }}
        borderRadius="xl"
        shadow="md"
        color="dark"
        position="relative"
        zIndex={3}
        sx={({ palette: { white, background, mode }, functions: { rgba } }) => ({
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          backdropFilter: `saturate(200%) blur(30px)`,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxSizing: "border-box",
        })}
      >
        <MKBox
          id="dashboard-navbar-layout"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          gap={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Left Side - Menu Button */}
          <MKBox
            id="dashboard-navbar-left"
            display="flex"
            alignItems="center"
            sx={{
              flex: { xs: "0 0 auto", sm: "0 1 auto" },
              minWidth: 0,
            }}
          >
            <IconButton
              id="dashboard-sidebar-toggle"
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onSidebarToggle}
              sx={{
                color: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                borderRadius: { xs: 1.5, sm: 2 },
                p: { xs: 0.5, sm: 0.75, md: 1 },
                transition: "all 200ms ease-out",
                width: { xs: "36px", sm: "40px", md: "48px" },
                height: { xs: "36px", sm: "40px", md: "48px" },
                minWidth: { xs: "36px", sm: "40px", md: "48px" },
                minHeight: { xs: "36px", sm: "40px", md: "48px" },
                flexShrink: 0,
              }}
            >
              <MenuIcon
                sx={{
                  fontSize: { xs: "20px", sm: "24px", md: "28px" },
                }}
              />
            </IconButton>
          </MKBox>

          {/* Center - Scarlet Pay Logo and Text */}
          <MKBox
            id="dashboard-navbar-center"
            display="flex"
            alignItems="center"
            gap={{ xs: 0.75, sm: 1.5, md: 2 }}
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/scarlet-pay-logo.svg"
              alt="Scarlet Pay Logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              sx={{
                height: { xs: "28px", sm: "36px", md: "44px" },
                width: "auto",
                objectFit: "contain",
                flexShrink: 0,
                display: "block",
              }}
            />
            <MKTypography
              id="dashboard-page-title"
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#CC0000",
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontSize: { xs: "0.875rem", sm: "1.25rem", md: "1.5rem" },
                whiteSpace: "nowrap",
                flexShrink: 0,
                lineHeight: 1.2,
              }}
            >
              SCARLET PAY
            </MKTypography>
          </MKBox>

          {/* Right Side - User Info and Settings */}
          <MKBox
            id="dashboard-navbar-right"
            display="flex"
            alignItems="center"
            gap={{ xs: 0.5, sm: 1, md: 2 }}
            sx={{
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <MKBox
              id="dashboard-user-welcome"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                px: { sm: 1.5, md: 2 },
                py: { sm: 0.75, md: 1 },
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateY(-1px)",
                  boxShadow: ({ boxShadows: { sm } }) => sm,
                },
                transition: "all 200ms ease-out",
              }}
            >
              <MKTypography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: { sm: "0.75rem", md: "0.875rem" },
                }}
                mr={1}
              >
                Welcome back,
              </MKTypography>
              <MKTypography
                variant="body2"
                fontWeight="medium"
                sx={{
                  color: "#ffffff",
                  fontSize: { sm: "0.75rem", md: "0.875rem" },
                }}
              >
                Admin
              </MKTypography>
            </MKBox>

            <IconButton
              id="dashboard-settings-button"
              onClick={handleSettingsClick}
              sx={{
                color: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                borderRadius: { xs: 1.5, sm: 2 },
                p: { xs: 0.5, sm: 0.75, md: 1 },
                transition: "all 200ms ease-out",
                width: { xs: "36px", sm: "40px", md: "48px" },
                height: { xs: "36px", sm: "40px", md: "48px" },
                minWidth: { xs: "36px", sm: "40px", md: "48px" },
                minHeight: { xs: "36px", sm: "40px", md: "48px" },
                flexShrink: 0,
              }}
            >
              <SettingsIcon
                sx={{
                  fontSize: { xs: "18px", sm: "20px", md: "24px" },
                }}
              />
            </IconButton>

            <Menu
              id="settings-menu"
              anchorEl={settingsAnchorEl}
              open={settingsOpen}
              onClose={handleSettingsClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: ({ borders: { borderRadius } }) => borderRadius.lg,
                  boxShadow: ({ boxShadows: { md } }) => md,
                  minWidth: 220,
                  mt: 1,
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.25,
                    borderRadius: ({ borders: { borderRadius } }) => borderRadius.md,
                    mx: 0.75,
                    my: 0.25,
                    transition: "all 200ms ease-out",
                    color: "#000000 !important",
                    "&:hover": {
                      backgroundColor: "rgba(204, 0, 0, 0.1)",
                      transform: "translateX(2px)",
                    },
                    "&:first-of-type": {
                      mt: 0.5,
                    },
                    "&:last-of-type": {
                      mb: 0.5,
                    },
                    "& .MuiListItemText-primary": {
                      color: "#000000 !important",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "#000000 !important",
                    },
                  },
                },
              }}
            >
              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "rgba(204, 0, 0, 0.1)",
                    "& .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#000000" }}>
                  <PersonIcon fontSize="small" sx={{ color: "#000000" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                  sx={{ "& .MuiTypography-root": { color: "#000000" } }}
                />
              </MenuItem>

              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "rgba(204, 0, 0, 0.1)",
                    "& .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#000000" }}>
                  <NotificationsIcon fontSize="small" sx={{ color: "#000000" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Notifications"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                  sx={{ "& .MuiTypography-root": { color: "#000000" } }}
                />
              </MenuItem>

              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "rgba(204, 0, 0, 0.1)",
                    "& .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#000000" }}>
                  <SecurityIcon fontSize="small" sx={{ color: "#000000" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Security"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                  sx={{ "& .MuiTypography-root": { color: "#000000" } }}
                />
              </MenuItem>

              <Divider sx={{ my: 0.75, mx: 0.75, borderColor: "rgba(0, 0, 0, 0.1)" }} />

              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "rgba(204, 0, 0, 0.1)",
                    "& .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#000000" }}>
                  <HelpIcon fontSize="small" sx={{ color: "#000000" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Help & Support"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                  sx={{ "& .MuiTypography-root": { color: "#000000" } }}
                />
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#CC0000",
                  "&:hover": {
                    backgroundColor: "rgba(204, 0, 0, 0.2)",
                    "& .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "#CC0000" }}>
                  <LogoutIcon fontSize="small" sx={{ color: "#CC0000" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                  sx={{ "& .MuiTypography-root": { color: "#CC0000" } }}
                />
              </MenuItem>
            </Menu>
          </MKBox>
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

// Typechecking props for the Navbar
Navbar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  onSidebarToggle: PropTypes.func.isRequired,
};

export default Navbar;
