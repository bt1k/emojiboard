import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type CountdownProps = {
  setDateUpdatedEveryMinute: Dispatch<SetStateAction<Date>>;
};

export default function Countdown({
  setDateUpdatedEveryMinute,
}: CountdownProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // If `secondsElapsed` is 59 and it's supposed to be updated, then it's
      // supposed to be updated to 60 - or rather it is supposed to be reset to
      // 0. On a watch, the number 60 for seconds is never shown - instead it
      // just goes straight to 0.
      if (secondsElapsed < 59) {
        setSecondsElapsed((secs) => secs + 1);
      } else {
        setSecondsElapsed(0);
        setDateUpdatedEveryMinute(new Date());
      }
    }, 1_000);
    return () => clearTimeout(timeoutId);
  }, [secondsElapsed, setDateUpdatedEveryMinute]);

  return <>{59 - secondsElapsed}</>;
}
