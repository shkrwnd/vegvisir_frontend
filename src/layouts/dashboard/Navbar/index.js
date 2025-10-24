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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

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

const drawerWidth = 240;

function Navbar({ sidebarOpen, onSidebarToggle }) {
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const settingsOpen = Boolean(settingsAnchorEl);

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  return (
    <MKBox
      id="dashboard-top-navbar"
      position="fixed"
      top={0}
      left={{ sm: sidebarOpen ? `${drawerWidth}px` : 0 }}
      right={0}
      zIndex={1300}
      sx={{
        transition: "left 0.3s ease",
        p: 1,
      }}
    >
      <MKBox
        id="dashboard-navbar-content"
        py={1}
        px={{ xs: 4, sm: 2, lg: 2 }}
        my={2}
        mx={3}
        width="calc(100% - 48px)"
        borderRadius="xl"
        shadow="md"
        color="dark"
        position="absolute"
        left={0}
        zIndex={3}
        sx={({ palette: { white }, functions: { rgba } }) => ({
          backgroundColor: rgba(white.main, 0.8),
          backdropFilter: `saturate(200%) blur(30px)`,
        })}
      >
        <MKBox
          id="dashboard-navbar-layout"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MKBox id="dashboard-navbar-left" display="flex" alignItems="center">
            <IconButton
              id="dashboard-sidebar-toggle"
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onSidebarToggle}
              sx={{
                mr: 2,
                color: "text.primary",
                backgroundColor: "rgba(0,0,0,0.04)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.08)",
                },
                borderRadius: 2,
                p: 1,
                transition: "all 200ms ease-out",
              }}
            >
              <MenuIcon />
            </IconButton>

            <MKTypography id="dashboard-page-title" variant="button" fontWeight="bold" color="dark">
              Dashboard
            </MKTypography>
          </MKBox>

          <MKBox id="dashboard-navbar-right" display="flex" alignItems="center" gap={2}>
            <MKBox
              id="dashboard-user-welcome"
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.04)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.08)",
                },
                transition: "all 200ms ease-out",
              }}
            >
              <MKTypography variant="body2" color="text.secondary" mr={1}>
                Welcome back,
              </MKTypography>
              <MKTypography variant="body2" fontWeight="medium" color="text.primary">
                Admin
              </MKTypography>
            </MKBox>

            <IconButton
              id="dashboard-settings-button"
              onClick={handleSettingsClick}
              sx={{
                backgroundColor: "rgba(0,0,0,0.04)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.08)",
                },
                borderRadius: 2,
                p: 1,
                transition: "all 200ms ease-out",
              }}
            >
              <SettingsIcon />
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
                  border: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[0]} solid ${grey[200]}`,
                  background: ({ palette: { white } }) => white.main,
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.25,
                    borderRadius: ({ borders: { borderRadius } }) => borderRadius.md,
                    mx: 0.75,
                    my: 0.25,
                    transition: "all 200ms ease-out",
                    "&:hover": {
                      backgroundColor: ({ palette: { primary } }) => primary.light + "10",
                      transform: "translateX(2px)",
                    },
                    "&:first-of-type": {
                      mt: 0.5,
                    },
                    "&:last-of-type": {
                      mb: 0.5,
                    },
                  },
                },
              }}
            >
              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  "&:hover .MuiListItemIcon-root": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                />
              </MenuItem>

              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  "&:hover .MuiListItemIcon-root": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <NotificationsIcon fontSize="small" color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Notifications"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                />
              </MenuItem>

              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  "&:hover .MuiListItemIcon-root": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SecurityIcon fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Security"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                />
              </MenuItem>

              <Divider sx={{ my: 0.75, mx: 0.75 }} />

              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  "&:hover .MuiListItemIcon-root": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <HelpIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Help & Support"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                  }}
                />
              </MenuItem>

              <MenuItem
                onClick={handleSettingsClose}
                sx={{
                  color: ({ palette: { error } }) => error.main,
                  "&:hover": {
                    backgroundColor: ({ palette: { error } }) => error.light + "10",
                    "& .MuiListItemIcon-root": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 500,
                    color: "inherit",
                  }}
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
