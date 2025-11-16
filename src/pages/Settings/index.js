/**
=========================================================
* Settings Page - Profile Settings Editable
=========================================================
*/

import { useState, useEffect } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Material Kit components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKInput from "components/base/MKInput";
import MKSnackbar from "components/base/MKSnackbar";

// Core
import { useAuth } from "core/context";
import { useUser } from "features/users";
import { userAPI } from "features/users/api";
import { useSnackbar } from "shared/hooks";

function Settings() {
  const { user: authUser, updateUser } = useAuth();
  const userId = authUser?.id || authUser?.user_id || authUser?._id;
  const { user, loading, error, refetch } = useUser(userId);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({ name: "", email: "", company: "" });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
      });
    }
  }, [user]);

  const handleProfileInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfileSettings = async () => {
    const targetUserId = user?.id || user?._id || user?.user_id || userId;
    if (!targetUserId) {
      showSnackbar("error", "error", "Error", "User ID not found");
      return;
    }
    try {
      setSaving(true);
      const updateData = {
        name: profileData.name || user.name,
        email: profileData.email || user.email,
        company: profileData.company,
      };
      Object.keys(updateData).forEach((k) => {
        if (updateData[k] === "" || updateData[k] === null || updateData[k] === undefined)
          delete updateData[k];
      });
      const response = await userAPI.update(targetUserId, updateData);
      const updated = response.data;
      updateUser(updated);
      showSnackbar("success", "check", "Success", "Profile settings updated successfully!");
      await refetch();
    } catch (err) {
      showSnackbar(
        "error",
        "error",
        "Error",
        err.response?.data?.message || "Failed to update profile settings"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <MKBox mb={6}>
        <MKTypography variant="h4" fontWeight="bold" mb={2}>
          Settings
        </MKTypography>
        <MKTypography variant="body1" color="text">
          Configure your application settings and preferences.
        </MKTypography>
      </MKBox>

      {loading && (
        <MKBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </MKBox>
      )}
      {error && (
        <MKBox mb={4} sx={{ px: 3 }}>
          <Alert severity="error">{error}</Alert>
        </MKBox>
      )}

      {!loading && (
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
              <MKTypography variant="h5" fontWeight="bold" mb={3}>
                Profile Settings
              </MKTypography>
              <MKBox mb={3}>
                <MKInput
                  type="text"
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleProfileInputChange("name", e.target.value)}
                  fullWidth
                />
              </MKBox>
              <MKBox mb={3}>
                <MKInput
                  type="email"
                  label="Email Address"
                  value={profileData.email}
                  onChange={(e) => handleProfileInputChange("email", e.target.value)}
                  fullWidth
                />
              </MKBox>
              <MKBox mb={3}>
                <MKInput
                  type="text"
                  label="Company"
                  value={profileData.company}
                  onChange={(e) => handleProfileInputChange("company", e.target.value)}
                  fullWidth
                />
              </MKBox>
              <MKButton
                variant="gradient"
                color="info"
                size="large"
                fullWidth
                onClick={handleSaveProfileSettings}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
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
      )}

      <MKSnackbar
        open={snackbar.open}
        close={closeSnackbar}
        title={snackbar.title}
        content={snackbar.content}
        dateTime={snackbar.dateTime}
        icon={snackbar.icon}
        color={snackbar.color}
        bgWhite
      />
    </Container>
  );
}

export default Settings;
