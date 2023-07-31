// React.js & Next.js libraries
import React, { useContext } from "react";

// Custom components imports
import { StatCard } from "@/components/cards";

// Import unit metric context
import { UnitMetricsAppContext } from "./context";

// Define the add data view
export function StatisticsBoard() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Render statistics board
  return (
    <div className="flex max-h-full w-3/12 flex-col gap-5 overflow-y-auto">
      <div className="flex flex-col gap-2 text-4xl">
        <div>Statistics for</div>
        <div
          className="bg-gradient-to-r from-deepOcean to-sky bg-clip-text
          font-bold text-transparent"
        >
          {c.nameMappings[0][c.xAxisSelection]}
        </div>
      </div>
      <div className="flex max-h-full flex-col gap-5 overflow-y-auto p-2">
        {}
        <StatCard
          keyContent={`Number of Datapoints`}
          valueContent={c.dataStats.length != 0 && c.dataStats[0]}
        />
        <StatCard
          keyContent={`Number of Units`}
          valueContent={c.dataStats.length != 0 && c.dataStats[1]}
        />
        <StatCard
          keyContent={`Overall Average ${
            c.format.scoring_formatted[c.metricToolbarSelect]
          }`}
          valueContent={
            c.dataStats.length != 0 &&
            c.specialProcess[c.format.scoring_type[c.metricToolbarSelect]](
              c.dataStats[2].toFixed(2)
            )
          }
        />
        <StatCard
          keyContent={
            `Overall Standard Deviation ` +
            `${c.format.scoring_formatted[c.metricToolbarSelect]}`
          }
          valueContent={
            c.dataStats.length != 0 &&
            c.specialProcess[c.format.scoring_type[c.metricToolbarSelect]](
              c.dataStats[3].toFixed(2)
            )
          }
        />
        <StatCard
          keyContent={`Average ${
            c.format.scoring_formatted[c.metricToolbarSelect]
          } Per Unit`}
          valueContent={
            <div className="w-full truncate text-lg">
              {c.dataStats.length != 0 && (
                <table>
                  <tbody>
                    {Object.entries(c.dataStats[4]).map(
                      ([key, value], index) => (
                        <tr key={index}>
                          <td className="text-2xl text-black">{key}</td>
                          <td
                            className="bg-gradient-to-r from-deepOcean
                            to-sky bg-clip-text pl-4 text-2xl font-bold
                            text-transparent"
                          >
                            {c.specialProcess[
                              c.format.scoring_type[c.metricToolbarSelect]
                            ](value.toFixed(2))}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          }
        />
        <StatCard
          keyContent={
            `Standard Deviation ` +
            `${c.format.scoring_formatted[c.metricToolbarSelect]} Per Unit`
          }
          valueContent={
            <div className="w-full truncate text-lg">
              {c.dataStats.length != 0 && (
                <table>
                  <tbody>
                    {Object.entries(c.dataStats[5]).map(
                      ([key, value], index) => (
                        <tr key={index}>
                          <td className="text-2xl text-black">{key}</td>
                          <td
                            className="bg-gradient-to-r from-deepOcean
                            to-sky bg-clip-text pl-4 text-2xl font-bold
                            text-transparent"
                          >
                            {c.specialProcess[
                              c.format.scoring_type[c.metricToolbarSelect]
                            ](value.toFixed(2))}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
