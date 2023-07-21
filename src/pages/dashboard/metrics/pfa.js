// ReChart imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Toaster Components and CSS
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Util imports
import { authCheck } from "@/utils/authCheck";
import { post } from "@/utils/call";

// Custom components imports
import { Nothing } from "@/components/nothing";
import { StatCard } from "@/components/cards";

// Component to define PFA chart and content
export default function PFAView() {
  // Define useStates and other constants
  const [labels, setLabels] = useState([]);
  const [compositeScores, setCompositeScores] = useState([]);
  const [subScores, setSubScores] = useState({});
  const [metricData, setMetricData] = useState([]);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [average, setAverage] = useState(0);
  const [highest, setHighest] = useState(0);
  const [current, setCurrent] = useState(0);
  const [difference, setDifference] = useState([]);
  const [isNothing, setIsNothing] = useState(false);
  const selectionMap = {
    0: "composite_score",
    1: "pushup",
    2: "situp",
    3: "run",
  };
  const toolbarItems = [
    "Composite Score",
    "Push-Ups",
    "Sit-Ups",
    "1.5 Mile Run",
  ];

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Get the user's metric data
    (async () => {
      // Call API to get the user's data
      var res = await post(
        "/user/get_pfa_data/",
        { page_size: 2000, page_index: 0 },
        Cookies.get("access")
      );

      // Extract information
      const info = res.message.reverse();

      // If info is empty, set isNothing to true
      if (info.length == 0) {
        setIsNothing(true);
        return;
      }

      // Get and set the list of labels
      setLabels(info.map((item) => item.name));

      // Get and set the list of composite scores
      setCompositeScores(info.map((item) => item.composite_score));

      // Get a list of the subscores
      var rawSubScores = info.reduce((acc, item) => {
        for (var subscore in item.subscores) {
          if (!acc[subscore]) acc[subscore] = [];
          acc[subscore].push(item.subscores[subscore]);
        }
        return acc;
      }, {});
      setSubScores(rawSubScores);
    })();
  }, []);

  // Format the data for display on selection of a metric
  useEffect(() => {
    // Variable declaration
    var average = 0;
    var highest = 0;
    var data = [];
    const dataSpeculate =
      toolbarSelect == 0
        ? compositeScores
        : subScores[selectionMap[toolbarSelect]];

    // Iterate through the data
    for (var [index, item] of dataSpeculate.entries()) {
      // Append new data
      data.push({
        name: labels[index],
        [toolbarItems[toolbarSelect]]: item,
      });

      // Calculate highest if so
      highest = Math.max(highest, item);

      // Add up for average
      average += item;
    }

    // If run is selected, process it
    if (toolbarSelect == 3) {
      // Reset highest and average values
      highest = 0;
      average = 0;

      // Convert "mm:ss" to total seconds
      data.forEach((d) => {
        // Get minutes and seconds of the run
        const parts = d[toolbarItems[toolbarSelect]].split(":");

        // Set the seconds information
        d.seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

        // Calculate highest if so
        highest = Math.max(highest, d.seconds);

        // Add up for average
        average += d.seconds;
      });

      // Calculate difference
      var diff = "";
      if (data.length > 1) {
        // Calculate value
        const diffValue = (
          data.slice(-1)[0].seconds - data.slice(-2)[0].seconds
        ).toFixed(2);

        // Calculate mm:ss format
        const formatted = formatTick(Math.abs(diffValue));

        diff = diffValue > 0 ? `+ ${formatted}` : `- ${formatted}`;
      }

      // Update useStates
      setHighest(formatTick(highest));
      setAverage(formatTick(parseInt(average / data.length)));
      setCurrent(
        data.length == 0 ? "N/A" : formatTick(data.slice(-1)[0].seconds)
      );
      setDifference(data.length <= 1 ? "N/A" : diff);
      setMetricData(data);
      return;
    }

    // Calculate difference
    var diff = "";
    if (data.length > 1) {
      // Calculate value
      const diffValue = (
        data.slice(-1)[0][toolbarItems[toolbarSelect]] -
        data.slice(-2)[0][toolbarItems[toolbarSelect]]
      ).toFixed(2);

      diff = diffValue > 0 ? `+ ${diffValue}` : `- ${Math.abs(diffValue)}`;
    }

    // Update useStates
    setHighest(highest);
    setAverage(average / data.length);
    setCurrent(
      data.length == 0 ? "N/A" : data.slice(-1)[0][toolbarItems[toolbarSelect]]
    );
    setDifference(data.length <= 1 ? "N/A" : diff);
    setMetricData(data);
  }, [toolbarSelect, compositeScores]);

  // Subcomponent for toolbar
  const toolbar = (
    <div className="flex flex-row justify-between py-3">
      <div className="flex flex-row gap-4">
        {toolbarItems.map((item, index) => (
          <button
            key={`toolbarItems-${item}`}
            className={`rounded-lg border px-2 py-1 text-base transition
            duration-200 ease-in hover:-translate-y-[0.1rem] hover:shadow-lg ${
              toolbarSelect == index
                ? `border-sky text-sky hover:border-sky`
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

  // Tick formatter
  const formatTick = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Create tooltip for run time
  const TimeToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Get states
      const seconds = payload[0].value;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      const formattedTime = `${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;

      // Return the tooltip information
      return (
        <div
          className="custom-tooltip rounded-lg border border-silver bg-white
        p-2 "
        >
          <div className="text-2xl">{payload[0].payload.name}</div>
          <div className="text-sky">{`Time : ${formattedTime}`}</div>
        </div>
      );
    }
    return null;
  };

  // Create default tooltip
  const DefaultToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Return the tooltip information
      return (
        <div
          className="custom-tooltip rounded-lg border border-silver bg-white
          p-2"
        >
          <div className="text-2xl">{payload[0].payload.name}</div>
          <div className="text-sky">
            {`${toolbarItems[toolbarSelect]} : ${payload[0].value}`}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render component
  return (
    <>
      {isNothing ? (
        <Nothing mainText="No Data Recorded" subText="* Cricket Chirps *" />
      ) : (
        <div className="flex h-full w-full flex-col gap-4">
          <div>{toolbar}</div>
          <div className="h-full w-full shrink">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricData} margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" padding={{ left: 40, right: 40 }} />
                {!(toolbarSelect == 3) ? (
                  <YAxis
                    tickCount={11}
                    domain={[0, 100]}
                    padding={{ bottom: 40 }}
                  />
                ) : (
                  <YAxis tickFormatter={formatTick} padding={{ bottom: 40 }} />
                )}
                {!(toolbarSelect == 3) ? (
                  <Tooltip content={<DefaultToolTip />} />
                ) : (
                  <Tooltip content={<TimeToolTip />} />
                )}
                <Tooltip />
                <Line
                  type="linear"
                  dataKey={
                    toolbarSelect == 3 ? "seconds" : toolbarItems[toolbarSelect]
                  }
                  stroke="#54c0ff"
                  strokeWidth={4}
                  dot={{ r: 8 }}
                  activeDot={{ r: 12 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex w-full flex-row gap-10">
            <StatCard
              keyContent={`Highest ${toolbarItems[toolbarSelect]}`}
              valueContent={highest}
            />
            <StatCard
              keyContent={`Average ${toolbarItems[toolbarSelect]}`}
              valueContent={average}
            />
            <StatCard
              keyContent={`Last ${toolbarItems[toolbarSelect]}`}
              valueContent={current}
            />
            <StatCard
              keyContent={`Current Difference`}
              valueContent={difference}
            />
          </div>
        </div>
      )}
    </>
  );
}
