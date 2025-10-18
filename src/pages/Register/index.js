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

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Authentication layout components
import IllustrationLayout from "pages/Register/components/IllustrationLayout";

// Image
import bgImage from "assets/images/illustrations/illustration-signup.jpg";

function Register() {
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSetAgreeTerms = () => setAgreeTerms(!agreeTerms);

  return (
    <IllustrationLayout
      title="Sign Up"
      description="Enter your details to create your account"
      illustration={bgImage}
    >
      <MKBox component="form" role="form">
        <MKBox mb={2}>
          <MKInput type="text" label="Name" fullWidth />
        </MKBox>
        <MKBox mb={2}>
          <MKInput type="email" label="Email" fullWidth />
        </MKBox>
        <MKBox mb={2}>
          <MKInput type="password" label="Password" fullWidth />
        </MKBox>
        <MKBox mb={2}>
          <MKInput type="password" label="Confirm Password" fullWidth />
        </MKBox>
        <MKBox display="flex" alignItems="center" ml={-1}>
          <Switch checked={agreeTerms} onChange={handleSetAgreeTerms} />
          <MKTypography
            variant="button"
            fontWeight="regular"
            color="text"
            onClick={handleSetAgreeTerms}
            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
          >
            &nbsp;&nbsp;I agree the{" "}
            <MKTypography
              component="a"
              href="#"
              variant="button"
              fontWeight="bold"
              color="info"
              textGradient
            >
              Terms and Conditions
            </MKTypography>
          </MKTypography>
        </MKBox>
        <MKBox mt={4} mb={1}>
          <MKButton variant="gradient" color="info" size="large" fullWidth>
            sign up
          </MKButton>
        </MKBox>
        <MKBox mt={3} textAlign="center">
          <MKTypography variant="button" color="text">
            Already have an account?{" "}
            <MKTypography
              component={Link}
              to="/login"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign in
            </MKTypography>
          </MKTypography>
        </MKBox>
      </MKBox>
    </IllustrationLayout>
  );
}

export default Register;
