import React from "react";
import DrawPerson from "../DrawPerson";
import { maxR, Person, maxXY } from "../Simulation";

interface Props {
  people: Person[];
  range: number;
  showRemoved: boolean;
  showPaths: boolean;
}

const Display: React.FunctionComponent<Props> = ({ people, range, showRemoved, showPaths }) => {
  const margin = maxR + range + 4;

  return (
    <div style={{ flexGrow: 0.5, minWidth: "200px" }}>
      <div style={{ position: "relative" }}>
        <div style={{ paddingBottom: "100%" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            border: "solid",
          }}
        >
          <svg
            viewBox={`${-margin} ${-margin} ${maxXY + margin * 2} ${maxXY + margin * 2}`}
            xmlns="http://www.w3.org/2000/svg"
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
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Display;
