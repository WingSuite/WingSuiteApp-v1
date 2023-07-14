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

// React Icons
import { VscCloseAll, VscEdit } from "react-icons/vsc";
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

// Config imports
import { permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { StatCard } from "@/components/cards";
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { CollapsableInfoCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Component to define Warrior Knowledge chart and content
export default function WarriorKnowledgeView() {
  // Define useStates and other constants
  const [compositeScores, setCompositeScores] = useState([]);
  const [subScores, setSubScores] = useState({});
  const [metricData, setMetricData] = useState([]);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [average, setAverage] = useState(0);
  const [highest, setHighest] = useState(0);
  const [current, setCurrent] = useState(0);
  const [difference, setDifference] = useState([]);
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
        "/user/get_warrior_data/",
        { page_size: 2000, page_index: 0 },
        Cookies.get("access")
      );

      // Get and set the list of labels
      const labels = res.message.reverse().map((item) => item.name);

      // Get the list of composite scores
      var compositeScoresList = res.message
        .reverse()
        .map((item) => item.composite_score);

      // Set variables for analytics
      var average = 0;
      var highest = 0;
      var data = [];

      // Iterate through the data
      for (var [index, item] of compositeScoresList.entries()) {
        // Append new data
        data.push({
          name: labels[index],
          composite_score: item,
        });

        // Calculate highest if so
        highest = Math.max(highest, item);

        // Add up for average
        average += item;
      }

      // Calculate value
      const diffValue = (
        data.slice(-1)[0].composite_score - data.slice(-2)[0].composite_score
      ).toFixed(2);

      // Added + and - signs for formatting
      var diff = diffValue > 0 ? `+ ${diffValue}` : `- ${Math.abs(diffValue)}`;

      // Update useStates
      setHighest(highest);
      setAverage(average / data.length);
      setCurrent(
        data.length == 0
          ? "N/A"
          : data.slice(-1)[0].composite_score
      );
      setDifference(data.length <= 1 ? "N/A" : diff);
      setMetricData(data);
    })();
  }, []);

  // Create default tooltip
  const DefaultToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Return the tooltip information
      return (
        <div
          className="custom-tooltip rounded-lg border border-silver bg-white
          p-2 "
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
    <div className="flex h-full w-full flex-col gap-4">
      <div className="h-full w-full shrink mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metricData} margin={{ top: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" padding={{ left: 40, right: 40 }} />
            <YAxis tickCount={11} domain={[0, 100]} padding={{ bottom: 40 }} />
            <Tooltip content={<DefaultToolTip />} />
            <Tooltip />
            <Line
              type="linear"
              dataKey="composite_score"
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
          keyContent={`Highest Warrior Knowledge`}
          valueContent={highest}
        />
        <StatCard
          keyContent={`Average Warrior Knowledge`}
          valueContent={average}
        />
        <StatCard
          keyContent={`Last Warrior Knowledge`}
          valueContent={current}
        />
        <StatCard keyContent={`Current Difference`} valueContent={difference} />
      </div>
    </div>
  );
}
