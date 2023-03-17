import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#538e92',
    },
    secondary: {
      main: '#aa6f73',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
