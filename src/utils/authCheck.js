// JS Cookies import
import Cookies from "js-cookie";

// React and Next.js imports
import Router from "next/router";

// Authentication checker
export function authCheck() {

  // Get access token
  var access = Cookies.get("access");

  // Return if the access is undefined or empty
  if (access == undefined || access == "") {
    // Move to login page
    Router.push("/login");

    // Return false
    return false;
  }

  // Return true if all good
  return true;
}
