import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Slider,
  Switch,
  Typography,
} from "@material-ui/core";
import React from "react";
import Info from "../Info";

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
  socialDistancing: number;
  setSocialDistancing: (socialDistancing: number) => void;
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
  socialDistancing,
  setSocialDistancing,
}) => {
  return (
    <FormControl component="fieldset" style={{ width: "100%" }}>
      <FormGroup>
        <Typography id="lasts-slider" gutterBottom>
          <Info>How long the infection lasts, in real time.</Info>
          Infectious Period: {lasts / 1000}s
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              value={lasts}
              onChange={parseNumberAnd(setLasts)}
              aria-labelledby="lasts-slider"
              min={1000}
              max={60_000}
              step={1000}
            />
          </Grid>
        </Grid>
        <Typography id="range-slider" gutterBottom>
          <Info>
            How far the infection can travel, represented as colored circles around the infected.
          </Info>
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
          <Info>
            How many people should be simulated. Increasing this also increases population density
            (higher population in the same simulation area). Changes to this don't take effect until
            a new simulation starts.
          </Info>
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
          <Info>Higher is cleaner. This makes infection less likely.</Info>
          Hygiene: {hygiene}
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
        <Typography id="social-distancing-slider" gutterBottom>
          <Info>
            The higher this is, the more time each person spends in a small "home area" of their
            circular routine. When set all the way to 1, they don't move at all.
          </Info>
          Social Distancing: {socialDistancing}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              value={socialDistancing}
              onChange={parseNumberAnd(setSocialDistancing)}
              aria-labelledby="social-distancing-slider"
              min={0}
              max={1}
              step={0.01}
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
    </FormControl>
  );
};

export default Controls;
