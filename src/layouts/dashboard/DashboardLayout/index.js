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
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

// @mui icons
import MenuIcon from "@mui/icons-material/Menu";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";

// Material Kit 2 PRO React example components
import DefaultNavbar from "components/custom/DefaultNavbar";
import CenteredFooter from "components/custom/CenteredFooter";
import Sidebar from "layouts/dashboard/Sidebar";

// Routes
import routes from "routes";

const drawerWidth = 240;

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: "margin 0.3s ease",
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
            ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
            transition: "width 0.3s ease, margin 0.3s ease",
            backgroundColor: "white",
            boxShadow: ({ boxShadows: { sm } }) => sm,
            borderBottom: "1px solid",
            borderColor: "divider",
            zIndex: 1100,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <MKTypography variant="h6" noWrap component="div" color="dark">
              Dashboard
            </MKTypography>
            <Box sx={{ flexGrow: 1 }} />
            <DefaultNavbar
              routes={routes}
              action={{
                type: "external",
                route: "https://www.creative-tim.com/product/material-kit-pro-react",
                label: "buy now",
                color: "info",
              }}
              transparent
              relative
            />
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 8 }}>{children}</Box>
        <MKBox mt="auto" pt={6}>
          <CenteredFooter />
        </MKBox>
      </Box>
    </Box>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
