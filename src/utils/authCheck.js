// JS Cookies import
import Cookies from "js-cookie";

// React and Next.js imports
import Router from "next/router";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";

// Authentication checker
export function authCheck(permissions = []) {
  // Check if the whoami located in localStorage exists
  if (localStorage.getItem("whoami") === null) {
    // Move to login page
    Router.push("/login");

    // Return false
    return false;
  }

  // Get access token nad user's data
  var access = Cookies.get("access");
  const user = JSON.parse(localStorage.getItem("whoami")).permissions;

  // Return if the access is undefined or empty
  if (access == undefined || access == "") {
    // Move to login page
    Router.push("/login");

    // Return false
    return false;
  }

  // Check if the user has access to the page
  if (permissions.length != 0) {
    if (!permissionsCheck(permissions, user)) {
      // Move to login page
      Router.push("/dashboard/homepage/");

      // Return false
      return false;
    }
  }

  // Return true if all good
  return true;
}
