import React from "react";

interface Props {
  x: number;
  y: number;
  r: number;
  color?: string;
}

const SimplePath: React.FunctionComponent<Props> = ({ x, y, r, color }) => (
  <circle cx={x} cy={y} r={r} stroke={color || "rgba(0,0,0,0.1)"} strokeWidth="1" fill="none" />
);

export default SimplePath;
