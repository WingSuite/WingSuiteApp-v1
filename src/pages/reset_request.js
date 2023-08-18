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
import { post, get } from "@/utils/call";

// JS Cookies import
import Cookies from "js-cookie";

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
  const requestReset = async () => {
    // Get values of the inputs
    const email = document.getElementById("email").value;

    // Check if all inputs have been filled or is properly filled
    // #region
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
    // #endregion

    // If all is good, send the request for reset
    (async () => {
      // Send API call
      var res = await post("/auth/password_reset_request/", {
        email: email,
      });

      // Pop toasters if the call was successful
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") {
        successToaster("Reset e-mail sent!");
        setSuccess(true);
      }
    })();
  };

  // Subcomponent for success message
  const successMessage = (
    <div className="flex h-full flex-col gap-5 px-5">
      <div className="text-3xl">Check Your E-Mail!</div>
      We've sent the reset link to your email. Contact WingSuite admins if you
      are facing any issues.
    </div>
  );

  // Subcomponent for getting reset
  const passwordResetRequest = (
    <div className="flex h-full flex-col gap-5 px-5">
      <div className="text-3xl">Reset Request</div>
      <div className="flex flex-col">
        <div className="">E-mail</div>
        <input
          className="text-gray-700 focus:shadow-outline w-full rounded-lg
          border border-silver bg-white/[0.3] p-1
          shadow-lg focus:outline-none"
          id="email"
          type="email"
        />
      </div>
      <button
        className="w-fit rounded-md bg-sky/[0.8] px-3 py-1 text-lg
      drop-shadow-lg transition duration-200 ease-in
      hover:-translate-y-[0.1rem] hover:text-white hover:shadow-xl"
        onClick={requestReset}
      >
        Request
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
      <div className="flex flex-row items-center gap-1 text-white">
        <div>Remembered Your Password?</div>
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
