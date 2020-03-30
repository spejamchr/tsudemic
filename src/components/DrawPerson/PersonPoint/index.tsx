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

const PersonPoint: React.FunctionComponent<Props> = ({ person, top, left }) => {
  switch (person.kind) {
    case "susceptible":
      return (
        <div
          style={{
            position: "absolute",
            top: top - 1,
            left: left - 1,
            width: "4px",
            height: "4px",
            borderRadius: `2px`,
            backgroundColor: color(person)
          }}
        />
      );
    case "infectious":
    case "removed":
      return <></>;
  }
};

export default PersonPoint;
