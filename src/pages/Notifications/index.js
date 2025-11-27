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

import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";

// @mui icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";
import MKAvatar from "components/base/MKAvatar";

// Sample notifications data
const allNotifications = [
  {
    id: 1,
    type: "success",
    title: "Payment Received",
    message: "Your payment of $1,234.56 has been successfully processed.",
    timestamp: "2 minutes ago",
    read: false,
    icon: "check_circle",
  },
  {
    id: 2,
    type: "error",
    title: "Server Error",
    message: "High CPU usage detected on server-02. Immediate attention required.",
    timestamp: "15 minutes ago",
    read: false,
    icon: "error",
  },
  {
    id: 3,
    type: "warning",
    title: "Storage Limit Warning",
    message: "Your storage is at 85% capacity. Consider upgrading your plan.",
    timestamp: "1 hour ago",
    read: false,
    icon: "warning",
  },
  {
    id: 4,
    type: "info",
    title: "New Feature Available",
    message: "We've added new analytics tools. Check them out in your dashboard.",
    timestamp: "2 hours ago",
    read: true,
    icon: "info",
  },
  {
    id: 5,
    type: "success",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    timestamp: "3 hours ago",
    read: true,
    icon: "check_circle",
  },
  {
    id: 6,
    type: "info",
    title: "New Team Member",
    message: "Sarah Johnson has joined your team as a Designer.",
    timestamp: "5 hours ago",
    read: true,
    icon: "info",
  },
  {
    id: 7,
    type: "warning",
    title: "Scheduled Maintenance",
    message: "System maintenance scheduled for tonight at 11 PM EST.",
    timestamp: "1 day ago",
    read: true,
    icon: "warning",
  },
  {
    id: 8,
    type: "error",
    title: "Failed Login Attempt",
    message: "There was a failed login attempt from an unknown device.",
    timestamp: "2 days ago",
    read: true,
    icon: "error",
  },
];

function Notifications() {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState(allNotifications);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event, notificationId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    handleMenuClose();
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    handleMenuClose();
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const getFilteredNotifications = () => {
    if (activeTab === 0) return notifications; // All
    if (activeTab === 1) return notifications.filter((n) => !n.read); // Unread
    return notifications.filter((n) => n.read); // Read
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type) => {
    const colors = {
      success: "success",
      error: "error",
      warning: "warning",
      info: "info",
    };
    return colors[type] || "info";
  };

  const getTypeIcon = (type) => {
    const icons = {
      success: <CheckCircleIcon />,
      error: <ErrorIcon />,
      warning: <WarningIcon />,
      info: <InfoIcon />,
    };
    return icons[type] || <InfoIcon />;
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox mb={6}>
        <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MKBox display="flex" alignItems="center">
            <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
              <NotificationsIcon sx={{ fontSize: 32 }} />
            </Badge>
            <MKTypography variant="h4" fontWeight="bold">
              Notification Center
            </MKTypography>
          </MKBox>
          <MKBox display="flex" gap={2}>
            {unreadCount > 0 && (
              <MKButton variant="outlined" color="info" size="large" onClick={markAllAsRead}>
                Mark All as Read
              </MKButton>
            )}
            <MKButton
              variant="gradient"
              color="error"
              size="large"
              onClick={deleteAllNotifications}
            >
              Clear All
            </MKButton>
          </MKBox>
        </MKBox>
        <MKTypography variant="body1" color="text">
          Manage and view all your notifications in one place.
        </MKTypography>
      </MKBox>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4} sx={{ px: 3 }}>
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
              {notifications.length}
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Total Notifications
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
              {unreadCount}
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Unread
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
              {notifications.filter((n) => n.type === "success").length}
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Success
            </MKTypography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(250, 112, 154, 0.3)",
            }}
          >
            <MKTypography variant="h4" fontWeight="bold" mb={1}>
              {notifications.filter((n) => n.type === "error" || n.type === "warning").length}
            </MKTypography>
            <MKTypography variant="body2" sx={{ opacity: 0.9 }}>
              Alerts
            </MKTypography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <MKBox sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="notification tabs">
            <Tab
              label={
                <MKBox display="flex" alignItems="center" gap={1}>
                  All
                  <Chip label={notifications.length} size="small" color="primary" />
                </MKBox>
              }
            />
            <Tab
              label={
                <MKBox display="flex" alignItems="center" gap={1}>
                  Unread
                  {unreadCount > 0 && <Chip label={unreadCount} size="small" color="error" />}
                </MKBox>
              }
            />
            <Tab
              label={
                <MKBox display="flex" alignItems="center" gap={1}>
                  Read
                  <Chip
                    label={notifications.filter((n) => n.read).length}
                    size="small"
                    color="default"
                  />
                </MKBox>
              }
            />
          </Tabs>
        </MKBox>

        {/* Notifications List */}
        <MKBox sx={{ maxHeight: "600px", overflowY: "auto" }}>
          {filteredNotifications.length === 0 ? (
            <MKBox p={6} textAlign="center">
              <NotificationsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <MKTypography variant="h6" color="text.secondary" mb={1}>
                No notifications found
              </MKTypography>
              <MKTypography variant="body2" color="text.secondary">
                {activeTab === 1
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."}
              </MKTypography>
            </MKBox>
          ) : (
            filteredNotifications.map((notification, index) => (
              <MKBox key={notification.id}>
                <MKBox
                  display="flex"
                  alignItems="flex-start"
                  p={3}
                  sx={{
                    backgroundColor: notification.read ? "transparent" : "action.hover",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <MKAvatar
                    color={getTypeColor(notification.type)}
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: `${getTypeColor(notification.type)}.main`,
                    }}
                  >
                    {getTypeIcon(notification.type)}
                  </MKAvatar>

                  <MKBox flex={1}>
                    <MKBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={1}
                    >
                      <MKBox>
                        <MKTypography variant="h6" fontWeight="bold" mb={0.5}>
                          {notification.title}
                        </MKTypography>
                        <MKTypography variant="body2" color="text.secondary">
                          {notification.message}
                        </MKTypography>
                      </MKBox>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, notification.id)}
                        sx={{ ml: 2 }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </MKBox>
                    <MKBox display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <MKTypography variant="caption" color="text.secondary">
                        {notification.timestamp}
                      </MKTypography>
                      {!notification.read && (
                        <Chip
                          label="New"
                          size="small"
                          color="error"
                          sx={{ height: 20, fontSize: "0.65rem" }}
                        />
                      )}
                    </MKBox>
                  </MKBox>
                </MKBox>
                {index < filteredNotifications.length - 1 && <Divider />}
              </MKBox>
            ))
          )}
        </MKBox>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => markAsRead(selectedNotification)}
          disabled={notifications.find((n) => n.id === selectedNotification)?.read}
        >
          Mark as read
        </MenuItem>
        <MenuItem onClick={() => deleteNotification(selectedNotification)}>Delete</MenuItem>
      </Menu>
    </Container>
  );
}

export default Notifications;
