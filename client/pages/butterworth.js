import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  Typography,
  Button,
  TextField,
  CssBaseline,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomSlider from "../components/CustomSlider";
import AudioPlayer from "../components/AudioPlayer";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const keys = ["order", "cutoff_freq", "type", "fs", "output"];

export default function Melspectrogram() {
  const [configuration, setConfiguration] = useState({
    audio_path: "C:\\Users\\pauli\\work\\vis-gram\\server\\audio",
    audio: "",
    order: 2,
    cutoff_freq: 400,
    type: "highpass",
    fs: null,
    output: "sos",
  });
  const [audioList, setAudioList] = useState(["None"]);
  const [img, setImg] = useState();
  const [pythonError, setPythonError] = useState(null);

  const fetchImage = async () => {
    console.log(configuration);
    const res = await fetch("http://localhost:5000/butterworth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configuration),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          return response.json().then((data) => {
            setPythonError(data.error);
          });
        } else {
          setPythonError(null);
        }
        return response.blob();
      })
      .then((blob) => {
        const imageObjectURL = URL.createObjectURL(blob);
        setImg(imageObjectURL);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchAvailableAudio = async () => {
    const res = await fetch("http://localhost:5000/available_audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio_path: configuration["audio_path"].trim() }),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          return response.json().then((data) => {
            setPythonError(data.error);
          });
        } else {
          return response.json().then((data) => {
            setAudioList(data);
            setPythonError(null);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchAvailableAudio();
  }, [configuration["audio_path"]]);

  function generateButterworthFilter() {
    fetchImage();
  }

  function changeKey(key, e) {
    let value = null;
    if (["type", "output", "audio", "audio_path"].includes(key)) {
      value = e.target.value;
    } else if (key == "cutoff_freq" && configuration["type"] == "bandpass") {
      value = e.target.value.map((item) => parseInt(item));
      console.log("this is the band :", value);
    } else {
      value = parseInt(e.target.value);
    }
    console.log("changing", key, "with ", e.target.value);
    setConfiguration({
      ...configuration,
      [key]: value,
    });

    console.log(configuration);
  }

  const handleChange = (event) => {
    changeKey("audio", event);
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div>Audio Path</div>
          <TextField
            onChange={(e) => changeKey("audio_path", e)}
            defaultValue={configuration.audio_path}
            fullWidth
          ></TextField>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={configuration.audio}
            onChange={handleChange}
            fullWidth
          >
            {audioList?.map((item) => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={3}>
          <Item>
            {keys.map((k) => (
              <>
                <div>{k}</div>
                {k == "cutoff_freq" && configuration["type"] == "bandpass" ? (
                  <CustomSlider
                    configuration={configuration}
                    setConfiguration={setConfiguration}
                  />
                ) : (
                  <TextField
                    onChange={(e) => changeKey(k, e)}
                    defaultValue={configuration[k]}
                    disabled={k == "output"}
                  ></TextField>
                )}
              </>
            ))}
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <img src={img} alt="Empty Image" width={1000} />
            {
              <Typography variant="h6" component="h2">
                {pythonError && <>Error: {pythonError}</>}
              </Typography>
            }
          </Item>
        </Grid>
        <Grid item xs={6}>
          <AudioPlayer configuration={configuration}/>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Button onClick={generateButterworthFilter}>Generate</Button>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
}
