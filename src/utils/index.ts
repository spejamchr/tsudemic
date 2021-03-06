import { just, Maybe, nothing } from "maybeasy";
import stopwatch from "./stopwatch";

export interface XY {
  x: number;
  y: number;
}

interface PersonBase {
  id: number;
  center: XY;
  radius: number;
  homeAngle: number;
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

export const calcDistance = (a: XY, b: XY): number => ((b.x - a.x) ** 2 + (b.y - a.y) ** 2) ** 0.5;

export const randRange = (a: number, b: number): number => a + Math.random() * (b - a);

export const randXY = (): XY => ({ x: randRange(0, maxXY), y: randRange(0, maxXY) });

export const susceptibleCons = (id: number): Susceptible => ({
  kind: "susceptible",
  id,
  center: randXY(),
  radius: randRange(minR, maxR),
  angle: randRange(0, 2 * Math.PI),
  homeAngle: randRange(0, 2 * Math.PI),
  speed: randRange(1, 5) * (Math.random() > 0.5 ? 1 : -1),
});

export const infectSusceptible = (person: Susceptible): Infectious => ({
  ...person,
  kind: "infectious",
  infectedAt: stopwatch.now(),
  infectedCount: 0,
});

export const removeInfectious = (person: Infectious): Removed => ({
  ...person,
  kind: "removed",
  removedAt: stopwatch.now(),
});

export const onlyKind = <A extends Person>(
  people: ReadonlyArray<Person>,
  type: A["kind"]
): ReadonlyArray<A> => (people.filter(({ kind }) => kind === type) as A[]) as ReadonlyArray<A>;

export const personPosition = (person: Person): XY => ({
  x: person.radius * Math.cos(person.angle) + person.center.x,
  y: person.radius * Math.sin(person.angle) + person.center.y,
});

const absAngleDiff = (a: number, b: number) =>
  Math.abs(((a - b + Math.PI * 3) % (Math.PI * 2)) - Math.PI);

export const move = (socialDistancing: number) => (person: Person): Person => {
  // Scale socialDistancing to be from 1-10, for math (1) and aesthetic (5) reasons.
  const maxScaled = 5;
  const scaled = socialDistancing * (maxScaled - 1) + 1;

  if (scaled === maxScaled) {
    return {
      ...person,
      angle: person.angle,
    };
  }
  const angleDiff = absAngleDiff(person.angle, person.homeAngle);
  const speed =
    angleDiff > (Math.PI * 2) / (scaled + 3) ? person.speed * scaled : person.speed / scaled;
  const angle = (person.angle + speed / person.radius + Math.PI * 2) % (Math.PI * 2);

  return {
    ...person,
    angle,
  };
};

export const historicalHFactor = (people: ReadonlyArray<Person>): number => {
  const removed = onlyKind<Removed>(people, "removed");
  return removed.reduce((acc, inf) => acc + inf.infectedCount, 0) / removed.length;
};

export const currentRFactor = (people: ReadonlyArray<Person>, lasts: number): number => {
  const currentTime = stopwatch.now();
  const infectious = onlyKind<Infectious>(people, "infectious");

  return (
    infectious
      .filter(person => person.infectedAt !== currentTime)
      .reduce(
        (acc, person) => acc + (person.infectedCount / (currentTime - person.infectedAt)) * lasts,
        0
      ) / infectious.length
  );
};

export const fromNANable = (n: number): Maybe<number> => (isNaN(n) ? nothing() : just(n));
export const toFixed = (digits: number) => (n: number) => n.toFixed(digits);
