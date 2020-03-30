import React from "react";

interface Props {
  susceptible: number;
  infectious: number;
  removed: number;
}

const Data: React.FunctionComponent<Props> = ({
  susceptible,
  infectious,
  removed
}) => {
  return (
    <ul>
      <li>susceptible: {susceptible}</li>
      <li>infectious: {infectious}</li>
      <li>removed: {removed}</li>
    </ul>
  );
};

export default Data;
