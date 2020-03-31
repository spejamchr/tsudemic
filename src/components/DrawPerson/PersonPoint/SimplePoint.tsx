import React from "react";
import { Person } from "../../Simulation";
import { useTheme, Theme } from "@material-ui/core/styles";

interface Props {
  person: Person;
  top: number;
  left: number;
}

const color = (theme: Theme, person: Person): string => {
  switch (person.kind) {
    case "susceptible":
      return theme.palette.primary.main;
    case "infectious":
      return theme.palette.secondary.main;
    case "removed":
      return theme.palette.grey[400];
  }
};

const SimplePoint: React.FunctionComponent<Props> = ({ person, top, left }) => {
  const theme = useTheme();
  return <circle cx={left} cy={top} r={2} fill={color(theme, person)} />;
};

export default SimplePoint;
