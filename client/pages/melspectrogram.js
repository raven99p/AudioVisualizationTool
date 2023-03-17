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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const keys = [
  "n_fft",
  "hop_length",
  "win_length",
  "window",
  "center",
  "pad_mode",
  "power",
];

export default function Melspectrogram() {
  const [configuration, setConfiguration] = useState({
    audio_path: "",
    audio: "",
    y: null,
    sr: 22050,
    S: null,
    n_fft: 2048,
    hop_length: 512,
    win_length: 1024,
    window: "hann",
    center: false,
    pad_mode: "constant",
    power: 1,
  });
  const [audioList, setAudioList] = useState(["None"]);
  const [img, setImg] = useState();
  const [pythonError, setPythonError] = useState(null);

  const fetchImage = async () => {
    const res = await fetch("http://localhost:5000/mel_spectrogram", {
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

  function generateSpectrogram() {
    fetchImage();
  }

  function changeKey(key, e) {
    let value = null;
    if (["window", "center", "pad_mode", "audio", "audio_path"].includes(key)) {
      value = e.target.value;
    } else {
      value = parseInt(e.target.value);
    }
    console.log("changing", key, "with ", e.target.value);
    setConfiguration({
      ...configuration,
      [key]: value,
    });
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
        <Grid item xs={2}>
          <Item>
            {keys.map((k) => (
              <>
                <div>{k}</div>
                <TextField
                  onChange={(e) => changeKey(k, e)}
                  defaultValue={configuration[k]}
                ></TextField>
              </>
            ))}
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <img src={img} alt="Empty Image" width={1000} />
            {
              <Typography variant="h6" component="h2">
                {pythonError && (
                  <>Error: {pythonError}</>
                )}
               
              </Typography>
            }
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Button onClick={generateSpectrogram}>Generate</Button>
          </Item>
        </Grid>
      </Grid>
      <div>
        Parameters: <br />
        <br />
        <b>y</b>
        {": np.ndarray [shape=(…, n)] or None"} <br />
        audio time-series. Multi-channel is supported.
        <br />
        <br />
        <b>sr</b>
        {": number > 0 [scalar]"} <br />
        sampling rate of y <br />
        <br />
        <b>S</b>
        {": np.ndarray [shape=(…, d, t)]"}
        <br />
        spectrogram
        <br />
        <br />
        <b>n_fft</b>
        {": int > 0 [scalar]"}
        <br />
        length of the FFT window
        <br />
        <br />
        <b>hop_length</b>
        {": int > 0 [scalar]"}
        <br />
        number of samples between successive frames. See librosa.stft
        <br />
        <br />
        <b>win_length</b>
        {": int <= n_fft [scalar]"}
        <br />
        Each frame of audio is windowed by window(). The window will be of
        length win_length and then padded with zeros to match n_fft. If
        unspecified, defaults to win_length = n_fft.
        <br />
        <br />
        <b>window</b>
        {": string, tuple, number, function, or np.ndarray [shape=(n_fft,)]"}
        <br />
        • a window specification (string, tuple, or number); see
        scipy.signal.get_window
        <br />
        • a window function, such as scipy.signal.windows.hann
        <br />
        • a vector or array of length n_fft
        <br />
        <br />
        <b>center</b>
        {": boolean"}
        <br />
        • If True, the signal y is padded so that frame t is centered at y[t *
        hop_length].
        <br />
        • If False, then frame t begins at y[t * hop_length]
        <br />
        <br />
        <b>pad_mode</b>
        {": string"}
        <br />
        If center=True, the padding mode to use at the edges of the signal. By
        default, STFT uses zero padding.
        <br />
        <br />
        <b>power</b>
        {": float > 0 [scalar]"}
        <br />
        Exponent for the magnitude melspectrogram. e.g., 1 for energy, 2 for
        power, etc.
        <br />
        <br />
        **kwargs: additional keyword arguments for Mel filter bank parameters
        <br />
        <br />
        <b>n_mels</b>
        {": int > 0 [scalar]"}
        <br />
        number of Mel bands to generate
        <br />
        <br />
        <b>fmin</b>
        {": float >= 0 [scalar]"}
        <br />
        lowest frequency (in Hz)
        <br />
        <br />
        <b>fmax</b>
        {": float >= 0 [scalar]"}
        <br />
        highest frequency (in Hz). If None, use fmax = sr / 2.0
        <br />
        <br />
        <b>htk</b>
        {": bool [scalar]"}
        <br />
        use HTK formula instead of Slaney
        <br />
        <br />
        <b>norm</b>
        {": {None, ‘slaney’, or number} [scalar]"}
        <br />
        If ‘slaney’, divide the triangular mel weights by the width of the mel
        band (area normalization). If numeric, use librosa.util.normalize to
        normalize each filter by to unit l_p norm. See librosa.util.normalize
        for a full description of supported norm values (including +-np.inf).
        Otherwise, leave all the triangles aiming for a peak value of 1.0
        <br />
        <br />
        <b>dtype</b>
        {": np.dtype"}
        <br />
        The data type of the output basis. By default, uses 32-bit
        (single-precision) floating point.
        <br />
        <br />
        <br />
        Returns: <b>S</b>
        {"         : np.ndarray [shape=(…, n_mels, t)]"}
        <br />
        Mel spectrogram
      </div>
    </Container>
  );
}
