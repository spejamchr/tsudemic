import { useTheme } from "@material-ui/core";
import { Maybe } from "maybeasy";
import React, { useEffect, useState } from "react";
import * as Victory from "victory";
import { onlyKind, Person } from "../Simulation";

interface Props {
  people: Person[];
  startedAt: Maybe<number>;
}

const Graph: React.FunctionComponent<Props> = ({ people, startedAt }) => {
  const theme = useTheme();

  const [sucs, setSucs] = useState([] as number[]);
  const [infs, setInfs] = useState([] as number[]);
  const [rems, setRems] = useState([] as number[]);
  const [times, setTimes] = useState([] as number[]);

  useEffect(() => {
    setSucs([]);
    setInfs([]);
    setRems([]);
    setTimes([]);
  }, [startedAt]);

  useEffect(() => {
    const timeNow = new Date().valueOf();
    if (times.length > 0 && timeNow - times.slice(-1)[0] < 150) {
      return;
    }
    startedAt.do(() => {
      setSucs(s => s.concat(onlyKind(people, "susceptible").length));
      setInfs(i => i.concat(onlyKind(people, "infectious").length));
      setRems(r => r.concat(onlyKind(people, "removed").length));
      setTimes(t => t.concat(timeNow));
    });
  }, [people, times, startedAt]);

  const xyData = (sir: number[]): { x: number; y: number }[] =>
    startedAt
      .map(t =>
        sir.map((s, n) => ({
          x: (times[n] - t) / 1000,
          y: s,
        }))
      )
      .getOrElseValue([]);

  return (
    <div
      style={{
        border: `solid 2px ${theme.palette.primary.main}`,
        height: "250px",
        width: "250px",
        margin: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <Victory.VictoryChart theme={Victory.VictoryTheme.material}>
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.primary.main } }}
            data={xyData(sucs)}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.error.main } }}
            data={xyData(infs)}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.grey[400] } }}
            data={xyData(rems)}
          />
        </Victory.VictoryChart>
      </div>
    </div>
  );
};

export default Graph;
