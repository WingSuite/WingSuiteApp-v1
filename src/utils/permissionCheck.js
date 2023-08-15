// Import
import { config } from "@/config/config";

// permission check definition
export function permissionsCheck(required, permissions, disjunction = false) {
  // Make a set from the given permissions
  const compareSet = new Set(permissions);

  // If the iterated item is the all access token, return true
  if (compareSet.has(config.allAccessPermission)) return true;

  // If the required parameter is an empty list, then return false;
  if (required.length === 0) return false;

  // If disjunction is true, return true if any required permission is found
  if (disjunction) {
    for (let item of required) if (compareSet.has(item)) return true;
    return false;
  }

  // If not, check if the user has all of the required permissions
  else {
    for (let item of required) if (!compareSet.has(item)) return false;
    return true;
  }
}
