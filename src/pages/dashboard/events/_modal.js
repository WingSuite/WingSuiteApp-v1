// React Icons
import { VscCheck, VscChromeClose } from "react-icons/vsc";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Autosize inputs import
import TextareaAutosize from "react-textarea-autosize";
import AutosizeInput from "react-input-autosize";

// Date Picker imports
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Moment import
import moment from "moment";

// Custom components imports
import { errorToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { TimeInput } from "@/components/input";

// Subcomponent to define the contents of the event modal
export default function EventModal({
  selectedEvent,
  units,
  setModalIsOpen,
  deleteEvent = null,
  updateEvent = null,
}) {
  // Define useStates
  const [event, setEvent] = useState(selectedEvent || []);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [timeFrame, setTimeFrame] = useState({
    day: "",
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
  });

  // Set the time frame information on mount
  useEffect(() => {
    // Get the day information and set it to 0000
    var date = new Date(event.start);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    // Set the day
    setTimeFrame((state) => {
      return { ...state, day: date };
    });

    // Set the start hour and minutes
    setTimeFrame((state) => {
      return {
        ...state,
        startHour: event.start.getHours().toString().padStart(2, "0"),
        startMinute: event.start.getMinutes().toString().padStart(2, "0"),
        endHour: event.end.getHours().toString().padStart(2, "0"),
        endMinute: event.end.getMinutes().toString().padStart(2, "0"),
      };
    });
  }, [editMode]);

  // Function to update time frame information
  const updateTimeFrameInfo = (key, value) => {
    // If the value is undefined, return
    if (value == undefined) return;

    // Get a copy of the timeFrame
    var copy = timeFrame;

    // Update the timeFrame;
    copy[key] = value;

    // Variable declaration
    var start_datetime = new Date(copy.day.getTime());
    var end_datetime = new Date(copy.day.getTime());

    // Calculate unix timestamps for start datetime
    if (copy.startHour != "" && copy.startMinute != "") {
      start_datetime.setHours(parseInt(copy.startHour));
      start_datetime.setMinutes(parseInt(copy.startMinute));
    }

    // Calculate end datetime if the end dates were presented
    if (copy.endHour != "" && copy.endMinute != "") {
      end_datetime = new Date(copy.day.getTime());
      end_datetime.setHours(parseInt(copy.endHour));
      end_datetime.setMinutes(parseInt(copy.endMinute));
    }

    // Set the start datetime to the start of the day if the end info is empty
    if (copy.endHour == "" && copy.endMinute == "") {
      start_datetime = new Date(copy.day.getTime());
    }

    // Update event info and save the copy
    updateEventInfo("start", start_datetime);
    updateEventInfo("end", end_datetime);
    setTimeFrame(copy);
  };

  // Function to update event information
  const updateEventInfo = (key, value) => {
    setEvent((state) => {
      return { ...state, [key]: value };
    });
  };

  // "N/A" input keypress handling
  const handleKeyDown = (event) => {
    // Set variables
    const { key } = event;
    const value = event.target.value;

    // Define alphanumeric and punctuation keys
    const permittedKeys = /^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]$/;

    // Prevent backspace and delete keypress if the value is N/A
    if ((key === "Backspace" || key === "Delete") && value === "N/A") {
      event.preventDefault();
    } else if (value == "N/A" && permittedKeys.test(key)) {
      event.target.value = "";
    }
  };

  // Function to verify changes
  const verifyChanges = () => {
    // Check if the Event title is empty
    if (event.title == "") {
      errorToaster("Event title is empty");
      return false;
    }

    // Check if start event times are empty or
    if (timeFrame.startHour == "" || timeFrame.startMinute == "") {
      errorToaster("Event start time should not be empty or partially filled");
      return false;
    }

    // Check if start event times is greater than the end time, if the end time
    // was provided
    if (timeFrame.endHour != "" || timeFrame.endMinute != "") {
      // Get the unix time of the two dates
      const startTime = new Date(
        `1970-01-01T${timeFrame.startHour}:${timeFrame.startMinute}:00`
      );
      const endTime = new Date(
        `1970-01-01T${timeFrame.endHour}:${timeFrame.endMinute}:00`
      );

      // Check if startTime is greater than the endTime
      if (startTime > endTime) {
        errorToaster("Event start time should not be after event end time");
        return;
      }
    }

    // Return true if good
    return true;
  };

  // Render content
  return (
    <div className="flex flex-row">
      <div
        className={`flex flex-col justify-between gap-6 ${
          !editMode ? `rounded-lg` : `rounded-bl-lg rounded-tl-lg`
        } bg-white
        p-6 pt-1 shadow-lg`}
      >
        {Object.keys(event).length != 0 && (
          <div className="flex flex-col text-7xl">
            <AutosizeInput
              className={`${editMode && `text-sky`}`}
              inputStyle={{ background: "transparent" }}
              value={event.title}
              disabled={!editMode}
              onChange={(e) => {
                updateEventInfo("title", e.target.value);
              }}
            />
            {!(event.start.getTime() == event.end.getTime()) ? (
              <div
                className={`${
                  editMode && `text-sky`
                } -mt-2 flex flex-row items-center gap-7 text-5xl`}
              >
                <div className="flex flex-col">
                  <div className="text-3xl">
                    {moment(event.start).format("DD MMM YYYY")}
                  </div>
                  <div>{moment(event.start).format("HHmm")}</div>
                </div>
                <div className="text-2xl">to</div>
                <div className="flex flex-col">
                  <div className="text-3xl">
                    {moment(event.end).format("DD MMM YYYY")}
                  </div>
                  <div>{moment(event.end).format("HHmm")}</div>
                </div>
              </div>
            ) : (
              <div className={`text-3xl ${editMode ? "text-sky" : ""}`}>
                All Day Event
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col">
          <div className="text-3xl font-bold">Unit</div>
          <div className={`text-base ${editMode ? "text-sky" : ""}`}>
            {!editMode ? (
              event.unit
            ) : (
              <BottomDropDown
                listOfItems={Object.keys(units)}
                setSelected={(e) => updateEventInfo("unit", e)}
                defaultValue={event.unit || "Select Unit"}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold">Location</div>
          <AutosizeInput
            className={`${editMode && `text-sky`}`}
            inputStyle={{ background: "transparent" }}
            value={!event.location ? `N/A` : event.location}
            onKeyDown={handleKeyDown}
            disabled={!editMode}
            onChange={(e) => {
              updateEventInfo("location", e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold">Description</div>
          <TextareaAutosize
            className={`resize-none bg-transparent ${editMode && `text-sky`}`}
            value={!event.description ? `N/A` : event.description}
            onKeyDown={handleKeyDown}
            disabled={!editMode}
            onChange={(e) => {
              updateEventInfo("description", e.target.value);
            }}
          />
        </div>
        <div className="flex flex-row gap-5">
          <button
            onClick={() => {
              setModalIsOpen(false);
              setDeleteMode(false);
              setEditMode(false);
            }}
            className="mt-4 rounded-lg border border-transparent px-1
          py-0.5 text-left text-black transition duration-200 ease-in
          hover:-translate-y-[0.1rem] hover:border-sky hover:text-sky
          hover:shadow-md"
          >
            Close
          </button>
          {!editMode && !deleteMode && updateEvent != null && (
            <button
              onClick={() => {
                setEditMode(true);
              }}
              className="mt-4 rounded-lg border border-transparent px-1
            py-0.5 text-left text-sky transition duration-200 ease-in
            hover:-translate-y-[0.1rem] hover:border-sky hover:text-sky
            hover:shadow-md"
            >
              Edit
            </button>
          )}
          {editMode && updateEvent != null && (
            <div
              className="mt-4 flex flex-row gap-2 rounded-lg border border-sky
            px-1 py-0.5 text-left text-sky "
            >
              <div>Save Changes?</div>
              <button
                className="transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-sky"
                onClick={() => {
                  setEvent(selectedEvent);
                  setEditMode(false);
                }}
              >
                <VscChromeClose />
              </button>
              <button
                className="mr-0.5 transition duration-200 ease-in
                hover:-translate-y-[0.1rem] hover:text-sky"
                onClick={() => {
                  if (verifyChanges()) {
                    updateEvent(event);
                    setEditMode(false);
                  }
                }}
              >
                <VscCheck />
              </button>
            </div>
          )}
          {!deleteMode && !editMode && deleteEvent != null && (
            <button
              onClick={() => setDeleteMode(true)}
              className="mt-4 rounded-lg border border-transparent px-1
            py-0.5 text-left text-darkScarlet transition duration-200 ease-in
            hover:-translate-y-[0.1rem] hover:border-sky hover:text-sky
            hover:shadow-md"
            >
              Delete
            </button>
          )}
          {deleteMode && deleteEvent != null && (
            <div
              className="mt-4 flex flex-row gap-2 rounded-lg border
            border-darkScarlet px-1 py-0.5 text-left text-darkScarlet "
            >
              <div>Are You Sure?</div>
              <button
                className="transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-scarlet"
                onClick={() => setDeleteMode(false)}
              >
                <VscChromeClose />
              </button>
              <button
                className="mr-0.5 transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-scarlet"
                onClick={deleteEvent}
              >
                <VscCheck />
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${
          !editMode && `hidden`
        } flex flex-col items-center gap-10 rounded-br-lg rounded-tr-lg
        bg-white p-6 drop-shadow-xl`}
      >
        <div className="text-4xl">Edit Time Frame</div>
        <div>
          <DayPicker
            showOutsideDays
            mode="single"
            selected={event.start}
            onSelect={(e) => {
              updateTimeFrameInfo("day", e);
            }}
          />
        </div>

        <div className="flex flex-row items-center gap-2 text-2xl">
          From
          <div className="text-sky">
            <TimeInput
              hour={timeFrame.startHour}
              setHour={(e) => {
                updateTimeFrameInfo("startHour", e);
              }}
              minute={timeFrame.startMinute}
              setMinute={(e) => {
                updateTimeFrameInfo("startMinute", e);
              }}
            />
          </div>
          to
          <div className="text-sky">
            <TimeInput
              hour={timeFrame.endHour}
              setHour={(e) => {
                updateTimeFrameInfo("endHour", e);
              }}
              minute={timeFrame.endMinute}
              setMinute={(e) => {
                updateTimeFrameInfo("endMinute", e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
