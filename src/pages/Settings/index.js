/**
=========================================================
* Material Kit 2 PRO React - v2.1.1
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2025 Made by Vegvisir Team

Coded by Vegvisir Team

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKInput from "components/base/MKInput";

function Settings() {
  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox mb={6}>
        <MKTypography variant="h4" fontWeight="bold" mb={2}>
          Settings
        </MKTypography>
        <MKTypography variant="body1" color="text">
          Configure your application settings and preferences.
        </MKTypography>
      </MKBox>

      <Grid container spacing={4} sx={{ px: 3 }}>
        {/* Profile Settings */}
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
            <MKTypography variant="h5" fontWeight="bold" mb={3}>
              Profile Settings
            </MKTypography>
            <MKBox mb={3}>
              <MKInput type="text" label="Full Name" defaultValue="John Doe" fullWidth />
            </MKBox>
            <MKBox mb={3}>
              <MKInput
                type="email"
                label="Email Address"
                defaultValue="john@example.com"
                fullWidth
              />
            </MKBox>
            <MKBox mb={3}>
              <MKInput type="text" label="Company" defaultValue="Creative Tim" fullWidth />
            </MKBox>
            <MKButton variant="gradient" color="info" size="large" fullWidth>
              Save Changes
            </MKButton>
          </Card>
        </Grid>

        {/* Notification Settings */}
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
            <MKTypography variant="h5" fontWeight="bold" mb={3}>
              Notifications
            </MKTypography>
            <MKBox mb={2}>
              <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
            </MKBox>
            <MKBox mb={2}>
              <FormControlLabel control={<Switch defaultChecked />} label="Push Notifications" />
            </MKBox>
            <MKBox mb={2}>
              <FormControlLabel control={<Switch />} label="SMS Notifications" />
            </MKBox>
            <MKBox mb={3}>
              <FormControlLabel control={<Switch defaultChecked />} label="Weekly Reports" />
            </MKBox>
            <MKButton variant="gradient" color="success" size="large" fullWidth>
              Update Preferences
            </MKButton>
          </Card>
        </Grid>

        {/* Security Settings */}
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
            <MKTypography variant="h5" fontWeight="bold" mb={3}>
              Security
            </MKTypography>
            <MKBox mb={3}>
              <MKInput type="password" label="Current Password" fullWidth />
            </MKBox>
            <MKBox mb={3}>
              <MKInput type="password" label="New Password" fullWidth />
            </MKBox>
            <MKBox mb={3}>
              <MKInput type="password" label="Confirm New Password" fullWidth />
            </MKBox>
            <MKButton variant="gradient" color="warning" size="large" fullWidth>
              Change Password
            </MKButton>
          </Card>
        </Grid>

        {/* System Settings */}
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
            <MKTypography variant="h5" fontWeight="bold" mb={3}>
              System Preferences
            </MKTypography>
            <MKBox mb={2}>
              <FormControlLabel control={<Switch defaultChecked />} label="Dark Mode" />
            </MKBox>
            <MKBox mb={2}>
              <FormControlLabel control={<Switch defaultChecked />} label="Auto-save" />
            </MKBox>
            <MKBox mb={2}>
              <FormControlLabel control={<Switch />} label="Beta Features" />
            </MKBox>
            <MKBox mb={3}>
              <FormControlLabel control={<Switch defaultChecked />} label="Analytics Tracking" />
            </MKBox>
            <MKButton variant="gradient" color="info" size="large" fullWidth>
              Save Settings
            </MKButton>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
