import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import Simulation from "../Simulation";

const AppBody: React.FunctionComponent = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">TSudemic</Typography>
        </Toolbar>
      </AppBar>
      <br />
      <Simulation />
    </>
  );
};

export default AppBody;
