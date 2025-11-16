import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { STORAGE_KEYS } from "../config";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import createTheme from "../../assets/theme"; // You'll modify this

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useLocalStorage(STORAGE_KEYS.THEME, "light");
  const [darkMode, setDarkMode] = useState(mode === "dark");

  useEffect(() => {
    setDarkMode(mode === "dark");
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
  };

  // Create theme based on mode
  const theme = useMemo(() => createTheme(mode), [mode]);

  const value = {
    mode,
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
