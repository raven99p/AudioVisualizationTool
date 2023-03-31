import { React, useState, useEffect } from "react";
import { Box, Slider, TextField, Button, Typography } from "@mui/material";
import ReactPlayer from "react-player";

export default function AudioPlayer({ configuration, setConfiguration }) {
  const [audio, setAudio] = useState();
  const [pythonError, setPythonError] = useState();
  useEffect(() => {
    console.log(audio);
  }, [audio]);

  const fetchAudio = async () => {
    const res = await fetch("http://localhost:5000/butterworth_audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configuration),
    })
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const blob = new Blob([arrayBuffer], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(blob);
        setAudio(audioUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Box width={250}>
      <Typography variant="h6" component="h2">Load filtered Audio</Typography>
      <Button onClick={fetchAudio}>Load Audio</Button>
      {audio && <audio src={audio} controls />}
      <Typography variant="h6" component="h2">
        {pythonError && <>Error: {pythonError}</>}
      </Typography>
    </Box>
  );
}
