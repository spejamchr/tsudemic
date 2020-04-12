import React from "react";

interface Props {
  x: number;
  y: number;
  r: number;
  color: string;
}

const SimplePath: React.FunctionComponent<Props> = ({ x, y, r, color }) => (
  // Add 50% alpha to the stroke color... I didn't find a better way to do this.
  <circle cx={x} cy={y} r={r} stroke={color + "7f"} strokeWidth="1" fill="none" />
);

export default SimplePath;
