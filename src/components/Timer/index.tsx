import { ListItem, ListItemText } from "@material-ui/core";
import { Maybe } from "maybeasy";
import React, { useEffect, useState } from "react";

interface Props {
  startedAt: Maybe<number>;
  stopped: boolean;
}

const Timer: React.FunctionComponent<Props> = ({ startedAt, stopped }) => {
  const [time, setTime] = useState(new Date().valueOf());
  useEffect(() => {
    if (stopped) {
      return;
    }
    const interval = setInterval(() => setTime(new Date().valueOf()), 100);
    return () => clearInterval(interval);
  }, [startedAt, stopped]);

  const seconds = startedAt.map(date => (date > time ? 0 : (time - date) / 1000)).getOrElseValue(0);

  return (
    <ListItem style={{ justifyContent: "space-between" }}>
      <ListItemText primary="Runtime" />
      <ListItemText primary={seconds.toFixed() + "s"} style={{ textAlign: "right" }} />
    </ListItem>
  );
};

export default Timer;
