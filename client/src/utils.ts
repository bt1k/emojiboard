const relativeTimeFormat = new Intl.RelativeTimeFormat('en', {
  style: 'short',
});

export function dateToRelativeTimeString(date: Date): string {
  const now = new Date();
  const difference = now.valueOf() - date.valueOf();
  if (difference < 60_000) {
    // Less than 1 minute.
    return `< ${relativeTimeFormat.format(-1, 'minute')}`;
  } else if (difference < 3_600_000) {
    // Less than 1 hour.
    return relativeTimeFormat.format(
      -Math.floor(difference / 1_000 / 60),
      'minute',
    );
  } else if (difference < 86_400_000) {
    // Less than 24 hours.
    return relativeTimeFormat.format(
      -Math.floor(difference / 1_000 / 60 / 60),
      'hour',
    );
  }
  // Anything more than 24 hours gets shown in days. In the future I could
  // possibly add months and years.
  return relativeTimeFormat.format(
    -Math.floor(difference / 1_000 / 60 / 60 / 24),
    'day',
  );
}
