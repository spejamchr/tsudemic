import React from "react";

interface Props {
  population: number;
  susceptible: number;
  infectious: number;
  removed: number;
  lasts: number;
  range: number;
}

const Data: React.FunctionComponent<Props> = ({
  population,
  susceptible,
  infectious,
  removed,
  lasts,
  range
}) => {
  return (
    <ul>
      <li>population: {population}</li>
      <li>susceptible: {susceptible}</li>
      <li>infectious: {infectious}</li>
      <li>removed: {removed}</li>
      <li>lasts: {lasts}</li>
      <li>range: {range}</li>
    </ul>
  );
};

export default Data;
