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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config import
import { endPointsList } from "@/config/config";

// Util imports
import { getSeconds, getFormattedTime } from "@/utils/time";
import * as statCalc from "@/utils/statsAnalysis";
import { authCheck } from "@/utils/authCheck";
import { get, post } from "@/utils/call";

// Custom components imports
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import { StatCard } from "@/components/cards";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function MetricsPage() {
  // Define useStates and other constants
  const [metricToolbarSelect, setMetricToolbarSelect] = useState(0);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [dataStats, setDataStats] = useState([]);
  const [format, setFormat] = useState({});
  const [data, setData] = useState({});
  const toolbarItems = ["PFA", "Warrior Knowledge"];

  // Special Process mapping
  const specialProcess = {
    time: getFormattedTime,
    number: (e) => {
      return Number(e);
    },
  };

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Get the user's metric data
    (async () => {
      // Call API to get the user's data
      var res = await post(
        endPointsList.user.metrics.data[toolbarSelect],
        { page_size: 2000, page_index: 0 },
        Cookies.get("access")
      );

      // Get metric format for iterated metric
      var metricFormatInfo = await get(
        endPointsList.user.metrics.format[toolbarSelect],
        Cookies.get("access")
      );
      metricFormatInfo = metricFormatInfo.message;
      setFormat(metricFormatInfo);

      // Compile the data and preprocess it
      var data = [];
      for (var item of res.message) {
        // Track subscore info
        var subscoreInfo = {};
        for (let [idx, subscore] of metricFormatInfo.scoring_ids
          .slice(1)
          .entries()) {
          if (metricFormatInfo.scoring_type[idx + 1] == "time")
            subscoreInfo[subscore] = getSeconds(item.subscores[subscore]);
          else subscoreInfo[subscore] = item.subscores[subscore];
        }

        // Push compiled information
        data.push({
          id: item._id,
          time: item.datetime_taken,
          name: item.name,
          composite_score: item.composite_score,
          ...subscoreInfo,
        });
      }
      data = data.sort((a, b) => a.time - b.time);
      setData(data);
    })();
  }, [toolbarSelect]);

  // Calculate statistics on change of the metricToolbarSelect
  useEffect(() => {
    // Return if unit_id is undefined
    if (data.length == 0 || Object.keys(format).length == 0) return;

    // Setup a data stat variable to compile stats
    const metric = format.scoring_ids[metricToolbarSelect];
    var stats = [];

    // Compile data
    if (format.scoring_type[metricToolbarSelect] == "time") {
      stats.push(statCalc.overallMinValue(data, metric));
    } else {
      stats.push(statCalc.overallMaxValue(data, metric));
    }
    stats.push(statCalc.overallAvgMetricValue(data, metric));

    // Save the stats calculations
    setDataStats(stats);
  }, [metricToolbarSelect, format]);

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
                : `border-silver hover:border-sky`
            }`}
            onClick={() => {
              setMetricToolbarSelect(0);
              setToolbarSelect(index);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  // Subcomponent for toolbar
  const metricToolbar = (
    <div className="flex flex-row justify-between py-3">
      <div className="flex flex-row gap-4">
        {Object.keys(format).length != 0 &&
          format.scoring_formatted.map((item, index) => (
            <button
              key={`metricToolbarItems-${item}`}
              className={`rounded-lg border px-2 py-1 text-base transition
              duration-200 ease-in hover:-translate-y-[0.1rem] hover:shadow-lg
              ${
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
    </div>
  );

  // Create default tooltip
  const DefaultToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Get the value of the selected information
      const value = payload[0].payload[format.scoring_ids[metricToolbarSelect]];

      // Render tooltip
      return (
        <div
          className="custom-tooltip rounded-lg border border-silver
            bg-white p-2"
        >
          <div className="text-2xl">{payload[0].payload.name}</div>
          <div className="text-lg">{payload[0].payload.user}</div>
          <div className="text-lg">{payload[0].payload.unit}</div>
          <div className="text-sky">
            {`${format.scoring_formatted[metricToolbarSelect]} : ${
              format.scoring_type[metricToolbarSelect] == "time"
                ? getFormattedTime(value)
                : value
            }`}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex w-full flex-col overflow-y-auto">
        <PageTitle className="flex-none" />
        {toolbar}
        <div className="h-full overflow-y-auto">
          {data.length == 0 ? (
            <Nothing mainText="No Data Recorded" subText="* Cricket Chirps *" />
          ) : (
            <>
              {Object.keys(format).length != 0 && (
                <div className="flex h-full w-full flex-col gap-4">
                  <div>{metricToolbar}</div>
                  <div className="h-full w-full shrink">
                    <ResponsiveContainer width="100%" height="99%">
                      <LineChart data={data} margin={{ right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          padding={{ left: 40, right: 40 }}
                        />
                        <YAxis
                          tickFormatter={
                            format.scoring_type[metricToolbarSelect] == "time"
                              ? getFormattedTime
                              : (e) => e
                          }
                          domain={[0, 100]}
                          padding={{ bottom: 40 }}
                        />
                        <Tooltip content={<DefaultToolTip />} />
                        <Tooltip />
                        <Line
                          type="linear"
                          dataKey={format.scoring_ids[metricToolbarSelect]}
                          stroke="#54c0ff"
                          strokeWidth={4}
                          dot={{ r: 8 }}
                          activeDot={{ r: 12 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex w-full flex-1 flex-row gap-10">
                    <StatCard
                      keyContent={
                        `Best ` +
                        `${format.scoring_formatted[metricToolbarSelect]}`
                      }
                      valueContent={
                        dataStats.length != 0 &&
                        specialProcess[
                          format.scoring_type[metricToolbarSelect]
                        ](dataStats[0].toFixed(2))
                      }
                    />
                    <StatCard
                      keyContent={
                        `Average ` +
                        `${format.scoring_formatted[metricToolbarSelect]}`
                      }
                      valueContent={
                        dataStats.length != 0 &&
                        specialProcess[
                          format.scoring_type[metricToolbarSelect]
                        ](dataStats[1].toFixed(2))
                      }
                    />
                    <StatCard
                      keyContent={
                        `Last ` +
                        `${format.scoring_formatted[metricToolbarSelect]}`
                      }
                      valueContent={
                        dataStats.length != 0 &&
                        specialProcess[
                          format.scoring_type[metricToolbarSelect]
                        ](
                          data[data.length - 1][
                            format.scoring_ids[metricToolbarSelect]
                          ].toFixed(2)
                        )
                      }
                    />
                    <StatCard
                      keyContent={`Improvement`}
                      valueContent={(() => {
                        // Return N/A if there isn't enough data
                        if (data.length < 2) return "N/A";

                        // Process data
                        const selected =
                          format.scoring_ids[metricToolbarSelect];
                        const now = data[data.length - 1][selected].toFixed(2);
                        const prev = data[data.length - 2][selected].toFixed(2);

                        // Calculate difference
                        const diff = now - prev;
                        const calcDiff =
                          specialProcess[
                            format.scoring_type[metricToolbarSelect]
                          ](diff);

                        // Return processed info
                        return diff > 0 ? `+${calcDiff}` : calcDiff;
                      })()}
                    />
                  </div>
                </div>
              )}
            </>
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
