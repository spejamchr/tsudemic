import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import { Maybe } from "maybeasy";
import React, { useEffect, useState } from "react";

interface Props {
  startedAt: Maybe<Date>;
  stopped: boolean;
}

const Timer: React.FunctionComponent<Props> = ({ startedAt, stopped }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    if (stopped) {
      return;
    }
    const interval = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(interval);
  }, [startedAt, stopped]);

  const seconds = startedAt
    .map(date => (date.valueOf() > time.valueOf() ? 0 : (time.valueOf() - date.valueOf()) / 1000))
    .getOrElseValue(0);

  return (
    <ListItem style={{ justifyContent: "space-between" }}>
      <ListItemText primary="Runtime" />
      <ListItemText primary={seconds.toFixed() + "s"} style={{ textAlign: "right" }} />
    </ListItem>
  );
};

export default Timer;
