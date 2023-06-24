// Style import
import "@/styles/globals.css";

// JS Cookies import
import Cookies from "js-cookie";

// React and Next.js imports
import { useEffect } from "react";

// Util imports
import { get } from "@/utils/call";

// Base page definition
export default function App({ Component, pageProps }) {

  // Get the user's whoami information and store it
  (async () => {
    // If the access token is not there, don't get the user's whoami
    const access = Cookies.get("access");
    if (access != undefined) {
        // Using the given access token, store the information
      // from the response of the /user/who_am_i/ endpoint
      const res = await get("/user/who_am_i/", access);

      // Store the content of the result to local storage
      localStorage.setItem("whoami", JSON.stringify(res));
    }
  })();

  // Render page's components
  return <Component {...pageProps} />;
}
