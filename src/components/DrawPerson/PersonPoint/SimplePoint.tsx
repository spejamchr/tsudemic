import { useTheme } from "@material-ui/core/styles";
import React from "react";
import { Person } from "../../../utils";

interface Props {
  person: Person;
  top: number;
  left: number;
}

const SimplePoint: React.FunctionComponent<Props> = ({ person, top, left }) => {
  const theme = useTheme();

  const color = (person: Person): string => {
    switch (person.kind) {
      case "susceptible":
        return theme.palette.primary.main;
      case "infectious":
        return theme.palette.secondary.main;
      case "removed":
        return theme.palette.grey[400];
    }
  };

  return <circle cx={left} cy={top} r={2} fill={color(person)} />;
};

export default SimplePoint;
