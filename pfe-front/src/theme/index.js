import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Professional Blue
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8', // Light grey for a modern dashboard look
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
  },
});

export default theme;