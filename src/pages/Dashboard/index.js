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

function Dashboard() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox
        mb={6}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4, md: 5 },
          background:
            "linear-gradient(135deg, rgba(204, 0, 0, 0.1) 0%, rgba(204, 0, 0, 0.05) 100%)",
          borderRadius: 3,
          border: "1px solid rgba(204, 0, 0, 0.2)",
          boxShadow: "0 4px 20px rgba(204, 0, 0, 0.1)",
        }}
      >
        <MKBox display="flex" alignItems="center" gap={2} mb={2}>
          <MKBox
            sx={{
              width: { xs: "4px", sm: "6px" },
              height: { xs: "40px", sm: "50px" },
              background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(204, 0, 0, 0.3)",
            }}
          />
          <MKTypography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              letterSpacing: "0.5px",
              lineHeight: 1.2,
            }}
          >
            Dashboard Overview
          </MKTypography>
        </MKBox>
        <MKTypography
          variant="body1"
          sx={{
            color: ({ palette: { text } }) => text.main,
            fontSize: { xs: "0.95rem", sm: "1rem" },
            lineHeight: 1.6,
            opacity: 0.9,
            pl: { xs: 3, sm: 4 },
          }}
        >
          Welcome to your comprehensive dashboard. Here you can view key metrics and manage your
          data.
        </MKTypography>
      </MKBox>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={6} sx={{ px: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              1,234
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Total Users
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(240, 147, 251, 0.3)",
            }}
          >
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              98.5%
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Uptime
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(79, 172, 254, 0.3)",
            }}
          >
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              567
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Reports
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(67, 233, 123, 0.3)",
            }}
          >
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              89
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Active Teams
            </MKTypography>
          </Card>
        </Grid>
      </Grid>

      {/* Content Cards */}
      <Grid container spacing={4} sx={{ px: 3 }}>
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              p: 4,
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <MKTypography variant="h5" fontWeight="bold" mb={2}>
              Recent Activity
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={3}>
              Track your recent activities and system events.
            </MKTypography>
            <MKButton variant="gradient" color="info" size="large" fullWidth>
              View Activity
            </MKButton>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              p: 4,
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <MKTypography variant="h5" fontWeight="bold" mb={2}>
              Quick Actions
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={3}>
              Access frequently used features and tools.
            </MKTypography>
            <MKButton variant="gradient" color="success" size="large" fullWidth>
              Get Started
            </MKButton>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
