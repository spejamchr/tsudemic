import { Button } from "@material-ui/core";
import * as React from "react";
import stopwatch from "../../utils/stopwatch";

interface Props {
  startSimulation: () => void;
  continueSimulation: () => void;
}

interface ButtonParams {
  onClick: () => void;
  color: "primary" | "secondary";
  title: string;
}

const buttonParams = ({ startSimulation, continueSimulation }: Props): ButtonParams => {
  switch (stopwatch.kind()) {
    case "stopped":
      return { onClick: startSimulation, color: "primary", title: "Start" };
    case "started":
      return { onClick: stopwatch.pause, color: "secondary", title: "Pause" };
    case "paused":
      return { onClick: continueSimulation, color: "primary", title: "Continue" };
  }
};

const PlayPauseButton: React.FunctionComponent<Props> = props => {
  const { onClick, color, title } = buttonParams(props);
  return (
    <Button style={{ width: "100%" }} variant="contained" color={color} onClick={onClick}>
      {title}
    </Button>
  );
};

export default PlayPauseButton;
