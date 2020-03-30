import React from "react";
import { Person } from "../../Simulation";

interface Props {
  person: Person;
  range: number;
  top: number;
  left: number;
}

const PersonBorder: React.FunctionComponent<Props> = ({
  person,
  range,
  top,
  left
}) => {
  switch (person.kind) {
    case "infectious":
      return (
        <div
          style={{
            position: "absolute",
            top: top - range,
            left: left - range,
            width: `${2 * range}px`,
            height: `${2 * range}px`,
            borderRadius: `${range + 1}px`,
            border: `1px solid red`
          }}
        />
      );
    case "susceptible":
    case "removed":
      return <></>;
  }
};

export default PersonBorder;
