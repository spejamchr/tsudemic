import React from "react";

interface Props {
  x: number;
  y: number;
  r: number;
  color: string;
}

// Add 50% alpha to the stroke color... I didn't find a better way to do this.
const SimplePath: React.FunctionComponent<Props> = ({ x, y, r, color }) => (
  <circle cx={x} cy={y} r={r} stroke={color + "7f"} strokeWidth="1" fill="none" />
);

export default SimplePath;
