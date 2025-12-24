const relativeTimeFormat = new Intl.RelativeTimeFormat('en', {
  style: 'short',
});

/**
 * Returns the gap between two `Date` objects as a string, using
 * `Intl.RelativeTimeFormat`. The `date1` parameter should represent an earlier
 * time than `date2`.
 */
export function dateGapAsRelativeTimeString(date1: Date, date2: Date): string {
  const difference = date2.valueOf() - date1.valueOf();
  if (difference < 60_000) {
    // Less than 1 minute.
    return `Less than ${relativeTimeFormat.format(-1, 'minute')}`;
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

/**
 * Alerts the user with how much time they have to wait (in seconds) until they
 * can again perform a rate-limited action. If time information is not in the
 * HTTP response, the user is told they can retry their action "soon". The
 * `action` string should be an action the user is trying to perform. E.g. if
 * `action` is "loading posts" then the alert to the user will say: "You are
 * loading posts too often".
 */
export function alertRateLimitInfo(headers: Headers, action?: string): void {
  const retryAfterHeader = headers.get('Retry-After');
  const retryAfterSecs = parseInt(String(retryAfterHeader));
  const timeString =
    retryAfterSecs <= 30 ? `in ${retryAfterSecs} second(s)` : 'soon';
  // Don't use the null coalescing operator because then if `action` is the
  // empty string, it will be put into the template literal. I don't want that.
  alert(
    `You are ${action ? action : 'doing that'} too often. Try again ${timeString}.`,
  );
}
