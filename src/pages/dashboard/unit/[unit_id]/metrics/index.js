// ReChart imports
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

// React Icons
import {
  VscGraphScatter,
  VscTable,
  VscNewFile,
  VscEdit,
  VscTrash,
  VscCheck,
  VscChromeClose,
} from "react-icons/vsc";
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

// Autosize inputs import
import AutosizeInput from "react-input-autosize";

// Config imports
import { permissionsList, config } from "@/config/config";

// Util imports
import * as statCalc from "@/utils/statsAnalysis";
import { getSeconds, getFormattedTime } from "@/utils/time";
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import { StatCard } from "@/components/cards";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitMetricsPage() {
  // Define router and get unit ID from URL
  const router = useRouter();
  const { unit_id } = router.query;

  // Define useStates and other constants
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [metricToolbarSelect, setMetricToolbarSelect] = useState(0);
  const [xAxisSelection, setXAxisSelection] = useState(0);
  const [viewSelect, setViewSelect] = useState(0);
  const [data, setData] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [nameMappings, setNameMappings] = useState([[], []]);
  const [unitMappings, setUnitMappings] = useState([[], []]);
  const [selectionMap, setSelectionMap] = useState([]);
  const [metricToolbarItems, setMetricToolbarItems] = useState([]);
  const [dataStats, setDataStats] = useState([]);
  const [isDeleting, setIsDeleting] = useState({});
  const [isUpdating, setIsUpdating] = useState({});
  const [editItem, setEditItem] = useState({});
  const [actionTrigger, setActionTrigger] = useState(false);
  const toolbarItems = ["PFA", "Warrior Knowledge"];
  const metricFetchEndPoints = [
    "/unit/get_all_pfa_data/",
    "/unit/get_all_warrior_data/",
  ];
  const metricEditEndPoints = [
    "/statistic/pfa/update_pfa/",
    "/statistic/warrior/update_warrior/",
  ];
  const metricDeleteEndPoints = [
    "/statistic/pfa/delete_pfa/",
    "/statistic/warrior/delete_warrior/",
  ];

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Set useStates
    setMetricToolbarSelect(0);

    // Fetch unit ID mapping
    var unitMap = JSON.parse(localStorage.getItem("unitIDMap"));
    unitMap = Object.entries(unitMap).reduce(
      (acc, [key, value]) => ({ ...acc, [value]: key }),
      {}
    );

    // Return if unit_id is undefined
    if (unit_id == undefined) return;

    // Get the user's metric data
    (async () => {
      // Call API to get the unit's data
      var res = await post(
        metricFetchEndPoints[toolbarSelect],
        { id: unitMap[unit_id] || "" },
        Cookies.get("access")
      );

      // Send a message if there was an error
      if (res.status == "error")
        errorToaster("Error occurred fetching unit data");

      // Extract util mappings from response and save that information
      setSelectionMap(res.values);
      setDataTypes(res.values_type);
      setMetricToolbarItems(res.values_formatted);

      // Compile the data
      var data = [];
      for (let unit in res.message) {
        for (let stat of res.message[unit]) {
          // Track subscore info
          var subscoreInfo = {};
          for (let [idx, subscore] of res.values.slice(1).entries()) {
            if (res.values_type[idx + 1] == "time")
              subscoreInfo[subscore] = getSeconds(stat.subscores[subscore]);
            else subscoreInfo[subscore] = stat.subscores[subscore];
          }

          // Push compilation information
          data.push({
            id: stat._id,
            unit: unit,
            time: stat.datetime_taken,
            name: stat.name,
            user: stat.full_name,
            composite_score: stat.composite_score,
            ...subscoreInfo,
          });
        }
      }
      data = data.sort((a, b) => a.time - b.time);

      // Process and get mappings for unit values
      var unitValues = [...new Set(data.map((item) => item.unit))];
      var unitValuesMap = Object.fromEntries(
        unitValues.map((value, index) => [value, index])
      );
      var nameValues = [...new Set(data.map((item) => item.name))];
      var nameValuesMap = Object.fromEntries(
        nameValues.map((value, index) => [value, index])
      );

      // Save mappings
      setUnitMappings([unitValues, unitValuesMap]);
      setNameMappings([nameValues, nameValuesMap]);

      // Format and save data
      data = data.map((item) => ({ ...item, name: nameValuesMap[item.name] }));
      setData(data);
    })();
  }, [unit_id, toolbarSelect, actionTrigger]);

  // Calculate average statistics
  useEffect(() => {
    // Return if unit_id is undefined
    if (data.length == 0) return;

    // Copy data for cleaner code
    const metric = selectionMap[metricToolbarSelect];
    const exam = xAxisSelection;

    // Setup a data stat variable to compile stats
    var stats = [];

    // Compile data
    stats.push(statCalc.numOfDataPoints(data, metric, exam));
    stats.push(statCalc.numOfUniqueUnits(data, metric, exam));
    stats.push(statCalc.overallAvgMetricValue(data, metric, exam));
    stats.push(statCalc.overallStdDev(data, metric, exam));
    stats.push(statCalc.avgMetricValuePerUnit(data, metric, exam));
    stats.push(statCalc.stdDevPerUnit(data, metric, exam));

    // Remove any stats that have NaN values
    stats[4] = Object.fromEntries(
      Object.entries(stats[4]).filter(([key, value]) => !Number.isNaN(value))
    );
    stats[5] = Object.fromEntries(
      Object.entries(stats[5]).filter(([key, value]) => !Number.isNaN(value))
    );

    // Save data
    setDataStats(stats);

    // Set the isDeleting and isUpdating tracker
    const copy = data.reduce((dict, row) => {
      dict[row._id] = false;
      return dict;
    }, {});
    setIsDeleting(copy);
    setIsUpdating(copy);
  }, [data, metricToolbarSelect, xAxisSelection]);

  // Update handler for table view
  const handleUpdate = (id, value) => {
    setEditItem((prevState) => ({ ...prevState, [id]: value }));
  };

  // Update selected metric
  const updateSelected = () => {
    // Grab a copy of the editItem
    var copy = editItem;

    // If composite score is the only value, then just update that
    if (selectionMap.length == 1) {
      (async () => {
        // Make the composite score a float
        copy.composite_score = Number(copy.composite_score);

        // Send API call
        var res = await post(
          metricEditEndPoints[toolbarSelect],
          copy,
          Cookies.get("access")
        );

        // Send a message if there was an error or success; then trigger
        if (res.status == "error") errorToaster(res.message);
        if (res.status == "success") successToaster(res.message);
        setActionTrigger(!actionTrigger);
      })();
      return true;
    }

    // Build temporary mappings and variables
    var body = {};
    const temp_map = selectionMap.reduce((dict, row, index) => {
      dict[row] = index;
      return dict;
    }, {});

    // Build the first parts of the query
    body = { id: copy.id, subscores: {} };
    delete copy.id;

    // Clean up for copy iteration
    delete copy.composite_score;

    // Iterate through the resulting copy and check if they are in the correct
    // format
    for (var item in copy) {
      // Ensure if an iterated time input is in "mm:ss" format
      if (dataTypes[temp_map[item]] == "time") {
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
              metricToolbarItems[temp_map[item]]
            } value was not formatted correctly`
          );
          return false;
        }

        // Add to the body content
        body.subscores[item] = copy[item];
      }

      // Ensure that number formats are in integer value
      else if (dataTypes[temp_map[item]] == "number")
        body.subscores[item] = Number(copy[item]);
    }

    // Send and process API
    (async () => {
      // Send API call
      var res = await post(
        metricEditEndPoints[toolbarSelect],
        body,
        Cookies.get("access")
      );

      // Send a message if there was an error or success; then trigger
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();
    return true;
  };

  // Delete selected metric datapoint
  const deleteSelected = (id) => {
    (async () => {
      // Send API call
      var res = await post(
        metricDeleteEndPoints[toolbarSelect],
        { id: id },
        Cookies.get("access")
      );

      // Send a message if there was an error or success; then trigger
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();
  };

  // Create default tooltip
  const DefaultToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Get the value of the selected information
      const value = payload[0].payload[selectionMap[metricToolbarSelect]];

      // Render tooltip
      return (
        <div className="custom-tooltip rounded-lg border border-silver bg-white p-2">
          <div className="text-2xl">
            {nameMappings[0][payload[0].payload.name]}
          </div>
          <div className="text-lg">{payload[0].payload.user}</div>
          <div className="text-lg">{payload[0].payload.unit}</div>
          <div className="text-sky">
            {`${metricToolbarItems[metricToolbarSelect]} : ${
              dataTypes[metricToolbarSelect] == "time"
                ? getFormattedTime(value)
                : value
            }`}
          </div>
        </div>
      );
    }
    return null;
  };

  // Define custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex w-full flex-row justify-center gap-4">
        {payload.map((entry, index) => (
          <div
            key={`${index}-${entry.payload.name}`}
            className="flex flex-row items-center justify-center gap-2"
          >
            <svg height="20" width="20">
              <circle
                cx="10"
                cy="10"
                r="10"
                fill={
                  config.colorOrder[
                    unitMappings[1][entry.payload.name] %
                      config.colorOrder.length
                  ]
                }
              />
            </svg>
            <p key={`item-${index}`}>{entry.value}</p>
          </div>
        ))}
      </div>
    );
  };

  // Define custom tick
  const CustomTick = (props) => {
    return (
      <g transform={`translate(${props.x},${props.y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          style={{ cursor: "pointer" }}
        >
          {nameMappings[0][props.payload.value]}
        </text>
      </g>
    );
  };

  // Subcomponent for toolbar
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
                : `border-silver hover:border-sky hover:text-sky`
            }`}
            onClick={() => setToolbarSelect(index)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  // Subcomponent for toolbar
  const metricToolbar = (
    <div className="flex flex-row justify-between">
      <div className="flex w-fit flex-row items-center  gap-4">
        {viewSelect == 1 && (
          <div>
            <BottomDropDown
              listOfItems={nameMappings[0]}
              setSelected={(e) => setXAxisSelection(nameMappings[1][e])}
              defaultValue={nameMappings[0][xAxisSelection] || "Select Unit"}
            />
          </div>
        )}
        {viewSelect == 0 &&
          metricToolbarItems.map((item, index) => (
            <button
              key={`toolbarItems-${item}`}
              className={`h-full w-fit rounded-lg border px-2 py-1 text-base
              transition duration-200 ease-in hover:-translate-y-[0.1rem]
              hover:shadow-lg ${
                metricToolbarSelect == index
                  ? `border-sky text-sky hover:border-sky`
                  : `border-silver hover:border-sky hover:text-sky`
              }`}
              onClick={() => setMetricToolbarSelect(index)}
            >
              {item}
            </button>
          ))}
      </div>
      <div className="flex flex-row gap-4">
        <button
          className={`rounded-lg border border-silver px-2 pb-1 pt-2 transition
          duration-200 ease-in hover:-translate-y-[0.1rem] hover:border-sky
           hover:text-sky hover:shadow-lg ${
             viewSelect == 0 && `border-sky text-sky`
           }`}
          onClick={() => setViewSelect(0)}
        >
          <IconContext.Provider value={{ size: "1.5em" }}>
            <VscGraphScatter />
          </IconContext.Provider>
        </button>
        <button
          className={`rounded-lg border border-silver p-2 pr-1.5 transition
          duration-200 ease-in hover:-translate-y-[0.1rem] hover:border-sky
          hover:text-sky hover:shadow-lg ${
            viewSelect == 1 && `border-sky text-sky`
          }`}
          onClick={() => setViewSelect(1)}
        >
          <IconContext.Provider value={{ size: "1.5em" }}>
            <VscTable />
          </IconContext.Provider>
        </button>
        <button
          className={`rounded-lg border border-silver p-2 transition
          duration-200 ease-in hover:-translate-y-[0.1rem] hover:border-sky
          hover:text-sky hover:shadow-lg ${
            viewSelect == 2 && `border-sky text-sky`
          }`}
          onClick={() => setViewSelect(2)}
        >
          <IconContext.Provider value={{ size: "1.5em" }}>
            <VscNewFile />
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );

  // Subcomponent for the scatter plot
  const scatterPlot = (
    <div className="flex w-9/12 flex-col gap-8">
      <div>{metricToolbar}</div>
      <ResponsiveContainer width="100%" height="91%">
        <ScatterChart margin={{ right: 30 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="name"
            name="Metric Datapoint"
            tickFormatter={(value) => nameMappings[0][value]}
            ticks={Object.values(nameMappings[1])}
            tick={<CustomTick />}
            padding={{ left: 40, right: 40 }}
            onClick={(e) => setXAxisSelection(e.value)}
          />
          <YAxis
            type="number"
            tickFormatter={
              dataTypes[metricToolbarSelect] == "time"
                ? getFormattedTime
                : (e) => e
            }
            dataKey={selectionMap[metricToolbarSelect]}
            name="Score Value"
            domain={[0, 100]}
            padding={{ bottom: 40 }}
          />
          <Tooltip content={<DefaultToolTip />} />
          <Tooltip />
          {metricToolbarSelect == 0 && (
            <ReferenceLine y={75} stroke="red" label="Failure Point" />
          )}
          {unitMappings[0].map((unit, index) => (
            <Scatter
              key={index}
              name={unit}
              shape={(props) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={7}
                  fill={
                    config.colorOrder[
                      unitMappings[1][unit] % config.colorOrder.length
                    ]
                  }
                />
              )}
              data={data.filter((item) => item.unit === unit)}
            />
          ))}
          <Legend content={<CustomLegend />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );

  // Subcomponent for table
  const dataTable = (
    <div className="flex w-9/12 flex-col gap-2">
      <div>{metricToolbar}</div>
      <div className="flex flex-col overflow-y-auto">
        <table className="divide-gray-200 min-w-full divide-y">
          <thead>
            <tr>
              <th
                className="bg-gray-50 text-gray-500 px-6 py-3 text-left
                text-xs font-medium uppercase leading-4 tracking-wider"
              >
                Name
              </th>
              <th
                className="bg-gray-50 text-gray-500 px-6 py-3 text-left
                text-xs font-medium uppercase leading-4 tracking-wider"
              >
                Unit
              </th>
              {metricToolbarItems.map((item, index) => (
                <th
                  className="bg-gray-50 text-gray-500 cursor-pointer px-6 py-3
                  text-left text-xs font-medium uppercase leading-4
                  tracking-wider"
                  key={`table-${item}`}
                  onClick={() => setMetricToolbarSelect(index)}
                >
                  {item}
                </th>
              ))}
              <th className="bg-gray-50 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) => item.name == xAxisSelection)
              .map((item) => (
                <tr key={item.id}>
                  <td
                    className="whitespace-no-wrap text-gray-500 px-6 py-2
                    text-sm leading-5"
                  >
                    {item.user}
                  </td>
                  <td
                    className="whitespace-no-wrap text-gray-500 px-6 py-2
                    text-sm leading-5"
                  >
                    {item.unit}
                  </td>
                  {metricToolbarItems.map((metric, index) => (
                    <td
                      className="bg-gray-50 text-gray-500 px-6 py-3 text-left
                      text-xs font-medium uppercase leading-4 tracking-wider"
                      key={`table-${metric}`}
                    >
                      {isUpdating[item.id] &&
                      (index != 0 || metricToolbarItems.length == 1) ? (
                        <AutosizeInput
                          placeholder="00"
                          id="hour"
                          pattern="[0-9]*"
                          maxLength={dataTypes[index] == "time" ? "5" : "2"}
                          value={editItem[selectionMap[index]]}
                          className="text-sky"
                          onKeyDown={(event) =>
                            (dataTypes[index] == "time"
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
                            handleUpdate(selectionMap[index], e.target.value)
                          }
                        />
                      ) : dataTypes[index] == "time" ? (
                        getFormattedTime(item[selectionMap[index]])
                      ) : (
                        item[selectionMap[index]]
                      )}
                    </td>
                  ))}
                  <td
                    className="whitespace-no-wrap px-6 py-2 text-right
                      text-sm font-medium leading-5"
                  >
                    {isDeleting[item.id] ? (
                      <>
                        <button
                          className="text-scarlet"
                          onClick={() => {
                            deleteSelected(item.id);
                            setIsDeleting((prevState) => ({
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
                            setIsDeleting((prevState) => ({
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
                    ) : isUpdating[item.id] ? (
                      <>
                        <button
                          className="text-sky"
                          onClick={() => {
                            setEditItem({});
                            setIsUpdating((prevState) => ({
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
                              setEditItem({});
                              setIsUpdating((prevState) => ({
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
                            Object.keys(editItem).length == 0 &&
                              setEditItem(
                                metricToolbarItems.reduce((dict, pt, index) => {
                                  dict[selectionMap[index]] =
                                    dataTypes[index] == "time"
                                      ? getFormattedTime(
                                          item[selectionMap[index]]
                                        )
                                      : item[selectionMap[index]];
                                  dict.id = item.id;
                                  return dict;
                                }, {})
                              );
                            Object.keys(editItem).length == 0 &&
                              setIsUpdating((prevState) => ({
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
                            setIsDeleting((prevState) => ({
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
        </table>
      </div>
    </div>
  );

  // Subcomponent for adding data point
  const addDataPoint = (
    <div className="flex w-9/12 flex-col gap-8">
      <div>{metricToolbar}</div>
      Data
    </div>
  );

  // Subcomponent for stat track
  const statisticsBoard = (
    <div className="flex max-h-full w-3/12 flex-col gap-5 overflow-y-auto">
      <div className="flex flex-col gap-2 text-4xl">
        <div>Statistics for</div>
        <div
          className="bg-gradient-to-r from-deepOcean to-sky
          bg-clip-text font-bold text-transparent"
        >
          {nameMappings[0][xAxisSelection]}
        </div>
      </div>
      <div className="flex max-h-full flex-col gap-5 overflow-y-auto p-2">
        <StatCard
          keyContent={`Number of Datapoints`}
          valueContent={dataStats.length != 0 && dataStats[0]}
        />
        <StatCard
          keyContent={`Number of Units`}
          valueContent={dataStats.length != 0 && dataStats[1]}
        />
        <StatCard
          keyContent={
            `Overall Average ` + `${metricToolbarItems[metricToolbarSelect]}`
          }
          valueContent={
            dataStats.length != 0 &&
            (dataTypes[metricToolbarSelect] == "time"
              ? getFormattedTime(dataStats[2])
              : parseFloat(dataStats[2].toFixed(2)))
          }
        />
        <StatCard
          keyContent={
            `Overall Standard Deviation ` +
            `${metricToolbarItems[metricToolbarSelect]}`
          }
          valueContent={
            dataStats.length != 0 &&
            (dataTypes[metricToolbarSelect] == "time"
              ? getFormattedTime(dataStats[3])
              : parseFloat(dataStats[3].toFixed(2)))
          }
        />
        <StatCard
          keyContent={
            `Average ` + `${metricToolbarItems[metricToolbarSelect]} Per Unit`
          }
          valueContent={
            <div className="w-full truncate text-lg">
              {dataStats.length != 0 && (
                <table>
                  <tbody>
                    {Object.entries(dataStats[4]).map(([key, value], index) => (
                      <tr key={index}>
                        <td className="text-2xl text-black">{key}</td>
                        <td
                          className="bg-gradient-to-r from-deepOcean to-sky
                          bg-clip-text pl-4 text-2xl font-bold text-transparent"
                        >
                          {dataTypes[metricToolbarSelect] == "time"
                            ? getFormattedTime(value)
                            : parseFloat(value.toFixed(2))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          }
        />
        <StatCard
          keyContent={
            `Standard Deviation ` +
            `${metricToolbarItems[metricToolbarSelect]} Per Unit`
          }
          valueContent={
            <div className="w-full truncate text-lg">
              {dataStats.length != 0 && (
                <table>
                  <tbody>
                    {Object.entries(dataStats[5]).map(([key, value], index) => (
                      <tr key={index}>
                        <td className="text-2xl text-black">{key}</td>
                        <td
                          className="bg-gradient-to-r from-deepOcean to-sky
                          bg-clip-text pl-4 text-2xl font-bold text-transparent"
                        >
                          {dataTypes[metricToolbarSelect] == "time"
                            ? getFormattedTime(value)
                            : parseFloat(value.toFixed(2))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          }
        />
      </div>
    </div>
  );

  // Define the view subcomponent list
  const viewList = [scatterPlot, dataTable, addDataPoint];

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-screen w-full flex-col overflow-y-auto">
        <PageTitle className="flex-none" />
        <div
          className="flex h-full w-full flex-col gap-4
          overflow-y-auto"
        >
          {toolbar}
          {data.length == 0 ? (
            <div className="h-full">
              <Nothing
                mainText="No Data Recorded"
                subText="* Cricket Chirps *"
              />
            </div>
          ) : (
            <div className="flex max-h-full w-full flex-row gap-8 overflow-y-auto pt-1">
              {viewList[viewSelect]}
              {statisticsBoard}
            </div>
          )}
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
