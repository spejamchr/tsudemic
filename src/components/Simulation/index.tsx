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

export const personPosition = (person: Person): XY => [
  person.radius * Math.cos(person.angle) + person.center[0],
  person.radius * Math.sin(person.angle) + person.center[1],
];

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

  const distance = (a: XY, b: XY): number => ((b[1] - a[1]) ** 2 + (b[0] - a[0]) ** 2) ** 0.5;

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
      const infectiousPeople = onlyKind<Infectious>(people, "infectious");
      const timeNow = new Date().valueOf();
      if (infectiousPeople.length === 0) {
        return;
      }
      const newPeople = people.map(
        (person: Person): Person => {
          person = move(person);
          switch (person.kind) {
            case "susceptible":
              const position = personPosition(person);

              const infectiousPeopleInRange = infectiousPeople
                .map<[Infectious, number]>(person => [
                  person,
                  distance(personPosition(person), position),
                ])
                .filter(([_, distance]) => distance <= range);

              const chanceOfStayingHealthy = infectiousPeopleInRange.reduce(
                (acc, [_, dist]) => acc * ((hygiene * dist) / range) ** 0.5,
                1
              );

              if (chanceOfStayingHealthy > Math.random()) {
                return person;
              } else {
                infectiousPeopleInRange.forEach(([person, _]) => (person.infectedCount += 1));
                return infectSusceptible(person);
              }
            case "infectious":
              const timeInfected = timeNow - person.infectedAt;
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
      </div>
      <Graph people={people} startedAt={startedAt} lasts={lasts} />
      <div style={{ flexGrow: 0.5, minWidth: "300px", margin: "20px" }}>
        <Display people={people} range={range} showRemoved={showRemoved} showPaths={showPaths} />
      </div>
    </div>
  );
};

export default Simulation;
