import React from "react";

interface Props {
  x: number;
  y: number;
  r: number;
  color?: string;
}

const SimplePath: React.FunctionComponent<Props> = ({ x, y, r, color }) => (
  <div
    style={{
      position: "absolute",
      top: `${y - (r + 1)}px`,
      left: `${x - (r + 1)}px`,
      width: `${2 * (r + 1) - 1}px`,
      height: `${2 * (r + 1) - 1}px`,
      borderRadius: `${r + 1}px`,
      border: `1px solid ${color || "rgba(0,0,0,0.1)"}`,
    }}
  />
);

export default SimplePath;
