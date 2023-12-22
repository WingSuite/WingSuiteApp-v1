// React Icons
import { VscClose, VscCheck } from "react-icons/vsc";
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
import { CollapsableInfoCard } from "@/components/cards";
import { ToggleSwitch } from "@/components/input";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitCommunicationsPage() {
  // Define router and get unit ID from URL
  const router = useRouter();
  const { unit_id } = router.query;

  // Define constants and useStates
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [integrationStatus, setIntegrationStatus] = useState(false);
  const [controlSidePanel, setControlSidePanel] = useState(false);
  const [payload, setPayload] = useState({});
  const discordSetupMessages = [
    "In your Discord server, hover over the channel you want WingSuite notifications to appear, and click on the gear icon",
    'Click on "Integrations" and then "Webhooks"',
    'Click on "New Webhook", then the new box that appears, and then "Copy Webhook URL"',
    'Paste the URL into the input field below, and press "Connect"',
  ];
  const toolbarItems = ["Discord"];

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.unit.communications.page)) return;

    // TODO: Get integration status
    setIntegrationStatus(true);
  }, []);

  // Update payload content
  const updatePayload = (key, value) => {
    setPayload((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

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
    </div>
  );

  // Status Panel definition
  const statusPanel = (
    <div
      className="flex h-full flex-col items-center justify-center 
      gap-5"
    >
      <div className="text-9xl">{integrationStatus ? "✅" : "⚠️"}</div>
      <div className="text-center text-3xl  font-bold">
        {toolbarItems[toolbarSelect]} Is {!integrationStatus && "Not"} Set Up
      </div>
    </div>
  );

  // Discord not added for unit section
  const discordInstructions = (
    <div className="flex h-full flex-col gap-8 overflow-y-auto pr-5">
      <div className="font text-3xl">
        To setup Discord for your unit, follow these instructions:
      </div>
      {discordSetupMessages.map((item, idx) => (
        <div>
          <div className="text-4xl font-bold">Step #{idx + 1}</div>
          <div className="text-2xl">{item}</div>
        </div>
      ))}
      <div className="flex w-full flex-row gap-3">
        <input
          className="w-full rounded-lg border border-silver p-2 
          shadow-inner"
        />
        <button
          className="mr-5 rounded-lg bg-bermuda px-3
          transition duration-200 ease-in hover:-translate-y-[0.1rem] 
          hover:text-white hover:shadow-lg"
          onClick={() => {
            // TODO: Integrate Discord
            setIntegrationStatus(true);
          }}
        >
          Connect
        </button>
      </div>
      <div className="text-xl">
        NOTE: If you are not in your unit's Discord and would like your members
        to receive WingSuite notifications, have a member from that unit follow
        these instructions so you can attain the Webhook URL.
      </div>
    </div>
  );

  // Discord controls section
  const discordControls = (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pr-5">
      <div className="mb-5 text-5xl font-bold">Discord Controls</div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl">Ping Everyone on Updates?</div>
        <ToggleSwitch
          onToggle={(e) => {
            // TODO: Change ping_everyone option
            updatePayload("ping_everyone", e);
          }}
          initialState={payload.ping_everyone}
        />
      </div>
      <button
        className={`w-fit rounded-lg  px-2 py-2 transition duration-200 
        ease-in hover:-translate-y-[0.1rem] hover:text-white hover:shadow-lg 
        ${controlSidePanel ? "bg-scarlet" : "bg-sky"}`}
        onClick={() =>
          controlSidePanel
            ? setControlSidePanel(false)
            : setControlSidePanel(discordInstructions)
        }
      >
        {controlSidePanel ? "Cancel Reconfiguration" : "Reconfigure Channel"}
      </button>
      {!payload.disable && (
        <button
          className="w-fit rounded-lg bg-scarlet px-2 py-2 transition 
        duration-200 ease-in hover:-translate-y-[0.1rem] hover:text-white 
        hover:shadow-lg"
          onClick={() => updatePayload("disable", true)}
        >
          Disable Notifications
        </button>
      )}
      {payload.disable && (
        <div
          className="flex w-fit flex-row items-center gap-2 rounded-lg 
          border border-scarlet px-2 py-2 text-scarlet"
        >
          Are You Sure?
          <button
            className="text-2xl transition duration-200 ease-in 
            hover:-translate-y-[0.1rem]"
            onClick={() => updatePayload("disable", false)}
          >
            <VscClose />
          </button>
          <button
            className="text-xl duration-200 ease-in 
            hover:-translate-y-[0.1rem]"
            onClick={() => {
              // TODO: Disable Discord Integration
              setIntegrationStatus(false);
            }}
          >
            <VscCheck />
          </button>
        </div>
      )}
    </div>
  );

  // Render page
  const controlSections = [discordControls];
  const instructionSections = [discordInstructions];
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        {toolbar}
        <div className="flex h-full w-full flex-row gap-3 overflow-y-auto">
          <div className="w-1/2">
            {controlSidePanel ? controlSidePanel : statusPanel}
          </div>
          <div className="w-1/2">
            {integrationStatus
              ? controlSections[toolbarSelect]
              : instructionSections[toolbarSelect]}
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
