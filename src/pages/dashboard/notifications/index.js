// React Icons
import { VscCloseAll, VscEdit } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { permissionsList, config } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { ToggleSwitch } from "@/components/input";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post, get } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { CollapsableInfoCard } from "@/components/cards";
import { BottomDropDown } from "@/components/dropdown";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Notifications page definition
export default function NotificationsPage() {
  // Define useStates and other constants
  const [toolbarAccess, setToolbarAccess] = useState(false);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [notificationRecipient, setNotificationRecipient] = useState("");
  const [notificationName, setNotificationName] = useState("");
  const [notificationText, setNotificationText] = useState("");
  const [notificationNotify, setNotificationNotify] = useState(false);
  const [actionTrigger, setActionTrigger] = useState(true);
  const required = permissionsList.notifications;

  // On mount of the Next.js page
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Fetch the permissions of the user from local storage
    const user = JSON.parse(localStorage.getItem("whoami"));

    // Set access for toolbar and other information
    setToolbarAccess(permissionsCheck(required.toolbar, user.permissions));

    // Process user's available units
    (async () => {
      // Variable declaration
      var workable = {};

      // Set availableUnits to all units
      var res = await get("/user/get_users_units/", Cookies.get("access"));

      // Process available units
      for (let item of res.message)
        if (item.is_superior) workable[item.name] = item._id;

      // If the user is an admin, grant all units
      if (user.permissions.includes(config.allAccessPermission))
        for (let item of res.message) workable[item.name] = item._id;

      // Set useStates
      setAvailableUnits(workable);

      // Return
      return;
    })();

    // Process the user's notifications
    (async () => {
      // Get the start and end bounds
      const start = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
      const end = Math.floor(Date.now() / 1000);

      // Get the user's feedback information
      var res = await post(
        "/user/get_notifications/",
        { start_datetime: start, end_datetime: end },
        Cookies.get("access")
      );

      // If resulting API results in an error, return
      if (res.status === "error") return;

      // Iterate through each item of the response and store just the quotes
      let parsed = [];
      for (let item of res.message) {
        // Get the author's name
        var from_user = await post(
          "/user/get_user/",
          { id: item.author },
          Cookies.get("access")
        );

        // Get the source unit
        var source_unit = await post(
          "/unit/get_unit_info/",
          { id: item.unit },
          Cookies.get("access")
        );

        // Append information
        parsed.push([
          item.created_datetime,
          item.name,
          source_unit.message.name,
          `${from_user.message.rank ? from_user.message.rank : ""} ${
            from_user.message.full_name
          }`,
          item.notification,
          user._id == item.author ||
            user.permissions.includes(config.allAccessPermission),
          item._id,
        ]);
      }

      // Store the quotes to the useState
      setNotificationData(parsed);
    })();
  }, [actionTrigger]);

  // Function definition for sending notification
  const createNotification = () => {
    // Get the target user's ID
    const targetUnit = availableUnits[notificationRecipient];

    // Check if the target_user is undefined
    if (targetUnit === undefined) {
      errorToaster("Improper recipient value. Please check your input.");
      return;
    }

    // Send API call for creating the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/notification/create_notification/",
        {
          unit: targetUnit,
          name: notificationName,
          notification: notificationText,
          notify: notificationNotify,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster and trigger
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();

    // Clear inputs
    setNotificationRecipient("");
    setNotificationName("");
    setNotificationText("");
    setNotificationNotify(false);
  };

  // Function definition for updating a notification
  const updateNotification = (id, title, text) => {
    // Send API call for creating the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/notification/update_notification/",
        {
          id: id,
          name: title,
          notification: text,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster and trigger
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();
  };

  // Function definition for deleting a notification
  const deleteNotification = (id) => {
    // Send API call for creating the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/notification/delete_notification/",
        {
          id: id,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster and trigger
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();
  };

  // Component for toolbar
  const toolbar = (
    <button
      className={`my-3 flex w-fit flex-row gap-4 rounded-lg border px-3
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
      <div>Make Notification</div>
    </button>
  );

  // Component for Inbox
  const inbox = (
    <div className="flex max-h-full w-full flex-col gap-2 overflow-auto pr-2">
      {notificationData.length === 0 ? (
        <Nothing
          icon={<VscCloseAll />}
          mainText={`No Notifications`}
          subText={`Seems Pretty Quiet`}
        />
      ) : (
        notificationData.map((info, index) => (
          <CollapsableInfoCard
            id={info[6]}
            key={`feedbackInbox-${info[0]}-${index}`}
            date={formatMilDate(info[0])}
            title={info[1]}
            titleAppendix={
              <>
                <div className="flex flex-row items-center gap-1.5 text-xs">
                  <div className="font-bold">For Personnel Under: </div>
                  <div>{info[2]}</div>
                </div>
                <div className="flex flex-row items-center gap-1.5 text-xs">
                  <div className="font-bold">From: </div>
                  <div>{info[3]}</div>
                </div>
              </>
            }
            mainText={info[4]}
            updateFunc={info[5] ? updateNotification : null}
            deleteFunc={info[5] ? deleteNotification : null}
          />
        ))
      )}
    </div>
  );

  // Component for editor
  const editor = (
    <div className="flex max-h-full w-1/2 flex-col gap-5 overflow-auto pb-2 pl-3">
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Recipient Unit</div>
        <BottomDropDown
          listOfItems={Object.keys(availableUnits)}
          setSelected={setNotificationRecipient}
          defaultValue={notificationRecipient || "Select Unit"}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Notification Title</div>
        <input
          className="rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => setNotificationName(event.target.value)}
          value={notificationName}
          id="feedbackTitle"
        />
      </div>
      <div className="flex h-full flex-col gap-1">
        <div className="text-2xl">Notification</div>
        <textarea
          className="flex-1 rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => setNotificationText(event.target.value)}
          value={notificationText}
          id="feedback"
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl">Notify Units?</div>
        <ToggleSwitch
          onToggle={setNotificationNotify}
          initialState={notificationNotify}
        />
      </div>
      <button
        onClick={createNotification}
        className="w-fit rounded-lg border border-silver bg-gradient-to-tr
        from-deepOcean to-sky bg-clip-text p-2 text-xl text-transparent
        transition duration-200 ease-in hover:-translate-y-[0.1rem]
        hover:border-sky hover:shadow-md hover:shadow-sky"
      >
        Send Notification
      </button>
    </div>
  );

  // Render content
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        <div className="flex flex-row-reverse">{toolbarAccess && toolbar}</div>
        <div className="flex h-full w-full flex-row gap-5 overflow-hidden">
          {inbox}
          {composerOpen && editor}
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
