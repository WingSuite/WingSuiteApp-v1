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
export function formatMilitary(unixTimestamp) {
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