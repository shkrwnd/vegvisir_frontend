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
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";

// Material Kit 2 PRO React example components
import CenteredFooter from "components/custom/CenteredFooter";
import Breadcrumbs from "components/custom/Breadcrumbs";

// Custom components
import Sidebar from "layouts/dashboard/Sidebar";
import Navbar from "layouts/dashboard/Navbar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Breadcrumb route mapping
  const getBreadcrumbRoutes = () => {
    const pathSegments = location.pathname.split("/").filter((segment) => segment !== "");

    if (pathSegments.length === 0) {
      return [{ label: "Home" }];
    }

    const routes = [];
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Map route segments to readable labels
      const labelMap = {
        home: "Home",
        dashboard: "Dashboard",
        analytics: "Analytics",
        users: "Users",
        settings: "Settings",
        "data-tables": "Data Tables",
        notifications: "Notifications",
        chatbot: "ChatBot",
      };

      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      routes.push({
        label,
        route: isLast ? null : currentPath,
      });
    });

    return routes;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar id="dashboard-sidebar" open={sidebarOpen} onClose={handleSidebarToggle} />

      <Box
        id="dashboard-main-content"
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Navbar sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
        <Box
          id="dashboard-page-content"
          sx={{
            mt: 8,
            pt: 5,
            pb: 12,
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            backgroundColor: ({ palette: { grey } }) => grey[50],
          }}
        >
          <Container>
            <MKBox width={{ xs: "100%", md: "50%", lg: "25%" }} mb={3}>
              <Breadcrumbs routes={getBreadcrumbRoutes()} />
            </MKBox>
            {children}
          </Container>
        </Box>

        <MKBox
          id="dashboard-footer"
          sx={{
            boxShadow: ({ boxShadows: { sm } }) => sm,
            backgroundColor: ({ palette: { grey } }) => grey[50],
          }}
        >
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
