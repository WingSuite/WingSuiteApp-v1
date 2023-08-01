// React.js & Next.js libraries
import { useContext } from "react";
import React from "react";

// Custom imports
import { StatisticsBoard } from "./statisticsBoard";
import { Toolbar } from "./toolbar";

// Import unit metric context
import { UnitMetricsAppContext } from "./context";

// Define the main component view
export function Renderer() {
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
          pt-1"
      >
        {c.viewList[c.viewSelect]}
        <StatisticsBoard />
      </div>
    </div>
  );
}
