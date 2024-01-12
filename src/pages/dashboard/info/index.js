// React Icons
import { VscCloseAll, VscEdit } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { CollapsableInfoCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitResourcesPage() {
  // Define router and get unit ID from URL
  const router = useRouter();
  const { unit_id } = router.query;

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;
  }, []);

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold">Beta Test Information</div>
          <div className="text-xl">
            Organization: <b>Detachment 025</b>
          </div>
          <div className="text-xl">
            Approved For Distribution By <b> Benjamin Joseph L. Herrera</b>
          </div>
          <div className="text-3xl font-bold">API Server</div>
          <div className="text-xl">
            Variant: <b>San Jose Del Monte City</b>
          </div>
          <div className="text-xl">
            Version: <b>v1 (b598c1e)</b>
          </div>
          <div className="text-3xl font-bold">Web App Server</div>
          <div className="text-xl">
            Variant: <b>Quezon City</b>
          </div>
          <div className="text-xl">
            Version: <b>v1 (26354f7)</b>
          </div>
          <div className="mt-9 text-3xl font-bold">NOTE:</div>
          <div className="w-1/2 text-xl">
            This application, API and Web App services, are part of a beta test
            cycle. The content provided through these services are not
            indicative of the final product.
          </div>
          <div className="mt-9 text-3xl font-bold">
            © Copyright 2024 WingSuite, LLC. All rights reserved.
          </div>
        </div>
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
}
