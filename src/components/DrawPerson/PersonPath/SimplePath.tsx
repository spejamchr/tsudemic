import React from "react";

interface Props {
  x: number;
  y: number;
  r: number;
}

const SimplePath: React.FunctionComponent<Props> = ({ x, y, r }) => (
  <div
    style={{
      position: "absolute",
      top: y - r,
      left: x - r,
      width: `${2 * r - 1}px`,
      height: `${2 * r - 1}px`,
      borderRadius: `${r}px`,
      border: `1px solid rgba(0,0,0,0.1)`
    }}
  />
);

export default SimplePath;
