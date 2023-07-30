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
import { useState, useEffect, useContext } from "react";
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
import { MetricToolBar } from "./metricToolbar";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import { StatCard } from "@/components/cards";
import Sidebar from "@/components/sidebar";

// Import unit metric context
import { UnitMetricsAppContext } from "./context";

// Define the add data view
export function AddDataView() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Render AddDataView
  return (
    <div className="flex w-9/12 flex-col gap-2">
      <MetricToolBar />
      <div>Test</div>
    </div>
  );
}
