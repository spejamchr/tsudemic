import React from "react";
import { Person } from "../../Simulation";

interface Props {
  person: Person;
  top: number;
  left: number;
}

const color = (person: Person): string => {
  switch (person.kind) {
    case "susceptible":
      return "green";
    case "infectious":
      return "red";
    case "removed":
      return "gray";
  }
};

const SimplePoint: React.FunctionComponent<Props> = ({ person, top, left }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${top - 2}px`,
        left: `${left - 2}px`,
        width: "4px",
        height: "4px",
        borderRadius: `2px`,
        backgroundColor: color(person),
      }}
    />
  );
};

export default SimplePoint;
