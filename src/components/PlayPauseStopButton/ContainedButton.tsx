import { Button, ButtonProps } from "@material-ui/core";
import * as React from "react";

interface Props extends ButtonProps {
  title: string;
}

const ContainedButton: React.FunctionComponent<Props> = ({ title, ...props }) => (
  <Button {...props} variant="contained">
    {title}
  </Button>
);

export default ContainedButton;
