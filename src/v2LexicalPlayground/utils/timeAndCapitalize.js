export function getLocationByUTCOffset(offset) {
  const timeZoneLocations = {
    "-12": "Baker Island",
    "-11": "Niue",
    "-10": "Honolulu",
    "-9": "Anchorage",
    "-8": "San Francisco",
    "-7": "Denver",
    "-6": "Chicago",
    "-5": "New York",
    "-4": "Santiago",
    "-3": "Buenos Aires",
    "-2": "Fernando de Noronha",
    "-1": "Azores",
    0: "London",
    1: "Paris",
    2: "Cairo",
    3: "Istanbul",
    4: "Dubai",
    5: "Karachi",
    6: "Dhaka",
    7: "Jakarta",
    8: "Singapore",
    9: "Seoul",
    10: "Sydney",
    11: "Noumea",
    12: "Auckland",
    13: "Apia",
    14: "Kiritimati",
  };

  return timeZoneLocations[offset.toString()] || "Unknown";
}

export function getTimeWithLocation(timeString) {
  const [time, offsetString] = timeString.split("+");
  const date = new Date(`1970-01-01T${time}Z`);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;

  const offset = parseInt(offsetString, 10);
  const location = getLocationByUTCOffset(offset);

  return {
    time: `${hours12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`,
    location,
  };
}

export function capitalizeFirstLetterOfEachWord(str) {
  if (str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  } else {
    return "";
  }
}
