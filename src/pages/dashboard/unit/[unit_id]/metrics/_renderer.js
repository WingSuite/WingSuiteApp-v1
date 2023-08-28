// React.js & Next.js libraries
import { useContext } from "react";
import React from "react";

// Custom imports
import StatisticsBoard from "./_statisticsBoard";
import Toolbar from "./_toolbar";

// Import unit metric context
import { UnitMetricsAppContext } from "./_context";

// Define the main component view
export default function Renderer() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Render
  return (
    <div
      className="flex h-full w-full flex-col gap-4 overflow-y-auto"
    >
      <Toolbar />
      <div
        className="flex h-full w-full flex-row gap-8 overflow-y-auto
        pt-1 pr-2"
      >
        {c.viewList[c.viewSelect]}
        <StatisticsBoard />
      </div>
    </div>
  );
}
