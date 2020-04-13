import { Button, List } from "@material-ui/core";
import { just, nothing } from "maybeasy";
import React, { useEffect, useState } from "react";
import {
  Infectious,
  infectSusceptible,
  move,
  onlyKind,
  Person,
  personPosition,
  Removed,
  removeInfectious,
  Susceptible,
  susceptibleCons,
  XY,
} from "../../utils";
import Controls from "../Controls";
import Data from "../Data";
import Display from "../Display";
import Graph from "../Graph";

let intervalInt = nothing<number>();

const Simulation: React.FunctionComponent = () => {
  const [startedAt, setStartedAt] = useState(nothing<number>());
  const [people, setPeople] = useState([] as Person[]);
  const [population, setPopulation] = useState(100);
  const [range, setRange] = useState(15);
  const [lasts, setLasts] = useState(3);
  const [hygiene, setHygiene] = useState(1);
  const [showRemoved, setShowRemoved] = useState(false);
  const [showPaths, setShowPaths] = useState(false);

  const distance = (a: XY, b: XY): number => ((b.x - a.x) ** 2 + (b.y - a.y) ** 2) ** 0.5;

  const stopSimulation = () => {
    intervalInt.do(clearInterval);
    setStartedAt(nothing());
    setPeople([]);
  };

  const startSimulation = () => {
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
    setStartedAt(just(new Date().valueOf()));
  };

  useEffect(() => {
    intervalInt.do(clearInterval);

    const tick = (): void => {
      const susceptiblePeople = onlyKind<Susceptible>(people, "susceptible");
      const infectiousPeople = onlyKind<Infectious>(people, "infectious");
      const removedPeople = onlyKind<Removed>(people, "removed");

      const timeNow = new Date().valueOf();

      if (infectiousPeople.length === 0) {
        return;
      }

      const newPeople = ([] as Person[])
        .concat(
          susceptiblePeople.map(person => {
            const position = personPosition(person);

            const infectiousInRange = infectiousPeople
              .map(person => ({ person, dist: distance(personPosition(person), position) }))
              .filter(({ dist }) => dist <= range);

            const chanceOfStayingHealthy = infectiousInRange.reduce(
              (acc, { dist }) => acc * ((hygiene * dist) / range) ** 0.5,
              1
            );

            if (chanceOfStayingHealthy > Math.random()) {
              return person;
            } else {
              const claims = infectiousInRange.map(i => ({ ...i, claim: 1 - i.dist / range }));
              const totalClaim = claims.reduce((acc, { claim }) => acc + claim, 0);
              claims.forEach(({ person, claim }) => (person.infectedCount += claim / totalClaim));
              return infectSusceptible(person);
            }
          })
        )
        .concat(
          infectiousPeople.map(person => {
            const timeInfected = timeNow - person.infectedAt;
            return timeInfected >= lasts * 1000 ? removeInfectious(person) : person;
          })
        )
        .concat(removedPeople)
        .map(move);

      setPeople(newPeople);
    };

    intervalInt = just(
      window.setInterval(
        startedAt.map(() => tick).getOrElseValue(() => {}),
        35
      )
    );

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
      <div style={{ minWidth: "250px", margin: "20px" }}>
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
          start={startSimulation}
        />
        <List>
          <Data people={people} lasts={lasts} />
        </List>
        {startedAt
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
