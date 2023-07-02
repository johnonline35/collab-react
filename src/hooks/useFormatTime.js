function formatTime(timeString) {
  // Create a date object from the timeString
  const utcDate = new Date(timeString);

  // Get the timezone offset in minutes for the current locale
  const timezoneOffsetMinutes = new Date().getTimezoneOffset();

  // Convert the offset to milliseconds and subtract it from the UTC time to get the local time
  const localDate = new Date(
    utcDate.getTime() - timezoneOffsetMinutes * 60 * 1000
  );

  const options = { month: "long", day: "numeric" };
  const dayMonth = new Intl.DateTimeFormat("en-US", options).format(localDate);

  const timeOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    // timeZoneName: "short",
  };
  const time = new Intl.DateTimeFormat("en-US", timeOptions).format(localDate);

  return `${dayMonth} at ${time}`;
}
