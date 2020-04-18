import { makeStyles } from "@material-ui/core";
import * as React from "react";
import stopwatch from "../../utils/stopwatch";
import ContainedButton from "./ContainedButton";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
  },
  onlyButton: {
    width: "50%",
    marginBottom: theme.spacing(1),
  },
  firstButton: {
    width: "50%",
    marginBottom: theme.spacing(1),
  },
  secondButton: {
    marginLeft: theme.spacing(1),
    width: "50%",
    marginBottom: theme.spacing(1),
  },
}));

interface Props {
  startSimulation: () => void;
  continueSimulation: () => void;
  stopSimulation: () => void;
}

const PlayPauseStopButton: React.FunctionComponent<Props> = ({
  startSimulation,
  continueSimulation,
  stopSimulation,
}) => {
  const classes = useStyles();

  const stopButton = (
    <ContainedButton
      className={classes.secondButton}
      color="secondary"
      onClick={stopSimulation}
      title="Clear"
    />
  );

  const startButton = (title: string) => (
    <ContainedButton
      className={classes.onlyButton}
      color="primary"
      onClick={startSimulation}
      title={title}
    />
  );

  switch (stopwatch.kind()) {
    case "stopped":
      return (
        <div className={classes.container}>
          {startButton("Start")}
          <ContainedButton
            className={classes.secondButton}
            color="secondary"
            title="Clear"
            disabled
          />
        </div>
      );
    case "started":
      return (
        <div className={classes.container}>
          <ContainedButton
            className={classes.firstButton}
            onClick={stopwatch.pause}
            title="Pause"
          />
          {stopButton}
        </div>
      );
    case "paused":
      return (
        <div className={classes.container}>
          <ContainedButton
            className={classes.firstButton}
            color="primary"
            onClick={continueSimulation}
            title="Continue"
          />
          {stopButton}
        </div>
      );
    case "over":
      return (
        <div className={classes.container}>
          {startButton("Restart")}
          {stopButton}
        </div>
      );
  }
};

export default PlayPauseStopButton;
