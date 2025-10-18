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

// Home page
import HomePage from "pages/Home";
// Login page
import LoginPage from "pages/Login";
// Register page
import RegisterPage from "pages/Register";
// Reset Password page
import ResetPasswordPage from "pages/ResetPassword";

const routes = [
  {
    name: "home",
    icon: <Icon>home</Icon>,
    route: "/home",
    component: <HomePage />,
  },
  {
    name: "login",
    icon: <Icon>login</Icon>,
    route: "/login",
    component: <LoginPage />,
  },
  {
    name: "register",
    icon: <Icon>person_add</Icon>,
    route: "/register",
    component: <RegisterPage />,
  },
  {
    name: "reset-password",
    icon: <Icon>lock_reset</Icon>,
    route: "/reset-password",
    component: <ResetPasswordPage />,
  },
];

export default routes;
