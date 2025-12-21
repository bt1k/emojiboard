type CountdownProps = {
  secondsElapsed: number;
};

export default function Countdown({ secondsElapsed }: CountdownProps) {
  return <>{59 - secondsElapsed}</>;
}
