import React from "react";
import { Typography, Box, CssBaseline, Container, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import BoxComponent from "../components/BoxComponent";



export default function Index() {


  const [cssComponent, setCssComponent] = React.useState(null);

  const handleComponentChange = (event) => {
    setCssComponent(event.target.value);
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <h1>Choose CSS component</h1>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Component</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={cssComponent}
            label="CSS Component"
            onChange={handleComponentChange}
          >
            <MenuItem value={"box"}>Box</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <br /><br /><br />

      {cssComponent == "box" ?
        (
          <BoxComponent />
        )
        :
        (
          <>null</>
        )}


    </Container>
  );
}
