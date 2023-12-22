// React Icons
import { VscClose, VscCheck } from "react-icons/vsc";

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
import { authCheck } from "@/utils/authCheck";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { ToggleSwitch } from "@/components/input";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitCommunicationsPage() {
  // Define router and get unit ID from URL
  const router = useRouter();
  const { unit_id } = router.query;

  // Define constants and useStates
  const [unitIDMap, setUnitIDMap] = useState({});
  const [actionTrigger, setActionTrigger] = useState(false);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [integrationStatus, setIntegrationStatus] = useState(false);
  const [controlSidePanel, setControlSidePanel] = useState(false);
  const [setting, setSetting] = useState({});
  const discordSetupMessages = [
    "In your Discord server, hover over the channel you want WingSuite notifications to appear, and click on the gear icon",
    'Click on "Integrations" and then "Webhooks"',
    'Click on "New Webhook", then the new box that appears, and then "Copy Webhook URL"',
    'Paste the URL into the input field below, and press "Connect"',
  ];
  const toolbarItems = ["Discord"];
  const mainIntegrationIndicator = {
    discord: "channel",
  };

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.unit.communications.page)) return;

    // Get unit ID mapping in reverse order
    const unitIDMap = JSON.parse(localStorage.getItem("reverseUnitIDMap"));
    setUnitIDMap(unitIDMap);

    // Get unit information
    if (unit_id != undefined) {
      (async () => {
        // Get unit information with communication info
        var res = await post(
          "/unit/get_unit_info/",
          { id: unitIDMap[unit_id], communications: true },
          Cookies.get("access")
        );

        // Extract the unit's communciation settings
        const settings = res.message.communications;

        // If the communications settings is empty, set the integration status
        // to null
        if (!settings) {
          setIntegrationStatus(false);
          return;
        }

        // If the main indicator is not present, then return null
        const currComm = toolbarItems[toolbarSelect].toLowerCase();
        if (!settings[currComm]) {
          setIntegrationStatus(false);
          return;
        }
        if (!settings[currComm][mainIntegrationIndicator[currComm]]) {
          setIntegrationStatus(false);
          return;
        }

        // If all else is good, set integration to true
        setSetting(settings[currComm]);
        setIntegrationStatus(true);
      })();
    }
  }, [unit_id, actionTrigger]);

  // Update payload content
  const updatePayload = (key, value) => {
    setSetting((prevState) => ({
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
            key={`toolbarItems-${index}`}
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
        <div key={`setup-${idx}`}>
          <div className="text-4xl font-bold">Step #{idx + 1}</div>
          <div className="text-2xl">{item}</div>
        </div>
      ))}
      <div className="flex w-full flex-row gap-3">
        <input
          className="w-full rounded-lg border border-silver p-2 
          shadow-inner"
          id="webhookLink"
        />
        <button
          className="mr-5 rounded-lg bg-bermuda px-3
          transition duration-200 ease-in hover:-translate-y-[0.1rem] 
          hover:text-white hover:shadow-lg"
          onClick={() => {
            // Update the settings of the unit
            (async () => {
              var res = await post(
                "/unit/update_communication_settings/",
                {
                  id: unitIDMap[unit_id],
                  communication: toolbarItems[toolbarSelect].toLowerCase(),
                  settings: {
                    channel: document.getElementById("webhookLink").value,
                    ping_everyone: false,
                  },
                },
                Cookies.get("access")
              );

              // Send information abou the message being sent
              if (res.status == "error") {
                errorToaster(res.message);
                setControlSidePanel(false);
                return;
              } else {
                successToaster(
                  'Discord is set up. Check if the channel has a new message. If not, redo by pressing the "Reconfigure Discord" button'
                );
                setActionTrigger(!actionTrigger);
                setControlSidePanel(false);
              }

              // Send discord message
              var res = await post(
                "/communications/send_unit_discord_message/",
                {
                  id: unitIDMap[unit_id],
                  title: "Test Title",
                  message: "Test Message",
                },
                Cookies.get("access")
              );
            })();
          }}
        >
          Connect
        </button>
      </div>
      <div className="text-xl">
        <b>NOTE:</b> If you are not in your unit's Discord and would like your
        members to receive WingSuite notifications, have a member from that unit
        follow these instructions so you can attain the Webhook URL.
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
            // Update the settings of the unit
            (async () => {
              var res = await post(
                "/unit/update_communication_settings/",
                {
                  id: unitIDMap[unit_id],
                  communication: toolbarItems[toolbarSelect].toLowerCase(),
                  settings: {
                    ping_everyone: e,
                  },
                },
                Cookies.get("access")
              );

              // Send information abou the message being sent
              if (res.status == "error") {
                errorToaster(res.message);
                return;
              } else {
                successToaster(res.message);
                setActionTrigger(!actionTrigger);
                return;
              }
            })();
          }}
          initialState={setting.ping_everyone}
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
        {controlSidePanel ? "Cancel Reconfiguration" : "Reconfigure Discord"}
      </button>
      {!setting.disable && (
        <button
          className="w-fit rounded-lg bg-scarlet px-2 py-2 transition 
        duration-200 ease-in hover:-translate-y-[0.1rem] hover:text-white 
        hover:shadow-lg"
          onClick={() => updatePayload("disable", true)}
        >
          Disable Notifications
        </button>
      )}
      {setting.disable && (
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
              // Update the settings of the unit
              (async () => {
                var res = await post(
                  "/unit/update_communication_settings/",
                  {
                    id: unitIDMap[unit_id],
                    communication: toolbarItems[toolbarSelect].toLowerCase(),
                    settings: {
                      channel: "",
                    },
                  },
                  Cookies.get("access")
                );

                // Send information abou the message being sent
                if (res.status == "error") {
                  errorToaster(res.message);
                  return;
                } else {
                  successToaster(res.message);
                  setActionTrigger(!actionTrigger);
                  return;
                }
              })();
              setIntegrationStatus(false);
            }}
          >
            <VscCheck />
          </button>
        </div>
      )}
      <div>
        <b>NOTE:</b> When setting up Discord for the first time, you should get
        a Discord message to the targeted channel. If no message with the title
        of <b>"Test Title"</b> occurs, reconfigure the setup by clicking the
        <b>"Reconfigure Discord"</b> Button and following the steps again.
      </div>
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
