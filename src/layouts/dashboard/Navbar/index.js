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

import { useState, useRef, useEffect } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import Popper from "@mui/material/Popper";

// @mui icons
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ClearIcon from "@mui/icons-material/Clear";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";

const drawerWidth = 240;

function Navbar({ sidebarOpen, onSidebarToggle }) {
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const settingsOpen = Boolean(settingsAnchorEl);

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const searchPopperRef = useRef(null);

  // Mock search data - replace with your actual data
  const searchableContent = [
    {
      id: 1,
      title: "Dashboard Overview",
      type: "page",
      route: "/dashboard",
      category: "Analytics",
    },
    { id: 2, title: "User Management", type: "page", route: "/users", category: "Management" },
    { id: 3, title: "Analytics Reports", type: "page", route: "/analytics", category: "Analytics" },
    { id: 4, title: "Settings", type: "page", route: "/settings", category: "Configuration" },
    { id: 5, title: "Profile Settings", type: "feature", route: "/settings", category: "User" },
    {
      id: 6,
      title: "Notification Center",
      type: "feature",
      route: "/dashboard",
      category: "System",
    },
    { id: 7, title: "Data Export", type: "feature", route: "/analytics", category: "Tools" },
    { id: 8, title: "User Permissions", type: "feature", route: "/users", category: "Security" },
  ];

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  // Search logic
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      // Add to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(
        0,
        5
      );
      setRecentSearches(newRecent);
      localStorage.setItem("recentSearches", JSON.stringify(newRecent));

      // Navigate to first result or show all results
      if (searchResults.length > 0) {
        // You can implement navigation logic here
        console.log("Navigate to:", searchResults[0]);
      }
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.title);
    setShowSearchSuggestions(false);
    // Navigate to the item
    console.log("Navigate to:", item);
  };

  // Load recent searches on component mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

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

          {/* Search Bar */}
          <MKBox
            id="dashboard-search-container"
            sx={{
              flex: 1,
              maxWidth: 400,
              mx: 3,
              position: "relative",
            }}
          >
            <TextField
              ref={searchInputRef}
              fullWidth
              size="small"
              placeholder="Search pages, features, and more..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              onFocus={() => searchQuery && setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSearchClear} sx={{ p: 0.5 }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "rgba(0,0,0,0.04)",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.08)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                    boxShadow: ({ boxShadows: { sm } }) => sm,
                  },
                },
              }}
            />

            {/* Search Suggestions Popper */}
            <Popper
              ref={searchPopperRef}
              open={
                showSearchSuggestions && (searchResults.length > 0 || recentSearches.length > 0)
              }
              anchorEl={searchInputRef.current}
              placement="bottom-start"
              transition
              sx={{
                zIndex: 1300,
                width: searchInputRef.current?.offsetWidth || 400,
                mt: 1,
              }}
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                  <Paper
                    sx={{
                      borderRadius: ({ borders: { borderRadius } }) => borderRadius.lg,
                      boxShadow: ({ boxShadows: { md } }) => md,
                      border: ({ borders: { borderWidth }, palette: { grey } }) =>
                        `${borderWidth[0]} solid ${grey[200]}`,
                      maxHeight: 400,
                      overflow: "auto",
                    }}
                  >
                    {searchResults.length > 0 ? (
                      <List sx={{ p: 1 }}>
                        {searchResults.map((item, index) => (
                          <ListItem
                            key={item.id}
                            button
                            onClick={() => handleSuggestionClick(item)}
                            sx={{
                              borderRadius: 1,
                              mb: 0.5,
                              "&:hover": {
                                backgroundColor: ({ palette: { primary } }) => primary.light + "10",
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {item.type === "page" ? (
                                <TrendingUpIcon fontSize="small" color="primary" />
                              ) : (
                                <SearchIcon fontSize="small" color="info" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.title}
                              secondary={item.category}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 500,
                              }}
                              secondaryTypographyProps={{
                                variant: "caption",
                              }}
                            />
                            <Chip
                              label={item.type}
                              size="small"
                              color={item.type === "page" ? "primary" : "secondary"}
                              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : recentSearches.length > 0 && !searchQuery ? (
                      <List sx={{ p: 1 }}>
                        <MKTypography
                          variant="caption"
                          color="text.secondary"
                          sx={{ px: 2, py: 1, fontWeight: 600 }}
                        >
                          Recent Searches
                        </MKTypography>
                        {recentSearches.map((search, index) => (
                          <ListItem
                            key={index}
                            button
                            onClick={() => {
                              setSearchQuery(search);
                              setShowSearchSuggestions(false);
                            }}
                            sx={{
                              borderRadius: 1,
                              mb: 0.5,
                              "&:hover": {
                                backgroundColor: ({ palette: { grey } }) => grey[100],
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <HistoryIcon fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={search}
                              primaryTypographyProps={{
                                variant: "body2",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : null}
                  </Paper>
                </Fade>
              )}
            </Popper>
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
