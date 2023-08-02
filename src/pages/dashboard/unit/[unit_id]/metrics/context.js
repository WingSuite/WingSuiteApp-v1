// React.js & Next.js libraries
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { endPointsList } from "@/config/config";

// Util imports
import * as statCalc from "@/utils/statsAnalysis";
import { authCheck } from "@/utils/authCheck";
import { getSeconds } from "@/utils/time";
import { get, post } from "@/utils/call";

// Custom components imports
import { errorToaster } from "@/components/toasters";
import { getFormattedTime } from "@/utils/time";
import { DataTableView } from "./dataTable";
import { ScatterPlotView } from "./scatterPlotView";
import { AddDataView } from "./addDataPoint";

// Develop app context for page
export const UnitMetricsAppContext = createContext();

// Define page app provider
export function UnitMetricsAppProvider({ children }) {
  // Define router and get unit ID from URL
  const router = useRouter();
  const { unit_id } = router.query;

  // Data and data tracking related useStates
  const [unitPersonnel, setUnitPersonnel] = useState({});
  const [unitPersonnelReverse, setUnitPersonnelReverse] = useState({});
  const [editItem, setEditItem] = useState({});
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);

  // Selection based and tracking useStates
  const [metricToolbarSelect, setMetricToolbarSelect] = useState(0);
  const [xAxisSelection, setXAxisSelection] = useState(0);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [isDeleting, setIsDeleting] = useState({});
  const [isUpdating, setIsUpdating] = useState({});
  const [viewSelect, setViewSelect] = useState(0);

  // Mapper useStates
  const [nameMappings, setNameMappings] = useState([[], []]);
  const [unitMappings, setUnitMappings] = useState([[], []]);
  const [dataStats, setDataStats] = useState([]);
  const [format, setFormat] = useState({});

  // Page related useStates
  const [actionTrigger, setActionTrigger] = useState(false);

  // View mappings
  const viewList = [<ScatterPlotView />, <DataTableView />, <AddDataView />];
  const toolbarItems = ["PFA", "Warrior Knowledge"];

  // Special Process mapping
  const specialProcess = {
    time: getFormattedTime,
    number: (e) => {
      return Number(e);
    },
  };

  // Endpoint mappings
  const metricAddEndPoints = endPointsList.unit.metrics.add;
  const metricFetchFormatEndpoints = endPointsList.unit.metrics.format;
  const metricFetchEndPoints = endPointsList.unit.metrics.data;
  const metricGetTestEndpoints = endPointsList.unit.metrics.testing;
  const metricEditEndPoints = endPointsList.unit.metrics.edit;
  const metricDeleteEndPoints = endPointsList.unit.metrics.delete;

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Save user info
    setUser(JSON.parse(localStorage.getItem("whoami")));

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

    // Calculate the unit's people
    (async () => {
      // Call API endpoint to get unit's members
      var res = await post(
        "/unit/get_all_members/",
        { id: unitMap[unit_id] || "" },
        Cookies.get("access")
      );

      // Send a message if there was an error
      if (res.status == "error") {
        errorToaster("Error occurred fetching unit data");
        return;
      }

      // Save the personnel list
      var personnel = res.message;

      // Call API endpoint to get unit's officers
      res = await post(
        "/unit/get_all_officers/",
        { id: unitMap[unit_id] || "" },
        Cookies.get("access")
      );

      // Send a message if there was an error
      if (res.status == "error") {
        errorToaster("Error occurred fetching unit data");
        return;
      }

      // Append to the personnel list and create a mapping for list of names
      personnel = [...personnel, ...res.message];
      var listOfNames = {};
      for (let item of personnel) {
        listOfNames[item.full_name] = item._id;
      }
      setUnitPersonnel(listOfNames);
      setUnitPersonnelReverse(
        Object.fromEntries(
          Object.entries(listOfNames).map(([key, value]) => [value, key])
        )
      );
    })();

    // Get the user's metric data
    (async () => {
      // Call API to get the unit's data
      var res = await post(
        metricFetchEndPoints[toolbarSelect],
        { id: unitMap[unit_id] || "" },
        Cookies.get("access")
      );

      // Send a message if there was an error
      if (res.status == "error") {
        errorToaster("Error occurred fetching unit data");
        return;
      }

      // Get metric format for iterated metric
      var metricFormatInfo = await get(
        metricFetchFormatEndpoints[toolbarSelect],
        Cookies.get("access")
      );
      metricFormatInfo = metricFormatInfo.message;
      setFormat(metricFormatInfo);

      // Compile the data
      var data = [];
      for (let unit in res.message) {
        for (let stat of res.message[unit]) {
          // Track subscore info
          var subscoreInfo = {};
          for (let [idx, subscore] of metricFormatInfo.scoring_ids
            .slice(1)
            .entries()) {
            if (metricFormatInfo.scoring_type[idx + 1] == "time")
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
    const metric = format.scoring_ids[metricToolbarSelect];
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

  // Return the app context
  return (
    <UnitMetricsAppContext.Provider
      value={{
        unitPersonnel,
        setUnitPersonnel,
        unitPersonnelReverse,
        setUnitPersonnelReverse,
        editItem,
        setEditItem,
        user,
        setUser,
        data,
        setData,
        metricToolbarSelect,
        setMetricToolbarSelect,
        xAxisSelection,
        setXAxisSelection,
        toolbarSelect,
        setToolbarSelect,
        isDeleting,
        setIsDeleting,
        isUpdating,
        setIsUpdating,
        viewSelect,
        setViewSelect,
        nameMappings,
        setNameMappings,
        unitMappings,
        setUnitMappings,
        dataStats,
        setDataStats,
        format,
        setFormat,
        actionTrigger,
        setActionTrigger,
        viewList,
        toolbarItems,
        specialProcess,
        metricAddEndPoints,
        metricFetchFormatEndpoints,
        metricFetchEndPoints,
        metricGetTestEndpoints,
        metricEditEndPoints,
        metricDeleteEndPoints,
      }}
    >
      {children}
    </UnitMetricsAppContext.Provider>
  );
}
