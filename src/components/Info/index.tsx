import { IconButton, makeStyles, Popover, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import * as React from "react";

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
  button: {
    padding: 0,
    marginRight: 5,
  },
  popover: {
    maxWidth: "500px",
  },
}));

interface Props {
  direction?: "top" | "bottom";
}

const Info: React.FunctionComponent<Props> = ({ children, direction }) => {
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null);
  const classes = useStyles();
  direction = direction || "top";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton className={classes.button} aria-describedby={id} onClick={handleClick}>
        <InfoIcon />
      </IconButton>
      <Popover
        className={classes.popover}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: direction,
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: direction === "bottom" ? "top" : "bottom",
          horizontal: "center",
        }}
      >
        <Typography className={classes.typography}>{children}</Typography>
      </Popover>
    </>
  );
};

export default Info;
