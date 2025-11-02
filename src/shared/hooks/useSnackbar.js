/**
=========================================================
* useSnackbar Hook
=========================================================
* Custom hook for managing snackbar notifications
*/

import { useState } from "react";

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: "info",
    icon: "info",
    title: "",
    dateTime: "now",
    content: "",
  });

  const showSnackbar = (color, icon, title, content) => {
    setSnackbar({
      open: true,
      color,
      icon,
      title,
      dateTime: new Date().toLocaleTimeString(),
      content,
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    snackbar,
    showSnackbar,
    closeSnackbar,
  };
};
