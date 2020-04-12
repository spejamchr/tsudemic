import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { cyan, deepPurple, grey } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import AppBody from "./components/AppBody";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: cyan,
    secondary: deepPurple,
    background: { default: grey[900] },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBody />
    </ThemeProvider>
  );
};

export default App;
