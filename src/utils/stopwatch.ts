import { just, Maybe, nothing } from "maybeasy";

const assertNever = (thing: never): never => {
  throw new Error(`Unexpectedly received something: ${thing}`);
};

const dateNow = () => new Date().valueOf();

interface Stopped {
  kind: "stopped";
}

const stopped = (): Stopped => ({ kind: "stopped" });

interface Started {
  kind: "started";
  base: number;
  startedAt: number;
}

const started = (): Started => ({
  kind: "started",
  base: 0,
  startedAt: dateNow(),
});

const restart = (state: Paused): Started => ({
  kind: "started",
  base: state.base,
  startedAt: dateNow(),
});

interface Paused {
  kind: "paused";
  base: number;
}

const pause = (state: Started): Paused => ({
  kind: "paused",
  base: stateNow(state),
});

// Like "stopped", but with a time. Used when the sim is over and the ending time needs to be read.
interface Over {
  kind: "over";
  now: number;
}

const over = (state: State): Over => ({
  kind: "over",
  now: stateNow(state),
});

type State = Stopped | Started | Paused | Over;

const stateNow = (state: State): number => {
  switch (state.kind) {
    case "stopped":
      return 0;
    case "paused":
      return state.base;
    case "started":
      return state.base + dateNow() - state.startedAt;
    case "over":
      return state.now;
  }
};

class Stopwatch {
  private state: State;

  constructor() {
    this.state = stopped();
  }

  now = (): number => {
    return stateNow(this.state);
  };

  kind = (): State["kind"] => this.state.kind;

  start = (): void => {
    switch (this.state.kind) {
      case "stopped":
      case "over":
        this.state = started();
        break;
      case "started":
        break;
      case "paused":
        this.state = restart(this.state);
        break;
      default:
        assertNever(this.state);
    }
  };

  pause = (): void => {
    switch (this.state.kind) {
      case "stopped":
      case "paused":
      case "over":
        break;
      case "started":
        this.state = pause(this.state);
        break;
      default:
        assertNever(this.state);
    }
  };

  stop = (): void => {
    this.state = stopped();
  };

  over = (): void => {
    this.state = over(this.state);
  };

  whenStarted = (): Maybe<Stopwatch> => {
    switch (this.state.kind) {
      case "stopped":
      case "paused":
      case "over":
        return nothing();
      case "started":
        return just(this);
    }
  };

  whenPaused = (): Maybe<Stopwatch> => {
    switch (this.state.kind) {
      case "stopped":
      case "started":
      case "over":
        return nothing();
      case "paused":
        return just(this);
    }
  };

  whenStopped = (): Maybe<Stopwatch> => {
    switch (this.state.kind) {
      case "started":
      case "paused":
      case "over":
        return nothing();
      case "stopped":
        return just(this);
    }
  };

  whenOver = (): Maybe<Stopwatch> => {
    switch (this.state.kind) {
      case "started":
      case "paused":
      case "stopped":
        return nothing();
      case "over":
        return just(this);
    }
  };
}

const stopwatch = new Stopwatch();

export default stopwatch;
