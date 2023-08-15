// React and Next.js imports
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";

// Toaster related imports
import { errorToaster } from "@/components/toasters";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Config imports
import { config } from "@/config/config";

// Util imports
import { post, get } from "@/utils/call";

// JS Cookies import
import Cookies from "js-cookie";

// Image import
import logo from "../../public/logo.png";

// Login Page definitions
const Login = () => {
  // Variable declaration and initialization
  const router = useRouter();

  // Pop toaster message if noTokens cookie is present
  useEffect(() => {
    const refresh = Cookies.get("noTokens");
    if (refresh === "true") {
      Cookies.set("noTokens", false);
      errorToaster("Login to access your dashboard", "top-center");
    }
  }, []);

  // Function call when the login button is pressed
  const loginPress = async () => {
    // Send API request and get its json representation
    var res = await post("/auth/login/", {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    });

    // If the response is not OK, send error message
    if (res.hasOwnProperty("status")) {
      errorToaster(res["message"]);
      return;
    }

    // Store basic information into a cookie
    Cookies.set("refresh", res["refresh_token"]);
    Cookies.set("access", res["access_token"]);

    // Using the given access token, store the information
    // from the response of the /user/who_am_i/ endpoint
    res = await get("/user/who_am_i/", res["access_token"]);

    // Store the content of the result to local storage
    localStorage.setItem("whoami", JSON.stringify(res));

    // Move to the dashboard
    router.push("/dashboard/homepage");
  };

  // Component return
  return (
    <div
      className="relative flex h-screen flex-col items-center justify-center
      gap-7 bg-gradient-to-tr from-deepOcean to-sky"
    >
      <div className="flex flex-row items-center gap-4 text-sm text-white">
        <div>
          <Image alt="Logo" src={logo} width={100} height={100} />
        </div>
        <div className="flex flex-col">
          <div className="text-5xl font-thin">WingSuite</div>
          <div className="text-2xl font-thin">{config.orgName}</div>
        </div>
      </div>
      <div
        className="h-fit w-fit rounded-2xl bg-white/[0.6] py-5
        shadow-lg shadow-sky"
      >
        <div className="flex h-full flex-col gap-5 px-5">
          <div className="text-3xl">User Login</div>
          <div className="">
            <input
              className="text-gray-700 focus:shadow-outline w-full rounded-lg
              border border-silver bg-white/[0.3] p-1
              shadow-lg focus:outline-none"
              id="email"
              type="text"
              placeholder="Email"
            />
          </div>
          <div className="">
            <input
              className="text-gray-700 focus:shadow-outline w-full rounded-lg
              border border-silver bg-white/[0.3] p-1
              shadow-lg focus:outline-none"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <button
            onClick={loginPress}
            className="w-fit rounded-md bg-sky/[0.8] px-3 py-1 text-lg
            drop-shadow-lg transition duration-200 ease-in
            hover:-translate-y-[0.1rem] hover:text-white hover:shadow-xl"
          >
            Log In
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-1 text-white">
        <div>Need Access?</div>
        <button
          className="rounded-lg border border-transparent px-2 py-1 text-white
          underline underline-offset-2 transition duration-200 ease-in
          hover:-translate-y-[0.1rem] hover:border-white hover:shadow-md
          hover:shadow-sky"
          onClick={() => router.push("/register")}
        >
          Register
        </button>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

// Export the Login page
export default Login;
