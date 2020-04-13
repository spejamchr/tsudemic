import { Maybe, nothing, just } from "maybeasy";

export interface XY {
  x: number;
  y: number;
}

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

export type Person = Susceptible | Infectious | Removed;

export const maxXY = 300;
export const minR = 10;
export const maxR = 60;

export const randRange = (a: number, b: number): number => a + Math.random() * (b - a);

export const randXY = (): XY => ({ x: randRange(0, maxXY), y: randRange(0, maxXY) });

export const susceptibleCons = (id: number): Susceptible => ({
  kind: "susceptible",
  id,
  center: randXY(),
  radius: randRange(minR, maxR),
  angle: randRange(0, 2 * Math.PI),
  speed: randRange(1, 5) * (Math.random() > 0.5 ? 1 : -1),
});

export const infectSusceptible = (person: Susceptible): Infectious => ({
  ...person,
  kind: "infectious",
  infectedAt: new Date().valueOf(),
  infectedCount: 0,
});

export const removeInfectious = (person: Infectious): Removed => ({
  ...person,
  kind: "removed",
  removedAt: new Date().valueOf(),
});

export const onlyKind = <A extends Person>(people: Person[], type: A["kind"]): A[] =>
  people.filter(({ kind }) => kind === type) as A[];

export const move = (person: Person): Person => ({
  ...person,
  angle: (person.angle + person.speed / person.radius + Math.PI * 2) % (Math.PI * 2),
});

export const personPosition = (person: Person): XY => ({
  x: person.radius * Math.cos(person.angle) + person.center.x,
  y: person.radius * Math.sin(person.angle) + person.center.y,
});

export const historicalHFactor = (people: Person[]): number => {
  const removed = onlyKind<Removed>(people, "removed");
  return removed.reduce((acc, inf) => acc + inf.infectedCount, 0) / removed.length;
};

export const currentRFactor = (people: Person[], lasts: number): number => {
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

export const fromNANable = (n: number): Maybe<number> => (isNaN(n) ? nothing() : just(n));
export const toFixed = (digits: number) => (n: number) => n.toFixed(digits);
