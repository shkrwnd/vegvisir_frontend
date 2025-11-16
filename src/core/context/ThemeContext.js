/**
=========================================================
* Theme Context
=========================================================
* Global theme state management (light/dark mode) using React Context
*/

import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { STORAGE_KEYS } from "../config";

// Import base theme components
import breakpoints from "assets/theme/base/breakpoints";
import typography from "assets/theme/base/typography";
import boxShadows from "assets/theme/base/boxShadows";
import borders from "assets/theme/base/borders";
import globals from "assets/theme/base/globals";

// Import theme functions
import boxShadow from "assets/theme/functions/boxShadow";
import hexToRgb from "assets/theme/functions/hexToRgb";
import linearGradient from "assets/theme/functions/linearGradient";
import pxToRem from "assets/theme/functions/pxToRem";
import rgba from "assets/theme/functions/rgba";

// Import component styles
import list from "assets/theme/components/list";
import listItem from "assets/theme/components/list/listItem";
import listItemText from "assets/theme/components/list/listItemText";
import card from "assets/theme/components/card";
import cardMedia from "assets/theme/components/card/cardMedia";
import cardContent from "assets/theme/components/card/cardContent";
import button from "assets/theme/components/button";
import iconButton from "assets/theme/components/iconButton";
import input from "assets/theme/components/form/input";
import inputLabel from "assets/theme/components/form/inputLabel";
import inputOutlined from "assets/theme/components/form/inputOutlined";
import textField from "assets/theme/components/form/textField";
import menu from "assets/theme/components/menu";
import menuItem from "assets/theme/components/menu/menuItem";
import switchButton from "assets/theme/components/form/switchButton";
import divider from "assets/theme/components/divider";
import tableContainer from "assets/theme/components/table/tableContainer";
import tableHead from "assets/theme/components/table/tableHead";
import tableCell from "assets/theme/components/table/tableCell";
import linearProgress from "assets/theme/components/linearProgress";
import breadcrumbs from "assets/theme/components/breadcrumbs";
import slider from "assets/theme/components/slider";
import avatar from "assets/theme/components/avatar";
import tooltip from "assets/theme/components/tooltip";
import appBar from "assets/theme/components/appBar";
import tabs from "assets/theme/components/tabs";
import tab from "assets/theme/components/tabs/tab";
import stepper from "assets/theme/components/stepper";
import step from "assets/theme/components/stepper/step";
import stepConnector from "assets/theme/components/stepper/stepConnector";
import stepLabel from "assets/theme/components/stepper/stepLabel";
import stepIcon from "assets/theme/components/stepper/stepIcon";
import select from "assets/theme/components/form/select";
import formControlLabel from "assets/theme/components/form/formControlLabel";
import formLabel from "assets/theme/components/form/formLabel";
import checkbox from "assets/theme/components/form/checkbox";
import radio from "assets/theme/components/form/radio";
import autocomplete from "assets/theme/components/form/autocomplete";
import flatpickr from "assets/theme/components/flatpickr";
import container from "assets/theme/components/container";
import popover from "assets/theme/components/popover";
import buttonBase from "assets/theme/components/buttonBase";
import icon from "assets/theme/components/icon";
import svgIcon from "assets/theme/components/svgIcon";
import link from "assets/theme/components/link";
import dialog from "assets/theme/components/dialog";
import dialogTitle from "assets/theme/components/dialog/dialogTitle";
import dialogContent from "assets/theme/components/dialog/dialogContent";
import dialogContentText from "assets/theme/components/dialog/dialogContentText";
import dialogActions from "assets/theme/components/dialog/dialogActions";
import swiper from "assets/theme/components/swiper";

// Light theme colors
const lightColors = {
  background: {
    default: "#f0f2f5",
  },
  text: {
    main: "#1a1a1a",
    focus: "#000000",
  },
  transparent: {
    main: "transparent",
  },
  white: {
    main: "#ffffff",
    focus: "#ffffff",
  },
  black: {
    light: "#000000",
    main: "#000000",
    focus: "#000000",
  },
  primary: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  secondary: {
    main: "#7b809a",
    focus: "#8f93a9",
  },
  info: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  success: {
    main: "#4CAF50",
    focus: "#67bb6a",
  },
  warning: {
    main: "#fb8c00",
    focus: "#fc9d26",
  },
  error: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  light: {
    main: "#f0f2f5",
    focus: "#f0f2f5",
  },
  dark: {
    main: "#344767",
    focus: "#2c3c58",
  },
  grey: {
    100: "#f8f9fa",
    200: "#f0f2f5",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
  gradients: {
    primary: {
      main: "#CC0000",
      state: "#8b0000",
    },
    secondary: {
      main: "#747b8a",
      state: "#495361",
    },
    info: {
      main: "#CC0000",
      state: "#8b0000",
    },
    success: {
      main: "#66BB6A",
      state: "#43A047",
    },
    warning: {
      main: "#FFA726",
      state: "#FB8C00",
    },
    error: {
      main: "#CC0000",
      state: "#8b0000",
    },
    light: {
      main: "#EBEFF4",
      state: "#CED4DA",
    },
    dark: {
      main: "#42424a",
      state: "#191919",
    },
  },
  socialMediaColors: {
    facebook: { main: "#ffffff", dark: "#f5f5f5" },
    twitter: { main: "#ffffff", dark: "#f5f5f5" },
    instagram: { main: "#ffffff", dark: "#f5f5f5" },
    linkedin: { main: "#ffffff", dark: "#f5f5f5" },
    pinterest: { main: "#ffffff", dark: "#f5f5f5" },
    youtube: { main: "#ffffff", dark: "#f5f5f5" },
    vimeo: { main: "#ffffff", dark: "#f5f5f5" },
    slack: { main: "#ffffff", dark: "#f5f5f5" },
    dribbble: { main: "#ffffff", dark: "#f5f5f5" },
    github: { main: "#ffffff", dark: "#f5f5f5" },
    reddit: { main: "#ffffff", dark: "#f5f5f5" },
    tumblr: { main: "#ffffff", dark: "#f5f5f5" },
  },
  badgeColors: {
    primary: { background: "#f8b3ca", text: "#cc084b" },
    secondary: { background: "#d7d9e1", text: "#6c757d" },
    info: { background: "#aecef7", text: "#095bc6" },
    success: { background: "#bce2be", text: "#339537" },
    warning: { background: "#ffd59f", text: "#c87000" },
    error: { background: "#fcd3d0", text: "#f61200" },
    light: { background: "#ffffff", text: "#c7d3de" },
    dark: { background: "#8097bf", text: "#1e2e4a" },
  },
  coloredShadows: {
    primary: "#e91e62",
    secondary: "#110e0e",
    info: "#00bbd4",
    success: "#4caf4f",
    warning: "#ff9900",
    error: "#f44336",
    light: "#adb5bd",
    dark: "#404040",
  },
  inputBorderColor: "#d2d6da",
  tabs: {
    indicator: { boxShadow: "#ddd" },
  },
};

// Dark theme colors
const darkColors = {
  background: {
    default: "#0a0a0a",
  },
  text: {
    main: "#ffffff",
    focus: "#ffffff",
  },
  transparent: {
    main: "transparent",
  },
  white: {
    main: "#ffffff",
    focus: "#ffffff",
  },
  black: {
    light: "#1a1a1a",
    main: "#000000",
    focus: "#000000",
  },
  primary: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  secondary: {
    main: "#ffffff",
    focus: "#f5f5f5",
  },
  info: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  success: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  warning: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  error: {
    main: "#CC0000",
    focus: "#8b0000",
  },
  light: {
    main: "#ffffff",
    focus: "#ffffff",
  },
  dark: {
    main: "#000000",
    focus: "#000000",
  },
  grey: {
    100: "#1a1a1a",
    200: "#2d2d2d",
    300: "#404040",
    400: "#525252",
    500: "#666666",
    600: "#808080",
    700: "#999999",
    800: "#cccccc",
    900: "#ffffff",
  },
  gradients: {
    primary: {
      main: "#CC0000",
      state: "#8b0000",
    },
    secondary: {
      main: "#ffffff",
      state: "#f5f5f5",
    },
    info: {
      main: "#CC0000",
      state: "#8b0000",
    },
    success: {
      main: "#CC0000",
      state: "#8b0000",
    },
    warning: {
      main: "#CC0000",
      state: "#8b0000",
    },
    error: {
      main: "#CC0000",
      state: "#8b0000",
    },
    light: {
      main: "#ffffff",
      state: "#f5f5f5",
    },
    dark: {
      main: "#000000",
      state: "#1a1a1a",
    },
  },
  socialMediaColors: {
    facebook: { main: "#ffffff", dark: "#f5f5f5" },
    twitter: { main: "#ffffff", dark: "#f5f5f5" },
    instagram: { main: "#ffffff", dark: "#f5f5f5" },
    linkedin: { main: "#ffffff", dark: "#f5f5f5" },
    pinterest: { main: "#ffffff", dark: "#f5f5f5" },
    youtube: { main: "#ffffff", dark: "#f5f5f5" },
    vimeo: { main: "#ffffff", dark: "#f5f5f5" },
    slack: { main: "#ffffff", dark: "#f5f5f5" },
    dribbble: { main: "#ffffff", dark: "#f5f5f5" },
    github: { main: "#ffffff", dark: "#f5f5f5" },
    reddit: { main: "#ffffff", dark: "#f5f5f5" },
    tumblr: { main: "#ffffff", dark: "#f5f5f5" },
  },
  badgeColors: {
    primary: { background: "#f8b3ca", text: "#cc084b" },
    secondary: { background: "#d7d9e1", text: "#6c757d" },
    info: { background: "#aecef7", text: "#095bc6" },
    success: { background: "#bce2be", text: "#339537" },
    warning: { background: "#ffd59f", text: "#c87000" },
    error: { background: "#fcd3d0", text: "#f61200" },
    light: { background: "#ffffff", text: "#c7d3de" },
    dark: { background: "#8097bf", text: "#1e2e4a" },
  },
  coloredShadows: {
    primary: "#e91e62",
    secondary: "#110e0e",
    info: "#00bbd4",
    success: "#4caf4f",
    warning: "#ff9900",
    error: "#f44336",
    light: "#adb5bd",
    dark: "#404040",
  },
  inputBorderColor: "#d2d6da",
  tabs: {
    indicator: { boxShadow: "#ddd" },
  },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode] = useState("light");

  const toggleMode = () => {
    // Toggle disabled - always use light mode
  };

  const colors = mode === "light" ? lightColors : darkColors;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...colors,
        },
        breakpoints: { ...breakpoints },
        typography: { ...typography },
        boxShadows: { ...boxShadows },
        borders: { ...borders },
        functions: {
          boxShadow,
          hexToRgb,
          linearGradient,
          pxToRem,
          rgba,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ...globals,
              ...flatpickr,
              ...container,
              ...swiper,
            },
          },
          MuiList: { ...list },
          MuiListItem: { ...listItem },
          MuiListItemText: { ...listItemText },
          MuiCard: { ...card },
          MuiCardMedia: { ...cardMedia },
          MuiCardContent: { ...cardContent },
          MuiButton: { ...button },
          MuiIconButton: { ...iconButton },
          MuiInput: { ...input },
          MuiInputLabel: { ...inputLabel },
          MuiOutlinedInput: { ...inputOutlined },
          MuiTextField: { ...textField },
          MuiMenu: { ...menu },
          MuiMenuItem: { ...menuItem },
          MuiSwitch: { ...switchButton },
          MuiDivider: { ...divider },
          MuiTableContainer: { ...tableContainer },
          MuiTableHead: { ...tableHead },
          MuiTableCell: { ...tableCell },
          MuiLinearProgress: { ...linearProgress },
          MuiBreadcrumbs: { ...breadcrumbs },
          MuiSlider: { ...slider },
          MuiAvatar: { ...avatar },
          MuiTooltip: { ...tooltip },
          MuiAppBar: { ...appBar },
          MuiTabs: { ...tabs },
          MuiTab: { ...tab },
          MuiStepper: { ...stepper },
          MuiStep: { ...step },
          MuiStepConnector: { ...stepConnector },
          MuiStepLabel: { ...stepLabel },
          MuiStepIcon: { ...stepIcon },
          MuiSelect: { ...select },
          MuiFormControlLabel: { ...formControlLabel },
          MuiFormLabel: { ...formLabel },
          MuiCheckbox: { ...checkbox },
          MuiRadio: { ...radio },
          MuiAutocomplete: { ...autocomplete },
          MuiPopover: { ...popover },
          MuiButtonBase: { ...buttonBase },
          MuiIcon: { ...icon },
          MuiSvgIcon: { ...svgIcon },
          MuiLink: { ...link },
          MuiDialog: { ...dialog },
          MuiDialogTitle: { ...dialogTitle },
          MuiDialogContent: { ...dialogContent },
          MuiDialogContentText: { ...dialogContentText },
          MuiDialogActions: { ...dialogActions },
        },
      }),
    [mode, colors]
  );

  const value = {
    mode,
    theme,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
