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

// React.js & Next.js libraries
import { useContext } from "react";
import React from "react";

// Config imports
import { config } from "@/config/config";

// Util imports
import { getFormattedTime } from "@/utils/time";

// Custom components imports
import { Nothing } from "@/components/nothing";
import MetricToolBar from "./_metricToolbar";

// Import unit metric context
import { UnitMetricsAppContext } from "./_context";

// Define the scatter plot view
export default function ScatterPlotView() {
  // Define the context for the unit metrics page
  const c = useContext(UnitMetricsAppContext);

  // Create default tooltip
  const DefaultToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Get the value of the selected information
      const value =
        payload[0].payload[c.format.scoring_ids[c.metricToolbarSelect]];

      // Render tooltip
      return (
        <div
          className="custom-tooltip rounded-lg border border-silver
          bg-white p-2"
        >
          <div className="text-2xl">
            {c.nameMappings[0][payload[0].payload.name]}
          </div>
          <div className="text-lg">{payload[0].payload.user}</div>
          <div className="text-lg">{payload[0].payload.unit}</div>
          <div className="text-sky">
            {`${c.format.scoring_formatted[c.metricToolbarSelect]} : ${
              c.format.scoring_type[c.metricToolbarSelect] == "time"
                ? getFormattedTime(value)
                : value
            }`}
          </div>
        </div>
      );
    }
    return null;
  };

  // Define custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex w-full flex-row justify-center gap-4">
        {payload.map((entry, index) => (
          <div
            key={`${index}-${entry.payload.name}`}
            className="flex flex-row items-center justify-center gap-2"
          >
            <svg height="20" width="20">
              <circle
                cx="10"
                cy="10"
                r="10"
                fill={
                  config.colorOrder[
                    c.unitMappings[1][entry.payload.name] %
                      config.colorOrder.length
                  ]
                }
              />
            </svg>
            <p key={`item-${index}`}>{entry.value}</p>
          </div>
        ))}
      </div>
    );
  };

  // Define custom tick
  const CustomTick = (props) => {
    return (
      <g transform={`translate(${props.x},${props.y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          style={{ cursor: "pointer" }}
        >
          {c.nameMappings[0][props.payload.value]}
        </text>
      </g>
    );
  };

  // Define the ScatterPlot
  return (
    <>
      <div className="flex w-9/12 flex-col gap-8">
        <MetricToolBar />
        {c.data.length == 0 ? (
          <div className="h-full w-full">
            <Nothing mainText="No Data Recorded" subText="* Cricket Chirps *" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="91%">
            <ScatterChart margin={{ right: 30 }}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="name"
                name="Metric Datapoint"
                tickFormatter={(value) => c.nameMappings[0][value]}
                ticks={Object.values(c.nameMappings[1])}
                tick={<CustomTick />}
                padding={{ left: 40, right: 40 }}
                onClick={(e) => c.setXAxisSelection(e.value)}
              />
              <YAxis
                type="number"
                tickFormatter={
                  c.format.scoring_type[c.metricToolbarSelect] == "time"
                    ? getFormattedTime
                    : (e) => e
                }
                dataKey={c.format.scoring_ids[c.metricToolbarSelect]}
                name="Score Value"
                domain={
                  c.format.scoring_domains[
                    c.format.scoring_ids[c.metricToolbarSelect]
                  ]
                }
                padding={{ bottom: 40, top: 40 }}
              />
              <Tooltip content={<DefaultToolTip />} />
              <Tooltip />
              {c.metricToolbarSelect == 0 && (
                <ReferenceLine y={75} stroke="red" label="Failure Point" />
              )}
              {c.unitMappings[0].map((unit, index) => (
                <Scatter
                  key={index}
                  name={unit}
                  shape={(props) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={7}
                      fill={
                        config.colorOrder[
                          c.unitMappings[1][unit] % config.colorOrder.length
                        ]
                      }
                    />
                  )}
                  data={c.data.filter((item) => item.unit === unit)}
                />
              ))}
              <Legend content={<CustomLegend />} />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}
