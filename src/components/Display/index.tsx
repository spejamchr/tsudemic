import React from "react";
import DrawPerson from "../DrawPerson";
import { maxR, maxX, maxY, Person } from "../Simulation";

interface Props {
  people: Person[];
  range: number;
}

const Display: React.FunctionComponent<Props> = ({ people, range }) => {
  return (
    <div
      style={{
        border: "solid",
        height: `${maxY + 2 * (maxR + range)}px`,
        width: `${maxX + 2 * (maxR + range)}px`,
        margin: "20px",
        padding: "10px"
      }}
    >
      <div
        style={{
          height: `${maxY}px`,
          width: `${maxX}px`,
          margin: `${maxR + range}px`,
          position: "relative"
        }}
      >
        {people.map(person => (
          <DrawPerson person={person} range={range} />
        ))}
      </div>
    </div>
  );
};

export default Display;
