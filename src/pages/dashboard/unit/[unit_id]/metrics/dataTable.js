// React Icons
import {
  VscEdit,
  VscTrash,
  VscCheck,
  VscChromeClose,
} from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect, useContext } from "react";
import React from "react";

// JS Cookies import
import Cookies from "js-cookie";

// Autosize inputs import
import AutosizeInput from "react-input-autosize";

// Util imports
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { MetricToolBar } from "./metricToolbar";

// Import unit metric context
import { UnitMetricsAppContext } from "./context";

// Define the data table view
export function DataTableView() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Define useState for this component
  const [filteredData, setFilteredData] = useState([]);

  // On mount, set the filtered data
  useEffect(() => {
    // Develope a copy of the data
    const copy = c.data;

    // Set the filtered data
    setFilteredData(copy.filter((item) => item.name == c.xAxisSelection));
  }, [c.xAxisSelection]);

  // Update handler for table view
  const handleUpdate = (id, value) => {
    c.setEditItem((prevState) => ({ ...prevState, [id]: value }));
  };

  // Update selected metric
  const updateSelected = () => {
    // Grab a copy of the editItem
    var copy = c.editItem;

    // If composite score is the only value, then just update that
    if (c.selectionMap.length == 1) {
      (async () => {
        // Make the composite score a float
        copy.composite_score = Number(copy.composite_score);

        // Send API call
        var res = await post(
          c.metricEditEndPoints[c.toolbarSelect],
          copy,
          Cookies.get("access")
        );

        // Send a message if there was an error or success; then trigger
        if (res.status == "error") errorToaster(res.message);
        if (res.status == "success") successToaster(res.message);
        c.setActionTrigger(!c.actionTrigger);
      })();
      return true;
    }

    // Build temporary mappings and variables
    var body = {};
    const temp_map = c.selectionMap.reduce((dict, row, index) => {
      dict[row] = index;
      return dict;
    }, {});

    // Build the first parts of the query
    body = { id: copy.id, subscores: {} };
    delete copy.id;

    // Clean up for copy iteration
    delete copy.composite_score;

    // ** SPECIAL **
    // Iterate through the resulting copy and check if they are in the correct
    // format
    for (var item in copy) {
      // Ensure if an iterated time input is in "mm:ss" format
      if (c.dataTypes[temp_map[item]] == "time") {
        // Check if in right format
        const [mins, secs] = copy[item].split(":");
        const isValid =
          mins.length === 2 &&
          mins >= 0 &&
          mins < 60 &&
          secs.length === 2 &&
          secs >= 0 &&
          secs < 60;

        // Return false and send error message if not
        if (!isValid) {
          errorToaster(
            `The ${
              c.metricToolbarItems[temp_map[item]]
            } value was not formatted correctly`
          );
          return false;
        }

        // Add to the body content
        body.subscores[item] = copy[item];
      }

      // Ensure that number formats are in integer value
      else if (c.dataTypes[temp_map[item]] == "number")
        body.subscores[item] = Number(copy[item]);
    }

    // Send and process API
    (async () => {
      // Send API call
      var res = await post(
        c.metricEditEndPoints[c.toolbarSelect],
        body,
        Cookies.get("access")
      );

      // Send a message if there was an error or success; then trigger
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);
      c.setActionTrigger(!c.actionTrigger);
    })();
    return true;
  };

  // Delete selected metric datapoint
  const deleteSelected = (id) => {
    (async () => {
      // Send API call
      var res = await post(
        c.metricDeleteEndPoints[c.toolbarSelect],
        { id: id },
        Cookies.get("access")
      );

      // Send a message if there was an error or success; then trigger
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);
      c.setActionTrigger(!c.actionTrigger);
    })();
  };

  // Render table head
  const tableHead = (
    <thead>
      <tr>
        <th
          className="bg-gray-50 text-gray-500 px-6 py-3 text-left text-xs
          font-medium uppercase leading-4 tracking-wider"
        >
          Name
        </th>
        <th
          className="bg-gray-50 text-gray-500 px-6 py-3 text-left text-xs
          font-medium uppercase leading-4 tracking-wider"
        >
          Unit
        </th>
        {c.metricToolbarItems.map((item, index) => (
          <th
            className="bg-gray-50 text-gray-500 cursor-pointer px-6 py-3
            text-left text-xs font-medium uppercase leading-4 tracking-wider"
            key={`table-${item}`}
            onClick={() => c.setMetricToolbarSelect(index)}
          >
            {item}
          </th>
        ))}
        <th className="bg-gray-50 px-6 py-3"></th>
      </tr>
    </thead>
  );

  // Render the table body row for the metric values
  const TableBodyRowMetricValues = ({item}) => (
    <>
      {c.metricToolbarItems.map((metric, index) => (
        <td
          className="bg-gray-50 text-gray-500 px-6 py-3 text-left text-xs
          font-medium uppercase leading-4 tracking-wider"
          key={`table-${metric}`}
        >
          {c.isUpdating[item.id] &&
          (index != 0 || c.metricToolbarItems.length == 1) ? (
            <AutosizeInput
              placeholder="00"
              id="hour"
              pattern="[0-9]*"
              maxLength={c.dataTypes[index] == "time" ? "5" : "2"}
              value={c.editItem[c.selectionMap[index]]}
              className="text-sky"
              onKeyDown={(event) =>
                (c.dataTypes[index] == "time"
                  ? !/[0-9:]/.test(event.key)
                  : !/[0-9.]/.test(event.key)) &&
                !(event.key === "Backspace") &&
                !(event.key === "Delete") &&
                !(event.key === "Tab") &&
                !(event.key === "ArrowLeft") &&
                !(event.key === "ArrowRight") &&
                event.preventDefault()
              }
              onChange={(e) =>
                handleUpdate(c.selectionMap[index], e.target.value)
              }
            />
          ) : (
            c.specialProcess[c.dataTypes[index]](item[c.selectionMap[index]])
          )}
        </td>
      ))}
    </>
  );

  // Render table body
  const tableBody = (
    <tbody>
      {filteredData.map((item) => (
        <tr key={item.id}>
          <td
            className="whitespace-no-wrap text-gray-500 px-6 py-2 text-sm
            leading-5"
          >
            {item.user}
          </td>
          <td
            className="whitespace-no-wrap text-gray-500 px-6 py-2 text-sm
            leading-5"
          >
            {item.unit}
          </td>
          <TableBodyRowMetricValues item={item}/>
          <td
            className="whitespace-no-wrap px-6 py-2 text-right text-sm
            font-medium leading-5"
          >
            {c.isDeleting[item.id] ? (
              <>
                <button
                  className="text-scarlet"
                  onClick={() => {
                    deleteSelected(item.id);
                    c.setIsDeleting((prevState) => ({
                      ...prevState,
                      [item.id]: false,
                    }));
                  }}
                >
                  <IconContext.Provider value={{ size: "1.5em" }}>
                    <VscCheck />
                  </IconContext.Provider>
                </button>
                <button
                  className="ml-4 text-scarlet"
                  onClick={() =>
                    c.setIsDeleting((prevState) => ({
                      ...prevState,
                      [item.id]: false,
                    }))
                  }
                >
                  <IconContext.Provider value={{ size: "1.5em" }}>
                    <VscChromeClose />
                  </IconContext.Provider>
                </button>
              </>
            ) : c.isUpdating[item.id] ? (
              <>
                <button
                  className="text-sky"
                  onClick={() => {
                    c.setEditItem({});
                    c.setIsUpdating((prevState) => ({
                      ...prevState,
                      [item.id]: false,
                    }));
                  }}
                >
                  <IconContext.Provider value={{ size: "1.5em" }}>
                    <VscChromeClose />
                  </IconContext.Provider>
                </button>
                <button
                  className="ml-4 text-sky"
                  onClick={() => {
                    var result = updateSelected();
                    if (result) {
                      c.setEditItem({});
                      c.setIsUpdating((prevState) => ({
                        ...prevState,
                        [item.id]: false,
                      }));
                    }
                  }}
                >
                  <IconContext.Provider value={{ size: "1.5em" }}>
                    <VscCheck />
                  </IconContext.Provider>
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-blue-600 hover:text-blue-900"
                  onClick={() => {
                    Object.keys(c.editItem).length == 0 &&
                      c.setEditItem(
                        c.metricToolbarItems.reduce((dict, pt, index) => {
                          dict[c.selectionMap[index]] = c.specialProcess[
                            c.dataTypes[index]
                          ](item[c.selectionMap[index]]);
                          dict.id = item.id;
                          return dict;
                        }, {})
                      );
                    Object.keys(c.editItem).length == 0 &&
                      c.setIsUpdating((prevState) => ({
                        ...prevState,
                        [item.id]: true,
                      }));
                  }}
                >
                  <IconContext.Provider value={{ size: "1.5em" }}>
                    <VscEdit />
                  </IconContext.Provider>
                </button>
                <button
                  className="text-red-600 hover:text-red-900 ml-4"
                  onClick={() =>
                    c.setIsDeleting((prevState) => ({
                      ...prevState,
                      [item.id]: true,
                    }))
                  }
                >
                  <IconContext.Provider value={{ size: "1.5em" }}>
                    <VscTrash />
                  </IconContext.Provider>
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );

  // Render the data table
  return (
    <div className="flex w-9/12 flex-col gap-2">
      <MetricToolBar />
      <div className="flex flex-col overflow-y-auto">
        <table className="divide-gray-200 min-w-full divide-y">
          {tableHead}
          {tableBody}
        </table>
      </div>
    </div>
  );
}
