import { useEffect, useState } from 'react';

type CountdownProps = {
  dateUpdatedEveryMinute: Date;
};

export default function Countdown({ dateUpdatedEveryMinute }: CountdownProps) {
  const [dateUpdatedEverySecond, setDateUpdatedEverySecond] = useState(
    new Date(),
  );

  useEffect(() => {
    const intervalId = setInterval(
      () => setDateUpdatedEverySecond(new Date()),
      1_000,
    );
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {60 -
        Math.floor(
          (dateUpdatedEverySecond.valueOf() -
            dateUpdatedEveryMinute.valueOf()) /
            1_000,
        )}
    </>
  );
}
