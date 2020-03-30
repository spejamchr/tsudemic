import React from "react";
import DrawPerson from "../DrawPerson";
import { maxR, maxX, maxY, Person } from "../Simulation";

interface Props {
  people: Person[];
  range: number;
  showRemoved: boolean;
  showPaths: boolean;
}

const Display: React.FunctionComponent<Props> = ({
  people,
  range,
  showRemoved,
  showPaths
}) => {
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
          <DrawPerson
            key={person.id}
            person={person}
            range={range}
            showRemoved={showRemoved}
            showPaths={showPaths}
          />
        ))}
      </div>
    </div>
  );
};

export default Display;
