// React.js & Next.js libraries
import { useContext } from "react";
import React from "react";

// Import unit metric context
import { UnitMetricsAppContext } from "./context";

// Define the toolbar view
export function Toolbar() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Render toolbar
  return (
    <div className="flex flex-row justify-between py-3">
      <div className="flex flex-row gap-4">
        {c.toolbarItems.map((item, index) => (
          <button
            key={`toolbarItems-${item}`}
            className={`rounded-lg border px-3 py-2 text-xl transition
            duration-200 ease-in hover:-translate-y-[0.1rem] hover:shadow-lg ${
              c.toolbarSelect == index
                ? `border-sky bg-gradient-to-tr from-deepOcean
                to-sky text-white hover:border-darkOcean`
                : `border-silver hover:border-sky hover:text-sky`
            }`}
            onClick={() => c.setToolbarSelect(index)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
