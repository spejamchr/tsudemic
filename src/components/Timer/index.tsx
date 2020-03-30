import React, { useEffect, useState } from "react";

interface Props {
  startedAt: Date;
  stopped: boolean;
}

const Timer: React.FunctionComponent<Props> = ({ startedAt, stopped }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    if (stopped) {
      return;
    }
    const interval = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(interval);
  }, [startedAt, stopped]);

  if (time.valueOf() < startedAt.valueOf()) {
    return <div>0s</div>;
  }

  return (
    <div>{((time.valueOf() - startedAt.valueOf()) / 1000).toFixed()}s</div>
  );
};

export default Timer;
