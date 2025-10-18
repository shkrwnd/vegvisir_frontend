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

// react-router-dom components
import { Link } from "react-router-dom";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Authentication layout components
import IllustrationLayout from "pages/ResetPassword/components/IllustrationLayout";

// Image
import bgImage from "assets/images/illustrations/illustration-reset.jpg";

function ResetPassword() {
  return (
    <IllustrationLayout
      title="Reset Password"
      description="You will receive an e-mail in maximum 60 seconds"
      illustration={bgImage}
    >
      <MKBox component="form" role="form">
        <MKBox mb={4}>
          <MKInput type="email" label="Email" fullWidth placeholder="john@email.com" />
        </MKBox>
        <MKBox mt={4} mb={1}>
          <MKButton variant="gradient" color="info" size="large" fullWidth>
            reset
          </MKButton>
        </MKBox>
        <MKBox mt={3} textAlign="center">
          <MKTypography variant="button" color="text">
            Remember your password?{" "}
            <MKTypography
              component={Link}
              to="/login"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Back to Login
            </MKTypography>
          </MKTypography>
        </MKBox>
      </MKBox>
    </IllustrationLayout>
  );
}

export default ResetPassword;
