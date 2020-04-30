import { List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React from "react";
import {
  currentRFactor,
  fromNANable,
  historicalHFactor,
  Infectious,
  onlyKind,
  Person,
  Removed,
  Susceptible,
  toFixed,
} from "../../utils";
import Info from "../Info";

interface Props {
  people: ReadonlyArray<Person>;
  lasts: number;
}

const useStyles = makeStyles(() => ({
  aligned: {
    display: "flex",
  },
}));

const Data: React.FunctionComponent<Props> = ({ people, lasts }) => {
  const susceptible = onlyKind<Susceptible>(people, "susceptible").length;
  const infectious = onlyKind<Infectious>(people, "infectious").length;
  const removed = onlyKind<Removed>(people, "removed").length;
  const rCurr = fromNANable(currentRFactor(people, lasts)).map(toFixed(2)).getOrElseValue("");
  const rHist = fromNANable(historicalHFactor(people)).map(toFixed(2)).getOrElseValue("");

  const classes = useStyles();

  return (
    <List>
      <ListItem>
        <ListItemText primaryTypographyProps={{ className: classes.aligned }}>
          <Info>The number of people who haven't been infected.</Info>
          Susceptible
        </ListItemText>
        <ListItemText primary={susceptible} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem>
        <ListItemText primaryTypographyProps={{ className: classes.aligned }}>
          <Info>The number of people who are currently infected.</Info>
          Infectious
        </ListItemText>
        <ListItemText primary={infectious} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem>
        <ListItemText primaryTypographyProps={{ className: classes.aligned }}>
          <Info>
            The number of people who were infected, but aren't now (so they've been removed from the
            simulation).
          </Info>
          Removed
        </ListItemText>
        <ListItemText primary={removed} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem>
        <ListItemText primaryTypographyProps={{ className: classes.aligned }}>
          <Info>
            The average number of secondary infections projected to be generated per currently
            infectious person.
          </Info>
          R-Current
        </ListItemText>
        <ListItemText primary={rCurr} style={{ textAlign: "right" }} />
      </ListItem>
      <ListItem>
        <ListItemText primaryTypographyProps={{ className: classes.aligned }}>
          <Info>
            The average number of secondary infections actually generated by all removed people
            while they were infectious.
          </Info>
          R-Historical
        </ListItemText>
        <ListItemText primary={rHist} style={{ textAlign: "right" }} />
      </ListItem>
    </List>
  );
};

export default Data;
