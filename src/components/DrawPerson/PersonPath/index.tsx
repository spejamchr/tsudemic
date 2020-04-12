import { useTheme } from "@material-ui/core";
import React from "react";
import { Person } from "../../Simulation";
import SimplePath from "./SimplePath";

interface Props {
  person: Person;
  showRemoved: boolean;
}

const PersonPath: React.FunctionComponent<Props> = ({
  person: {
    kind,
    center: { x, y },
    radius: r,
  },
  showRemoved,
}) => {
  const theme = useTheme();

  switch (kind) {
    case "susceptible":
    case "infectious":
      return <SimplePath x={x} y={y} r={r} color={theme.palette.grey[800]} />;
    case "removed":
      return showRemoved ? <SimplePath x={x} y={y} r={r} color={theme.palette.grey[800]} /> : <></>;
  }
};

export default PersonPath;
