import { useTheme } from "@material-ui/core";
import React from "react";
import { Person } from "../../Simulation";
import SimplePath from "../PersonPath/SimplePath";

interface Props {
  person: Person;
  range: number;
  top: number;
  left: number;
}

const PersonBorder: React.FunctionComponent<Props> = ({ person, range, top, left }) => {
  const theme = useTheme();

  switch (person.kind) {
    case "infectious":
      return <SimplePath x={left} y={top} r={range} color={theme.palette.secondary.main} />;
    case "susceptible":
    case "removed":
      return <></>;
  }
};

export default PersonBorder;
