import { useTheme } from "@material-ui/core";
import { Maybe } from "maybeasy";
import React, { useEffect, useState } from "react";
import { onlyKind, Person } from "../Simulation";

interface Props {
  people: Person[];
  startedAt: Maybe<Date>;
  stopped: boolean;
}

const Graph: React.FunctionComponent<Props> = ({ people, startedAt, stopped }) => {
  const theme = useTheme();

  const [sucs, setSucs] = useState([] as number[]);
  const [infs, setInfs] = useState([] as number[]);
  const [rems, setRems] = useState([] as number[]);
  const [times, setTimes] = useState([] as Date[]);
  const [hasStopped, setHasStopped] = useState(false);

  useEffect(() => {
    if (stopped && !hasStopped) {
      setHasStopped(true);
    } else if (hasStopped && !stopped) {
      setHasStopped(false);
      setSucs([]);
      setInfs([]);
      setRems([]);
      setTimes([]);
    }
    setSucs(s => s.concat(onlyKind(people, "susceptible").length).slice(-250));
    setInfs(i => i.concat(onlyKind(people, "infectious").length).slice(-250));
    setRems(r => r.concat(onlyKind(people, "removed").length).slice(-250));
    setTimes(t => t.concat(new Date()));
  }, [people, stopped, hasStopped]);

  const pop = people.length;

  return (
    <div
      style={{
        border: `solid 2px ${theme.palette.primary.main}`,
        height: "250px",
        overflow: "hidden",
        width: "250px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        {sucs
          .map((s, n) => [s, infs[n], rems[n], times[n]] as [number, number, number, Date])
          .map(([s, i, r, t]) => (
            <div key={t.valueOf()} style={{ height: "100%" }}>
              <div
                style={{
                  height: `${(s / pop) * 100}%`,
                  width: 1,
                  background: theme.palette.success.main,
                }}
              />
              <div
                style={{
                  height: `${(i / pop) * 100}%`,
                  width: 1,
                  background: theme.palette.error.main,
                }}
              />
              <div
                style={{
                  height: `${(r / pop) * 100}%`,
                  width: 1,
                  background: theme.palette.grey[400],
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Graph;
