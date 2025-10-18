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

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

// Material Kit 2 PRO React examples
import DashboardLayout from "layouts/dashboard/DashboardLayout";

// Images
import bgImage from "assets/images/bg-presentation.jpg";

function Home() {
  return (
    <DashboardLayout>
      <Container>
        {/* Welcome Section */}
        <MKBox
          mb={4}
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            color: "white",
            textAlign: "center",
          }}
        >
          <MKTypography
            variant="h2"
            fontWeight="bold"
            mb={2}
            sx={({ breakpoints, typography: { size } }) => ({
              [breakpoints.down("md")]: {
                fontSize: size["2xl"],
              },
            })}
          >
            Welcome to Dashboard
          </MKTypography>
          <MKTypography variant="body1" mb={3}>
            Your comprehensive dashboard with sidebar navigation, breadcrumbs, and modern design.
          </MKTypography>
        </MKBox>

        {/* Feature Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <MKBox>
                <MKTypography variant="h4" fontWeight="bold" mb={2}>
                  Dashboard Overview
                </MKTypography>
                <MKTypography variant="body2" color="text" mb={3}>
                  Get insights into your data with our comprehensive dashboard.
                </MKTypography>
              </MKBox>
              <MKButton variant="gradient" color="info" size="large" fullWidth>
                Get Started
              </MKButton>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <MKBox>
                <MKTypography variant="h4" fontWeight="bold" mb={2}>
                  Analytics
                </MKTypography>
                <MKTypography variant="body2" color="text" mb={3}>
                  Track your performance with detailed analytics and reports.
                </MKTypography>
              </MKBox>
              <MKButton variant="gradient" color="success" size="large" fullWidth>
                View Analytics
              </MKButton>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <MKBox>
                <MKTypography variant="h4" fontWeight="bold" mb={2}>
                  Settings
                </MKTypography>
                <MKTypography variant="body2" color="text" mb={3}>
                  Customize your experience with our flexible settings panel.
                </MKTypography>
              </MKBox>
              <MKButton variant="gradient" color="warning" size="large" fullWidth>
                Configure
              </MKButton>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}

export default Home;
