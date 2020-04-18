import { Button } from "@material-ui/core";
import { just, nothing } from "maybeasy";
import React, { useEffect, useState } from "react";
import { infectSusceptible, Person, susceptibleCons } from "../../utils";
import stopwatch from "../../utils/stopwatch";
import tick from "../../utils/tick";
import Controls from "../Controls";
import Data from "../Data";
import Display from "../Display";
import Graph from "../Graph";
import PlayPauseButton from "../PlayPauseButton";

let intervalInt = nothing<number>();

const Simulation: React.FunctionComponent = () => {
  const [startedAt, setStartedAt] = useState(nothing<number>());
  const [people, setPeople] = useState([] as ReadonlyArray<Person>);
  const [population, setPopulation] = useState(100);
  const [range, setRange] = useState(15);
  const [lasts, setLasts] = useState(3000);
  const [hygiene, setHygiene] = useState(1);
  const [showRemoved, setShowRemoved] = useState(false);
  const [showPaths, setShowPaths] = useState(false);

  const stopSimulation = () => {
    stopwatch.stop();
    intervalInt.do(clearInterval);
    setStartedAt(nothing());
    setPeople([]);
  };

  const continueSimulation = () => {
    stopwatch.start();
    tick(people, range, hygiene, lasts, setPeople);
  };

  const startSimulation = () => {
    stopwatch.start();
    intervalInt.do(clearInterval);
    let tmpPeople: Person[] = [];
    for (let i = 0; i < population; i++) {
      let person: Person = susceptibleCons(i);
      if (i === 0) {
        person = infectSusceptible(person);
      }
      tmpPeople.push(person);
    }
    setPeople(tmpPeople);
    setStartedAt(just(stopwatch.now()));
  };

  useEffect(() => {
    intervalInt = stopwatch
      .whenStarted()
      .map(() => window.setInterval(() => tick(people, range, hygiene, lasts, setPeople), 35));

    return () => {
      intervalInt.do(clearInterval);
    };
  }, [lasts, people, range, hygiene, startedAt]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      <div style={{ width: "250px", margin: "20px" }}>
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
        />

        <PlayPauseButton
          startSimulation={startSimulation}
          continueSimulation={continueSimulation}
        />

        <Data people={people} lasts={lasts} />

        {stopwatch
          .whenStarted()
          .orElse(stopwatch.whenPaused)
          .map(() => (
            <Button
              style={{ width: "100%" }}
              variant="contained"
              color="secondary"
              onClick={stopSimulation}
            >
              Clear
            </Button>
          ))
          .getOrElseValue(<></>)}
      </div>
      <div style={{ flexGrow: 0.6, minWidth: "300px" }}>
        <Display people={people} range={range} showRemoved={showRemoved} showPaths={showPaths} />
      </div>
      <div style={{ flexGrow: 0.3, minWidth: "300px" }}>
        <Graph people={people} startedAt={startedAt} lasts={lasts} />
      </div>
    </div>
  );
};

export default Simulation;
