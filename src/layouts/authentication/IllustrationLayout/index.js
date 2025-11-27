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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";

// Material Kit 2 PRO React example components
import DefaultNavbar from "components/custom/DefaultNavbar";

// Material Kit 2 PRO React page layout routes

function IllustrationLayout({
  header = "",
  title = "",
  description = "",
  illustration = "",
  illustration2 = "",
  children,
}) {
  return (
    <MKBox width="100%" height="100%" bgColor="white">
      <MKBox position="absolute" width="100%" mt={1}>
        <DefaultNavbar
          brand="SCARLET PAY"
          action={{
            type: "external",
            route: "https://www.creative-tim.com/product/material-kit-pro-react",
            label: "buy now",
            color: "dark",
          }}
        />
      </MKBox>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <MKBox
            display={{ xs: "none", lg: "flex" }}
            width="calc(100% - 2rem)"
            height="calc(100vh - 2rem)"
            borderRadius="lg"
            ml={2}
            mt={2}
            gap={1}
            flexDirection="column"
          >
            {illustration && (
              <MKBox
                flex={1}
                borderRadius="lg"
                sx={{
                  backgroundImage: `url(${illustration})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
            {illustration2 && (
              <MKBox
                flex={1}
                borderRadius="lg"
                sx={{
                  backgroundImage: `url(${illustration2})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </MKBox>
        </Grid>
        <Grid item xs={11} sm={8} md={5} lg={4} xl={3} sx={{ mx: "auto" }}>
          <MKBox display="flex" flexDirection="column" justifyContent="center" height="100vh">
            <MKBox p={3} textAlign="center">
              {!header ? (
                <>
                  <MKBox mb={1} textAlign="center">
                    <MKTypography variant="h4" fontWeight="bold">
                      {title}
                    </MKTypography>
                  </MKBox>
                  <MKTypography variant="body2" color="text">
                    {description}
                  </MKTypography>
                </>
              ) : (
                header
              )}
            </MKBox>
            <MKBox p={3}>{children}</MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
}

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  illustration: PropTypes.string,
  illustration2: PropTypes.string,
};

export default IllustrationLayout;
