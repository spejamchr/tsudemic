import React from "react";
import { Person, personPosition } from "../Simulation";
import PersonBorder from "./PersonBorder";
import PersonPath from "./PersonPath";
import PersonPoint from "./PersonPoint";

interface Props {
  person: Person;
  range: number;
  showRemoved: boolean;
  showPaths: boolean;
}

const DrawPerson: React.FunctionComponent<Props> = ({
  person,
  range,
  showRemoved,
  showPaths
}) => {
  const [left, top] = personPosition(person);
  return (
    <>
      <PersonPoint
        person={person}
        top={top}
        left={left}
        showRemoved={showRemoved}
      />
      <PersonBorder person={person} range={range} top={top} left={left} />
      {showPaths && <PersonPath person={person} showRemoved={showRemoved} />}
    </>
  );
};

export default DrawPerson;
