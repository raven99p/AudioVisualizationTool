import React from "react";
import { Typography, Box, CssBaseline, Container, Link } from "@mui/material";

export default function Navigation() {
  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <h1>Choose feature</h1>
      <Link
        href="http://localhost:3000/melspectrogram"
        sx={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Box
          sx={{
            width: 250,
            height: 200,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h7"
            sx={{
              fontWeight: "bold",
              color: "white",
            }}
          >
            MELSPECTROGRAM
          </Typography>
        </Box>
      </Link>
      <Link
        href="http://localhost:3000/butterworth"
        sx={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Box
          sx={{
            width: 250,
            height: 200,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5
          }}
        >
          <Typography
            variant="h7"
            sx={{
              fontWeight: "bold",
              color: "white",
            }}
          >
            BUTTERWORTH
          </Typography>
        </Box>
      </Link>
    </Container>
  );
}
