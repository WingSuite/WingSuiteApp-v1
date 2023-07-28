import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MyComponent() {
  var testData = [
    { x: "PFA 1", y: 200, unit: "Unit 1" },
    { x: "PFA 1", y: 100, unit: "Unit 2" },
    { x: "PFA 2", y: 300, unit: "Unit 1" },
    { x: "PFA 2", y: 250, unit: "Unit 2" },
    { x: "PFA 3", y: 400, unit: "Unit 1" },
    { x: "PFA 3", y: 280, unit: "Unit 2" },
    { x: "PFA 3", y: 180, unit: "Unit 2" },
  ];

  var uniqueXValues = [...new Set(testData.map((item) => item.x))];
  var xValueMap = Object.fromEntries(
    uniqueXValues.map((value, index) => [value, index])
  );

  testData = testData.map((item) => {
    // Convert y value (in seconds) to a Date object
    let yAsDate = new Date(item.y * 1000);
    return { ...item, y: yAsDate, x: xValueMap[item.x] };
  });

  // Custom dot with larger size
  const renderDot = (props) => {
    const { cx, cy, payload } = props;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={payload.unit === "Unit 1" ? "#8884d8" : "#82ca9d"}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name="PFA Exam"
          tickFormatter={(value) => uniqueXValues[value]}
          ticks={Object.values(xValueMap)}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Composite Score"
          domain={['auto', 'auto']}
          tickFormatter={(unixTime) => {
            var date = new Date(unixTime);
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            return minutes.substr(-2) + ":" + seconds.substr(-2);
          }}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter shape={renderDot} data={testData} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}