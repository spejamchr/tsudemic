import { useTheme } from "@material-ui/core";
import { Maybe } from "maybeasy";
import React, { useEffect, useState } from "react";
import * as Victory from "victory";
import {
  currentRFactor,
  historicalHFactor,
  Infectious,
  onlyKind,
  Person,
  Removed,
  Susceptible,
} from "../../utils";
import stopwatch from "../../utils/stopwatch";
import RatioContainer from "../RatioContainer";

interface Props {
  people: ReadonlyArray<Person>;
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
      const timeNow = stopwatch.now();

      if (times.length > 0 && timeNow - times.slice(-1)[0] < timeLimit(timeNow, started)) {
        return;
      }

      setSucs(s => s.concat(onlyKind<Susceptible>(people, "susceptible").length));
      setInfs(i => i.concat(onlyKind<Infectious>(people, "infectious").length));
      setRems(r => r.concat(onlyKind<Removed>(people, "removed").length));
      setRFac(f => f.concat(currentRFactor(people, lasts)));
      setHFac(f => f.concat(historicalHFactor(people)));
      setTimes(t => t.concat(timeNow));
    });
    // React warns here about missing dependencies: 'lasts' and 'times'.
    // However, these are deliberately *not* dependencies here. When updating
    // this function, enable eslint to check for accidentally missed
    // dependencies.
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

  const labelStyles = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    padding: 8,
    fill: theme.palette.text.primary,
  };

  const vTheme = {
    chart: { width: 350, height: 350 },
    axis: {
      style: {
        tickLabels: labelStyles,
        axis: { stroke: theme.palette.text.hint },
        grid: { stroke: theme.palette.text.hint },
      },
    },
    legend: {
      orientation: "horizontal" as "horizontal",
      style: { labels: labelStyles },
      x: 60,
      y: 10,
      gutter: 20,
    },
  };

  return (
    <>
      <RatioContainer ratio={100}>
        <Victory.VictoryChart theme={vTheme}>
          <Victory.VictoryLegend
            data={[
              { name: "Susc.", symbol: { fill: theme.palette.primary.main } },
              { name: "Inf.", symbol: { fill: theme.palette.secondary.main } },
              { name: "Rem.", symbol: { fill: theme.palette.grey[400] } },
            ]}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.primary.main } }}
            data={xyData(sucs)}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.secondary.main } }}
            data={xyData(infs)}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.grey[400] } }}
            data={xyData(rems)}
          />
        </Victory.VictoryChart>
      </RatioContainer>
      <RatioContainer ratio={100}>
        <Victory.VictoryChart theme={vTheme}>
          <Victory.VictoryLegend
            data={[
              { name: "R-Current", symbol: { fill: theme.palette.secondary.main } },
              { name: "R-Historical", symbol: { fill: theme.palette.primary.main } },
            ]}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.secondary.main } }}
            data={xyData(rFac)}
          />
          <Victory.VictoryLine
            style={{ data: { stroke: theme.palette.primary.main } }}
            data={xyData(hFac)}
          />
        </Victory.VictoryChart>
      </RatioContainer>
    </>
  );
};

export default Graph;
