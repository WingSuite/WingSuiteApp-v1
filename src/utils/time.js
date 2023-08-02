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
export function formatMilDate(unixTimestamp) {
  // Process time information
  const dateObject = new Date(unixTimestamp * 1000);
  const day = dateObject.getDate();
  const month = dateObject.toLocaleString('default', { month: 'short' });
  const year = dateObject.getFullYear();

  // Return formatted date
  return `${day} ${month} ${year}`;
}

// Function to get amount of seconds from "mm:ss" format
export function getSeconds(minuteSecondString) {
  // Calculate the string into minutes and seconds
  const [minutes, seconds] = minuteSecondString.split(':').map(Number);

  // Return the count
  return minutes * 60 + seconds;
}

// Function to get "mm:ss" from seconds values format
export function getFormattedTime(minuteSecondString) {
    // Get calculations
    const seconds = minuteSecondString;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const formattedTime = `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;

  // Return the formatted information
  return formattedTime;
}