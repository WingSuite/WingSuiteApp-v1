// React Icons
import { VscCloseAll, VscEdit } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// Toaster components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Date Picker imports
import { DayPicker } from "react-day-picker";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { formatMilDate } from "@/utils/time";
import { post, get } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { CollapsableInfoCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import { TimeInput } from "@/components/input";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function EventsPage() {
  // Define useStates and other constants
  const [toolbarAccess, setToolbarAccess] = useState(false);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [eventRecipient, setEventRecipient] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTimes, setEventTimes] = useState({
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
  });
  const [eventDays, setEventDays] = useState([]);
  const required = permissionsList.events;

  // Calendar footer text
  const footer =
    eventDays && eventDays.length > 0 ? (
      <p>{eventDays.length} Day(s) Selected</p>
    ) : (
      <p>No days selected</p>
    );

  // Function to update eventTimes
  const updateTimes = (key, value) => {
    setEventTimes((state) => {
      return { ...state, [key]: value };
    });
    console.log(eventTimes);
  };

  // Preprocess information on mount
  useEffect(() => {
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
      for (let item of res.message) {
        workable[item.name] = item._id;
      }

      // Set useStates
      setAvailableUnits(workable);
      setToolbarAccess(true);

      // Return
      return;
    })();
  }, []);

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
      <div>Make Event</div>
    </button>
  );

  // Component for editor
  const editor = (
    <div
      className="flex max-h-full w-1/4 flex-col gap-5
      overflow-y-auto pb-2 pl-3 pr-3"
    >
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Recipient Unit</div>
        <BottomDropDown
          listOfItems={Object.keys(availableUnits)}
          setSelected={setEventRecipient}
          defaultValue={eventRecipient || "Select Unit"}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Event Title</div>
        <input
          className="rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => setEventName(event.target.value)}
          value={eventName}
          id="feedbackTitle"
        />
      </div>
      <div className="flex h-full flex-col gap-1">
        <div className="text-2xl">Event Description</div>
        <textarea
          className="rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => setEventDescription(event.target.value)}
          value={eventDescription}
          id="feedback"
        />
      </div>
      <div className="flex h-full flex-col gap-1">
        <div className="text-2xl">Event Location</div>
        <input
          className="rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => setEventLocation(event.target.value)}
          value={eventLocation}
          id="feedbackTitle"
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="text-2xl">Event Time</div>
        <div className="flex flex-row items-center gap-2">
          From
          <TimeInput
            hour={eventTimes["startHour"]}
            setHour={(e) => {
              updateTimes("startHour", e);
            }}
            minute={eventTimes["startMinute"]}
            setMinute={(e) => {
              updateTimes("startMinute", e);
            }}
          />
          to
          <TimeInput
            hour={eventTimes["endHour"]}
            setHour={(e) => {
              updateTimes("endHour", e);
            }}
            minute={eventTimes["endMinute"]}
            setMinute={(e) => {
              updateTimes("endMinute", e);
            }}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div>
          <div className="text-2xl">Event Date</div>
          <div className="text-xs">{footer}</div>
        </div>
        <DayPicker
          showOutsideDays
          mode="multiple"
          selected={eventDays}
          onSelect={setEventDays}
        />
      </div>
      <button
        className="w-fit rounded-lg border border-silver bg-gradient-to-tr
          from-deepOcean to-sky bg-clip-text p-2 text-xl text-transparent
          transition duration-200 ease-in hover:-translate-y-[0.1rem]
          hover:border-sky hover:shadow-md hover:shadow-sky"
      >
        Create Event
      </button>
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        <div className="flex flex-row-reverse">{toolbarAccess && toolbar}</div>
        <div className="flex h-full w-full flex-row gap-5 overflow-hidden">
          <div
            className="flex max-h-full w-full flex-col gap-2 overflow-auto
            bg-silver pr-2"
          >
            Test Area
          </div>
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
