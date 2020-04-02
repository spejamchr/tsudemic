import { List } from "@material-ui/core";
import { just, nothing } from "maybeasy";
import React, { useEffect, useState } from "react";
import Controls from "../Controls";
import Data from "../Data";
import Display from "../Display";
import Graph from "../Graph";
import Timer from "../Timer";

type XY = [number, number];

const randRange = (a: number, b: number): number => a + Math.random() * (b - a);

const randXY = (): XY => [randRange(0, maxXY), randRange(0, maxXY)];

interface PersonBase {
  id: number;
  center: XY;
  radius: number;
  angle: number;
  speed: number;
}

interface Susceptible extends PersonBase {
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

interface Infectious extends PersonBase {
  kind: "infectious";
  infectedAt: Date;
}

interface Removed extends PersonBase {
  kind: "removed";
  infectedAt: Date;
  removedAt: Date;
}

const infectSusceptible = (person: Susceptible): Infectious => ({
  ...person,
  kind: "infectious",
  infectedAt: new Date(),
});

const removeInfectious = (person: Infectious): Removed => ({
  ...person,
  kind: "removed",
  removedAt: new Date(),
});

export const onlyKind = (people: Person[], type: Person["kind"]): Person[] => {
  return people.filter(({ kind }) => kind === type);
};

const move = (person: Person): Person => ({
  ...person,
  angle: (person.angle + person.speed / person.radius + Math.PI * 2) % (Math.PI * 2),
});

export const personPosition = (person: Person): XY => [
  person.radius * Math.cos(person.angle) + person.center[0],
  person.radius * Math.sin(person.angle) + person.center[1],
];

export type Person = Susceptible | Infectious | Removed;
export const maxXY = 300;
export const minR = 10;
export const maxR = 60;

const Simulation: React.FunctionComponent = () => {
  const [startedAt, setStartedAt] = useState(nothing<Date>());
  const [people, setPeople] = useState([] as Person[]);
  const [population, setPopulation] = useState(100);
  const [range, setRange] = useState(15);
  const [lasts, setLasts] = useState(3);
  const [hygiene, setHygiene] = useState(1);
  const [showRemoved, setShowRemoved] = useState(false);
  const [showPaths, setShowPaths] = useState(false);

  const distance = (a: XY, b: XY): number => ((b[1] - a[1]) ** 2 + (b[0] - a[0]) ** 2) ** 0.5;

  const startSimulation = () => {
    let tmpPeople: Person[] = [];
    for (let i = 0; i < population; i++) {
      let person: Person = susceptibleCons(i);
      if (i === 0) {
        person = infectSusceptible(person);
      }
      tmpPeople.push(person);
    }
    setPeople(tmpPeople);
    setStartedAt(just(new Date()));
  };

  useEffect(() => {
    const tick = (): void => {
      const infectiousPeople = onlyKind(people, "infectious");
      if (infectiousPeople.length === 0) {
        return;
      }
      const newPeople = people.map(
        (person: Person): Person => {
          person = move(person);
          switch (person.kind) {
            case "susceptible":
              const position = personPosition(person);

              const chanceOfStayingHealthy = infectiousPeople
                .map(other => distance(personPosition(other), position))
                .filter(dist => dist <= range)
                .reduce((acc, dist) => acc * ((hygiene * dist) / range) ** 0.5, 1);

              return chanceOfStayingHealthy > Math.random() ? person : infectSusceptible(person);
            case "infectious":
              const timeInfected = new Date().valueOf() - person.infectedAt.valueOf();
              return timeInfected >= lasts * 1000 ? removeInfectious(person) : person;
            case "removed":
              return person;
            default:
              return person;
          }
        }
      );
      setPeople(newPeople);
    };
    const interval = setInterval(
      startedAt.map(() => tick).getOrElseValue(() => {}),
      35
    );
    return () => clearInterval(interval);
  }, [lasts, people, range, hygiene, startedAt]);

  const susceptible = () => onlyKind(people, "susceptible").length;
  const infectious = () => onlyKind(people, "infectious").length;
  const removed = () => onlyKind(people, "removed").length;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      <div style={{ minWidth: "250px" }}>
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
      </div>
      <Graph people={people} startedAt={startedAt} stopped={infectious() === 0} />
      <div style={{ flexGrow: 0.5, minWidth: "250px" }}>
        <Display people={people} range={range} showRemoved={showRemoved} showPaths={showPaths} />
      </div>
    </div>
  );
};

export default Simulation;
