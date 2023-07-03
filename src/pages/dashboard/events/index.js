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
import 'react-day-picker/dist/style.css'

// Calendar UI imports
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import startOfWeek from "date-fns/startOfWeek";
import enUS from "date-fns/locale/en-US";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { permissionsList, config } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { formatMilDate, getTodayDay } from "@/utils/time";
import { post, get } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { CollapsableInfoCard, ButtonCard } from "@/components/cards";
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
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTimes, setEventTimes] = useState({
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
  });
  const [eventDays, setEventDays] = useState([]);
  const [actionTrigger, setActionTrigger] = useState(true);
  const required = permissionsList.events;
  const locales = {
    'en-US': enUS,
  };
  const localizer = dateFnsLocalizer({
    format,
    startOfWeek,
    getDay,
    locales,
  });

  // Calendar footer text
  const footer =
    eventDays && eventDays.length > 0 ? (
      <p>{eventDays.length} Day(s) Selected</p>
    ) : (
      <p>No days selected</p>
    );

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

  // Function to update eventTimes
  const updateTimes = (key, value) => {
    setEventTimes((state) => {
      return { ...state, [key]: value };
    });
  };

  // Function to send call to create event
  const createEvent = () => {
    /*
        INPUT CHECKERS
    */

    // Get the target user's ID
    const targetUnit = availableUnits[eventRecipient];

    // Check if the target_user is undefined
    if (targetUnit === undefined) {
      errorToaster("Improper recipient value. Please check your input.");
      return;
    }

    // Check if event title is empty
    if (eventTitle == "") {
      errorToaster("Event title is empty");
      return;
    }

    // Check if start event times are empty
    if (eventTimes["startHour"] == "" || eventTimes["startMinute"] == "") {
      errorToaster("Event start time should not be empty or partially filled");
      return;
    }

    // Check if start event times are empty
    if (eventTimes["startHour"] == "" || eventTimes["startMinute"] == "") {
      errorToaster("Event start time should not be empty or partially filled");
      return;
    }

    // Check if start event times is greater than the end time, if the end time
    // was provided
    if (eventTimes["endHour"] != "" && eventTimes["endMinute"] != "") {
      // Get the unix time of the two dates
      const startTime = new Date(
        `1970-01-01T${eventTimes["startHour"]}:${eventTimes["startMinute"]}:00`
      );
      const endTime = new Date(
        `1970-01-01T${eventTimes["endHour"]}:${eventTimes["endMinute"]}:00`
      );

      // Check if startTime is greater than the endTime
      if (startTime > endTime) {
        errorToaster("Event start time should not be after event end time");
        return;
      }
    }

    // Check if event days are filled
    if (eventDays.length == 0) {
      errorToaster("Select one or more days for the event");
      return;
    }

    /*
        EVENT CREATION
    */

    // Iterate through every day selected
    for (let item of eventDays) {
      // Call API for creating the event
      (async () => {
        // Variable declaration
        var start_datetime = new Date(item.getTime());
        var end_datetime = null;

        // Calculate unix timestamps for start datetime
        start_datetime.setHours(parseInt(eventTimes["startHour"]));
        start_datetime.setMinutes(parseInt(eventTimes["startMinute"]));
        start_datetime = start_datetime.getTime() / 1000;

        // Calculate end datetime if the end dates were presented
        if (eventTimes["endHour"] != "" && eventTimes["endMinute"] != "") {
          // Calculate unix timestamps for start datetime
          end_datetime = new Date(item.getTime());
          end_datetime.setHours(parseInt(eventTimes["endHour"]));
          end_datetime.setMinutes(parseInt(eventTimes["endMinute"]));
          end_datetime = end_datetime.getTime() / 1000;
        }

        // Call API endpoint for creation
        var res = await post(
          "/event/create_event/",
          {
            name: eventTitle,
            unit: targetUnit,
            location: eventLocation,
            start_datetime: start_datetime,
            end_datetime: end_datetime,
            description: eventDescription,
          },
          Cookies.get("access")
        );

        // If the call was successful, send a success toaster
        if (res.status == "success") successToaster(res.message);
        if (res.status == "error") errorToaster(res.message);
      })();
    }

    // Clear inputs
    setEventRecipient("");
    setEventTitle("");
    setEventDescription("");
    setEventLocation("");
    setEventTimes({
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
    });
    setEventDays([]);

    // Trigger action
    setActionTrigger(!actionTrigger);
  };

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
          onChange={(event) => setEventTitle(event.target.value)}
          value={eventTitle}
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
        onClick={createEvent}
        className="w-fit rounded-lg border border-silver bg-gradient-to-tr
          from-deepOcean to-sky bg-clip-text p-2 text-xl text-transparent
          transition duration-200 ease-in hover:-translate-y-[0.1rem]
          hover:border-sky hover:shadow-md hover:shadow-sky"
      >
        Create Event
      </button>
    </div>
  );

  // Week View definition
  const WeekView = (
    <div className="flex w-full flex-col overflow-y-hidden gap-2 pr-2">
      <div style={{ height: "100vh" }}>
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
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
          {WeekView}
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
