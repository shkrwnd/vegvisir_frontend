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
import CenteredFooter from "components/custom/CenteredFooter";
import Sidebar from "layouts/dashboard/Sidebar";

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
          transition: "margin 0.3s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        <MKBox
          position="fixed"
          top={0}
          left={{ sm: sidebarOpen ? `${drawerWidth}px` : 0 }}
          right={0}
          zIndex={1300}
          sx={{
            transition: "left 0.3s ease",
            p: 1, // Add minimal padding to navbar container
          }}
        >
          <MKBox
            py={1}
            px={{ xs: 2, sm: 2 }}
            borderRadius="xl"
            shadow="md"
            color="dark"
            sx={({ palette: { transparent: transparentColor, white }, functions: { rgba } }) => ({
              backgroundColor: rgba(white.main, 0.8),
              backdropFilter: `saturate(200%) blur(30px)`,
            })}
          >
            <MKBox display="flex" justifyContent="space-between" alignItems="center">
              <MKBox display="flex" alignItems="center">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleSidebarToggle}
                  sx={{
                    mr: 2,
                    color: "text.primary",
                    backgroundColor: "rgba(0,0,0,0.04)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.08)",
                    },
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <MenuIcon />
                </IconButton>

                <MKTypography variant="button" fontWeight="bold" color="dark">
                  Dashboard
                </MKTypography>
              </MKBox>

              <MKBox display="flex" alignItems="center" gap={2}>
                <MKBox
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
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.04)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.08)",
                    },
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <MKTypography variant="body2" color="text.primary">
                    ⚙️
                  </MKTypography>
                </IconButton>
              </MKBox>
            </MKBox>
          </MKBox>
        </MKBox>
        <Box
          sx={{
            mt: 8, // Reduced margin for better spacing
            pt: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          {children}
        </Box>
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
