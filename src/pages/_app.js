// Style import
import "@/styles/globals.css";

// JS Cookies import
import Cookies from "js-cookie";

// Util imports
import { get, post } from "@/utils/call";

// Base page definition
export default function App({ Component, pageProps }) {
  // Get the user's whoami information and store it
  (async () => {
    // If the access token is not there, don't get the user's whoami
    var access = Cookies.get("access");
    var refresh = Cookies.get("refresh");

    // Return if the access is undefined or empty
    if (access == undefined || access == "") {
      // Return
      return;
    }

    if (access != undefined) {
      // Using the given access token, store the information
      // from the response of the /user/who_am_i/ endpoint
      var res = await get("/user/who_am_i/", access);

      // If the user's access token is expired, refresh
      if (res.status == "expired") {
        // Get new access token and store it
        const new_access = await post("/auth/refresh/", {}, refresh);
        Cookies.set("access", new_access.access_token);
        access = new_access.access_token;
      }

      // Refresh who_am_i value and store it
      var res = await get("/user/who_am_i/", access);
      localStorage.setItem("whoami", JSON.stringify(res));

      // Get all units
      var res = await post(
        "/unit/get_all_units/",
        { page_size: 2000, page_index: 0 },
        access
      );

      // Process the unit info and store it
      var unitIDMap = {};
      var reverseUnitIDMap = {};
      for (let item of res.message) {
        unitIDMap[item._id] = item.name;
        reverseUnitIDMap[item.name] = item._id;
      }
      localStorage.setItem("unitIDMap", JSON.stringify(unitIDMap));
      localStorage.setItem(
        "reverseUnitIDMap",
        JSON.stringify(reverseUnitIDMap)
      );
    }
  })();

  // Render page's components
  return <Component {...pageProps} />;
}
