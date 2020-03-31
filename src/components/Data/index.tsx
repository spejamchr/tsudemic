import { ListItem, ListItemText } from "@material-ui/core";
import React from "react";

interface Props {
  susceptible: number;
  infectious: number;
  removed: number;
}

const Data: React.FunctionComponent<Props> = ({ susceptible, infectious, removed }) => {
  return (
    <>
      <ListItem style={{ justifyContent: "space-between" }}>
        <ListItemText primary="Susceptible" />
        <ListItemText primary={susceptible} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem style={{ justifyContent: "space-between" }}>
        <ListItemText primary="Infectious" />
        <ListItemText primary={infectious} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem style={{ justifyContent: "space-between" }}>
        <ListItemText primary="Removed" />
        <ListItemText primary={removed} style={{ textAlign: "right" }} />
      </ListItem>
    </>
  );
};

export default Data;
