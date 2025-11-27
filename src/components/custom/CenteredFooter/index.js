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
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import GitHubIcon from "@mui/icons-material/GitHub";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";

// Core
import { useTheme } from "core/context";

function CenteredFooter({
  company = { href: "#", name: "Vegvisir Team" },
  links = [
    { href: "#", name: "Company" },
    { href: "#", name: "About Us" },
    { href: "#", name: "Team" },
    { href: "#", name: "Products" },
    { href: "#", name: "Blog" },
    { href: "#", name: "License" },
  ],
  socials = [
    { icon: <FacebookIcon fontSize="small" />, link: "https://www.facebook.com/CreativeTim/" },
    {
      icon: <TwitterIcon fontSize="small" />,
      link: "https://twitter.com/creativetim",
    },
    {
      icon: <InstagramIcon fontSize="small" />,
      link: "https://www.instagram.com/creativetimofficial/",
    },
    {
      icon: <PinterestIcon fontSize="small" />,
      link: "https://ro.pinterest.com/thecreativetim/",
    },
    { icon: <GitHubIcon fontSize="small" />, link: "https://github.com/creativetimofficial" },
  ],
  light = false,
}) {
  const { mode } = useTheme();
  const { href, name } = company;

  const year = new Date().getFullYear();

  const renderLinks = links.map((link) => (
    <MKTypography
      key={link.name}
      component={Link}
      href={link.href}
      variant="body2"
      sx={{
        color: ({ palette: { mode, text } }) =>
          mode === "dark" ? text.main : text.secondary || "#7b809a",
        fontWeight: "regular",
        "&:hover": {
          color: ({ palette: { primary } }) => primary.main,
        },
      }}
    >
      {link.name}
    </MKTypography>
  ));

  const renderSocials = socials.map((social) => (
    <MKTypography
      key={social.link}
      component={Link}
      href={social.link}
      variant="body2"
      sx={{
        color: ({ palette: { mode, text } }) =>
          mode === "dark" ? text.main : text.secondary || "#7b809a",
        fontWeight: "regular",
        "&:hover": {
          color: ({ palette: { primary } }) => primary.main,
        },
      }}
    >
      {social.icon}
    </MKTypography>
  ));

  return (
    <MKBox component="footer" py={6}>
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={8}>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            spacing={{ xs: 2, lg: 3, xl: 6 }}
            mb={3}
          >
            {renderLinks}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Stack display="flex" direction="row" justifyContent="center" spacing={3} mt={1} mb={3}>
            {renderSocials}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8} sx={{ textAlign: "center" }}>
          <MKTypography
            variant="body2"
            sx={{
              color: ({ palette: { mode, text } }) =>
                mode === "dark" ? text.main : text.secondary || "#7b809a",
            }}
          >
            Copyright &copy; {year} Material by{" "}
            <MKTypography
              component={Link}
              href={href}
              target="_blank"
              rel="noreferrer"
              variant="body2"
              sx={{
                color: ({ palette: { mode, text } }) =>
                  mode === "dark" ? text.main : text.secondary || "#7b809a",
                "&:hover": {
                  color: ({ palette: { primary } }) => primary.main,
                },
              }}
            >
              {name}
            </MKTypography>
            .
          </MKTypography>
        </Grid>
      </Grid>
    </MKBox>
  );
}

// Typechecking props for the CenteredFooter
CenteredFooter.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  socials: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  light: PropTypes.bool,
};

export default CenteredFooter;
