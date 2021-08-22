import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { theme } from "./lib/material-ui/theme";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
