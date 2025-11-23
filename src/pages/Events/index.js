import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// Material Kit 2 PRO React components
import MKBox from "components/base/MKBox";
import MKTypography from "components/base/MKTypography";
import MKButton from "components/base/MKButton";

function Events() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Tech Talk",
      date: "Nov 15, 2025",
      time: "2:00 PM",
      location: "101 Science Hall",
      description: "An insightful tech talk on AI trends",
      rsvp: false,
    },
    {
      id: 2,
      name: "Networking Mixer",
      date: "Nov 21, 2025",
      time: "6:00 PM",
      location: "202 Business Center",
      description: "Meet tech professionals",
      rsvp: false,
    },
    {
      id: 3,
      name: "Hackathon",
      date: "Dec 1, 2025",
      time: "9:00 AM",
      location: "303 Innovation Hub",
      description: "24-hour coding challenge!",
      rsvp: false,
    },
  ]);

  const handleRSVP = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === id ? { ...event, rsvp: !event.rsvp } : event))
    );
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {/* Header Section */}
      <MKBox
        mb={6}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4, md: 5 },
          background:
            "linear-gradient(135deg, rgba(204, 0, 0, 0.1) 0%, rgba(204, 0, 0, 0.05) 100%)",
          borderRadius: 3,
          border: "1px solid rgba(204, 0, 0, 0.2)",
          boxShadow: "0 4px 20px rgba(204, 0, 0, 0.1)",
        }}
      >
        <MKBox display="flex" alignItems="center" gap={2}>
          <MKBox
            sx={{
              width: { xs: "4px", sm: "6px" },
              height: { xs: "40px", sm: "50px" },
              background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(204, 0, 0, 0.3)",
            }}
          />
          <MKTypography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #CC0000 0%, #8b0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              letterSpacing: "0.5px",
              lineHeight: 1.2,
            }}
          >
            Events
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Events Grid */}
      <Grid container spacing={3} sx={{ px: 3 }}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                boxShadow: ({ palette: { mode } }) =>
                  mode === "dark" ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
                background: ({ palette: { mode } }) =>
                  mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "white",
                border: ({ palette: { mode } }) =>
                  mode === "dark"
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: ({ palette: { mode } }) =>
                    mode === "dark" ? "0 12px 40px rgba(0,0,0,0.4)" : "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent>
                <MKTypography variant="h6" fontWeight="bold" mb={1}>
                  {event.name}
                </MKTypography>
                <MKTypography variant="body2" color="text.secondary" mb={1}>
                  {event.date} | {event.time}
                </MKTypography>
                <MKTypography variant="body2" color="text.secondary" mb={1}>
                  {event.location}
                </MKTypography>
                <MKTypography variant="body2" color="text" mb={2}>
                  {event.description}
                </MKTypography>
                <MKButton
                  variant="contained"
                  sx={{
                    backgroundColor: "#fff",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() => handleRSVP(event.id)}
                >
                  {event.rsvp ? "Un-RSVP" : "RSVP"}
                </MKButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Events;
