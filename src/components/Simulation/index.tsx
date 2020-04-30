import { just, nothing } from "maybeasy";
import React, { useEffect, useState } from "react";
import { infectSusceptible, Person, susceptibleCons } from "../../utils";
import stopwatch from "../../utils/stopwatch";
import tick, { TickArgs } from "../../utils/tick";
import Controls from "../Controls";
import Data from "../Data";
import Display from "../Display";
import Graph from "../Graph";
import PlayPauseStopButton from "../PlayPauseStopButton";

let intervalInt = nothing<number>();

const Simulation: React.FunctionComponent = () => {
  const [startedAt, setStartedAt] = useState(nothing<number>());
  const [people, setPeople] = useState([] as ReadonlyArray<Person>);
  const [population, setPopulation] = useState(100);
  const [range, setRange] = useState(15);
  const [lasts, setLasts] = useState(3000);
  const [hygiene, setHygiene] = useState(1);
  const [socialDistancing, setSocialDistancing] = useState(1);
  const [showRemoved, setShowRemoved] = useState(false);
  const [showPaths, setShowPaths] = useState(false);

  const tickArgs: TickArgs = {
    people,
    range,
    lasts,
    hygiene,
    socialDistancing,
    setPeople,
  };

  const stopSimulation = () => {
    stopwatch.stop();
    intervalInt.do(clearInterval);
    setStartedAt(nothing());
    setPeople([]);
  };

  const continueSimulation = () => {
    stopwatch.start();
    tick(tickArgs);
  };

  const startSimulation = () => {
    stopwatch.start();
    intervalInt.do(clearInterval);
    let tmpPeople: Person[] = [infectSusceptible(susceptibleCons(0))];
    for (let i = 1; i < population; i++) {
      tmpPeople.push(susceptibleCons(i));
    }
    setPeople(tmpPeople);
    setStartedAt(just(stopwatch.now()));
  };

  useEffect(() => {
    intervalInt = stopwatch.whenStarted().map(() => window.setInterval(() => tick(tickArgs), 35));

    return () => {
      intervalInt.do(clearInterval);
    };
  }, [tickArgs]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      <div style={{ width: "250px", margin: "0 20px" }}>
        <PlayPauseStopButton
          startSimulation={startSimulation}
          continueSimulation={continueSimulation}
          stopSimulation={stopSimulation}
        />

        <Controls
          lasts={lasts}
          setLasts={setLasts}
          range={range}
          setRange={setRange}
          population={population}
          setPopulation={setPopulation}
          hygiene={hygiene}
          setHygiene={setHygiene}
          showRemoved={showRemoved}
          setShowRemoved={setShowRemoved}
          showPaths={showPaths}
          setShowPaths={setShowPaths}
          socialDistancing={socialDistancing}
          setSocialDistancing={setSocialDistancing}
        />

        <Data people={people} lasts={lasts} />
      </div>
      <div style={{ flexGrow: 1, minWidth: "300px", maxWidth: "calc(100vh - 84px)" }}>
        <Display people={people} range={range} showRemoved={showRemoved} showPaths={showPaths} />
      </div>
      <div style={{ flexGrow: 1, minWidth: "300px", maxWidth: "calc(50vh - 42px)" }}>
        <Graph people={people} startedAt={startedAt} lasts={lasts} />
      </div>
    </div>
  );
};

export default Simulation;
