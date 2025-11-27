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
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

function Users() {
  const users = [
    { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
    { name: "Alice Brown", email: "alice@example.com", role: "Moderator", status: "Active" },
  ];

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox mb={6}>
        <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MKTypography variant="h4" fontWeight="bold">
            User Management
          </MKTypography>
          <MKButton variant="gradient" color="info" size="large">
            Add User
          </MKButton>
        </MKBox>
        <MKTypography variant="body1" color="text">
          Manage your users, roles, and permissions. View and edit user information.
        </MKTypography>
      </MKBox>

      {/* Users List */}
      <Grid container spacing={3} sx={{ px: 3 }}>
        {users.map((user, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <MKBox display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <MKBox>
                  <MKTypography variant="h6" fontWeight="bold" mb={0.5}>
                    {user.name}
                  </MKTypography>
                  <MKTypography variant="body2" color="text.secondary">
                    {user.email}
                  </MKTypography>
                </MKBox>
              </MKBox>

              <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Chip label={user.role} size="small" color="primary" sx={{ fontWeight: 500 }} />
                <Chip
                  label={user.status}
                  size="small"
                  color={user.status === "Active" ? "success" : "default"}
                  sx={{ fontWeight: 500 }}
                />
              </MKBox>

              <MKButton variant="outlined" color="info" size="small" fullWidth>
                Edit User
              </MKButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* User Stats */}
      <Grid container spacing={4} sx={{ px: 3, mt: 4 }}>
        <Grid item xs={12} md={4}>
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
            <MKTypography variant="h3" fontWeight="bold" mb={1}>
              {users.length}
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Total Users
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
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
            <MKTypography variant="h3" fontWeight="bold" mb={1}>
              {users.filter((u) => u.status === "Active").length}
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Active Users
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
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
            <MKTypography variant="h3" fontWeight="bold" mb={1}>
              {users.filter((u) => u.role === "Admin").length}
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Administrators
            </MKTypography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Users;
