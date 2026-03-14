import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            backgroundColor: '#3a3a3a',
            color: '#b0b0b0',
            opacity: 0.7,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: 'red',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: 'red',
        },
      },
    },
  },
});
