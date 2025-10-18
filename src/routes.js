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

// Login page
import LoginPage from "pages/Login";
// Register page
import RegisterPage from "pages/Register";

const routes = [
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
];

export default routes;
