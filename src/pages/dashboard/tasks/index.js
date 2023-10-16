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
  // Define the router for page transitioning
  const router = useRouter();

  // Define useStates and other constants
  const [toolbarAccess, setToolbarAccess] = useState(false);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [actionTrigger, setActionTrigger] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const required = permissionsList.tasks;
  const toolbarItems = ["Your Tasks", "Dispatched"];

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Fetch the permissions of the user from local storage
    const user = JSON.parse(localStorage.getItem("whoami"));

    // Set access for toolbar and other information
    setToolbarAccess(permissionsCheck(required.toolbar, user.permissions));
  }, []);

  // Process on change of the taskbar selection and other actions
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Get the user's tasks
    (async () => {
      // Set a variable to collect all types of tasks
      var tasks = [];

      // Get the user's tasks that have not been completed
      var res = await post(
        "/user/get_tasks/",
        { page_size: 2000, page_index: 0, get_completed: false },
        Cookies.get("access")
      );

      // Add to the tasks list
      tasks = tasks.concat(res.message);

      // Get the user's tasks that have been completed
      res = await post(
        "/user/get_tasks/",
        { page_size: 2000, page_index: 0, get_completed: true },
        Cookies.get("access")
      );

      // Add to the tasks list
      tasks = tasks.concat(res.message);

      // Sort the tasks by suspense date and then its completion status
      tasks.sort((a, b) => {
        // Sort by suspense date
        if (a.suspense < b.suspense) return -1;
        if (a.suspense > b.suspense) return 1;

        // If suspense dates are the same, sort by status
        if (a.status === "complete" && b.status !== "complete") return 1;
        if (a.status !== "complete" && b.status === "complete") return -1;

        // If both have the same status, they remain in their current order
        return 0;
      });

      // Save the data
      setTaskData(tasks);
    })();
  }, [actionTrigger, toolbarSelect]);

  // Component for toolbar
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
            } `}
            onClick={() => setToolbarSelect(index)}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        className={`flex flex-row gap-4 rounded-lg border px-3
        py-2 text-xl transition duration-200 ease-in hover:-translate-y-[0.1rem]
        hover:shadow-lg ${
          composerOpen
            ? `border-sky bg-gradient-to-tr from-deepOcean
            to-sky text-white hover:border-darkOcean`
            : `border-silver hover:border-sky`
        }`}
        onClick={() => setComposerOpen(!composerOpen)}
      >
        <IconContext.Provider
          value={{
            size: "1.2em",
          }}
        >
          <VscEdit />
        </IconContext.Provider>
        <div>Make Task</div>
      </button>
    </div>
  );

  // Component for inbox
  const inbox = (
    <div className="flex max-h-full w-full flex-col gap-2 overflow-auto pr-2">
      {taskData.length === 0 ? (
        <Nothing
          icon={<VscCloseAll />}
          mainText={`No Tasks ${toolbarSelect == 0 ? `to Do` : `Dispatched`}`}
          subText={
            toolbarSelect == 0
              ? `Go Take a Break`
              : `Let's Get the Gears Moving!`
          }
        />
      ) : (
        taskData.map((info, index) => (
          <CollapsableInfoCard
            id={`task-${toolbarSelect}-${info._id}`}
            key={`task-${toolbarSelect}-${info._id}`}
            title={info.name}
            titleAppendix={
              <div className="flex flex-row gap-2">
                <div className="font-bold">Suspense: </div>
                <div>{formatMilDate(info.suspense, true)}</div>
              </div>
            }
            mainText={info.description}
            // updateFunc={toolbarSelect && info[5] ? updateFeedback : null}
            // deleteFunc={toolbarSelect && info[5] ? deleteFeedback : null}
          />
        ))
      )}
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        {toolbarAccess && toolbar}
        <div className="flex h-full w-full flex-row gap-5 overflow-hidden">
          {inbox}
          {/* {composerOpen && editor} */}
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
