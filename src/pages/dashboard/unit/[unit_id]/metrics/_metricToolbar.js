// React Icons
import { VscGraphScatter, VscTable, VscNewFile } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useContext } from "react";
import React from "react";

// Custom components imports
import { BottomDropDown } from "@/components/dropdown";

// Config imports
import { permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";

// Import unit metric context
import { UnitMetricsAppContext } from "./_context";

// Define the scatter plot view
export default function MetricToolBar() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Render component
  return (
    <div className="flex flex-row justify-between">
      <div className="flex w-fit flex-row items-center  gap-4">
        {c.viewSelect == 1 && (
          <div>
            <BottomDropDown
              listOfItems={c.nameMappings[0]}
              setSelected={(e) => c.setXAxisSelection(c.nameMappings[1][e])}
              defaultValue={
                c.nameMappings[0][c.xAxisSelection] || "Select Metric"
              }
            />
          </div>
        )}
        {c.viewSelect == 0 && Object.keys(c.format).length != 0
          ? c.format.scoring_formatted.map((item, index) => (
              <button
                key={`toolbarItems-${item}`}
                className={`h-full w-fit rounded-lg border px-2 py-1 text-base
              transition duration-200 ease-in hover:-translate-y-[0.1rem]
              hover:shadow-lg ${
                c.metricToolbarSelect == index
                  ? `border-sky text-sky hover:border-sky`
                  : `border-silver hover:border-sky hover:text-sky`
              }`}
                onClick={() => c.setMetricToolbarSelect(index)}
              >
                {item}
              </button>
            ))
          : null}
      </div>
      <div className="flex flex-row gap-4">
        <button
          className={`rounded-lg border border-silver px-2 pb-1 pt-2
          transition duration-200 ease-in hover:-translate-y-[0.1rem]
          hover:border-sky hover:text-sky hover:shadow-lg ${
            c.viewSelect == 0 && `border-sky text-sky`
          }`}
          onClick={() => c.setViewSelect(0)}
        >
          <IconContext.Provider value={{ size: "1.5em" }}>
            <VscGraphScatter />
          </IconContext.Provider>
        </button>
        {permissionsCheck(
          permissionsList.unit.metrics.edit,
          c.user.permissions
        ) && (
          <button
            className={`rounded-lg border border-silver p-2 pr-1.5 transition
          duration-200 ease-in hover:-translate-y-[0.1rem] hover:border-sky
          hover:text-sky hover:shadow-lg ${
            c.viewSelect == 1 && `border-sky text-sky`
          }`}
            onClick={() => c.setViewSelect(1)}
          >
            <IconContext.Provider value={{ size: "1.5em" }}>
              <VscTable />
            </IconContext.Provider>
          </button>
        )}
        {permissionsCheck(
          permissionsList.unit.metrics.add,
          c.user.permissions
        ) && (<button
          className={`rounded-lg border border-silver p-2 transition
          duration-200 ease-in hover:-translate-y-[0.1rem] hover:border-sky
          hover:text-sky hover:shadow-lg ${
            c.viewSelect == 2 && `border-sky text-sky`
          }`}
          onClick={() => c.setViewSelect(2)}
        >
          <IconContext.Provider value={{ size: "1.5em" }}>
            <VscNewFile />
          </IconContext.Provider>
        </button>)}
      </div>
    </div>
  );
}
