import React from "react";
import { maxR, maxXY, Person } from "../../utils";
import DrawPerson from "../DrawPerson";
import RatioContainer from "../RatioContainer";

interface Props {
  people: ReadonlyArray<Person>;
  range: number;
  showRemoved: boolean;
  showPaths: boolean;
}

const Display: React.FunctionComponent<Props> = ({ people, range, showRemoved, showPaths }) => {
  const margin = maxR + range + 4;

  return (
    <RatioContainer ratio={100}>
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
    </RatioContainer>
  );
};

export default Display;
