// React.js & Next.js libraries
import { useState, useEffect, useContext } from "react";
import React from "react";

// Toaster Components and CSS
import "react-toastify/dist/ReactToastify.css";

// Date Picker imports
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// JS Cookies import
import Cookies from "js-cookie";

// Util imports
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { AutoCompleteInput, TimeInput } from "@/components/input";
import { BottomDropDown } from "@/components/dropdown";
import MetricToolBar from "./_metricToolbar";

// Import unit metric context
import { UnitMetricsAppContext } from "./_context";

// Define customized time input component with special update features
function TimeComponent({ item, onChange }) {
  // Create dummy useStates
  const [hour, setHour] = useState();
  const [minute, setMinute] = useState();

  useEffect(() => {
    onChange();
  }, [hour, minute]);

  // Render time input
  return (
    <TimeInput
      hour={hour}
      setHour={setHour}
      minute={minute}
      setMinute={setMinute}
      id={`${item}`}
    />
  );
}

// Define the add data view
export default function AddDataView() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Define useStates and constants for adding user metrics
  const [insert, setInsert] = useState({});
  const [actionTrigger, setActionTrigger] = useState(false);
  const [result, setResult] = useState(0);
  const [split, setSplit] = useState(0);

  // On change of the toolbar, change the schema of the the insert useState
  useEffect(() => {
    // Build the first parts of the query
    var query = { to_user: "", name: "", datetime_taken: 0 };

    // Set split
    setSplit(c.format.scoring_ids.length == 1 ? 0 : 1);

    // Set input tracker and query string
    setInsert(query);
  }, [c.toolbarSelect]);

  // On change of the action, update inputs
  useEffect(() => {
    // Get a copy of the insert
    var copy = { ...insert };
    delete copy.to_user;
    delete copy.name;
    delete copy.datetime_taken;

    // Prepare the iteration entries
    const iterList = [
      ...c.format.scoring_ids.slice(split),
      ...c.format.info_ids,
    ];
    const iterTypes = [
      ...c.format.scoring_type.slice(split),
      ...c.format.info_type,
    ];

    // Loop through all inputs and see if there's an input it in
    for (let [index, item] of iterList.entries()) {
      // Retrieve values if the iterated scoring info is number format
      if (iterTypes[index] == "number") {
        // Add item to tracker
        copy[item] = +document.getElementById(item).value;
      }

      // Retrieve values if the iterated scoring info is time format
      else if (iterTypes[index] == "time") {
        // Extract hour and minute information
        var hour = document.getElementById(`${item}-hour`).value;
        var minute = document.getElementById(`${item}-minute`).value;
        var formattedHour = +hour;
        var formattedMinute = +minute;

        // Format hours and minutes info
        if (+hour < 10) formattedHour = "0" + +hour;
        if (+minute < 10) formattedMinute = "0" + +minute;

        // Track the information
        copy[item] = `${formattedHour}:${formattedMinute}`;
      }
    }

    // Get a basic test PFA score
    (async () => {
      // Call API endpoint
      var res = await post(
        c.metricGetTestEndpoints[c.toolbarSelect],
        copy,
        Cookies.get("access")
      );

      // If the resulting response is a success, set the result useState
      if (res.status == "success") {
        setResult(res.message);
      }
    })();
  }, [actionTrigger]);

  // Update the query body
  const updateInsert = (id, value) => {
    setInsert((prevState) => ({ ...prevState, [id]: value }));
    setActionTrigger(!actionTrigger);
  };

  // Create metric function
  const createMetric = () => {
    // Get a copy of the insert
    var copy = insert;

    // Update insert for the name
    copy.name = document.getElementById("name").value;

    // Check if Metric Name input is empty
    if (copy.name === "") {
      errorToaster(`Metric Name is empty`);
      return;
    }
    // Check if User input is empty
    if (copy.to_user === "") {
      errorToaster(`User field is empty`);
      return;
    }
    // Check if Date Taken input is empty
    if (copy.datetime_taken === 0) {
      errorToaster(`Date Taken field is empty`);
      return;
    }

    // Prepare the iteration entries
    const iterList = [
      ...c.format.scoring_ids.slice(split),
      ...c.format.info_ids,
    ];
    const iterTypes = [
      ...c.format.scoring_type.slice(split),
      ...c.format.info_type,
    ];
    const iterFormatted = [
      ...c.format.scoring_formatted.slice(split),
      ...c.format.info_formatted,
    ];

    // Loop through all inputs and see if there's an input it in
    for (let [index, item] of iterList.entries()) {
      // Retrieve values if the iterated scoring info is number format
      if (iterTypes[index] == "number") {
        // If the input is empty, send an error
        if (document.getElementById(item).value.length === 0) {
          errorToaster(`${iterFormatted[index]} field is empty`);
          return;
        }

        // Add item to tracker
        copy[item] = +document.getElementById(item).value;
      }

      // Retrieve values if the iterated scoring info is time format
      else if (iterTypes[index] == "time") {
        // Extract hour and minute information
        var hour = document.getElementById(`${item}-hour`).value;
        var minute = document.getElementById(`${item}-minute`).value;

        // If the input is empty, send an error
        if (hour.length === 0 || minute.length === 0) {
          errorToaster(`${iterFormatted[index]} field is empty`);
          return;
        }

        // Copy hour and minute
        var formattedHour = +hour;
        var formattedMinute = +minute;

        // Format hours and minutes info
        if (+hour < 10) formattedHour = "0" + +hour;
        if (+minute < 10) formattedMinute = "0" + +minute;

        // Track the information
        copy[item] = `${formattedHour}:${formattedMinute}`;
      }
    }

    // Send API call to make new metric
    (async () => {
      // Call API endpoint
      var res = await post(
        c.metricAddEndPoints[c.toolbarSelect],
        copy,
        Cookies.get("access")
      );

      // Send success or error messages
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);

      // Trigger context wide action
      c.setActionTrigger(!c.actionTrigger);

      // If the resulting call was successful, wipe all trackers and inputs
      if (res.status == "success") {
        // Clear trackers
        setInsert({ to_user: "", name: "", datetime_taken: 0 });
        setResult(0);

        // Iterate through the inputs and clear them
        // Loop through all inputs and see if there's an input it in
        for (let [index, item] of iterList.entries()) {
          // Retrieve values if the iterated scoring info is number format
          if (iterTypes[index] == "number") {
            // Add item to tracker
            document.getElementById(item).value = "";
          }

          // Retrieve values if the iterated scoring info is time format
          else if (iterTypes[index] == "time") {
            // Extract hour and minute information
            document.getElementById(`${item}-hour`).value = "";
            document.getElementById(`${item}-minute`).value = "";
          }
        }
      }
    })();
  };

  // Define customized selection component for selection type inputs
  const SelectionComponent = ({ type, item }) => (
    <BottomDropDown
      listOfItems={c.format[`${type == 0 ? "info" : "scoring"}_options`][item]}
      setSelected={(e) => {
        updateInsert(item, e);
        setActionTrigger(!actionTrigger);
      }}
      defaultValue={insert[item]}
    />
  );

  // Render AddDataView
  return (
    <>
      <div className="flex w-9/12 flex-col gap-8">
        <MetricToolBar />
        <div
          className="flex w-full flex-row justify-center gap-10
            overflow-auto"
        >
          <div className="flex w-1/4 flex-col p-2">
            <div className="flex flex-col gap-4">
              <div className="text-5xl">Basic Info</div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl">Metric Name</div>
                <input
                  className="rounded-lg border border-silver p-2"
                  id="name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl">User</div>
                <AutoCompleteInput
                  possibleItems={Object.keys(c.unitPersonnel)}
                  onChange={(e) => updateInsert("to_user", c.unitPersonnel[e])}
                  value={
                    insert.to_user == ""
                      ? ""
                      : c.unitPersonnelReverse[insert.to_user]
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl">Date Taken</div>
                <DayPicker
                  showOutsideDays
                  mode="single"
                  className="w-full"
                  style={{ width: "100%" }}
                  selected={new Date(insert.datetime_taken * 1000)}
                  onSelect={(e) => {
                    updateInsert("datetime_taken", Math.floor(e / 1000));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex w-1/4 flex-col gap-5 p-2">
            <div
              className={`flex flex-col gap-4 ${
                c.format.info_ids == undefined
                  ? "hidden"
                  : c.format.info_ids.length == 0
                  ? "hidden"
                  : ""
              }`}
            >
              <div className="text-5xl">User Info</div>
              {c.format.info_ids != undefined &&
                c.format.info_ids.map((item, index) => (
                  <div className="flex flex-col gap-1" key={`info-${index}`}>
                    <div className="text-2xl">
                      {c.format.info_formatted[index]}
                    </div>
                    {c.format.info_type[index] == "selection" && (
                      <SelectionComponent type={0} item={item} />
                    )}
                    {c.format.info_type[index] == "number" && (
                      <input
                        className="rounded-lg border border-silver p-2"
                        onChange={() => setActionTrigger(!actionTrigger)}
                        type="number"
                        id={item}
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-5xl">Scoring</div>
              {c.format.scoring_ids != undefined &&
                c.format.scoring_ids.slice(split).map((item, index) => (
                  <div className="flex flex-col gap-1" key={`score-${index}`}>
                    <div className="text-2xl">
                      {c.format.scoring_formatted.slice(split)[index]}
                    </div>
                    {c.format.scoring_type.slice(split)[index] ==
                      "selection" && (
                      <SelectionComponent type={1} item={item} />
                    )}
                    {c.format.scoring_type.slice(split)[index] == "number" && (
                      <input
                        className="rounded-lg border border-silver p-2"
                        onChange={() => setActionTrigger(!actionTrigger)}
                        type="number"
                        id={item}
                      />
                    )}
                    {c.format.scoring_type.slice(split)[index] == "time" && (
                      <TimeComponent
                        item={item}
                        onChange={() => setActionTrigger(!actionTrigger)}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex h-full w-1/4 flex-col p-2">
            <div className="flex flex-col gap-4">
              <div className="text-5xl">Result</div>
              <div
                className="mb-1.5 flex h-full w-full flex-col items-center
              rounded-lg border border-silver p-2 text-7xl shadow-inner"
              >
                <div
                  className="border-silver bg-gradient-to-tr
                    from-deepOcean to-sky bg-clip-text p-2 font-semibold
                    text-transparent"
                >
                  {result}
                </div>
              </div>
              <button
                onClick={createMetric}
                className="w-fit rounded-lg border border-silver
                  bg-gradient-to-tr from-deepOcean to-sky bg-clip-text p-2
                  text-xl text-transparent transition duration-200 ease-in
                  hover:-translate-y-[0.1rem] hover:border-sky hover:shadow-md
                  hover:shadow-sky"
              >
                Create Metric
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
