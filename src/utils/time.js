// Config imports
import { config } from "@/config/config";

// Function to get start and end time of this week
export function getTimeBounds() {
  // Get current day information
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get the day of the week
  const dayOfWeek = today.getDay();

  // Calculate start of week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfWeekUnix = Math.floor(startOfWeek.getTime() / 1000);

  // Calculate end of week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  const endOfWeekUnix = Math.floor(endOfWeek.getTime() / 1000);

  // Return the bounds
  return [startOfWeekUnix, endOfWeekUnix];
}

// Function to turn unix timestamp to military time
export function formatMilTime(unixTimestamp) {
  // Get date information
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  // String formatting
  const militaryTime = (hours <= 9 ? "0" : "") + hours + minutes.substring(-2);

  // Return final value
  return militaryTime;
}

// Function to get current day
export function getTodayDay() {
  // Get datetime information
  const date = new Date();
  let dayOfWeek = date.getDay();

  // Change the day index
  if (dayOfWeek === 0) dayOfWeek = 6;
  else dayOfWeek -= 1;

  // Return final value
  return config.daysOfTheWeek[dayOfWeek];
}

// Function to get current day
export function formatMilDate(unixTimestamp, includeTime = false) {
  // Convert the Unix timestamp to a JavaScript Date object
  const dateObject = new Date(unixTimestamp * 1000);

  // Extract the day, month, and year from the Date object
  const day = dateObject.getDate();
  const month = dateObject.toLocaleString("default", { month: "short" });
  const year = dateObject.getFullYear();

  // If includeTime is true, format the date with time, otherwise format without time
  if (includeTime) {
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}${minutes}`;
  }

  // Return the date in the 'DD MMM YYYY' format
  return `${day} ${month} ${year}`;
}

// Function to get amount of seconds from "mm:ss" format
export function getSeconds(minuteSecondString) {
  // Calculate the string into minutes and seconds
  const [minutes, seconds] = minuteSecondString.split(":").map(Number);

  // Return the count
  return minutes * 60 + seconds;
}

// Function to get amount of minutes from "mm:ss" format
export function parseTime(minuteSecondString) {
  // Calculate the string into minutes and seconds
  const [minutes, seconds] = minuteSecondString.split(":").map(Number);

  // Return the total in minutes
  return [
    minutes == 0 ? null : `${minutes}`,
    seconds == 0 ? null : `${seconds}`,
  ];
}

// Function to get "mm:ss" from seconds values format
export function getFormattedTime(secondsCount) {
  // Get calculations
  const seconds = secondsCount;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const formattedTime = `${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;

  // Return the formatted information
  return formattedTime;
}

// Function to update time string
export function updateTimeString(original, part, newValue) {
  // Split the original "mm:ss" string into minutes and seconds
  const [minutes, seconds] = original.split(":");

  // Check which part needs to be updated
  switch (part) {
    case "mm":
      return `${newValue.padStart(2, "0")}:${seconds}`;
    case "ss":
      return `${minutes}:${newValue.padStart(2, "0")}`;
    default:
      return original;
  }
}

// Function to parse a string representing time into seconds
export function convertToSeconds(timeStr) {
  // Regular expression to match numbers followed by a time unit
  // The time unit can be hours, minutes, seconds, or days with various abbreviations
  // The regex is case-insensitive and allows for optional spaces between the number and unit
  const regex =
    /(\d+)\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?|days?|d)\b/i;

  // Attempt to match the input string with the regular expression
  const match = timeStr.match(regex);

  // If there is no match, the input is invalid, so return null
  if (!match) return null;

  // Extract the numeric value and the unit from the match
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  // Determine the unit and convert the numeric value to seconds accordingly
  switch (true) {
    case unit.startsWith("hour") || unit.startsWith("hr"):
      // For hours, multiply the value by the number of seconds in an hour (3600)
      return value * 3600;
    case unit.startsWith("minute") || unit.startsWith("min"):
      // For minutes, multiply the value by the number of seconds in a minute (60)
      return value * 60;
    case unit.startsWith("second") || unit.startsWith("sec"):
      // For seconds, the value is already in seconds, so return it directly
      return value;
    case unit.startsWith("day") || unit === "d":
      // For days, multiply the value by the number of seconds in a day (86400)
      return value * 86400;
    default:
      // If the unit is not recognized, return null to indicate an invalid input
      return null;
  }
}
