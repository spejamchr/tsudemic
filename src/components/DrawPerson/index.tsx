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

const DrawPerson: React.FunctionComponent<Props> = ({ person, range, showRemoved, showPaths }) => {
  const { x, y } = personPosition(person);
  return (
    <>
      {showPaths && <PersonPath person={person} showRemoved={showRemoved} />}
      <PersonPoint person={person} top={y} left={x} showRemoved={showRemoved} />
      <PersonBorder person={person} range={range} top={y} left={x} />
    </>
  );
};

export default DrawPerson;
