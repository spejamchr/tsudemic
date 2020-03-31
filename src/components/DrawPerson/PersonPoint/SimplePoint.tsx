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
  return (
    <div
      style={{
        position: "absolute",
        top: `${top - 2}px`,
        left: `${left - 2}px`,
        width: "3px",
        height: "3px",
        borderRadius: `2px`,
        backgroundColor: color(theme, person),
      }}
    />
  );
};

export default SimplePoint;
