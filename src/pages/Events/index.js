import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Events() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Tech Talk",
      date: "Nov 15, 2025",
      time: "2:00 PM",
      location: "Prcc",
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.date} | {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.location}
                  {/* To make building name a Google Maps link in the future:
                      Wrap the building name part in <a href="https://maps.google.com/?q=Science+Hall" target="_blank" rel="noreferrer">Science Hall</a>
                  */}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {event.description}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#fff",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  onClick={() => handleRSVP(event.id)}
                >
                  {event.rsvp ? "Un-RSVP" : "RSVP"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Events;
