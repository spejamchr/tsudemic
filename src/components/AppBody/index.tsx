import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import Info from "../Info";
import Simulation from "../Simulation";

const AppBody: React.FunctionComponent = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Info direction="bottom">
            Welcome! This is a simulation of a pandemic. People are modeled as dots that move in
            circles (because people tend to have repetitive routines), and there are lots of
            controls to twiddle with. Enjoy the moving dots and graphs!
          </Info>
          <Typography variant="h6">TSudemic</Typography>
        </Toolbar>
      </AppBar>
      <br />
      <Simulation />
    </>
  );
};

export default AppBody;
