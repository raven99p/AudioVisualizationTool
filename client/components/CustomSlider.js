import { React, useState, useEffect } from "react";
import { Box, Slider, TextField } from "@mui/material";

export default function CustomSlider() {
  const [range, setRange] = useState([100, 5000]);

  const handleSliderChange = (event, newValue) => {
    setRange(newValue);
  };

  const handleInputChangeHigh = (event) => {
    setRange(
      event.target.value === ""
        ? [range[0], ""]
        : [range[0], Number(event.target.value)]
    );
  };

  const handleInputChangeLow = (event) => {
    setRange(
      event.target.value === ""
        ? ["", range[1]]
        : [Number(event.target.value), range[1]]
    );
  };

  const handleBlur = () => {
    if (range < 0) {
      setRange(0);
    } else if (range > 5000) {
      setRange(5000);
    }
  };

  useEffect(() => {
    console.log(range);
  }, [range]);

  return (
    <Box width={250}>
      <Slider
        value={range}
        max={10000}
        aria-label="Default"
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
      />
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <TextField
          type="number"
          value={range[0]}
          size="small"
          onChange={handleInputChangeLow}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: 0,
            max: 5000,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <TextField
          type="number"
          value={range[1]}
          size="small"
          onChange={handleInputChangeHigh}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: 0,
            max: 5000,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
      </Box>
    </Box>
  );
}
