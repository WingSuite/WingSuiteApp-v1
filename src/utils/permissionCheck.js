// Import
import { config } from "@/config/config";

// POST Call definition
export function permissionsCheck(required, permissions) {
  // Make a set from the given config
  const compareSet = new Set(permissions);

  // If the iterated item is the all access token, return true
  if (compareSet.has(config.allAccessPermission)) return true;

  // If the required parameter is an empty list, then return false;
  if (required.length === 0) return false;

  // Iterate through the user's permissions
  for (let item of required) {
    // If the iterated item is not in the user's permissions, return false
    if (!compareSet.has(item)) return false;
  }

  // Return true if all else worked
  return true;
}
