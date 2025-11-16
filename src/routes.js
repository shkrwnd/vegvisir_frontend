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
import Icon from "@mui/material/Icon";

// Core config
import { ROUTES } from "core/config";

// Dashboard routes for sidebar navigation
export const dashboardRoutes = [
  {
    name: "Home",
    icon: <Icon>home</Icon>,
    route: ROUTES.HOME,
  },
  {
    name: "Dashboard",
    icon: <Icon>dashboard</Icon>,
    route: ROUTES.DASHBOARD,
  },
  {
    name: "Analytics",
    icon: <Icon>analytics</Icon>,
    route: ROUTES.ANALYTICS,
  },
  {
    name: "Users",
    icon: <Icon>people</Icon>,
    route: ROUTES.USERS,
  },
  {
    name: "Settings",
    icon: <Icon>settings</Icon>,
    route: ROUTES.SETTINGS,
  },
  {
    name: "Data Tables",
    icon: <Icon>table_chart</Icon>,
    route: ROUTES.DATA_TABLES,
  },
  {
    name: "Notifications",
    icon: <Icon>notifications</Icon>,
    route: ROUTES.NOTIFICATIONS,
  },
  {
    name: "Budgets",
    icon: <Icon>account_balance_wallet</Icon>,
    route: ROUTES.BUDGETS,
  },
  {
    name: "Cards",
    icon: <Icon>credit_card</Icon>,
    route: ROUTES.CARDS,
  },
  {
    name: "Transactions",
    icon: <Icon>receipt_long</Icon>,
    route: ROUTES.TRANSACTIONS,
  },
  {
    name: "Order",
    icon: <Icon>shopping_cart</Icon>,
    route: ROUTES.ORDER,
  },
];
