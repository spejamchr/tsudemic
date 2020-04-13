import { ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import { Infectious, onlyKind, Person, Removed, Susceptible } from "../Simulation";

interface Props {
  people: Person[];
}

const Data: React.FunctionComponent<Props> = ({ people }) => {
  const susceptible = onlyKind<Susceptible>(people, "susceptible").length;
  const infectious = onlyKind<Infectious>(people, "infectious").length;
  const removed = onlyKind<Removed>(people, "removed").length;

  return (
    <>
      <ListItem>
        <ListItemText primary="Susceptible" />
        <ListItemText primary={susceptible} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Infectious" />
        <ListItemText primary={infectious} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Removed" />
        <ListItemText primary={removed} style={{ textAlign: "right" }} />
      </ListItem>
    </>
  );
};

export default Data;
