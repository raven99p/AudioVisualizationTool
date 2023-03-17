import React from "react";
import { Box, Typography, Container } from "@mui/material";

export default function AppFooter() {
  return (
    <footer>
      <Box
        style={{
          backgroundColor: "#133d2f",
          bottom: 0,
          position: "static",
          width: "100%",
          marginTop: "calc(45vh - 50px)",
          padding: "2%",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography style={{ color: "white" }}>
            ©Audio Visualization Tool
          </Typography>
        </Container>
      </Box>
    </footer>
  );
}
