// React Icons
import { VscInfo } from "react-icons/vsc";
import { IconContext } from "react-icons";

// Imports
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import React from "react";

// Toaster related imports
import { successToaster, errorToaster } from "@/components/toasters";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Config imports
import { config } from "@/config/config";

// Util imports
import { post } from "@/utils/call";

// Image import
import logo from "../../public/logo.png";

export default function TokenPage() {
  // Get token for the password reset
  const router = useRouter();
  const { token } = router.query;

  // useState definition
  const [passwordReq, setPasswordReq] = useState(false);
  const [success, setSuccess] = useState(false);

  // Function to call API for reset
  const resetPassword = async () => {
    // Get values of the inputs
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    // Check if all inputs have been filled or is properly filled
    // #region
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

    // If all is good, send the request for reset
    (async () => {
      // Send API call
      var res = await post("/auth/reset_password/", {
        token: token,
        new_password: password1,
      });

      // Pop toasters if the call was successful
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") {
        successToaster("Password updated!");
        setSuccess(true);
      }
    })();
  };

  // Subcomponent for success message
  const successMessage = (
    <div className="flex h-full flex-col gap-5 px-5">
      <div className="text-3xl">Success!</div>
      Your password has been updated! Please login to get back to using
      WingSuite!
      <div className="flex flex-row items-center gap-1 text-white">
        <button
          className="w-fit rounded-md bg-sky/[0.8] px-3 py-1 text-lg
          drop-shadow-lg transition duration-200 ease-in
          hover:-translate-y-[0.1rem] hover:text-white hover:shadow-xl"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );

  // Subcomponent for getting reset
  const passwordResetRequest = (
    <div className="flex h-full flex-col gap-5 px-5">
      <div className="text-3xl">Reset Password</div>
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
        onClick={resetPassword}
      >
        Reset
      </button>
    </div>
  );

  // Render reset form
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
        className="h-fit w-1/5 rounded-2xl bg-white/[0.6] py-5
        shadow-lg shadow-sky"
      >
        {!success ? passwordResetRequest : successMessage}
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
}
