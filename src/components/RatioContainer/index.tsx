import { useTheme } from "@material-ui/core";
import React from "react";

interface Props {
  ratio: number;
}

const RatioContainer: React.FunctionComponent<Props> = ({ ratio, children }) => {
  const theme = useTheme();

  return (
    <div style={{ position: "relative", marginBottom: "20px", marginRight: "20px" }}>
      <div style={{ paddingBottom: `${ratio}%` }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          border: `solid 2px ${theme.palette.primary.main}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default RatioContainer;
