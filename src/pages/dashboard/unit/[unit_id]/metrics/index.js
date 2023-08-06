// React.js & Next.js libraries
import { useRouter } from "next/router";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom components imports
import { UnitMetricsAppProvider } from "../../../../../helper/dashboard/unit/metrics/context";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";
import { Renderer } from "../../../../../helper/dashboard/unit/metrics/renderer";

// Unit member page definition
export default function UnitMetricsPage() {
  // Render page
  return (
    <UnitMetricsAppProvider>
      <div className="relative flex h-screen flex-row">
        <Sidebar />
        <div className="m-10 flex max-h-screen w-full flex-col overflow-y-auto">
          <PageTitle className="flex-none" />
          <Renderer/>
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
    </UnitMetricsAppProvider>
  );
}
