import React from "react";
import { Person, personPosition } from "../Simulation";
import PersonBorder from "./PersonBorder";
import PersonPoint from "./PersonPoint";

interface Props {
  person: Person;
  range: number;
}

const DrawPerson: React.FunctionComponent<Props> = ({ person, range }) => {
  const [left, top] = personPosition(person);
  return (
    <>
      <PersonPoint person={person} top={top} left={left} />
      <PersonBorder person={person} range={range} top={top} left={left} />
    </>
  );
};

export default DrawPerson;
