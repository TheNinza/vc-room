import { createTheme } from "@material-ui/core/styles";

export const theme = createTheme({
  palette: {
    type: "dark",
    background: {
      default: "#1C1D28",
      paper: "#28293D",
    },
    primary: {
      main: "#4e69ff",
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});
