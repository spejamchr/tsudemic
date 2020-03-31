import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Slider,
  Switch,
  Typography,
} from "@material-ui/core";
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
  _: unknown,
  newValue: number | number[]
): void => {
  if (typeof newValue === "number") {
    setThing(newValue);
  }
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
    <FormControl component="fieldset" style={{ width: "300px" }}>
      <FormGroup>
        <Typography id="lasts-slider" gutterBottom>
          Infectious Period: {lasts}s
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              value={lasts}
              onChange={parseNumberAnd(setLasts)}
              aria-labelledby="lasts-slider"
              min={1}
              max={60}
            />
          </Grid>
        </Grid>
        <Typography id="range-slider" gutterBottom>
          Infectious Range: {range}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              value={range}
              onChange={parseNumberAnd(setRange)}
              aria-labelledby="range-slider"
              min={1}
              max={30}
            />
          </Grid>
        </Grid>
        <Typography id="population-slider" gutterBottom>
          Population Size: {population} people
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              value={population}
              onChange={parseNumberAnd(setPopulation)}
              aria-labelledby="population-slider"
              min={10}
              max={500}
            />
          </Grid>
        </Grid>
        <Typography id="hygiene-slider" gutterBottom>
          Hygiene (higher is cleaner): {hygiene}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              value={hygiene}
              onChange={parseNumberAnd(setHygiene)}
              aria-labelledby="hygiene-slider"
              min={0}
              max={5}
              step={0.1}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Switch
              checked={showPaths}
              onChange={(_, checked: boolean) => setShowPaths(checked)}
              name="showPaths"
            />
          }
          label="Show Paths?"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showRemoved}
              onChange={(_, checked: boolean) => setShowRemoved(checked)}
              name="showRemoved"
            />
          }
          label="Show Removed?"
        />
      </FormGroup>
      <Button variant="contained" color="primary" onClick={start}>
        Start
      </Button>
    </FormControl>
  );
};

export default Controls;
