import React from "react";

interface Props {
  lasts: number;
  setLasts: (lasts: number) => void;
  range: number;
  setRange: (range: number) => void;
  population: number;
  setPopulation: (population: number) => void;
  hygiene: number;
  setHygiene: (hygiene: number) => void;
  showRemoved: boolean;
  setShowRemoved: (showRemoved: boolean) => void;
  showPaths: boolean;
  setShowPaths: (showPaths: boolean) => void;
  start: () => void;
}

const parseNumberAnd = (setThing: (thing: number) => void) => (
  e: React.ChangeEvent<HTMLInputElement>
): void => {
  setThing(Number(e.target.value) || 0);
};

const Controls: React.FunctionComponent<Props> = ({
  lasts,
  setLasts,
  range,
  setRange,
  population,
  setPopulation,
  hygiene,
  setHygiene,
  showRemoved,
  setShowRemoved,
  showPaths,
  setShowPaths,
  start,
}) => {
  return (
    <div>
      <div>
        <label>
          Lasts
          <input type="text" value={lasts} onChange={parseNumberAnd(setLasts)} />
        </label>
      </div>
      <div>
        <label>
          Range
          <input type="text" value={range} onChange={parseNumberAnd(setRange)} />
        </label>
      </div>
      <div>
        <label>
          Population
          <input type="text" value={population} onChange={parseNumberAnd(setPopulation)} />
        </label>
      </div>
      <div>
        <label>
          Hygiene
          <input type="text" value={hygiene} onChange={parseNumberAnd(setHygiene)} />
        </label>
      </div>
      <div>
        <label>
          Show Paths?
          <input
            type="checkbox"
            checked={showPaths}
            onChange={(e) => setShowPaths(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          Show Removed?
          <input
            type="checkbox"
            checked={showRemoved}
            onChange={(e) => setShowRemoved(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <button onClick={start}>Start</button>
      </div>
    </div>
  );
};

export default Controls;
