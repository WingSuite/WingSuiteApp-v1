// React Icons
import { VscEdit } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Toaster components and CSS
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Date Picker imports
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Modal imports
import Modal from "react-modal";

// JS Cookies import
import Cookies from "js-cookie";

// Quill editor and HTML import
import QuillNoSSRWrapper from "@/components/editor";
import "quill/dist/quill.snow.css";

// Config imports
import { permissionsList, config, quillConfigs } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { post, get } from "@/utils/call";

// Custom components imports
import {
  errorToaster,
  successToaster,
  infoToaster,
} from "@/components/toasters";
import { TimeInput, ToggleSwitch } from "@/components/input";
import { CalendarComponent } from "@/components/calendar";
import { BottomDropDown } from "@/components/dropdown";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";
import EventModal from "./_modal";

// replace '#root' with '#__next' for Next.js
Modal.setAppElement("#__next");

// Unit member page definition
export default function EventsPage() {
  // Define useStates for utility purposes
  const [unitIDMapping, setUnitIDMapping] = useState({});
  const [toolbarAccess, setToolbarAccess] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [actionTrigger, setActionTrigger] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [colorFormat, setColorFormat] = useState({});

  // Define useStates for composing an event
  const [availableUnits, setAvailableUnits] = useState([]);
  const [eventRecipient, setEventRecipient] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventTag, setEventTag] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTimes, setEventTimes] = useState({
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
  });
  const [eventDays, setEventDays] = useState([]);
  const [eventEmailNotify, setEventEmailNotify] = useState(false);
  const [eventDiscordNotify, setEventDiscordNotify] = useState(false);

  // Define useStates for getting event data
  const [queryRange, setQueryRange] = useState({});
  const [events, setEvents] = useState([]);

  // Get the required permissions
  const required = permissionsList.events;

  // Preprocess information on user's units mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Fetch the permissions of the user and unit ID map from local storage
    const user = JSON.parse(localStorage.getItem("whoami"));
    const unitMap = JSON.parse(localStorage.getItem("unitIDMap"));

    // Set access for toolbar and other information
    setToolbarAccess(permissionsCheck(required.toolbar, user.permissions));
    setUnitIDMapping(unitMap);

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

    // Save the current formatting for tags
    (async () => {
      var res = await get("/event/get_event_format/", Cookies.get("access"));
      setColorFormat(res.tag_options);
    })();
  }, []);

  // Preprocess information on the user's events
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Preprocess user's events
    (async () => {
      // Return if the queryRange is nothing
      if (Object.keys(queryRange).length == 0) return;

      // Set availableUnits to all units
      var res = await post(
        "/user/get_events/",
        {
          start_datetime: queryRange.start,
          end_datetime: queryRange.end,
        },
        Cookies.get("access")
      );

      // Extract message
      res = res.message;

      // Rename keys
      res = res.map(
        ({
          name: title,
          start_datetime: start,
          end_datetime: end,
          ...res
        }) => ({
          title,
          start,
          end,
          ...res,
        })
      );

      // Convert Unix timestamps to Date objects
      res = res.map((event) => ({
        ...event,
        start: new Date(event.start * 1000),
        end: event.end
          ? new Date(event.end * 1000)
          : new Date(event.start * 1000),
        allDay: event.end ? false : true,
        unit: unitIDMapping[event.unit],
      }));

      // Set the event information
      setEvents(res);
    })();
  }, [queryRange, actionTrigger]);

  // Function to update eventTimes
  const updateTimes = (key, value) => {
    setEventTimes((state) => {
      return { ...state, [key]: value };
    });
  };

  // Function to create event
  const createEvent = () => {
    /*
        INPUT CHECKERS
    */
    // #region

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

    // Check if event tag is empty
    if (eventTag == "") {
      errorToaster("Event tag is empty");
      return;
    }

    // Check if start event times are empty
    if (eventTimes.startHour == "" || eventTimes.startMinute == "") {
      errorToaster("Event start time should not be empty or partially filled");
      return;
    }

    // Check if start event times is greater than the end time, if the end time
    // was provided
    if (eventTimes.endHour != "" || eventTimes.endMinute != "") {
      // Get the unix time of the two dates
      const startTime = new Date(
        `1970-01-01T${eventTimes.startHour}:${eventTimes.startMinute}:00`
      );
      const endTime = new Date(
        `1970-01-01T${eventTimes.endHour}:${eventTimes.endMinute}:00`
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
    // #endregion

    /*
        EVENT CREATION
    */

    // Call API for creating the event
    (async () => {
      // Iterate through every day selected
      for (let item of eventDays) {
        // Variable declaration
        var start_datetime = new Date(item.getTime());
        var end_datetime = null;

        // Calculate unix timestamps for start datetime
        start_datetime.setHours(parseInt(eventTimes.startHour));
        start_datetime.setMinutes(parseInt(eventTimes.startMinute));
        start_datetime = start_datetime.getTime() / 1000;

        // Calculate end datetime if the end dates were presented
        if (eventTimes.endHour != "" && eventTimes.endMinute != "") {
          // Calculate unix timestamps for start datetime
          end_datetime = new Date(item.getTime());
          end_datetime.setHours(parseInt(eventTimes.endHour));
          end_datetime.setMinutes(parseInt(eventTimes.endMinute));
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
            notify_email: eventEmailNotify,
            notify_discord: eventDiscordNotify,
            tag: eventTag,
          },
          Cookies.get("access")
        );
      }

      // Display success
      successToaster("All events created successfully!");
      setActionTrigger(!actionTrigger);
    })();

    // Clear inputs
    setEventRecipient("");
    setEventTitle("");
    setEventTag("");
    setEventDescription("");
    setEventLocation("");
    setEventTimes({
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
    });
    setEventDays([]);
    setEventEmailNotify(false);
    setEventDiscordNotify(false);
  };

  // Function to update the event
  const updateEvent = (info) => {
    // Update the event
    (async () => {
      // Call API endpoint for creation
      var res = await post(
        "/event/update_event/",
        {
          id: info._id,
          name: info.title,
          unit: availableUnits[info.unit],
          description: info.description,
          location: info.location,
          start_datetime: info.start.getTime() / 1000,
          end_datetime: info.end.getTime() / 1000,
          tag: info.tag,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster and trigger
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();

    // Exit out of view
    setSelectedEvent({});
    setModalIsOpen(false);
  };

  // Function to delete the event
  const deleteEvent = () => {
    // Delete the event
    (async () => {
      // Call API endpoint for creation
      var res = await post(
        "/event/delete_event/",
        {
          id: selectedEvent._id,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster and trigger
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();

    // Exit out of view and set trigger
    setSelectedEvent({});
    setModalIsOpen(false);
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
      <div>Make Event</div>
    </button>
  );

  // Component for composer
  const composer = (
    <div
      className="flex max-h-full w-1/3 flex-col gap-5
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
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Event Tag</div>
        <BottomDropDown
          listOfItems={Object.keys(colorFormat)}
          setSelected={(e) => setEventTag(e)}
          defaultValue={eventTag || "Select a Tag"}
          editColor={false}
        />
      </div>
      <div className="flex h-full flex-col gap-1">
        <div className="text-2xl">Event Description</div>
        <div className="h-[30rem]">
          <QuillNoSSRWrapper
            className="h-full pb-[7.3rem]"
            modules={quillConfigs.modules}
            formats={quillConfigs.formats}
            theme="snow"
            value={eventDescription}
            onChange={setEventDescription}
          />
        </div>
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
          <div className="text-xs">
            {eventDays && eventDays.length > 0 ? (
              <p>{eventDays.length} Day(s) Selected</p>
            ) : (
              <p>No days selected</p>
            )}
          </div>
        </div>
        <DayPicker
          showOutsideDays
          mode="multiple"
          selected={eventDays}
          onSelect={setEventDays}
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl">Notify via Discord?</div>
        <ToggleSwitch
          onToggle={setEventDiscordNotify}
          initialState={eventDiscordNotify}
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl">Notify via Email?</div>
        <ToggleSwitch
          onToggle={setEventEmailNotify}
          initialState={eventEmailNotify}
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

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        <div className="flex flex-row-reverse">{toolbarAccess && toolbar}</div>
        <div className="flex h-full w-full flex-row gap-5 overflow-hidden">
          <CalendarComponent
            colorFormatting={colorFormat}
            events={events}
            updateRange={setQueryRange}
            onEventClick={(e) => {
              setModalIsOpen(true);
              setSelectedEvent(e);
            }}
          />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Example Modal"
            className="m-auto w-fit max-w-[60%] border-0 outline-none"
            overlayClassName="flex items-center justify-center bg-black
            bg-opacity-30 fixed inset-0 z-[999]"
          >
            <EventModal
              selectedEvent={selectedEvent}
              units={availableUnits}
              setModalIsOpen={setModalIsOpen}
              colorFormat={colorFormat}
              updateEvent={toolbarAccess ? updateEvent : null}
              deleteEvent={toolbarAccess ? deleteEvent : null}
            />
          </Modal>
          {composerOpen && composer}
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
