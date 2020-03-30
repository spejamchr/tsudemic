import React from "react";
import { Person } from "../../Simulation";
import SimplePoint from "./SimplePoint";

interface Props {
  person: Person;
  top: number;
  left: number;
  showRemoved: boolean;
}

const PersonPoint: React.FunctionComponent<Props> = ({ person, top, left, showRemoved }) => {
  switch (person.kind) {
    case "susceptible":
    case "infectious":
      return <SimplePoint person={person} top={top} left={left} />;
    case "removed":
      return showRemoved ? <SimplePoint person={person} top={top} left={left} /> : <></>;
  }
};

export default PersonPoint;
