import { useTheme } from "@material-ui/core";
import { Maybe } from "maybeasy";
import React, { useEffect, useState } from "react";
import * as Victory from "victory";
import { Infectious, onlyKind, Person, Removed } from "../Simulation";

interface Props {
  people: Person[];
  startedAt: Maybe<number>;
  lasts: number;
}

const Graph: React.FunctionComponent<Props> = ({ people, startedAt, lasts }) => {
  const theme = useTheme();

  const [sucs, setSucs] = useState([] as number[]);
  const [infs, setInfs] = useState([] as number[]);
  const [rems, setRems] = useState([] as number[]);
  const [rFac, setRFac] = useState([] as number[]);
  const [hFac, setHFac] = useState([] as number[]);
  const [times, setTimes] = useState([] as number[]);

  useEffect(() => {
    setSucs([]);
    setInfs([]);
    setRems([]);
    setRFac([]);
    setHFac([]);
    setTimes([]);
  }, [startedAt]);

  const timeLimit = (timeNow: number, timeStart: number) =>
    Math.max(200, (timeNow - timeStart) / 50);

  useEffect(() => {
    startedAt.do(started => {
      const timeNow = new Date().valueOf();

      if (times.length > 0 && timeNow - times.slice(-1)[0] < timeLimit(timeNow, started)) {
        return;
      }

      setSucs(s => s.concat(onlyKind(people, "susceptible").length));
      setInfs(i => i.concat(onlyKind(people, "infectious").length));
      setRems(r => r.concat(onlyKind(people, "removed").length));
      setRFac(f => f.concat(currentRFactor()));
      setHFac(f => f.concat(historicalHFactor()));
      setTimes(t => t.concat(timeNow));
    });
    // React warns here about missing dependencies: 'currentRFactor',
    // 'historicalHFactor', and 'times'. However, these are deliberately *not*
    // dependencies here. When updating this function, enable eslint to check
    // for accidentally missed dependencies.
    // eslint-disable-next-line
  }, [people, startedAt]);

  const xyData = (sir: number[]): { x: number; y: number }[] =>
    startedAt
      .map(t => {
        const xys = sir
          .map((s, n) => ({
            x: (times[n] - t) / 1000,
            y: s,
          }))
          .filter(({ y }) => y.toString() !== "NaN");
        return xys.length < 2 ? [] : xys;
      })
      .getOrElseValue([]);

  const historicalHFactor = () => {
    const removed = onlyKind<Removed>(people, "removed");
    return removed.reduce((acc, inf) => acc + inf.infectedCount, 0) / removed.length;
  };

  const currentRFactor = () => {
    const currentTime = new Date().valueOf();
    const infectious = onlyKind<Infectious>(people, "infectious");

    return (
      infectious.reduce(
        (acc, person) =>
          acc + (person.infectedCount / (currentTime - person.infectedAt)) * lasts * 1000,
        0
      ) / infectious.length
    );
  };

  return (
    <div style={{ width: "250px" }}>
      <div style={{ margin: "20px", border: `solid 2px ${theme.palette.primary.main}` }}>
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
      <div style={{ margin: "20px", border: `solid 2px ${theme.palette.primary.main}` }}>
        <Victory.VictoryChart theme={Victory.VictoryTheme.material}>
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.error.main } }}
            data={xyData(rFac)}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.grey[400] } }}
            data={xyData(hFac)}
          />
        </Victory.VictoryChart>
      </div>
    </div>
  );
};

export default Graph;
