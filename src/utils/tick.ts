import {
  calcDistance,
  Infectious,
  infectSusceptible,
  onlyKind,
  Person,
  personPosition,
  Removed,
  removeInfectious,
  Susceptible,
} from ".";
import stopwatch from "./stopwatch";

const handleSusceptible = (
  infectiousPeople: ReadonlyArray<Infectious>,
  range: number,
  hygiene: number
) => (person: Susceptible) => {
  const position = personPosition(person);

  const infectiousInRange = infectiousPeople
    .map(person => ({ person, distance: calcDistance(personPosition(person), position) }))
    .filter(({ distance }) => distance <= range);

  const staysHealthy =
    Math.random() <
    infectiousInRange.reduce((acc, { distance }) => acc * ((hygiene * distance) / range) ** 0.5, 1);

  if (staysHealthy) {
    return person;
  } else {
    const claims = infectiousInRange.map(i => ({ ...i, claim: 1 - i.distance / range }));
    const totalClaim = claims.reduce((acc, { claim }) => acc + claim, 0);
    claims.forEach(({ person, claim }) => (person.infectedCount += claim / totalClaim));
    return infectSusceptible(person);
  }
};

const handleInfectious = (timeNow: number, lasts: number) => (person: Infectious) =>
  timeNow - person.infectedAt >= lasts ? removeInfectious(person) : person;

const tick = (
  people: ReadonlyArray<Person>,
  range: number,
  hygiene: number,
  lasts: number,
  setPeople: (people: ReadonlyArray<Person>) => void
): void => {
  const timeNow = stopwatch.now();

  const susceptiblePeople = onlyKind<Susceptible>(people, "susceptible");
  const infectiousPeople = onlyKind<Infectious>(people, "infectious");
  const removedPeople = onlyKind<Removed>(people, "removed");

  if (infectiousPeople.length === 0) {
    stopwatch.over();
    setPeople(people.slice(-1).concat(people.slice(0, -1)));
    return;
  }

  setPeople(
    ([] as ReadonlyArray<Person>)
      .concat(susceptiblePeople.map(handleSusceptible(infectiousPeople, range, hygiene)))
      .concat(infectiousPeople.map(handleInfectious(timeNow, lasts)))
      .concat(removedPeople)
  );
};

export default tick;
