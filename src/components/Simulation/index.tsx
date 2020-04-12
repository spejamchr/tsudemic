import { Button, List } from "@material-ui/core";
import { just, nothing } from "maybeasy";
import React, { useEffect, useState } from "react";
import Controls from "../Controls";
import Data from "../Data";
import Display from "../Display";
import Graph from "../Graph";
import Timer from "../Timer";

interface XY {
  x: number;
  y: number;
}

const randRange = (a: number, b: number): number => a + Math.random() * (b - a);

const randXY = (): XY => ({ x: randRange(0, maxXY), y: randRange(0, maxXY) });

interface PersonBase {
  id: number;
  center: XY;
  radius: number;
  angle: number;
  speed: number;
}

export interface Susceptible extends PersonBase {
  kind: "susceptible";
}

const susceptibleCons = (id: number): Susceptible => ({
  kind: "susceptible",
  id,
  center: randXY(),
  radius: randRange(minR, maxR),
  angle: randRange(0, 2 * Math.PI),
  speed: randRange(1, 5) * (Math.random() > 0.5 ? 1 : -1),
});

export interface Infectious extends PersonBase {
  kind: "infectious";
  infectedAt: number;
  infectedCount: number;
}

export interface Removed extends PersonBase {
  kind: "removed";
  infectedAt: number;
  removedAt: number;
  infectedCount: number;
}

const infectSusceptible = (person: Susceptible): Infectious => ({
  ...person,
  kind: "infectious",
  infectedAt: new Date().valueOf(),
  infectedCount: 0,
});

const removeInfectious = (person: Infectious): Removed => ({
  ...person,
  kind: "removed",
  removedAt: new Date().valueOf(),
});

export function onlyKind<A extends Person>(people: Person[], type: A["kind"]): A[] {
  return people.filter(({ kind }) => kind === type) as A[];
}

const move = (person: Person): Person => ({
  ...person,
  angle: (person.angle + person.speed / person.radius + Math.PI * 2) % (Math.PI * 2),
});

export const personPosition = (person: Person): XY => ({
  x: person.radius * Math.cos(person.angle) + person.center.x,
  y: person.radius * Math.sin(person.angle) + person.center.y,
});

export type Person = Susceptible | Infectious | Removed;
export const maxXY = 300;
export const minR = 10;
export const maxR = 60;

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

            const infectiousPeopleInRange = infectiousPeople
              .map(person => ({ person, dist: distance(personPosition(person), position) }))
              .filter(({ dist }) => dist <= range);

            const chanceOfStayingHealthy = infectiousPeopleInRange.reduce(
              (acc, { dist }) => acc * ((hygiene * dist) / range) ** 0.5,
              1
            );

            if (chanceOfStayingHealthy > Math.random()) {
              return person;
            } else {
              const totalClaim = infectiousPeopleInRange.reduce(
                (acc, { dist }) => acc + 1 - dist / range,
                0
              );
              console.log(
                "before: ",
                infectiousPeopleInRange.reduce((a, { person }) => a + person.infectedCount, 0)
              );
              infectiousPeopleInRange.forEach(
                ({ person, dist }) => (person.infectedCount += (1 - dist / range) / totalClaim)
              );
              console.log(
                "after: ",
                infectiousPeopleInRange.reduce((a, { person }) => a + person.infectedCount, 0)
              );
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

  const susceptible = () => onlyKind<Susceptible>(people, "susceptible").length;
  const infectious = () => onlyKind<Infectious>(people, "infectious").length;
  const removed = () => onlyKind<Removed>(people, "removed").length;

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
          <Timer startedAt={startedAt} stopped={infectious() === 0} />
          <Data susceptible={susceptible()} infectious={infectious()} removed={removed()} />
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
      <div style={{ flexGrow: 0.3, minWidth: "300px" }}>
        <Graph people={people} startedAt={startedAt} lasts={lasts} />
      </div>
      <div style={{ flexGrow: 0.4, minWidth: "300px" }}>
        <Display people={people} range={range} showRemoved={showRemoved} showPaths={showPaths} />
      </div>
    </div>
  );
};

export default Simulation;
