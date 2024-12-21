import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import './index.css';
const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Helvetica, Roboto, Arial, sans-serif;',
  },
  palette: {
    primary: {
      main: "#cbe068",
    },
    secondary: {
      main: "#555",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
