/**
=========================================================
* Profile Page - Editable with Save
=========================================================
*/

import { useState, useEffect } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
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

function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const userId = authUser?.id || authUser?.user_id || authUser?._id;
  const { user, loading, error, refetch } = useUser(userId);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    company: "",
    jobTitle: "",
    website: "",
    timezone: "",
  });

  useEffect(() => {
    if (user) {
      const firstName = user.name ? user.name.split(" ")[0] || "" : "";
      const lastName = user.name ? user.name.split(" ").slice(1).join(" ") || "" : "";
      setFormData({
        firstName,
        lastName,
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
        location: user.location || user.address || "",
        bio: user.bio || user.description || "",
        company: user.company || "",
        jobTitle: user.jobTitle || user.role || "",
        website: user.website || user.url || "",
        timezone: user.timezone || "",
      });
    }
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    } catch {
      return dateString;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    const targetUserId = user?.id || user?._id || user?.user_id || userId;
    if (!targetUserId) {
      showSnackbar("error", "error", "Error", "User ID not found");
      return;
    }
    try {
      setSaving(true);
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const updateData = {
        name: name || user?.name,
        email: formData.email || user?.email,
        phone: formData.phone,
        phoneNumber: formData.phone,
        location: formData.location,
        address: formData.location,
        bio: formData.bio,
        description: formData.bio,
        company: formData.company,
        jobTitle: formData.jobTitle,
        role: formData.jobTitle,
        website: formData.website,
        url: formData.website,
        timezone: formData.timezone,
      };
      Object.keys(updateData).forEach((k) => {
        if (updateData[k] === "" || updateData[k] === null || updateData[k] === undefined)
          delete updateData[k];
      });
      const response = await userAPI.update(targetUserId, updateData);
      const updated = response.data;
      updateUser(updated);
      showSnackbar("success", "check", "Success", "Profile updated successfully!");
      await refetch();
    } catch (err) {
      showSnackbar(
        "error",
        "error",
        "Error",
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ px: 0 }}>
        <MKBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </MKBox>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth={false} sx={{ px: 0 }}>
        <MKBox mb={6}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </MKBox>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth={false} sx={{ px: 0 }}>
        <MKBox mb={6}>
          <Alert severity="warning">No user data available. Please log in again.</Alert>
        </MKBox>
      </Container>
    );
  }

  const fullName =
    formData.firstName && formData.lastName
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : user.name || "User";

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <MKBox mb={6}>
        <MKTypography variant="h4" fontWeight="bold" mb={2}>
          Profile
        </MKTypography>
        <MKTypography variant="body1" color="text">
          Manage your profile information and preferences.
        </MKTypography>
      </MKBox>

      <Grid container spacing={4} sx={{ px: 3 }}>
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              p: 4,
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 3,
                bgcolor: "primary.main",
                fontSize: "3rem",
              }}
            >
              {getInitials(fullName || user.email)}
            </Avatar>
            <MKTypography variant="h5" fontWeight="bold" mb={1}>
              {fullName}
            </MKTypography>
            <MKTypography variant="body2" color="text" mb={3}>
              {formData.email || user.email || ""}
            </MKTypography>
            <Divider sx={{ my: 3 }} />
            <MKBox>
              <MKTypography variant="body2" color="text" mb={1}>
                Member since
              </MKTypography>
              <MKTypography variant="h6" fontWeight="bold">
                {formatDate(user.createdAt || user.created_at)}
              </MKTypography>
            </MKBox>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
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
              Personal Information
            </MKTypography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MKInput
                  type="text"
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MKInput
                  type="text"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <MKInput
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MKInput
                  type="tel"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MKInput
                  type="text"
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <MKInput
                  type="text"
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <MKButton
                  variant="gradient"
                  color="info"
                  size="large"
                  fullWidth
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </MKButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <MKTypography variant="h5" fontWeight="bold" mb={3}>
              Additional Information
            </MKTypography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MKBox>
                  <MKTypography variant="body2" color="text" mb={1}>
                    Company
                  </MKTypography>
                  <MKInput
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    fullWidth
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MKBox>
                  <MKTypography variant="body2" color="text" mb={1}>
                    Job Title
                  </MKTypography>
                  <MKInput
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    fullWidth
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MKBox>
                  <MKTypography variant="body2" color="text" mb={1}>
                    Website
                  </MKTypography>
                  <MKInput
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    fullWidth
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MKBox>
                  <MKTypography variant="body2" color="text" mb={1}>
                    Timezone
                  </MKTypography>
                  <MKInput
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => handleInputChange("timezone", e.target.value)}
                    fullWidth
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12}>
                <MKButton
                  variant="gradient"
                  color="info"
                  size="large"
                  fullWidth
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Additional Information"}
                </MKButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

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

export default Profile;
