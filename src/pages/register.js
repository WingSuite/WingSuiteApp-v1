// React Icons
import { VscInfo } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React and Next.js imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";

// Toaster related imports
import { errorToaster, successToaster } from "@/components/toasters";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Config import
import { config } from "@/config/config";

// Util imports
import { post } from "@/utils/call";

// JS Cookies import
import Cookies from "js-cookie";

// Image import
import logo from "../../public/logo.png";

// Login Page definitions
const Register = () => {
  // Variable declaration and initialization
  const [passwordReq, setPasswordReq] = useState(false);
  const [success, setSuccess] = useState(false);
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
  const registerPress = async () => {
    // Get values of the inputs
    const first = document.getElementById("first").value;
    const middle = document.getElementById("middle").value;
    const last = document.getElementById("last").value;
    const email = document.getElementById("email").value;
    const phone = `(${document.getElementById("phone1").value}) ${
      document.getElementById("phone2").value
    }-${document.getElementById("phone3").value}`;
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    // Check if all inputs have been filled or is properly filled
    // #region
    if (first == "") {
      errorToaster("First name input not filled");
      return;
    }
    if (last == "") {
      errorToaster("Last name input not filled");
      return;
    }
    if (email == "") {
      errorToaster("Email input not filled");
      return;
    }
    if (!config.emailRegex.test(email)) {
      errorToaster(
        "Email either not an email or is not an associated school email " +
          "(i.e. asu.edu, gcu.edu, or maricopa.edu)"
      );
      return;
    }
    if (!config.phoneRegex.test(phone)) {
      errorToaster("Phone input not properly filled or is empty");
      return;
    }
    if (password1 == "") {
      errorToaster("Password is empty");
      return;
    }
    if (!config.passwordRegex.test(password1)) {
      errorToaster(
        "Password is not strong enough. Check the password criteria."
      );
      return;
    }
    if (password2 == "") {
      errorToaster(`Type your password again in the "Confirm Password" Field`);
      return;
    }
    if (password1 != password2) {
      errorToaster("Passwords do not match");
      return;
    }
    // #endregion

    // Build the query JSON
    var query = {
      first_name: first,
      last_name: last,
      email: email,
      phone_number: phone,
      password: password1,
    };
    if (middle != "") {
      query.middle_initial = middle;
    }

    // If all is good, send the request for registration
    (async () => {
      // Send API call
      var res = await post("/auth/register/", query);

      // Pop toasters if the call was successful
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") {
        successToaster("Registration complete!");
        setSuccess(true);
      }
    })();
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
        className="h-fit w-[20rem] rounded-2xl bg-white/[0.6] py-5
        shadow-lg shadow-sky"
      >
        {!success && (
          <div className="flex h-full flex-col gap-3 px-5">
            <div className="text-3xl">Register</div>
            <div className="flex flex-col">
              <div className="">First Name</div>
              <input
                className="text-gray-700 focus:shadow-outline w-full rounded-lg
              border border-silver bg-white/[0.3] p-1
              shadow-lg focus:outline-none"
                id="first"
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <div className="">MIddle Initial (Optional)</div>
              <input
                className="text-gray-700 focus:shadow-outline w-full rounded-lg
              border border-silver bg-white/[0.3] p-1
              shadow-lg focus:outline-none"
                id="middle"
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <div className="">Last Name</div>
              <input
                className="text-gray-700 focus:shadow-outline w-full rounded-lg
              border border-silver bg-white/[0.3] p-1
              shadow-lg focus:outline-none"
                id="last"
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <div className="">Email</div>
              <input
                className="text-gray-700 focus:shadow-outline w-full rounded-lg
              border border-silver bg-white/[0.3] p-1
              shadow-lg focus:outline-none"
                id="email"
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <div className="">Phone Number</div>
              <div
                className="flex w-full flex-row items-center
                justify-between"
              >
                <div className="text-xl">(</div>
                <input
                  className="text-gray-700 focus:shadow-outline w-1/4
                  rounded-lg border border-silver bg-white/[0.3] p-1
                  shadow-lg focus:outline-none"
                  id="phone1"
                  maxlength="3"
                  type="text"
                />
                <div className="text-xl">)</div>
                <input
                  className="text-gray-700 focus:shadow-outline w-1/4
                rounded-lg border border-silver bg-white/[0.3] p-1
                shadow-lg focus:outline-none"
                  id="phone2"
                  maxlength="3"
                  type="text"
                />
                <div className="text-3xl">-</div>
                <input
                  className="text-gray-700 focus:shadow-outline w-1/4
                rounded-lg border border-silver bg-white/[0.3] p-1
                shadow-lg focus:outline-none"
                  id="phone3"
                  maxlength="4"
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-1">
                <div className="group relative">
                  <IconContext.Provider
                    value={{
                      color: "#3394cc",
                      size: "0.9em",
                    }}
                  >
                    <button
                      onClick={() => {
                        setPasswordReq(!passwordReq);
                      }}
                    >
                      <VscInfo />
                    </button>
                  </IconContext.Provider>
                  <div
                    className={`bg-gray-800 absolute z-10
                     whitespace-nowrap rounded-md bg-white p-2 text-xs
                     ${!passwordReq ? `hidden` : ``}`}
                  >
                    Password requirements:
                    <ul className="list-inside list-disc">
                      <li>At least 1 lowercase alphabetical character</li>
                      <li>At least 1 uppercase alphabetical character</li>
                      <li>At least 1 numeric character</li>
                      <li>At least 1 special character</li>
                      <li>Must be eight characters or longer</li>
                    </ul>
                  </div>
                </div>
                <div>Password</div>
              </div>
              <input
                className="text-gray-700 focus:shadow-outline w-full rounded-lg
                border border-silver bg-white/[0.3] p-1
                shadow-lg focus:outline-none"
                id="password1"
                type="password"
              />
            </div>
            <div className="flex flex-col">
              <div className="">Confirm Password</div>
              <input
                className="text-gray-700 focus:shadow-outline w-full rounded-lg
                border border-silver bg-white/[0.3] p-1
                shadow-lg focus:outline-none"
                id="password2"
                type="password"
              />
            </div>
            <button
              className="w-fit rounded-md bg-sky/[0.8] px-3 py-1 text-lg
              drop-shadow-lg transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-white hover:shadow-xl"
              onClick={registerPress}
            >
              Register
            </button>
          </div>
        )}
        {success && (
          <div className="flex h-full flex-col gap-5 px-5">
            <div className="text-3xl">Success!</div>
            Your registration is complete! We'll let you know of any changes.
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-1 text-white">
        <div>Already Have Access?</div>
        <button
          className="rounded-lg border border-transparent px-2 py-1 text-white
          underline underline-offset-2 transition duration-200 ease-in
          hover:-translate-y-[0.1rem] hover:border-white hover:shadow-md
          hover:shadow-sky "
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>

      <ToastContainer
        position="top-right"
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
export default Register;
