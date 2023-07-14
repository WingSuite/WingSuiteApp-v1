// React Icons

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Util imports
import { authCheck } from "@/utils/authCheck";

// Custom components imports
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Metric views imports
import PFAView from "./pfa";
import WarriorKnowledgeView from "./wk";

// Unit member page definition
export default function MetricsPage() {
  // Define useStates and other constants
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const toolbarItems = ["PFA", "Warrior Knowledge"];
  const metricViews = [<PFAView/>, <WarriorKnowledgeView/>];

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;
  }, []);

  // Subcomponent for toolbar
  const toolbar = (
    <div className="flex flex-row justify-between py-3">
      <div className="flex flex-row gap-4">
        {toolbarItems.map((item, index) => (
          <button
            key={`toolbarItems-${item}`}
            className={`rounded-lg border px-3 py-2 text-xl transition
            duration-200 ease-in hover:-translate-y-[0.1rem] hover:shadow-lg ${
              toolbarSelect == index
                ? `border-sky bg-gradient-to-tr from-deepOcean
                to-sky text-white hover:border-darkOcean`
                : `border-silver hover:border-sky`
            }`}
            onClick={() => setToolbarSelect(index)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        {toolbar}
        <div className="h-full">
          {metricViews[toolbarSelect]}
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
