import { ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import {
  currentRFactor,
  historicalHFactor,
  Infectious,
  onlyKind,
  Person,
  Removed,
  Susceptible,
  toFixed,
  fromNANable,
} from "../../utils";

interface Props {
  people: Person[];
  lasts: number;
}

const Data: React.FunctionComponent<Props> = ({ people, lasts }) => {
  const susceptible = onlyKind<Susceptible>(people, "susceptible").length;
  const infectious = onlyKind<Infectious>(people, "infectious").length;
  const removed = onlyKind<Removed>(people, "removed").length;
  const rCurr = fromNANable(currentRFactor(people, lasts)).map(toFixed(2)).getOrElseValue("");
  const rHist = fromNANable(historicalHFactor(people)).map(toFixed(2)).getOrElseValue("");

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
      <ListItem>
        <ListItemText primary="R-Current" />
        <ListItemText primary={rCurr} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem>
        <ListItemText primary="R-Historical" />
        <ListItemText primary={rHist} style={{ textAlign: "right" }} />
      </ListItem>
    </>
  );
};

export default Data;
